import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/feed/presentation/widgets/post_author_header.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';

/// Editorial Video Report — luxury card with side-by-side thumbnail layout and Hero transition.
/// Features view count, frosted circular play button, duration badge, and numeric engagement bar.
class VideoCard extends ConsumerWidget {
  const VideoCard({
    super.key,
    required this.post,
    this.onTap,
  });

  final Post post;
  final VoidCallback? onTap;

  String _formatViews(int views) {
    if (views >= 1000000) return '${(views / 1000000).toStringAsFixed(1)}M';
    if (views >= 1000) return '${(views / 1000).toStringAsFixed(1)}K';
    return views.toString();
  }

  void _handleVideoPress(BuildContext context) {
    NagrikMotion.mediumImpact();
    // View registration happens once real playback begins in the player —
    // a tap that never plays must not count.
    if (onTap != null) {
      onTap!();
    } else {
      context.push('/content/${post.id}', extra: post);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = context.isDarkMode;
    final subtextColor = context.nagrikTheme.textSecondary;
    final viewCountText = (post.viewCount != null && post.viewCount! > 0)
        ? '${_formatViews(post.viewCount!)} views'
        : null;

    return NagrikSpringPressable(
      onTap: () => _handleVideoPress(context),
      scaleFactor: 0.98,
      child: GlassCard(
        margin: const EdgeInsets.symmetric(
          horizontal: NagrikSpacing.space4,
          vertical: NagrikSpacing.space2,
        ),
        padding: const EdgeInsets.all(NagrikSpacing.space3),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // 1. Author Header with View Count & 3-dots
            PostAuthorHeader.fromPost(
              post,
              showCategory: false,
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (viewCountText != null) ...[
                    Icon(
                      Icons.visibility_outlined,
                      size: 14,
                      color: context.colorScheme.primary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      viewCountText,
                      style: context.textTheme.labelMedium?.copyWith(
                        color: context.colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                  ],
                  IconButton(
                    icon: Icon(
                      Icons.more_vert,
                      size: 20,
                      color: subtextColor,
                    ),
                    tooltip: 'More options',
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
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
            const SizedBox(height: NagrikSpacing.space3),

            // 2. Headline across full width
            Text(
              post.title,
              style: context.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w800,
                fontSize: 17,
                height: 1.30,
                letterSpacing: -0.25,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            if (post.body.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                post.body,
                style: context.textTheme.bodyMedium?.copyWith(
                  color: subtextColor,
                  height: 1.40,
                  fontSize: 13.5,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: NagrikSpacing.space3),

            // 3. Cinematic 16:9 Video Thumbnail Showcase
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Backdrop Hero Cached Image
                    Hero(
                      tag: 'post-media-${post.id}',
                      child: post.mediaUrls.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: post.mediaUrls.first,
                              memCacheWidth: 800,
                              fit: BoxFit.cover,
                              fadeInDuration: const Duration(milliseconds: 150),
                              placeholder: (context, url) =>
                                  _thumbnailFallback(context, isDark),
                              errorWidget: (context, url, error) =>
                                  _thumbnailFallback(context, isDark),
                            )
                          : _thumbnailFallback(context, isDark),
                    ),

                    // Cinematic subtle gradient vignette
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha: 0.15),
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.65),
                            ],
                            stops: const [0.0, 0.5, 1.0],
                          ),
                        ),
                      ),
                    ),

                    // Top-Left "VIDEO REPORT" badge
                    Positioned(
                      top: 10,
                      left: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.65),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.20),
                            width: 0.8,
                          ),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.videocam_rounded,
                              color: Colors.white,
                              size: 13,
                            ),
                            SizedBox(width: 4),
                            Text(
                              'VIDEO REPORT',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 9.5,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Center Glowing Frosted Play Button
                    Center(
                      child: Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.65),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.90),
                            width: 1.8,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.5),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.play_arrow_rounded,
                            color: Colors.white,
                            size: 34,
                          ),
                        ),
                      ),
                    ),

                    // Duration Badge (bottom right)
                    if (post.videoDuration != null && post.videoDuration!.trim().isNotEmpty)
                      Positioned(
                        bottom: 10,
                        right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3.5,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.82),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.22),
                              width: 0.8,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.timer_outlined,
                                color: Colors.white,
                                size: 12,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                post.videoDuration!,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 10.5,
                                  letterSpacing: 0.4,
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

            const SizedBox(height: NagrikSpacing.space3),

            // 3. Numeric Engagement Action Bar
            EngagementActionBar(post: post),
          ],
        ),
      ),
    );
  }

  Widget _thumbnailFallback(BuildContext context, bool isDark) {
    return Container(
      color: isDark
          ? context.nagrikTheme.level4Muted
          : context.nagrikTheme.surfaceMuted,
      child: Center(
        child: Icon(
          Icons.videocam_outlined,
          size: 30,
          color: context.nagrikTheme.textTertiary,
        ),
      ),
    );
  }
}
