import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/feed/presentation/widgets/post_author_header.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';

/// Editorial News Post — high-performance card with side-thumbnail layout and Hero transition.
/// Layout: Author header → [Headline + Body excerpt | Thumbnail with frosted category badge] → Engagement bar.
class NewsCard extends StatelessWidget {
  const NewsCard({
    super.key,
    required this.post,
    this.onTap,
    this.isFeatured = false,
  });

  final Post post;
  final VoidCallback? onTap;
  final bool isFeatured;

  Widget _buildFeaturedCard(BuildContext context, bool isDark) {
    return GlassCard(
      margin: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      padding: const EdgeInsets.all(NagrikSpacing.space3),
      onTap: onTap ?? () => context.push('/content/${post.id}', extra: post),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Author & Metadata Header
          PostAuthorHeader.fromPost(
            post,
            showCategory: false,
            onMorePressed: () {
              showReportContentSheet(
                context,
                contentId: post.id,
                contentTitle: post.title,
              );
            },
          ),
          const SizedBox(height: NagrikSpacing.space3),

          // 2. Full-Width 16:9 Cinematic Hero Image with Category Badge & Gradient Scrim
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Hero(
                    tag: 'post-media-${post.id}',
                    child: CachedNetworkImage(
                      imageUrl: post.mediaUrls.first,
                      memCacheWidth: 800,
                      fit: BoxFit.cover,
                      fadeInDuration: const Duration(milliseconds: 150),
                      placeholder: (context, url) => Container(
                        color: isDark
                            ? context.nagrikTheme.level4Muted
                            : context.nagrikTheme.surfaceMuted,
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: isDark
                            ? context.nagrikTheme.level4Muted
                            : context.nagrikTheme.surfaceMuted,
                        child: Center(
                          child: Icon(
                            Icons.image_outlined,
                            size: 32,
                            color: context.nagrikTheme.textTertiary,
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Subtle bottom vignette scrim
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.10),
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.70),
                          ],
                          stops: const [0.0, 0.4, 1.0],
                        ),
                      ),
                    ),
                  ),
                  // Floating Category Pill in the corner
                  Positioned(
                    bottom: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3.5,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.78),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.25),
                          width: 0.8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: context.colorScheme.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 5),
                          Text(
                            post.category.label.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.8,
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

          // 3. Main Headline in Bold Editorial Scale
          Text(
            post.title,
            style: context.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              height: 1.30,
              letterSpacing: -0.25,
              color: Theme.of(context).colorScheme.onSurface,
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          if (post.body.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              post.body,
              style: context.textTheme.bodyMedium?.copyWith(
                color: context.nagrikTheme.textSecondary,
                height: 1.42,
                fontSize: 13.5,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
          const SizedBox(height: NagrikSpacing.space3),

          // 4. Engagement Bar
          EngagementActionBar(post: post),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final hasThumbnail = post.mediaUrls.isNotEmpty;

    if (isFeatured && hasThumbnail) {
      return _buildFeaturedCard(context, isDark);
    }

    return GlassCard(
      margin: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      padding: const EdgeInsets.all(NagrikSpacing.space3),
      onTap: onTap ?? () => context.push('/content/${post.id}', extra: post),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Source, Locality & Timestamp Meta Row
          PostAuthorHeader.fromPost(
            post,
            showCategory: !hasThumbnail,
            onMorePressed: () {
              showReportContentSheet(
                context,
                contentId: post.id,
                contentTitle: post.title,
              );
            },
          ),
          const SizedBox(height: NagrikSpacing.space3),

          // 2. Content Row: Headline + Body on left, Thumbnail on right
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Text content (headline + body excerpt)
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      post.title,
                      style: context.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 16.5,
                        height: 1.32,
                        letterSpacing: -0.2,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                      maxLines: hasThumbnail ? 3 : 4,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      post.body,
                      style: context.textTheme.bodyMedium?.copyWith(
                        color: context.nagrikTheme.textSecondary,
                        height: 1.42,
                        fontSize: 13.5,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),

              // Thumbnail with frosted category badge overlay and Hero support
              if (hasThumbnail) ...[
                const SizedBox(width: NagrikSpacing.space3),
                SizedBox(
                  width: 104,
                  height: 104,
                  child: Stack(
                    children: [
                      // Hero Cached Thumbnail
                      Hero(
                        tag: 'post-media-${post.id}',
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SizedBox.expand(
                            child: CachedNetworkImage(
                              imageUrl: post.mediaUrls.first,
                              memCacheWidth: 320,
                              memCacheHeight: 320,
                              fit: BoxFit.cover,
                              fadeInDuration: const Duration(milliseconds: 150),
                              placeholder: (context, url) => Container(
                                color: isDark
                                    ? context.nagrikTheme.level4Muted
                                    : context.nagrikTheme.surfaceMuted,
                              ),
                              errorWidget: (context, url, error) => Container(
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? context.nagrikTheme.level4Muted
                                      : context.nagrikTheme.surfaceMuted,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: Icon(
                                    Icons.image_outlined,
                                    size: 28,
                                    color: context.nagrikTheme.textTertiary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),

                      // Category badge overlay
                      Positioned(
                        bottom: 6,
                        left: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6.5,
                            vertical: 2.5,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.76),
                            borderRadius: BorderRadius.circular(5),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.22),
                              width: 0.6,
                            ),
                          ),
                          child: Text(
                            post.category.label.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9.0,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: NagrikSpacing.space3),

          // 3. Compact Numeric Engagement Bar: ❤ 142  💬 29  ↗ 88  🔖
          EngagementActionBar(post: post),
        ],
      ),
    );
  }
}
