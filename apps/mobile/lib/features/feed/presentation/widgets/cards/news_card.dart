import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/core/widgets/nagrik_avatar.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';

/// Streamlined Luxury Editorial News Post Card.
///
/// Features:
/// - 16:9 media ratio with 14dp rounded corners (`NagrikRadii.borderRadiusCard`).
/// - Dark glassmorphic geofence pill at top-left: MapPin in `#DE5227` + `5KM RADIUS` in `JetBrains Mono` bold.
/// - Metadata row: `CATEGORY · WARD · TIME` in letterspaced uppercase `JetBrains Mono`.
/// - Category tag in uppercase brand orange monospace.
/// - Dominant headline in `Newsreader` bold serif (`fontSize: 18-21`).
/// - Summary excerpt in `Plus Jakarta Sans` regular (`bodyMedium`).
/// - Author byline with avatar, verified badge (`#047857` light / `#34D399` dark), and publication time.
/// - Bottom action row: Bookmark button with active toggle, Share, and Flag/Report actions.
/// - Prominent layout and typography scale when [isFeatured] is true.
/// - Tactile spring press and semantic accessibility labels.
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

  void _handleCardTap(BuildContext context) {
    NagrikMotion.lightImpact();
    if (onTap != null) {
      onTap!();
    } else {
      context.push('/content/${post.id}', extra: post);
    }
  }

  void _handleReportTap(BuildContext context) {
    showReportContentSheet(
      context,
      contentId: post.id,
      contentTitle: post.title,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;

    return Semantics(
      button: true,
      label: 'News article: ${post.title}',
      child: NagrikSpringPressable(
        onTap: () => _handleCardTap(context),
        scaleFactor: 0.985,
        child: GlassCard(
          margin: const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space4,
            vertical: NagrikSpacing.space2,
          ),
          padding: const EdgeInsets.all(NagrikSpacing.space3),
          borderRadius: NagrikRadii.borderRadiusCard,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. 16:9 Cinematic Media with Geofence Badge & Scrim
              _buildMedia(context, isDark),
              const SizedBox(height: NagrikSpacing.space3),

              // 2. Metadata row: CATEGORY · WARD · TIME in JetBrains Mono
              _buildMetadataRow(context),
              const SizedBox(height: NagrikSpacing.space2),

              // 3. Headline rendered in Newsreader bold serif
              _buildHeadline(context),

              // 4. Summary excerpt in Plus Jakarta Sans
              if (post.body.isNotEmpty) ...[
                const SizedBox(height: 6),
                _buildExcerpt(context),
              ],
              const SizedBox(height: NagrikSpacing.space3),

              // 5. Author byline with avatar and verified badge (#047857 / #34D399)
              _buildAuthorByline(context, isDark),
              const SizedBox(height: NagrikSpacing.space2),

              // 6. Bottom action row: Bookmark, Share, Flag/Report, and Engagement counts
              EngagementActionBar(
                post: post,
                onReportPressed: () => _handleReportTap(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMedia(BuildContext context, bool isDark) {
    final hasImage = post.mediaUrls.isNotEmpty;

    return ClipRRect(
      borderRadius: NagrikRadii.borderRadiusCard,
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Hero Media or Warm Placeholder
            if (hasImage)
              Hero(
                tag: 'post-media-${post.id}',
                child: CachedNetworkImage(
                  imageUrl: post.mediaUrls.first,
                  memCacheWidth: 800,
                  memCacheHeight: 450,
                  fit: BoxFit.cover,
                  fadeInDuration: const Duration(milliseconds: 150),
                  placeholder: (context, url) => _imagePlaceholder(context, isDark),
                  errorWidget: (context, url, error) => _imageErrorFallback(context, isDark),
                ),
              )
            else
              _imagePlaceholder(context, isDark),

            // Cinematic vignette gradient scrim
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
                    stops: const [0.0, 0.45, 1.0],
                  ),
                ),
              ),
            ),

            // Floating dark glassmorphic 5KM RADIUS Geofence Badge at top-left
            Positioned(
              top: 10,
              left: 10,
              child: _buildGeofenceBadge(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGeofenceBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.72),
        borderRadius: NagrikRadii.borderRadiusPill,
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.20),
          width: 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.location_on_rounded,
            color: NagrikBrandColors.orangePrimary, // #DE5227
            size: 13,
          ),
          const SizedBox(width: 4),
          Text(
            '5KM RADIUS',
            style: GoogleFonts.jetBrainsMono(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
            ).copyWith(
              fontFamilyFallback: NagrikTypography.fontFallbacks,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetadataRow(BuildContext context) {
    final categoryText = post.category.label.toUpperCase();
    final wardText = (post.locality.isNotEmpty ? post.locality : post.city).toUpperCase();
    final timeText = post.timeAgo.toUpperCase();

    return Row(
      children: [
        // Category tag in uppercase brand orange monospace
        Text(
          categoryText,
          style: GoogleFonts.jetBrainsMono(
            color: NagrikBrandColors.orangePrimary, // #DE5227
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
          ).copyWith(
            fontFamilyFallback: NagrikTypography.fontFallbacks,
          ),
        ),
        if (wardText.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Text(
              '·',
              style: GoogleFonts.jetBrainsMono(
                color: context.nagrikTheme.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Flexible(
            child: Text(
              wardText,
              style: GoogleFonts.jetBrainsMono(
                color: context.nagrikTheme.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.6,
              ).copyWith(
                fontFamilyFallback: NagrikTypography.fontFallbacks,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
        if (timeText.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Text(
              '·',
              style: GoogleFonts.jetBrainsMono(
                color: context.nagrikTheme.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Text(
            timeText,
            style: GoogleFonts.jetBrainsMono(
              color: context.nagrikTheme.textTertiary,
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.6,
            ).copyWith(
              fontFamilyFallback: NagrikTypography.fontFallbacks,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildHeadline(BuildContext context) {
    return Text(
      post.title,
      style: GoogleFonts.newsreader(
        fontSize: isFeatured ? 20.0 : 17.5,
        fontWeight: isFeatured ? FontWeight.w800 : FontWeight.w700,
        height: 1.28,
        letterSpacing: -0.15,
        color: Theme.of(context).colorScheme.onSurface,
      ).copyWith(
        fontFamilyFallback: NagrikTypography.fontFallbacks,
      ),
      maxLines: isFeatured ? 3 : 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildExcerpt(BuildContext context) {
    return Text(
      post.body,
      style: GoogleFonts.plusJakartaSans(
        fontSize: isFeatured ? 14.0 : 13.5,
        fontWeight: FontWeight.w400,
        height: 1.45,
        color: context.nagrikTheme.textSecondary,
      ).copyWith(
        fontFamilyFallback: NagrikTypography.fontFallbacks,
      ),
      maxLines: isFeatured ? 3 : 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildAuthorByline(BuildContext context, bool isDark) {
    final hasDistance = post.author.formattedDistance != null;
    final secondaryText = post.author.badgeTitle != null && post.author.badgeTitle!.isNotEmpty
        ? post.author.badgeTitle!
        : (hasDistance ? post.author.formattedDistance! : post.timeAgo);

    return Row(
      children: [
        NagrikAvatar(
          name: post.author.name,
          imageUrl: post.author.avatarUrl,
          size: NagrikAvatarSize.xs,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Flexible(
                    child: Text(
                      post.author.name,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Theme.of(context).colorScheme.onSurface,
                        letterSpacing: -0.1,
                      ).copyWith(
                        fontFamilyFallback: NagrikTypography.fontFallbacks,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (post.author.isVerified) ...[
                    const SizedBox(width: 4),
                    const VerificationBadge(size: 13),
                  ],
                ],
              ),
              const SizedBox(height: 1),
              Text(
                secondaryText,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.w400,
                  color: context.nagrikTheme.textSecondary,
                ).copyWith(
                  fontFamilyFallback: NagrikTypography.fontFallbacks,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _imagePlaceholder(BuildContext context, bool isDark) {
    return Container(
      color: isDark
          ? context.nagrikTheme.level4Muted
          : context.nagrikTheme.surfaceMuted,
      child: Center(
        child: Icon(
          Icons.newspaper_outlined,
          size: 32,
          color: context.nagrikTheme.textTertiary.withValues(alpha: 0.5),
        ),
      ),
    );
  }

  Widget _imageErrorFallback(BuildContext context, bool isDark) {
    return Container(
      color: isDark
          ? context.nagrikTheme.level4Muted
          : context.nagrikTheme.surfaceMuted,
      child: Center(
        child: Icon(
          Icons.image_not_supported_outlined,
          size: 32,
          color: context.nagrikTheme.textTertiary.withValues(alpha: 0.5),
        ),
      ),
    );
  }
}
