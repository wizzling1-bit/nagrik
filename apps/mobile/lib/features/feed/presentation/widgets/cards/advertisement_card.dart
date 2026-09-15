import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';

/// Editorial Sponsored / Advertisement Card with clear visual distinction.
/// Does NOT mimic organic news headlines or use deceptive styling.
class AdvertisementCard extends StatelessWidget {
  const AdvertisementCard({
    super.key,
    required this.ad,
    this.onTap,
  });

  final AdvertisementFeedItem ad;
  final VoidCallback? onTap;

  void _showSponsorInfo(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.isDarkMode
          ? context.nagrikTheme.level2Elevated
          : context.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(NagrikSpacing.space4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: context.colorScheme.primary.withValues(alpha: 0.12),
                      borderRadius: NagrikRadii.borderRadiusXs,
                    ),
                    child: Text(
                      'SPONSORED PARTNER',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: context.colorScheme.primary,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                ad.sponsorName,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              Text(
                ad.title,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
              if (ad.description != null && ad.description!.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  ad.description!,
                  style: TextStyle(
                    fontSize: 13.5,
                    color: ctx.nagrikTheme.textSecondary,
                  ),
                ),
              ],
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Opening partner: ${ad.sponsorName}'),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.open_in_new_rounded, size: 18),
                  label: Text(ad.ctaText),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Nagrik partners are verified to adhere to hyperlocal civic safety guidelines.',
                style: TextStyle(
                  fontSize: 11.5,
                  color: ctx.nagrikTheme.textTertiary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = context.nagrikTheme.textSecondary;
    final brandColor = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;

    return NagrikSpringPressable(
      onTap: onTap ?? () => _showSponsorInfo(context),
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
            // Sponsored Header Tag with Frosted Glass Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 2.5,
                      ),
                      decoration: BoxDecoration(
                        color: isDark
                            ? Colors.white.withValues(alpha: 0.08)
                            : const Color(0xFFF1F5F9),
                        borderRadius: NagrikRadii.borderRadiusXs,
                        border: Border.all(
                          color: isDark
                              ? context.colorScheme.primary.withValues(alpha: 0.30)
                              : context.nagrikTheme.border.withValues(alpha: 0.60),
                          width: 0.8,
                        ),
                      ),
                      child: Text(
                        'SPONSORED',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: isDark
                              ? context.colorScheme.primary
                              : context.nagrikTheme.textTertiary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      ad.sponsorName,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: subtextColor,
                      ),
                    ),
                  ],
                ),
                Icon(
                  Icons.info_outline_rounded,
                  size: 15,
                  color: context.nagrikTheme.textTertiary,
                ),
              ],
            ),

            const SizedBox(height: NagrikSpacing.space2),

            // Optional Media
            if (ad.mediaUrl != null && ad.mediaUrl!.isNotEmpty) ...[
              ClipRRect(
                borderRadius: NagrikRadii.borderRadiusSm,
                child: CachedNetworkImage(
                  imageUrl: ad.mediaUrl!,
                  memCacheWidth: 600,
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  placeholder: (_, _) => Container(
                    height: 140,
                    color: isDark
                        ? context.nagrikTheme.level4Muted
                        : context.nagrikTheme.surfaceMuted,
                  ),
                  errorWidget: (context, url, error) => const SizedBox.shrink(),
                ),
              ),
              const SizedBox(height: NagrikSpacing.space2),
            ],

            // Title
            Text(
              ad.title,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: textColor,
                height: 1.3,
              ),
            ),

            // Description
            if (ad.description != null && ad.description!.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                ad.description!,
                style: TextStyle(
                  fontSize: 13,
                  color: subtextColor,
                  height: 1.4,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],

            const SizedBox(height: NagrikSpacing.space2),

            // CTA Button with Animated Arrow
            Align(
              alignment: Alignment.centerRight,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    ad.ctaText,
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: brandColor,
                    ),
                  ),
                  const SizedBox(width: 3),
                  Icon(
                    Icons.arrow_outward_rounded,
                    size: 14,
                    color: brandColor,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
