import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/empty_state.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/post_card.dart';
import 'package:nagrik/features/saved/presentation/providers/saved_providers.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/widgets/nagrik_adaptive_banner.dart';
import 'package:nagrik/core/ads/widgets/nagrik_native_ad_card.dart';

/// Filter selection for the saved magazine.
enum SavedFilter { all, articles, videos }

/// Screen #3: Device-locally saved magazine: news articles and video reports.
/// Features filter pills, swipe-to-remove with undo snackbar, item count badge, and staggered entrance.
class SavedScreen extends ConsumerStatefulWidget {
  const SavedScreen({super.key});

  @override
  ConsumerState<SavedScreen> createState() => _SavedScreenState();
}

class _SavedScreenState extends ConsumerState<SavedScreen>
    with AutomaticKeepAliveClientMixin {
  SavedFilter _selectedFilter = SavedFilter.all;

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final savedPosts = ref.watch(savedPostsProvider);
    final strings = ref.watch(appStringsProvider);

    final bgColor = context.nagrikTheme.level0Background;
    final barBg = context.nagrikTheme.level1Surface;

    final articles =
        savedPosts.where((p) => p.type == PostType.news).toList();
    final videos =
        savedPosts.where((p) => p.type == PostType.video).toList();

    final filteredPosts = switch (_selectedFilter) {
      SavedFilter.all => savedPosts,
      SavedFilter.articles => articles,
      SavedFilter.videos => videos,
    };

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: barBg,
        elevation: 0,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              strings.navSaved,
              style: context.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.3,
              ),
            ),
            if (savedPosts.isNotEmpty) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: context.colorScheme.primary.withValues(alpha: 0.12),
                  borderRadius: NagrikRadii.borderRadiusPill,
                  border: Border.all(
                    color: context.colorScheme.primary.withValues(alpha: 0.30),
                    width: 0.8,
                  ),
                ),
                child: Text(
                  '${savedPosts.length}',
                  style: context.textTheme.labelMedium?.copyWith(
                    color: context.colorScheme.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 680),
          child: savedPosts.isEmpty
              ? LayoutBuilder(
                  builder: (context, constraints) {
                    return SingleChildScrollView(
                      key: const PageStorageKey<String>(
                        'saved_empty_scroll_view',
                      ),
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          minHeight: constraints.maxHeight,
                        ),
                        child: Column(
                          children: [
                            SizedBox(height: constraints.maxHeight * 0.16),
                            NagrikEmptyState(
                              icon: Icons.bookmark_border_rounded,
                              title: strings.noSavedStoriesTitle,
                              description: strings.noSavedStoriesDesc,
                              actionLabel: strings.browseLatestNews,
                              onAction: () => context.go('/'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                )
              : Column(
                  children: [
                    // Dynamic Filter Tabs (All, Articles, Videos)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(
                        NagrikSpacing.space4,
                        NagrikSpacing.space2,
                        NagrikSpacing.space4,
                        NagrikSpacing.space2,
                      ),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildFilterPill(
                              context: context,
                              label: 'All (${savedPosts.length})',
                              isSelected:
                                  _selectedFilter == SavedFilter.all,
                              onTap: () {
                                NagrikMotion.lightImpact();
                                setState(() =>
                                    _selectedFilter = SavedFilter.all);
                              },
                            ),
                            const SizedBox(width: 8),
                            _buildFilterPill(
                              context: context,
                              label: 'Articles (${articles.length})',
                              isSelected:
                                  _selectedFilter == SavedFilter.articles,
                              onTap: () {
                                NagrikMotion.lightImpact();
                                setState(() =>
                                    _selectedFilter = SavedFilter.articles);
                              },
                            ),
                            const SizedBox(width: 8),
                            _buildFilterPill(
                              context: context,
                              label: 'Videos (${videos.length})',
                              isSelected:
                                  _selectedFilter == SavedFilter.videos,
                              onTap: () {
                                NagrikMotion.lightImpact();
                                setState(() =>
                                    _selectedFilter = SavedFilter.videos);
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: filteredPosts.isEmpty
                          ? Center(
                              child: Padding(
                                padding: const EdgeInsets.all(
                                    NagrikSpacing.space6),
                                child: NagrikEmptyState(
                                  icon: _selectedFilter == SavedFilter.videos
                                      ? Icons.videocam_outlined
                                      : Icons.article_outlined,
                                  title:
                                      'No saved ${_selectedFilter.name}',
                                  description:
                                      'Save ${_selectedFilter.name} to view them in this list.',
                                ),
                              ),
                            )
                          : Builder(
                              builder: (context) {
                                final adConfig = ref.watch(adConfigurationProvider);
                                final consent = ref.watch(adConsentProvider);
                                final showSavedAd = adConfig.nativeEnabled &&
                                    consent.canRequestAds &&
                                    filteredPosts.length >=
                                        adConfig.minSavedCountForAds;
                                final totalCount =
                                    filteredPosts.length + (showSavedAd ? 1 : 0);

                                return ListView.builder(
                                  key: const PageStorageKey<String>(
                                    'saved_list_scroll_view',
                                  ),
                                  padding: const EdgeInsets.fromLTRB(
                                    0,
                                    NagrikSpacing.space1,
                                    0,
                                    100,
                                  ),
                                  itemCount: totalCount,
                                  addAutomaticKeepAlives: true,
                                  addRepaintBoundaries: true,
                                  itemBuilder: (context, index) {
                                    if (showSavedAd &&
                                        index == filteredPosts.length) {
                                      return const Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Padding(
                                            padding: EdgeInsets.symmetric(
                                              vertical: 6,
                                            ),
                                            child: NagrikNativeAdCard(
                                              templateType: TemplateType.small,
                                            ),
                                          ),
                                          Padding(
                                            padding: EdgeInsets.symmetric(
                                              vertical: 4,
                                            ),
                                            child: NagrikAdaptiveBanner(),
                                          ),
                                        ],
                                      );
                                    }
                                    final post = filteredPosts[index];
                                    return Semantics(
                                      label: post.title,
                                      onDismiss: () =>
                                          _removePost(context, post),
                                      child: Dismissible(
                                        key: ValueKey('saved-${post.id}'),
                                        direction: DismissDirection.endToStart,
                                        background: Container(
                                          margin: const EdgeInsets.symmetric(
                                            horizontal: NagrikSpacing.space4,
                                            vertical: NagrikSpacing.space2,
                                          ),
                                          padding:
                                              const EdgeInsets.only(right: 20),
                                          alignment: Alignment.centerRight,
                                          decoration: BoxDecoration(
                                            color: context.colorScheme.error,
                                            borderRadius:
                                                NagrikRadii.borderRadiusMd,
                                          ),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            children: [
                                              const Icon(
                                                Icons.delete_outline_rounded,
                                                color: Colors.white,
                                                size: 24,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                strings.removeAction,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.w700,
                                                  fontSize: 13,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        confirmDismiss: (direction) async => true,
                                        child: RepaintBoundary(
                                          child: NagrikStaggeredEntrance(
                                            index: index < 5 ? index : 0,
                                            child: PostCard(post: post),
                                          ),
                                        ),
                                      ),
                                    );
                                  },
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

  Widget _buildFilterPill({
    required BuildContext context,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isDark = context.isDarkMode;
    final activeBg = context.colorScheme.primary
        .withValues(alpha: isDark ? 0.22 : 0.12);
    final activeBorder =
        context.colorScheme.primary.withValues(alpha: 0.40);
    final inactiveBg =
        isDark ? context.nagrikTheme.level2Elevated : context.nagrikTheme.level1Surface;
    final inactiveBorder = isDark
        ? context.nagrikTheme.border.withValues(alpha: 0.7)
        : context.nagrikTheme.border;

    return Semantics(
      button: true,
      selected: isSelected,
      child: NagrikSpringPressable(
        onTap: onTap,
        scaleFactor: 0.95,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? activeBg : inactiveBg,
            borderRadius: NagrikRadii.borderRadiusPill,
            border: Border.all(
              color: isSelected ? activeBorder : inactiveBorder,
              width: 0.85,
            ),
            boxShadow: [
              BoxShadow(
                color: isDark
                    ? Colors.black.withValues(alpha: 0.2)
                    : Colors.black.withValues(alpha: 0.03),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Text(
            label,
            style: context.textTheme.labelMedium?.copyWith(
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              color: isSelected
                  ? context.colorScheme.primary
                  : context.nagrikTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _removePost(BuildContext context, Post post) async {
    final strings = ref.read(appStringsProvider);
    NagrikMotion.mediumImpact();
    // Persist removal, then sync the feed's bookmark state.
    await ref.read(savedPostsProvider.notifier).removePost(post.id);
    if (context.mounted) {
      ref.read(feedStateProvider.notifier).syncBookmark(post.id, false);
    }

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(strings.removedFromSaved),
        action: SnackBarAction(
          label: 'UNDO',
          onPressed: () async {
            final saved = await ref
                .read(savedPostsProvider.notifier)
                .toggleSave(post);
            ref.read(feedStateProvider.notifier).syncBookmark(post.id, saved);
          },
        ),
        duration: const Duration(seconds: 5),
      ),
    );
  }
}
