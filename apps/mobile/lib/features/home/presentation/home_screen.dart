import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/ad_placement_policy.dart';
import 'package:nagrik/core/ads/widgets/nagrik_adaptive_banner.dart';
import 'package:nagrik/core/ads/widgets/nagrik_native_ad_card.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/core/widgets/empty_state.dart';
import 'package:nagrik/core/widgets/error_state.dart';
import 'package:nagrik/core/widgets/feed_skeleton.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/advertisement_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/post_card.dart';
import 'package:nagrik/features/home/presentation/widgets/breaking_hero_card.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';
import 'package:nagrik/features/home/presentation/widgets/trending_topics_bar.dart';

/// The core Luxury Master Home Feed Screen:
/// 1. Home App Bar (Brand + GPS/Location Switcher + Search + Pulsing Notifications)
/// 2. Urgent Breaking News Hero Card with specular shine & breathing aura
/// 3. Offline warm editorial warning banner when network is down
/// 4. Dynamic Trending Topics derived from live GET /content/categories
/// 5. Section Header: "Latest Near You" with "Explore >" and edition date
/// 6. Staggered Entrance Feed Cards (News, Video Reports, and Interleaved Ads)
/// 7. Shimmer Skeleton Loading & Spring Pull-to-refresh with brand orange spinner
/// 8. Sleek floating "Back to Top" pill button on deep scroll (> 500dp)
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with AutomaticKeepAliveClientMixin {
  late final ScrollController _scrollController;
  bool _showBackToTop = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    final offset = _scrollController.offset;
    if (offset > 500 && !_showBackToTop) {
      setState(() => _showBackToTop = true);
    } else if (offset <= 500 && _showBackToTop) {
      setState(() => _showBackToTop = false);
    }

    if (_scrollController.position.extentAfter < 400) {
      final feedState = ref.read(feedStateProvider);
      if (!feedState.isLoading &&
          !feedState.isLoadingMore &&
          feedState.hasMore) {
        ref.read(feedStateProvider.notifier).loadNextPage();
      }
    }
  }

  void _scrollToTop() {
    NagrikMotion.lightImpact();
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 450),
      curve: Curves.easeOutCubic,
    );
  }

  String _formatEditionDate() {
    final now = DateTime.now();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const weekdays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday'
    ];
    return '${weekdays[now.weekday - 1]}, ${months[now.month - 1]} ${now.day} · Today\'s Ward Edition';
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final feedState = ref.watch(feedStateProvider);
    final strings = ref.watch(appStringsProvider);
    final isOnline = ref.watch(connectivityStatusProvider);
    final isDark = context.isDarkMode;

    final bgColor = context.nagrikTheme.level0Background;
    const linkColor = NagrikBrandColors.orangePrimary;

    int firstContentIndex = -1;
    for (int i = 0; i < feedState.items.length; i++) {
      if (feedState.items[i] is ContentFeedItem) {
        firstContentIndex = i;
        break;
      }
    }

    return ColoredBox(
      color: bgColor,
      child: SafeArea(
        bottom: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Stack(
              children: [
                RefreshIndicator(
                  color: NagrikBrandColors.orangePrimary,
                  backgroundColor: isDark
                      ? NagrikDarkColors.level1Surface
                      : NagrikLightColors.surface,
                  displacement: 28,
                  onRefresh: () async {
                    NagrikMotion.lightImpact();
                    await ref.read(feedStateProvider.notifier).refreshFeed();
                  },
                  child: CustomScrollView(
                    controller: _scrollController,
                    key: const PageStorageKey<String>('home_feed_scroll_view'),
                    physics: const AlwaysScrollableScrollPhysics(
                      parent: BouncingScrollPhysics(),
                    ),
                    slivers: [
                      // 1. Compact Home App Bar (Brand + Location + Actions)
                      const HomeAppBar(),

                      // 2. Urgent Breaking News Alert (Rendered only if urgent post exists)
                      const SliverToBoxAdapter(child: BreakingHeroCard()),

                      // 3. Offline Editorial Warning Banner
                      if (!isOnline)
                        SliverToBoxAdapter(
                          child: Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: NagrikSpacing.space4,
                              vertical: NagrikSpacing.space2,
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: NagrikSpacing.space3,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E2416)
                                  : const Color(0xFFFBF4E6),
                              borderRadius: NagrikRadii.borderRadiusSm,
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFF42371E)
                                    : const Color(0xFFE4CF9C),
                                width: 1.0,
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.wifi_off_rounded,
                                  size: 15,
                                  color: isDark
                                      ? const Color(0xFFE5A138)
                                      : const Color(0xFFB45309),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    strings.offlineDesc,
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 12.0,
                                      fontWeight: FontWeight.w500,
                                      color: isDark
                                          ? const Color(0xFFE5A138)
                                          : const Color(0xFFB45309),
                                    ).copyWith(
                                      fontFamilyFallback:
                                          NagrikTypography.fontFallbacks,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // 4. Category Filter Bar (Dynamic Trending Topics)
                      const SliverToBoxAdapter(child: TrendingTopicsBar()),

                      // 5. Section Header: Daily Edition & Live Status
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(
                            NagrikSpacing.space4,
                            NagrikSpacing.space3,
                            NagrikSpacing.space4,
                            NagrikSpacing.space2,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _formatEditionDate(),
                                      style: GoogleFonts.jetBrainsMono(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w600,
                                        letterSpacing: 0.3,
                                        color: context.nagrikTheme.textSecondary,
                                      ).copyWith(
                                        fontFamilyFallback:
                                            NagrikTypography.fontFallbacks,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Flexible(
                                          child: Text(
                                            strings.latestNearYou,
                                            style: GoogleFonts.newsreader(
                                              fontSize: 22.0,
                                              fontWeight: FontWeight.w700,
                                              letterSpacing: -0.2,
                                              color: context.colorScheme.onSurface,
                                            ).copyWith(
                                              fontFamilyFallback:
                                                  NagrikTypography.fontFallbacks,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Container(
                                          width: 7,
                                          height: 7,
                                          decoration: const BoxDecoration(
                                            color: Color(0xFF10B981),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              Semantics(
                                button: true,
                                label: strings.viewAllStories,
                                child: NagrikSpringPressable(
                                  onTap: () => context.push('/search'),
                                  child: ConstrainedBox(
                                    constraints: const BoxConstraints(
                                      minHeight: 44,
                                      minWidth: 44,
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          'Explore',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontWeight: FontWeight.w700,
                                            fontSize: 14,
                                            color: linkColor,
                                          ).copyWith(
                                            fontFamilyFallback:
                                                NagrikTypography.fontFallbacks,
                                          ),
                                        ),
                                        const SizedBox(width: 3),
                                        const Icon(
                                          Icons.arrow_forward_rounded,
                                          size: 15,
                                          color: linkColor,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // 6. Feed of Cards / Shimmer Skeleton / Error
                      if (feedState.isLoading && feedState.items.isEmpty)
                        SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) => const FeedCardSkeleton(),
                            childCount: 4,
                          ),
                        )
                      else if (feedState.errorMessage != null &&
                          feedState.items.isEmpty)
                        SliverFillRemaining(
                          hasScrollBody: false,
                          child: NagrikErrorState(
                            message: isOnline
                                ? strings.feedLoadError
                                : strings.offlineTitle,
                            description: isOnline
                                ? feedState.errorMessage
                                : strings.offlineDesc,
                            onRetry: () => ref
                                .read(feedStateProvider.notifier)
                                .refreshFeed(),
                          ),
                        )
                      else if (feedState.items.isEmpty)
                        SliverFillRemaining(
                          hasScrollBody: false,
                          child: Center(
                            child: Padding(
                              padding: const EdgeInsets.all(
                                NagrikSpacing.space6,
                              ),
                              child: NagrikEmptyState(
                                icon: Icons.newspaper_outlined,
                                title: strings.noUpdatesTitle,
                                description: strings.noUpdatesDesc,
                              ),
                            ),
                          ),
                        )
                      else
                        Builder(
                          builder: (context) {
                            final adConfig = ref.watch(adConfigurationProvider);
                            final consent = ref.watch(adConsentProvider);
                            final adsActive =
                                adConfig.nativeEnabled && consent.canRequestAds;
                            final totalCount = AdPlacementPolicy.getTotalCount(
                              feedState.items.length,
                              frequency: adConfig.nativeFeedFrequency,
                              adsEnabled: adsActive,
                            );

                            return SliverList(
                              delegate: SliverChildBuilderDelegate(
                                (context, index) {
                                  Widget cardWidget;
                                  if (adsActive &&
                                      AdPlacementPolicy.isAdIndex(
                                        index,
                                        frequency:
                                            adConfig.nativeFeedFrequency,
                                      )) {
                                    cardWidget = const NagrikNativeAdCard(
                                      templateType: TemplateType.medium,
                                    );
                                  } else {
                                    final organicIndex = adsActive
                                        ? AdPlacementPolicy.getOrganicIndex(
                                            index,
                                            frequency:
                                                adConfig.nativeFeedFrequency,
                                          )
                                        : index;
                                    if (organicIndex < 0 ||
                                        organicIndex >= feedState.items.length) {
                                      cardWidget = const SizedBox.shrink();
                                    } else {
                                      final item =
                                          feedState.items[organicIndex];
                                      if (item is ContentFeedItem) {
                                        cardWidget = PostCard(
                                          post: item.post,
                                          isFeatured:
                                              organicIndex == firstContentIndex,
                                        );
                                      } else if (item is AdvertisementFeedItem) {
                                        cardWidget =
                                            AdvertisementCard(ad: item);
                                      } else {
                                        cardWidget = const SizedBox.shrink();
                                      }
                                    }
                                  }

                                  final itemWidget = index < 4
                                      ? NagrikStaggeredEntrance(
                                          index: index,
                                          child: cardWidget,
                                        )
                                      : cardWidget;

                                  return RepaintBoundary(
                                    child: itemWidget,
                                  );
                                },
                                childCount: totalCount,
                                addAutomaticKeepAlives: true,
                                addRepaintBoundaries: true,
                              ),
                            );
                          },
                        ),

                      // Loading More Shimmer / Spinner
                      if (feedState.isLoadingMore)
                        const SliverToBoxAdapter(
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: 20),
                            child: Center(
                              child: SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.2,
                                  valueColor: AlwaysStoppedAnimation(
                                    NagrikBrandColors.orangePrimary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),

                      // Persistent In-Feed Adaptive Banner Ad
                      const SliverToBoxAdapter(
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: NagrikSpacing.space4,
                            vertical: NagrikSpacing.space2,
                          ),
                          child: NagrikAdaptiveBanner(),
                        ),
                      ),

                      // Bottom Spacer with ample clearance
                      const SliverToBoxAdapter(
                        child: SizedBox(height: NagrikSpacing.space6),
                      ),
                    ],
                  ),
                ),

                // 7. Sleek Floating "Back to Top" Button
                if (_showBackToTop)
                  Positioned(
                    bottom: 24,
                    right: 20,
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0.8, end: 1.0),
                      duration: const Duration(milliseconds: 220),
                      curve: Curves.easeOutBack,
                      builder: (context, scale, child) => Transform.scale(
                        scale: scale,
                        child: child,
                      ),
                      child: NagrikFadeIn(
                        duration: const Duration(milliseconds: 200),
                        child: Semantics(
                          button: true,
                          label: strings.backToTop,
                          child: NagrikSpringPressable(
                            onTap: _scrollToTop,
                            child: ConstrainedBox(
                              constraints: const BoxConstraints(
                                minHeight: 48,
                                minWidth: 48,
                              ),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 9,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? NagrikDarkColors.level1Surface
                                      : NagrikLightColors.surfaceElevated,
                                  borderRadius: NagrikRadii.borderRadiusPill,
                                  border: Border.all(
                                    color: NagrikBrandColors.orangePrimary.withValues(
                                      alpha: isDark ? 0.45 : 0.35,
                                    ),
                                    width: 1.0,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: NagrikBrandColors.orangePrimary
                                          .withValues(alpha: 0.20),
                                      blurRadius: 14,
                                      offset: const Offset(0, 4),
                                    ),
                                    BoxShadow(
                                      color: Colors.black.withValues(
                                        alpha: isDark ? 0.45 : 0.08,
                                      ),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(
                                      Icons.arrow_upward_rounded,
                                      size: 16,
                                      color: NagrikBrandColors.orangePrimary,
                                    ),
                                    const SizedBox(width: 5),
                                    Text(
                                      'Top',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                        color: isDark
                                            ? Colors.white
                                            : NagrikLightColors.textPrimary,
                                      ).copyWith(
                                        fontFamilyFallback:
                                            NagrikTypography.fontFallbacks,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
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
      ),
    );
  }
}
