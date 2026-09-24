import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

/// Streamlined Luxury Editorial Video Report Card.
///
/// Features:
/// - 16:9 aspect ratio video thumbnail with dark vignette gradient scrim.
/// - Floating circular brand orange Play button (`#DE5227`) with white play icon.
/// - Dark glassmorphic 5KM RADIUS geofence pill at top-left.
/// - "SHORT VIDEO" tag and duration pill in `JetBrains Mono`.
/// - Monospace metadata row (Category · Ward · Time · Views).
/// - Headline in `Newsreader` bold serif (`fontSize: 17.5`).
/// - Summary excerpt in `Plus Jakarta Sans` regular (`bodyMedium`).
/// - Author byline with avatar and verified badge (`#047857` light / `#34D399` dark).
/// - Numeric engagement action bar with bookmark, share, and report actions.
/// - Tactile spring press feedback with haptics.
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
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = context.isDarkMode;

    return Semantics(
      button: true,
      label: 'Watch video report: ${post.title}',
      child: NagrikSpringPressable(
        onTap: () => _handleVideoPress(context),
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
              // 1. Cinematic 16:9 Video Thumbnail Showcase
              _buildThumbnail(context, isDark),
              const SizedBox(height: NagrikSpacing.space3),

              // 2. Monospace Metadata row (Category · Ward · Time · Views)
              _buildMetadataRow(context),
              const SizedBox(height: NagrikSpacing.space2),

              // 3. Headline rendered in Newsreader bold serif
              _buildHeadline(context),

              // 4. Summary excerpt if present
              if (post.body.isNotEmpty) ...[
                const SizedBox(height: 6),
                _buildExcerpt(context),
              ],
              const SizedBox(height: NagrikSpacing.space3),

              // 5. Author byline with avatar and verified badge (#047857 / #34D399)
              _buildAuthorByline(context, isDark),
              const SizedBox(height: NagrikSpacing.space2),

              // 6. Numeric Engagement Action Bar with bookmark, share, and report
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

  Widget _buildThumbnail(BuildContext context, bool isDark) {
    final hasImage = post.mediaUrls.isNotEmpty;

    return ClipRRect(
      borderRadius: NagrikRadii.borderRadiusCard,
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Backdrop Hero Cached Image or Placeholder
            if (hasImage)
              Hero(
                tag: 'post-media-${post.id}',
                child: CachedNetworkImage(
                  imageUrl: post.mediaUrls.first,
                  memCacheWidth: 800,
                  memCacheHeight: 450,
                  fit: BoxFit.cover,
                  fadeInDuration: const Duration(milliseconds: 150),
                  placeholder: (context, url) => _thumbnailFallback(context, isDark),
                  errorWidget: (context, url, error) => _thumbnailFallback(context, isDark),
                ),
              )
            else
              _thumbnailFallback(context, isDark),

            // Cinematic subtle gradient vignette scrim
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.20),
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.70),
                    ],
                    stops: const [0.0, 0.45, 1.0],
                  ),
                ),
              ),
            ),

            // Top-Left 5KM RADIUS Geofence Badge
            Positioned(
              top: 10,
              left: 10,
              child: _buildGeofenceBadge(),
            ),

            // Top-Right "SHORT VIDEO" Badge
            Positioned(
              top: 10,
              right: 10,
              child: _buildVideoBadge(),
            ),

            // Center Glowing Brand Orange Play Button (#DE5227)
            Center(
              child: _buildPlayButton(),
            ),

            // Bottom-Right Duration Badge
            if (post.videoDuration != null && post.videoDuration!.trim().isNotEmpty)
              Positioned(
                bottom: 10,
                right: 10,
                child: _buildDurationBadge(post.videoDuration!),
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

  Widget _buildVideoBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 7,
        vertical: 3.5,
      ),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.72),
        borderRadius: NagrikRadii.borderRadiusPill,
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.20),
          width: 0.8,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.videocam_rounded,
            color: Colors.white,
            size: 12,
          ),
          const SizedBox(width: 4),
          Text(
            'SHORT VIDEO',
            style: GoogleFonts.jetBrainsMono(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 9.5,
              letterSpacing: 0.7,
            ).copyWith(
              fontFamilyFallback: NagrikTypography.fontFallbacks,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayButton() {
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        color: NagrikBrandColors.orangePrimary, // #DE5227
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.90),
          width: 2.0,
        ),
        boxShadow: [
          BoxShadow(
            color: NagrikBrandColors.orangePrimary.withValues(alpha: 0.45),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.40),
            blurRadius: 10,
            offset: const Offset(0, 2),
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
    );
  }

  Widget _buildDurationBadge(String duration) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 7,
        vertical: 3.5,
      ),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.80),
        borderRadius: NagrikRadii.borderRadiusPill,
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
            size: 11,
          ),
          const SizedBox(width: 4),
          Text(
            duration,
            style: GoogleFonts.jetBrainsMono(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 10.5,
              letterSpacing: 0.4,
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
    final viewCountText = (post.viewCount != null && post.viewCount! > 0)
        ? '${_formatViews(post.viewCount!)} VIEWS'
        : null;

    return Row(
      children: [
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
        if (viewCountText != null) ...[
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
            viewCountText,
            style: GoogleFonts.jetBrainsMono(
              color: NagrikBrandColors.orangePrimary,
              fontSize: 11,
              fontWeight: FontWeight.w700,
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
        fontSize: 17.5,
        fontWeight: FontWeight.w700,
        height: 1.28,
        letterSpacing: -0.15,
        color: Theme.of(context).colorScheme.onSurface,
      ).copyWith(
        fontFamilyFallback: NagrikTypography.fontFallbacks,
      ),
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildExcerpt(BuildContext context) {
    return Text(
      post.body,
      style: GoogleFonts.plusJakartaSans(
        fontSize: 13.5,
        fontWeight: FontWeight.w400,
        height: 1.42,
        color: context.nagrikTheme.textSecondary,
      ).copyWith(
        fontFamilyFallback: NagrikTypography.fontFallbacks,
      ),
      maxLines: 2,
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

  Widget _thumbnailFallback(BuildContext context, bool isDark) {
    return Container(
      color: isDark
          ? context.nagrikTheme.level4Muted
          : context.nagrikTheme.surfaceMuted,
      child: Center(
        child: Icon(
          Icons.videocam_outlined,
          size: 32,
          color: context.nagrikTheme.textTertiary.withValues(alpha: 0.5),
        ),
      ),
    );
  }
}
