import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/empty_state.dart';
import 'package:nagrik/core/widgets/error_state.dart';
import 'package:nagrik/core/widgets/feed_skeleton.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/video_card.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/widgets/nagrik_adaptive_banner.dart';
import 'package:nagrik/core/ads/widgets/nagrik_native_ad_card.dart';
import 'package:nagrik/features/home/presentation/widgets/trending_topics_bar.dart';
import 'package:nagrik/features/search/presentation/providers/search_providers.dart';

/// Screen #4: Dominant, first-class Search screen backed by GET /content/search.
/// Features focus glow ring, category filtering, persistent history, and robust error/loading states.
class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen>
    with AutomaticKeepAliveClientMixin {
  late final TextEditingController _controller;
  late final FocusNode _focusNode;
  bool _isFocused = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    final initialQuery = ref.read(searchStateProvider).query;
    _controller = TextEditingController(text: initialQuery);
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    if (mounted) {
      setState(() => _isFocused = _focusNode.hasFocus);
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onSubmitted(String query) {
    if (query.trim().isNotEmpty) {
      ref.read(recentSearchesProvider.notifier).addSearch(query);
      ref.read(searchStateProvider.notifier).executeImmediate(query);
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final searchState = ref.watch(searchStateProvider);
    final recentSearches = ref.watch(recentSearchesProvider);
    final categoriesAsync = ref.watch(apiCategoriesProvider);
    final strings = ref.watch(appStringsProvider);
    final isDark = context.isDarkMode;

    final bgColor = context.nagrikTheme.level0Background;
    final barBg = context.nagrikTheme.level1Surface;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: barBg,
        elevation: 0,
        titleSpacing: 0,
        toolbarHeight: 64,
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                onPressed: () {
                  ref.read(searchStateProvider.notifier).clear();
                  Navigator.of(context).pop();
                },
              )
            : null,
        title: Padding(
          padding: EdgeInsets.only(
            left: Navigator.of(context).canPop() ? 0 : NagrikSpacing.space4,
            right: NagrikSpacing.space4,
          ),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 44,
            decoration: BoxDecoration(
              color: isDark
                  ? context.nagrikTheme.level4Muted
                  : context.nagrikTheme.surfaceMuted,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(
                color: _isFocused
                    ? context.colorScheme.primary
                    : context.nagrikTheme.border.withValues(
                        alpha: isDark ? 0.35 : 0.60,
                      ),
                width: _isFocused ? 1.4 : 0.8,
              ),
              boxShadow: _isFocused
                  ? [
                      BoxShadow(
                        color: context.colorScheme.primary.withValues(
                          alpha: 0.16,
                        ),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ]
                  : null,
            ),
            child: TextField(
              controller: _controller,
              focusNode: _focusNode,
              textInputAction: TextInputAction.search,
              onChanged: (val) {
                ref.read(searchStateProvider.notifier).setQuery(val);
              },
              onSubmitted: _onSubmitted,
              style: context.textTheme.bodyLarge,
              decoration: InputDecoration(
                hintText: strings.searchPlaceholder,
                hintStyle: context.textTheme.bodyMedium?.copyWith(
                  color: context.nagrikTheme.textTertiary,
                ),
                prefixIcon: Icon(
                  Icons.search_rounded,
                  size: 20,
                  color: _isFocused
                      ? context.colorScheme.primary
                      : context.nagrikTheme.textSecondary,
                ),
                suffixIcon: searchState.query.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close_rounded, size: 18),
                        constraints: const BoxConstraints(
                          minWidth: 40,
                          minHeight: 40,
                        ),
                        onPressed: () {
                          _controller.clear();
                          ref.read(searchStateProvider.notifier).clear();
                        },
                      )
                    : null,
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 11,
                ),
              ),
            ),
          ),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 680),
          child: Column(
            children: [
              // Dynamic category refinement chips from GET /content/categories
              categoriesAsync.maybeWhen(
                data: (categories) {
                  if (categories.isEmpty) return const SizedBox.shrink();
                  return Container(
                    height: 46,
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    decoration: BoxDecoration(
                      color: barBg,
                      border: Border(
                        bottom: BorderSide(
                          color: context.nagrikTheme.border.withValues(
                            alpha: 0.3,
                          ),
                          width: 0.5,
                        ),
                      ),
                    ),
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(
                        horizontal: NagrikSpacing.space4,
                      ),
                      scrollDirection: Axis.horizontal,
                      itemCount: categories.length + 1,
                      separatorBuilder: (_, _) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        if (index == 0) {
                          final isSelected =
                              searchState.selectedCategorySlug == null;
                          return ChoiceChip(
                            label: const Text('All'),
                            selected: isSelected,
                            onSelected: (_) {
                              NagrikMotion.lightImpact();
                              ref
                                  .read(searchStateProvider.notifier)
                                  .selectCategory(null);
                            },
                          );
                        }
                        final cat = categories[index - 1];
                        final isSelected =
                            searchState.selectedCategorySlug == cat.slug;
                        return ChoiceChip(
                          label: Text(cat.name),
                          selected: isSelected,
                          onSelected: (_) {
                            NagrikMotion.lightImpact();
                            ref
                                .read(searchStateProvider.notifier)
                                .selectCategory(cat.slug);
                          },
                        );
                      },
                    ),
                  );
                },
                orElse: () => const SizedBox.shrink(),
              ),

              // Search Content Body
              Expanded(
                child: Builder(
                  builder: (context) {
                    if (searchState.query.trim().isEmpty) {
                      return _buildIdleView(
                        context,
                        recentSearches,
                        isDark,
                        strings,
                      );
                    }

                    if (searchState.isLoading && searchState.results.isEmpty) {
                      return ListView.builder(
                        padding: const EdgeInsets.symmetric(
                          vertical: NagrikSpacing.space3,
                        ),
                        itemCount: 4,
                        itemBuilder: (_, _) => const FeedCardSkeleton(),
                      );
                    }

                    if (searchState.errorMessage != null &&
                        searchState.results.isEmpty) {
                      final isOnline = ref.watch(connectivityStatusProvider);
                      return NagrikErrorState(
                        message: isOnline
                            ? strings.searchLoadError
                            : strings.offlineTitle,
                        description: isOnline
                            ? searchState.errorMessage
                            : strings.offlineDesc,
                        onRetry: () {
                          ref
                              .read(searchStateProvider.notifier)
                              .executeImmediate();
                        },
                      );
                    }

                    if (searchState.results.isEmpty) {
                      return Center(
                        child: Padding(
                          padding: const EdgeInsets.all(NagrikSpacing.space6),
                          child: NagrikEmptyState(
                            icon: Icons.search_off_rounded,
                            title: strings.noNewsFound,
                            description: strings.noNewsFoundDesc,
                          ),
                        ),
                      );
                    }

                    return _buildCategorizedResults(
                      context,
                      searchState.results,
                      strings,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategorizedResults(
    BuildContext context,
    List<Post> searchResults,
    NagrikStringsData strings,
  ) {
    final newsResults = searchResults
        .where((p) => p.type == PostType.news)
        .toList();
    final videoResults = searchResults
        .where((p) => p.type == PostType.video)
        .toList();

    return CustomScrollView(
      key: const PageStorageKey<String>('search_results_scroll_view'),
      slivers: [
        if (newsResults.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                NagrikSpacing.space4,
                NagrikSpacing.space3,
                NagrikSpacing.space4,
                NagrikSpacing.space1,
              ),
              child: Text(
                '${strings.newsSection} (${newsResults.length})',
                style: context.textTheme.labelSmall?.copyWith(
                  color: context.nagrikTheme.textSecondary,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return RepaintBoundary(
                  child: NagrikStaggeredEntrance(
                    index: index < 5 ? index : 0,
                    child: NewsCard(post: newsResults[index]),
                  ),
                );
              },
              childCount: newsResults.length,
              addAutomaticKeepAlives: true,
              addRepaintBoundaries: true,
            ),
          ),
        ],
        Builder(
          builder: (context) {
            final adConfig = ref.watch(adConfigurationProvider);
            final consent = ref.watch(adConsentProvider);
            final showSearchAd = adConfig.nativeEnabled &&
                consent.canRequestAds &&
                searchResults.length >= 2;
            if (!showSearchAd) return const SliverToBoxAdapter(child: SizedBox.shrink());
            return const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 4),
                child: NagrikNativeAdCard(templateType: TemplateType.small),
              ),
            );
          },
        ),
        if (videoResults.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                NagrikSpacing.space4,
                NagrikSpacing.space4,
                NagrikSpacing.space4,
                NagrikSpacing.space1,
              ),
              child: Text(
                '${strings.videosSection} (${videoResults.length})',
                style: context.textTheme.labelSmall?.copyWith(
                  color: context.nagrikTheme.textSecondary,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return RepaintBoundary(
                  child: NagrikStaggeredEntrance(
                    index: index < 5 ? index : 0,
                    child: VideoCard(post: videoResults[index]),
                  ),
                );
              },
              childCount: videoResults.length,
              addAutomaticKeepAlives: true,
              addRepaintBoundaries: true,
            ),
          ),
        ],
        // Adaptive Banner at bottom of search results
        const SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: NagrikSpacing.space4,
              vertical: NagrikSpacing.space2,
            ),
            child: NagrikAdaptiveBanner(),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }

  String _formatCategoryName(String slug) {
    if (slug.isEmpty) return 'Stories';
    return slug[0].toUpperCase() + slug.substring(1);
  }

  List<Post> _filterPostsByCategory(List<Post> posts, String? categorySlug) {
    if (categorySlug == null || categorySlug.isEmpty || categorySlug == 'all') {
      return posts;
    }
    final target = categorySlug.toLowerCase().trim();
    final matched = posts.where((p) {
      // Backend slug taxonomy first (source of truth since M0).
      if (p.categorySlug != null && p.categorySlug!.toLowerCase() == target) {
        return true;
      }
      final catName = p.category.name.toLowerCase();
      final catLabel = p.category.label.toLowerCase();
      if (catName == target || catLabel == target) {
        return true;
      }
      if (p.title.toLowerCase().contains(target) ||
          p.body.toLowerCase().contains(target)) {
        return true;
      }
      return false;
    }).toList();

    return matched.isNotEmpty ? matched : posts;
  }

  Widget _buildIdleView(
    BuildContext context,
    List<String> recentSearches,
    bool isDark,
    NagrikStringsData strings,
  ) {
    final searchState = ref.watch(searchStateProvider);
    final allPosts = ref.watch(feedPostsProvider);
    final displayPosts = _filterPostsByCategory(
      allPosts,
      searchState.selectedCategorySlug,
    );
    final categoriesAsync = ref.watch(apiCategoriesProvider);
    // Suggested searches come from live backend categories — never hardcoded.
    final suggestedTerms = categoriesAsync.maybeWhen(
      data: (cats) => cats
          .where(
            (c) =>
                c.slug.toLowerCase() != 'all' &&
                !recentSearches.contains(c.name),
          )
          .take(6)
          .map((c) => c.name)
          .toList(),
      orElse: () => const <String>[],
    );

    return CustomScrollView(
      key: const PageStorageKey<String>('search_idle_scroll_view'),
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: NagrikSpacing.space3,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. Trending Topics Strip derived dynamically from GET /content/categories
                TrendingTopicsBar(
                  onTopicTap: (topic) {
                    _controller.text = topic.title;
                    ref.read(searchStateProvider.notifier).setQuery(topic.title);
                    _onSubmitted(topic.title);
                  },
                ),
                const SizedBox(height: NagrikSpacing.space4),
              ],
            ),
          ),
        ),

        // 2. Suggested searches derived from live backend categories
        if (suggestedTerms.isNotEmpty)
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: NagrikSpacing.space4,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                Semantics(
                  header: true,
                  child: Text(
                    strings.suggestedSection,
                    style: context.textTheme.labelSmall?.copyWith(
                      color: context.nagrikTheme.textSecondary,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
                const SizedBox(height: NagrikSpacing.space2),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: suggestedTerms.map((term) {
                    return Semantics(
                      button: true,
                      label: 'Search $term',
                      child: NagrikSpringPressable(
                        onTap: () {
                          _controller.text = term;
                          ref.read(searchStateProvider.notifier).setQuery(term);
                          _onSubmitted(term);
                        },
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(minHeight: 44),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? context.nagrikTheme.level2Elevated
                                  : context.nagrikTheme.level1Surface,
                              borderRadius: NagrikRadii.borderRadiusPill,
                              border: Border.all(
                                color: context.nagrikTheme.border,
                                width: 0.8,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.trending_up_rounded,
                                  size: 15,
                                  color: context.colorScheme.primary,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  term,
                                  style: context.textTheme.labelLarge?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
        ),
      ),
        const SliverToBoxAdapter(
          child: SizedBox(height: NagrikSpacing.space4),
        ),

        // 3. Recent searches section
        if (recentSearches.isNotEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: NagrikSpacing.space4,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    strings.recentSearches,
                    style: context.textTheme.labelSmall?.copyWith(
                      color: context.nagrikTheme.textSecondary,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                    ),
                  ),
                  Semantics(
                    button: true,
                    label: strings.clearAll,
                    child: NagrikSpringPressable(
                      onTap: () => ref
                          .read(recentSearchesProvider.notifier)
                          .clearAll(),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(minHeight: 44),
                        child: Center(
                          child: Text(
                            strings.clearAll,
                            style: context.textTheme.labelLarge?.copyWith(
                              color: context.colorScheme.error,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        if (recentSearches.isNotEmpty)
          SliverList.builder(
            itemCount: recentSearches.length,
            itemBuilder: (context, index) {
              final term = recentSearches[index];
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: NagrikSpacing.space4,
                  vertical: 2,
                ),
                leading: Icon(
                  Icons.history_rounded,
                  size: 20,
                  color: context.nagrikTheme.textTertiary,
                ),
                title: Text(
                  term,
                  style: context.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.close_rounded, size: 18),
                  tooltip: 'Remove search',
                  color: context.nagrikTheme.textTertiary,
                  constraints: const BoxConstraints(
                    minWidth: 44,
                    minHeight: 44,
                  ),
                  onPressed: () {
                    ref
                        .read(recentSearchesProvider.notifier)
                        .removeSearch(term);
                  },
                ),
                onTap: () {
                  _controller.text = term;
                  ref.read(searchStateProvider.notifier).setQuery(term);
                  _onSubmitted(term);
                },
              );
            },
          ),
        if (recentSearches.isNotEmpty)
          const SliverToBoxAdapter(
            child: SizedBox(height: NagrikSpacing.space3),
          ),

        // 4. Explore Stories Section (Never leaves the screen empty!)
        if (displayPosts.isNotEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                NagrikSpacing.space4,
                NagrikSpacing.space2,
                NagrikSpacing.space4,
                NagrikSpacing.space2,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          color: context.colorScheme.primary.withValues(
                            alpha: 0.12,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.explore_rounded,
                          size: 16,
                          color: context.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        searchState.selectedCategorySlug != null
                            ? '${strings.explorePrefix} ${_formatCategoryName(searchState.selectedCategorySlug!)}'
                            : strings.exploreStoriesNearYou,
                        style: context.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                          letterSpacing: -0.2,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: context.colorScheme.primary.withValues(
                        alpha: 0.12,
                      ),
                      borderRadius: NagrikRadii.borderRadiusPill,
                    ),
                    child: Text(
                      '${displayPosts.length}',
                      style: context.textTheme.labelMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: context.colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        if (displayPosts.isNotEmpty)
          SliverList.builder(
            itemCount: displayPosts.length,
            addAutomaticKeepAlives: false,
            itemBuilder: (context, index) {
              final post = displayPosts[index];
              final cardWidget = post.type == PostType.video
                  ? VideoCard(post: post)
                  : NewsCard(post: post);
              return RepaintBoundary(
                child: NagrikStaggeredEntrance(
                  index: index < 5 ? index : 0,
                  child: cardWidget,
                ),
              );
            },
          ),

        const SliverToBoxAdapter(child: SizedBox(height: 80)),
      ],
    );
  }
}
