import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/error_state.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/comment.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/feed/presentation/widgets/post_author_header.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';
import 'package:nagrik/features/feed/presentation/widgets/share_bottom_sheet.dart';
import 'package:nagrik/features/feed/presentation/widgets/video/nagrik_video_player.dart';
import 'package:nagrik/core/ads/ad_frequency_manager.dart';
import 'package:nagrik/core/ads/managers/interstitial_ad_manager.dart';
import 'package:nagrik/core/ads/widgets/nagrik_adaptive_banner.dart';
import 'package:nagrik/core/ads/widgets/nagrik_native_ad_card.dart';
import 'package:nagrik/features/search/presentation/providers/search_providers.dart';

/// Screen displaying full article or video report details fetched via GET /content/{id}.
/// Editorial reading experience: hero media, headline, metadata, key points,
/// full body, topic tags (wired to real search), location context, engagement
/// actions, and related stories.
class ContentDetailScreen extends ConsumerStatefulWidget {
  const ContentDetailScreen({
    super.key,
    required this.contentId,
    this.initialPost,
  });

  final String contentId;
  final Post? initialPost;

  @override
  ConsumerState<ContentDetailScreen> createState() =>
      _ContentDetailScreenState();
}

class _ContentDetailScreenState extends ConsumerState<ContentDetailScreen> {
  Post? _post;
  bool _isLoading = true;
  late final ScrollController _scrollController;
  bool _showFloatingBar = false;
  double _readingProgress = 0.0;

  @override
  void initState() {
    super.initState();
    _post = widget.initialPost;
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
    _fetchDetails();
    ref.read(interstitialAdManagerProvider).preloadAd();
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final offset = _scrollController.offset;
    final progress = maxScroll > 0 ? (offset / maxScroll).clamp(0.0, 1.0) : 0.0;
    final show = offset > 240;

    if (show != _showFloatingBar ||
        (progress - _readingProgress).abs() > 0.01) {
      setState(() {
        _showFloatingBar = show;
        _readingProgress = progress;
      });
    }
  }

  Future<void> _fetchDetails() async {
    final repo = ref.read(contentRepositoryProvider);
    final detail = await repo.getContentDetails(widget.contentId);

    if (mounted) {
      setState(() {
        if (detail != null) {
          _post = detail;
        }
        _isLoading = false;
      });
    }
  }

  int _calculateReadingTime(String text) {
    final words = text
        .trim()
        .split(RegExp(r'\s+'))
        .where((w) => w.isNotEmpty)
        .length;
    return (words / 160).ceil().clamp(1, 60);
  }

  void _showCommentsSheet(BuildContext context, Post post) {
    final commentController = TextEditingController();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: context.isDarkMode
          ? context.nagrikTheme.level2Elevated
          : context.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (modalCtx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            final isDark = ctx.isDarkMode;
            final currentP = _post ?? post;
            final commentsList = currentP.comments;

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom,
              ),
              child: SafeArea(
                child: Container(
                  constraints: BoxConstraints(
                    maxHeight: MediaQuery.of(ctx).size.height * 0.75,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: NagrikSpacing.space4,
                    vertical: NagrikSpacing.space3,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 38,
                          height: 4,
                          margin: const EdgeInsets.only(bottom: 14),
                          decoration: BoxDecoration(
                            color: ctx.nagrikTheme.border.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Discussion',
                                style: ctx.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: ctx.colorScheme.primary
                                      .withValues(alpha: 0.12),
                                  borderRadius: NagrikRadii.borderRadiusPill,
                                ),
                                child: Text(
                                  '${currentP.commentsCount}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: ctx.colorScheme.primary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded),
                            onPressed: () => Navigator.pop(modalCtx),
                          ),
                        ],
                      ),
                      const Divider(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 6,
                        ),
                        margin: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                          color: isDark
                              ? ctx.nagrikTheme.level4Muted
                              : ctx.nagrikTheme.surfaceMuted,
                          borderRadius: NagrikRadii.borderRadiusSm,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.verified_user_outlined,
                              size: 14,
                              color: ctx.nagrikTheme.textSecondary,
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                'Verified citizen discourse. Reports are moderated for community safety.',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: ctx.nagrikTheme.textSecondary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: commentsList.isEmpty
                            ? Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.chat_bubble_outline_rounded,
                                      size: 36,
                                      color: ctx.nagrikTheme.textTertiary,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Be the first to share ground insights',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: ctx.nagrikTheme.textSecondary,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Your perspective helps verify local developments.',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: ctx.nagrikTheme.textTertiary,
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            : ListView.separated(
                                itemCount: commentsList.length,
                                separatorBuilder: (_, _) => const Divider(height: 16),
                                itemBuilder: (c, idx) {
                                  final cm = commentsList[idx];
                                  final authorInitial = cm.author.name.isNotEmpty
                                      ? cm.author.name[0].toUpperCase()
                                      : 'C';
                                  final timeDiff = DateTime.now().difference(cm.createdAt);
                                  final timeText = timeDiff.inMinutes < 60
                                      ? '${timeDiff.inMinutes}m ago'
                                      : '${timeDiff.inHours}h ago';

                                  return Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      CircleAvatar(
                                        radius: 14,
                                        backgroundColor: ctx.colorScheme.primary
                                            .withValues(alpha: 0.15),
                                        child: Text(
                                          authorInitial,
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: ctx.colorScheme.primary,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Text(
                                                  cm.author.name,
                                                  style: const TextStyle(
                                                    fontSize: 13,
                                                    fontWeight: FontWeight.w700,
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                Text(
                                                  timeText,
                                                  style: TextStyle(
                                                    fontSize: 11,
                                                    color: ctx
                                                        .nagrikTheme
                                                        .textTertiary,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 3),
                                            Text(
                                              cm.text,
                                              style: TextStyle(
                                                fontSize: 13,
                                                color: isDark
                                                    ? const Color(0xFFCBD5E1)
                                                    : const Color(0xFF334155),
                                                height: 1.35,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: commentController,
                              textInputAction: TextInputAction.send,
                              onSubmitted: (_) {
                                _submitComment(
                                  commentController,
                                  setModalState,
                                  modalCtx,
                                );
                              },
                              decoration: InputDecoration(
                                hintText: 'Add to this community report...',
                                hintStyle: TextStyle(
                                  fontSize: 13,
                                  color: ctx.nagrikTheme.textTertiary,
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 10,
                                ),
                                isDense: true,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton.filled(
                            icon: const Icon(Icons.send_rounded, size: 18),
                            onPressed: () {
                              _submitComment(
                                commentController,
                                setModalState,
                                modalCtx,
                              );
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _submitComment(
    TextEditingController controller,
    StateSetter setModalState,
    BuildContext modalCtx,
  ) {
    final txt = controller.text.trim();
    if (txt.isEmpty) return;
    NagrikMotion.lightImpact();
    controller.clear();
    final newComment = Comment(
      id: 'c_${DateTime.now().millisecondsSinceEpoch}',
      author: const PostAuthor(
        id: 'usr_local',
        name: 'Citizen Contributor',
        avatarUrl: '',
        isVerified: true,
      ),
      text: txt,
      createdAt: DateTime.now(),
    );
    final target = _post ?? widget.initialPost;
    if (target != null) {
      final updatedList = [...target.comments, newComment];
      final updatedPost = target.copyWith(
        comments: updatedList,
        commentsCount: target.commentsCount + 1,
      );
      setState(() {
        _post = updatedPost;
      });
      setModalState(() {});
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Contribution submitted for community review'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final post = _post;
    final strings = ref.watch(appStringsProvider);
    final bottomInset = MediaQuery.paddingOf(context).bottom;
    final floatingBarBottom = _showFloatingBar
        ? (bottomInset > 0 ? bottomInset + 10.0 : 16.0)
        : -120.0;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        ref.read(adFrequencyManagerProvider.notifier).recordContentTransition();
        await ref.read(interstitialAdManagerProvider).maybeShowInterstitial(
              placement: 'content_detail_exit',
            );
        if (context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        scrolledUnderElevation: 0,
        backgroundColor: context.nagrikTheme.level0Background.withValues(
          alpha: 0.94,
        ),
        elevation: 0,
        title: Text(
          post?.type == PostType.video
              ? strings.videoReportTitle
              : strings.localStoryTitle,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
        actions: [
          if (post != null)
            IconButton(
              icon: const Icon(Icons.share_outlined, size: 20),
              tooltip: 'Share story',
              onPressed: () => showShareSheet(context, post),
            ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            tooltip: 'More options',
            onPressed: () {
              showReportContentSheet(
                context,
                contentId: widget.contentId,
                contentTitle: post?.title,
              );
            },
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2.5),
          child: _buildReadingProgressBar(context, isDark),
        ),
      ),
      body: Stack(
        children: [
          if (_isLoading && post == null)
            _buildArticleSkeleton(context, isDark)
          else if (post == null)
            Builder(
              builder: (context) {
                final isOnline = ref.watch(connectivityStatusProvider);
                return NagrikErrorState(
                  message: isOnline
                      ? strings.contentNotFoundTitle
                      : strings.offlineTitle,
                  description: isOnline
                      ? strings.contentNotFoundDesc
                      : strings.offlineDesc,
                  onRetry: () {
                    setState(() => _isLoading = true);
                    _fetchDetails();
                  },
                );
              },
            )
          else
            SingleChildScrollView(
              controller: _scrollController,
              physics: const BouncingScrollPhysics(),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 680),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Hero Media Section (Video, Image, or Dynamic Topic Header)
                      _buildHeroMedia(post, isDark),

                      // 2. Article Content Body Container
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: NagrikSpacing.space4,
                          vertical: NagrikSpacing.space3,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Category & Reading Time Meta Row
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: context.colorScheme.primary
                                        .withValues(
                                          alpha: isDark ? 0.22 : 0.12,
                                        ),
                                    borderRadius: NagrikRadii.borderRadiusXs,
                                    border: Border.all(
                                      color: context.colorScheme.primary
                                          .withValues(alpha: 0.35),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color:
                                              context.nagrikTheme.brandBright,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 5),
                                      Text(
                                        post.category.label.toUpperCase(),
                                        style: TextStyle(
                                          color:
                                              context.nagrikTheme.brandBright,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w800,
                                          letterSpacing: 0.8,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: NagrikSpacing.space2),
                                // Reading time estimate badge
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? context.nagrikTheme.level2Elevated
                                        : context.nagrikTheme.surfaceMuted,
                                    borderRadius: NagrikRadii.borderRadiusXs,
                                    border: Border.all(
                                      color: context.nagrikTheme.border
                                          .withValues(alpha: 0.4),
                                      width: 0.8,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.schedule_rounded,
                                        size: 13,
                                        color:
                                            context.nagrikTheme.textSecondary,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        post.type == PostType.video
                                            ? 'Video coverage'
                                            : '${_calculateReadingTime(post.body)} min read',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color:
                                              context.nagrikTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: NagrikSpacing.space3),

                            // Main Headline
                            Text(
                              post.title,
                              style: context.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w800,
                                height: 1.28,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: NagrikSpacing.space3),

                            // Author Meta Header with verified badge
                            PostAuthorHeader.fromPost(
                              post,
                              showCategory: false,
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 3,
                                    ),
                                    decoration: BoxDecoration(
                                      color: context.nagrikTheme.level2Elevated,
                                      borderRadius:
                                          NagrikRadii.borderRadiusPill,
                                      border: Border.all(
                                        color: context.nagrikTheme.border
                                            .withValues(alpha: 0.4),
                                        width: 0.8,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.verified_rounded,
                                          size: 12,
                                          color:
                                              context.nagrikTheme.brandBright,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Verified Source',
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w700,
                                            color: context
                                                .nagrikTheme
                                                .textSecondary,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(
                                      Icons.flag_outlined,
                                      size: 18,
                                    ),
                                    tooltip: 'Report story',
                                    color: context.nagrikTheme.textTertiary,
                                    onPressed: () {
                                      showReportContentSheet(
                                        context,
                                        contentId: post.id,
                                        contentTitle: post.title,
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: NagrikSpacing.space2),

                            // Location & Proximity Pill
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? context.nagrikTheme.level2Elevated
                                    : context.nagrikTheme.surfaceMuted,
                                borderRadius: NagrikRadii.borderRadiusSm,
                                border: Border.all(
                                  color: context.nagrikTheme.border.withValues(
                                    alpha: 0.5,
                                  ),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.location_on_outlined,
                                    size: 14,
                                    color: context.nagrikTheme.brandBright,
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    post.locality.isNotEmpty
                                        ? '${post.locality}, ${post.city}'
                                        : post.city,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: context.nagrikTheme.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 4. Key Highlights Executive Summary Card
                            if (post.body.length > 60) ...[
                              _buildKeyHighlightsCard(context, post, isDark),
                              const SizedBox(height: NagrikSpacing.space4),
                            ],

                            // Article Divider Line
                            Divider(
                              color: context.nagrikTheme.border.withValues(
                                alpha: 0.3,
                              ),
                              height: 1,
                            ),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 5. Full Article Body with Editorial Typography
                            Text(
                              post.body,
                              style: context.textTheme.bodyLarge?.copyWith(
                                height: 1.72,
                                letterSpacing: 0.15,
                              ),
                            ),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 6. Topic Tags (tap runs a real search)
                            _buildTagsStrip(context, post, isDark),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 7. Location context (real API location only)
                            _buildCivicLocationCard(context, post, isDark),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 8. In-Article Engagement Action Bar
                            GlassCard(
                              padding: const EdgeInsets.symmetric(
                                horizontal: NagrikSpacing.space3,
                                vertical: NagrikSpacing.space2,
                              ),
                              child: EngagementActionBar(post: post),
                            ),
                            const SizedBox(height: NagrikSpacing.space4),

                            // In-Article Editorial Native Ad
                            const NagrikNativeAdCard(
                              margin: EdgeInsets.symmetric(
                                vertical: NagrikSpacing.space2,
                              ),
                            ),
                            const SizedBox(height: NagrikSpacing.space4),

                            // 9. Related Local Stories
                            _buildRelatedStoriesSection(context, post, isDark),
                            const SizedBox(height: NagrikSpacing.space3),

                            // Bottom Article Adaptive Banner Ad
                            const NagrikAdaptiveBanner(
                              margin: EdgeInsets.symmetric(
                                horizontal: NagrikSpacing.space2,
                                vertical: NagrikSpacing.space2,
                              ),
                            ),
                            SizedBox(
                              height: 120 + bottomInset,
                            ), // clearance for bottom dock
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // 11. Floating Bottom Frosted Engagement Bar (Appears when scrolled past hero)
          if (post != null)
            AnimatedPositioned(
              duration: const Duration(milliseconds: 260),
              curve: Curves.easeOutCubic,
              bottom: floatingBarBottom,
              left: 16,
              right: 16,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: _showFloatingBar ? 1.0 : 0.0,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 440),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: isDark
                            ? context.nagrikTheme.level1Surface.withValues(alpha: 0.95)
                            : Colors.white.withValues(alpha: 0.96),
                        borderRadius: BorderRadius.circular(NagrikRadii.pill),
                        border: Border.all(
                          color: context.nagrikTheme.border.withValues(alpha: 0.75),
                          width: 0.85,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(
                              alpha: isDark ? 0.40 : 0.08,
                            ),
                            blurRadius: 24,
                            offset: const Offset(0, 8),
                          ),
                          BoxShadow(
                            color: context.colorScheme.primary.withValues(
                              alpha: isDark ? 0.06 : 0.03,
                            ),
                            blurRadius: 16,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Like action
                          NagrikSpringPressable(
                            onTap: () {
                              NagrikMotion.lightImpact();
                              ref.read(feedPostsProvider.notifier).toggleLike(post.id);
                              final updatedLiked = !post.isLiked;
                              final updatedCount = updatedLiked
                                  ? post.likesCount + 1
                                  : (post.likesCount - 1).clamp(0, 999999);
                              setState(() {
                                _post = (_post ?? post).copyWith(
                                  isLiked: updatedLiked,
                                  likesCount: updatedCount,
                                );
                              });
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  post.isLiked
                                      ? Icons.favorite_rounded
                                      : Icons.favorite_border_rounded,
                                  size: 20,
                                  color: post.isLiked
                                      ? context.colorScheme.error
                                      : context.nagrikTheme.textSecondary,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '${post.likesCount}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                    color: post.isLiked
                                        ? context.colorScheme.error
                                        : context.colorScheme.onSurface,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Comment action with open discussion
                          NagrikSpringPressable(
                            onTap: () => _showCommentsSheet(context, post),
                            child: Semantics(
                              label: '${post.commentsCount} comments',
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.chat_bubble_outline_rounded,
                                    size: 19,
                                    color: context.nagrikTheme.textSecondary,
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    '${post.commentsCount}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w600,
                                      fontSize: 13,
                                      color: context.colorScheme.onSurface,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          // Share action
                          IconButton(
                            icon: const Icon(Icons.share_outlined, size: 20),
                            tooltip: 'Share',
                            onPressed: () => showShareSheet(context, post),
                          ),
                          // Scroll to top button
                          NagrikSpringPressable(
                            onTap: () {
                              _scrollController.animateTo(
                                0,
                                duration: const Duration(milliseconds: 400),
                                curve: Curves.easeOutCubic,
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: context.colorScheme.primary.withValues(
                                  alpha: 0.12,
                                ),
                                borderRadius: BorderRadius.circular(
                                  NagrikRadii.pill,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.arrow_upward_rounded,
                                    size: 14,
                                    color: context.nagrikTheme.brandBright,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Top',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: context.nagrikTheme.brandBright,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    ),
    );
  }

  /// Hairline reading progress indicator pinned under the AppBar.
  Widget _buildReadingProgressBar(BuildContext context, bool isDark) {
    return Container(
      height: 3.0,
      width: double.infinity,
      color: context.nagrikTheme.border.withValues(alpha: 0.25),
      alignment: Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: _readingProgress,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                context.colorScheme.primary,
                context.nagrikTheme.brandBright,
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Hero media with fallback to bespoke editorial topic hero banner.
  Widget _buildHeroMedia(Post post, bool isDark) {
    if (post.type == PostType.video &&
        post.videoUrl != null &&
        post.videoUrl!.isNotEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: NagrikSpacing.space4,
          vertical: NagrikSpacing.space2,
        ),
        child: Hero(
          tag: 'post-media-${widget.contentId}',
          child: NagrikVideoPlayer(
            videoUrl: post.videoUrl!,
            postId: post.id,
            thumbnailUrl:
                post.thumbnailUrl ??
                (post.mediaUrls.isNotEmpty ? post.mediaUrls.first : null),
            autoPlay: true,
          ),
        ),
      );
    } else if (post.mediaUrls.isNotEmpty) {
      return Hero(
        tag: 'post-media-${widget.contentId}',
        child: SizedBox(
          height: 260,
          width: double.infinity,
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(
                imageUrl: post.mediaUrls.first,
                memCacheWidth: 800,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  color: isDark
                      ? context.nagrikTheme.level4Muted
                      : context.nagrikTheme.surfaceMuted,
                ),
                errorWidget: (context, url, error) => Container(
                  color: isDark
                      ? context.nagrikTheme.level4Muted
                      : context.nagrikTheme.surfaceMuted,
                  child: const Center(
                    child: Icon(Icons.image_outlined, size: 48),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withValues(alpha: 0.55),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Editorial topic hero banner for text-first articles. Single brand
    // treatment: icons vary by category, color never does.
    IconData categoryIcon;
    switch (post.category.label.toLowerCase()) {
      case 'traffic':
        categoryIcon = Icons.traffic_rounded;
        break;
      case 'crime':
      case 'safety':
        categoryIcon = Icons.security_rounded;
        break;
      case 'weather':
        categoryIcon = Icons.cloud_outlined;
        break;
      case 'jobs':
        categoryIcon = Icons.work_outline_rounded;
        break;
      default:
        categoryIcon = Icons.account_balance_rounded;
    }
    final accentColor = context.colorScheme.primary;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      padding: const EdgeInsets.all(NagrikSpacing.space4),
      decoration: BoxDecoration(
        color: accentColor.withValues(alpha: 0.08),
        borderRadius: NagrikRadii.borderRadiusCard,
        border: Border.all(
          color: accentColor.withValues(alpha: 0.30),
          width: 1,
        ),
      ),
      child: Stack(
        children: [
          // Background geometric watermark icon
          Positioned(
            right: -10,
            bottom: -15,
            child: Icon(
              categoryIcon,
              size: 110,
              color: accentColor.withValues(alpha: isDark ? 0.08 : 0.05),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: accentColor.withValues(alpha: 0.18),
                      borderRadius: NagrikRadii.borderRadiusSm,
                    ),
                    child: Icon(categoryIcon, size: 18, color: accentColor),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'LOCAL JOURNALISM • DISPATCH',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                      color: accentColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                'Comprehensive verified coverage from ${post.locality.isNotEmpty ? post.locality : post.city} field desk.',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  height: 1.4,
                  color: context.nagrikTheme.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Executive summary callout box with bulleted takeaways.
  Widget _buildKeyHighlightsCard(BuildContext context, Post post, bool isDark) {
    // Extractive key points: split on sentence boundaries, keep fragments
    // long enough to stand alone, cap length with an ellipsis. Presented as
    // article excerpts — never as an AI summary.
    final sentences = post.body
        .split(RegExp(r'(?<=[.!?\n])\s+|\n+'))
        .map((s) => s.trim().replaceAll(RegExp(r'\s+'), ' '))
        .where((s) => s.length > 24)
        .toList();
    final bullets = sentences.take(3).map((s) {
      const max = 160;
      return s.length <= max ? s : '${s.substring(0, max).trim()}…';
    }).toList();
    if (bullets.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(NagrikSpacing.space4),
      decoration: BoxDecoration(
        color: isDark
            ? context.nagrikTheme.level1Surface
            : context.nagrikTheme.surfaceMuted,
        borderRadius: NagrikRadii.borderRadiusCard,
        border: Border(
          left: BorderSide(
            color: context.nagrikTheme.brandBright,
            width: 3.5,
          ),
          top: BorderSide(
            color: context.nagrikTheme.border.withValues(alpha: 0.4),
            width: 0.8,
          ),
          right: BorderSide(
            color: context.nagrikTheme.border.withValues(alpha: 0.4),
            width: 0.8,
          ),
          bottom: BorderSide(
            color: context.nagrikTheme.border.withValues(alpha: 0.4),
            width: 0.8,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.bolt_rounded,
                size: 18,
                color: context.nagrikTheme.brandBright,
              ),
              const SizedBox(width: 6),
              Text(
                'KEY HIGHLIGHTS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.7,
                  color: context.nagrikTheme.brandBright,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          for (final bullet in bullets)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '• ',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: context.nagrikTheme.brandBright,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      bullet.trim(),
                      style: TextStyle(
                        fontSize: 13.5,
                        height: 1.45,
                        color: isDark
                            ? const Color(0xFFCBD5E1)
                            : const Color(0xFF334155),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// Interactive tags strip.
  /// Topic tags derived from real post metadata. Tapping a tag runs a real
  /// search for that term and opens the Search tab with live results.
  Widget _buildTagsStrip(BuildContext context, Post post, bool isDark) {
    final tags = <String, String>{};
    if (post.locality.isNotEmpty) {
      tags['#${post.locality.replaceAll(' ', '')}'] = post.locality;
    }
    if (post.city.isNotEmpty) {
      tags['#${post.city.replaceAll(' ', '')}'] = post.city;
    }
    final categoryName = post.categorySlug?.isNotEmpty == true
        ? post.categorySlug!
        : post.category.label;
    tags['#$categoryName'] = categoryName;
    if (tags.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 6,
      children: tags.entries.map((entry) {
        return Semantics(
          button: true,
          label: 'Search ${entry.value}',
          child: NagrikSpringPressable(
            onTap: () {
              NagrikMotion.lightImpact();
              ref
                  .read(searchStateProvider.notifier)
                  .executeImmediate(entry.value);
              context.push('/search');
            },
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level2Elevated
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusPill,
                  border: Border.all(
                    color: context.nagrikTheme.border.withValues(alpha: 0.4),
                    width: 0.8,
                  ),
                ),
                child: Center(
                  widthFactor: 1.0,
                  child: Text(
                    entry.key,
                    style: context.textTheme.labelLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: context.nagrikTheme.brandBright,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  /// Location context card showing the real API-provided coverage area.
  Widget _buildCivicLocationCard(BuildContext context, Post post, bool isDark) {
    final strings = ref.watch(appStringsProvider);
    final parts = [
      if (post.locality.isNotEmpty) post.locality,
      if (post.city.isNotEmpty) post.city,
      if (post.state.isNotEmpty) post.state,
    ];
    final locationDisplay = parts.isNotEmpty
        ? parts.join(', ')
        : 'Nearby coverage';

    return Container(
      padding: const EdgeInsets.all(NagrikSpacing.space4),
      decoration: BoxDecoration(
        color: isDark
            ? context.nagrikTheme.level2Elevated
            : context.nagrikTheme.level1Surface,
        borderRadius: NagrikRadii.borderRadiusCard,
        border: Border.all(
          color: context.nagrikTheme.border.withValues(alpha: 0.5),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: context.colorScheme.primary.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.location_on_outlined,
              color: context.nagrikTheme.brandBright,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  strings.coverageArea,
                  style: context.textTheme.labelMedium?.copyWith(
                    color: context.nagrikTheme.textTertiary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  locationDisplay,
                  style: context.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Related stories section to eliminate empty voids.
  Widget _buildRelatedStoriesSection(
    BuildContext context,
    Post post,
    bool isDark,
  ) {
    // Score candidates: same city + same backend category slug weigh most,
    // same content type breaks ties, newer stories win the rest.
    final feedAsync = ref.watch(feedStateProvider);
    final strings = ref.watch(appStringsProvider);
    final candidates = feedAsync.posts.where((p) => p.id != post.id).toList();
    int score(Post p) {
      var s = 0;
      if (p.city.isNotEmpty &&
          p.city.toLowerCase() == post.city.toLowerCase()) {
        s += 2;
      }
      if (p.categorySlug != null &&
          post.categorySlug != null &&
          p.categorySlug!.toLowerCase() ==
              post.categorySlug!.toLowerCase()) {
        s += 2;
      }
      if (p.type == post.type) s += 1;
      return s;
    }

    candidates.sort((a, b) {
      final byScore = score(b).compareTo(score(a));
      if (byScore != 0) return byScore;
      return b.createdAt.compareTo(a.createdAt);
    });
    final allPosts = candidates.take(3).toList();

    if (allPosts.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.auto_stories_rounded,
              size: 18,
              color: context.nagrikTheme.brandBright,
            ),
            const SizedBox(width: 8),
            Text(
              strings.relatedStoriesTitle,
              style: context.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        for (final related in allPosts)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: NagrikSpringPressable(
              onTap: () {
                context.push('/content/${related.id}', extra: related);
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: context.nagrikTheme.level1Surface,
                  borderRadius: NagrikRadii.borderRadiusCard,
                  border: Border.all(
                    color: context.nagrikTheme.border.withValues(alpha: 0.4),
                  ),
                ),
                child: Row(
                  children: [
                    if (related.mediaUrls.isNotEmpty) ...[
                      ClipRRect(
                        borderRadius: NagrikRadii.borderRadiusSm,
                        child: CachedNetworkImage(
                          imageUrl: related.mediaUrls.first,
                          memCacheWidth: 160,
                          memCacheHeight: 160,
                          width: 64,
                          height: 64,
                          fit: BoxFit.cover,
                          errorWidget: (_, _, _) => Container(
                            width: 64,
                            height: 64,
                            color: context.nagrikTheme.level2Elevated,
                            child: const Icon(
                              Icons.newspaper_rounded,
                              size: 24,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                    ],
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: context.colorScheme.primary.withValues(
                                alpha: 0.12,
                              ),
                              borderRadius: NagrikRadii.borderRadiusXs,
                            ),
                            child: Text(
                              related.category.label.toUpperCase(),
                              style: context.textTheme.labelSmall?.copyWith(
                                fontWeight: FontWeight.w800,
                                color: context.colorScheme.primary,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            related.title,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: context.textTheme.bodyMedium?.copyWith(
                              fontWeight: FontWeight.w700,
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            related.timeAgo,
                            style: context.textTheme.labelSmall?.copyWith(
                              color: context.nagrikTheme.textTertiary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: context.nagrikTheme.textTertiary,
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  /// Shimmer loading skeleton.
  Widget _buildArticleSkeleton(BuildContext context, bool isDark) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          NagrikShimmer(
            child: Container(
              height: 240,
              width: double.infinity,
              color: context.nagrikTheme.surfaceMuted,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(NagrikSpacing.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                NagrikShimmer(
                  child: Container(
                    height: 22,
                    width: 90,
                    decoration: BoxDecoration(
                      color: context.nagrikTheme.surfaceMuted,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
                const SizedBox(height: NagrikSpacing.space3),
                NagrikShimmer(
                  child: Container(
                    height: 26,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: context.nagrikTheme.surfaceMuted,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
                const SizedBox(height: NagrikSpacing.space2),
                NagrikShimmer(
                  child: Container(
                    height: 26,
                    width: 220,
                    decoration: BoxDecoration(
                      color: context.nagrikTheme.surfaceMuted,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
                const SizedBox(height: NagrikSpacing.space4),
                for (int i = 0; i < 6; i++) ...[
                  NagrikShimmer(
                    child: Container(
                      height: 14,
                      width: i == 5 ? 180 : double.infinity,
                      decoration: BoxDecoration(
                        color: context.nagrikTheme.surfaceMuted,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
