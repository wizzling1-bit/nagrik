import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

/// Urgent breaking-news alert card.
/// Features:
/// - Amber-crimson subtle gradient backdrop (#DE5227 / #C53030)
/// - 16dp rounded corners and delicate border
/// - Lightning bolt badge with breathing pulse aura (`NagrikPulseBadge`)
/// - "BREAKING ALERT" label in uppercase monospace (`JetBrains Mono`)
/// - Dominant headline rendered in `Newsreader` serif typography
/// - Tactile spring press feedback with `NagrikMotion.lightImpact()`
class BreakingHeroCard extends ConsumerWidget {
  const BreakingHeroCard({super.key, this.onTap});

  final void Function(Post post)? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final urgentPost = ref.watch(urgentAlertsProvider);
    final strings = ref.watch(appStringsProvider);

    if (urgentPost == null) {
      return const SizedBox.shrink();
    }

    final isDark = context.isDarkMode;
    const amberOrange = NagrikBrandColors.orangePrimary; // #DE5227
    const crimsonRed = NagrikBrandColors.crimson; // #C53030

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      child: Semantics(
        button: true,
        label: 'Breaking news: ${urgentPost.title}',
        child: NagrikSpringPressable(
          onTap: () {
            NagrikMotion.lightImpact();
            if (onTap != null) {
              onTap!(urgentPost);
            } else {
              context.push('/content/${urgentPost.id}', extra: urgentPost);
            }
          },
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  amberOrange.withValues(
                    alpha: isDark ? 0.20 : 0.09,
                  ),
                  crimsonRed.withValues(
                    alpha: isDark ? 0.12 : 0.04,
                  ),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: (isDark ? crimsonRed : amberOrange).withValues(
                  alpha: isDark ? 0.40 : 0.25,
                ),
                width: 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: crimsonRed.withValues(
                    alpha: isDark ? 0.20 : 0.06,
                  ),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // 1. Bolt badge with pulse aura (urgent-only motion)
                NagrikPulseBadge(
                  pulseColor: amberOrange,
                  maxRadius: 8,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [amberOrange, crimsonRed],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.bolt_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
                const SizedBox(width: 14),

                // 2. Breaking label + Headline in Newsreader serif + Subtitle
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3.5,
                        ),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [amberOrange, crimsonRed],
                          ),
                          borderRadius: NagrikRadii.borderRadiusXs,
                        ),
                        child: Text(
                          strings.breakingTag == 'BREAKING'
                              ? 'BREAKING ALERT'
                              : '${strings.breakingTag} ALERT',
                          style: GoogleFonts.jetBrainsMono(
                            color: Colors.white,
                            fontSize: 11.0,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ).copyWith(
                            fontFamilyFallback: NagrikTypography.fontFallbacks,
                          ),
                        ),
                      ),
                      const SizedBox(height: 5),

                      Text(
                        urgentPost.title,
                        style: GoogleFonts.newsreader(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w700,
                          height: 1.25,
                          letterSpacing: -0.1,
                          color: context.colorScheme.onSurface,
                        ).copyWith(
                          fontFamilyFallback: NagrikTypography.fontFallbacks,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),

                      Text(
                        urgentPost.body,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13.0,
                          fontWeight: FontWeight.w400,
                          color: context.nagrikTheme.textSecondary,
                          height: 1.25,
                        ).copyWith(
                          fontFamilyFallback: NagrikTypography.fontFallbacks,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // 3. Right chevron in subtle action pill
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    color: amberOrange.withValues(
                      alpha: isDark ? 0.18 : 0.10,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: amberOrange,
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
