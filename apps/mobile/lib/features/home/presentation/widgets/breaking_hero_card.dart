import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

/// Breaking-news alert card. Flat error-tinted surface with a text label
/// (never color-alone); the pulse badge is reserved for this urgent slot.
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

    final error = context.colorScheme.error;

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
                  error.withValues(
                    alpha: context.isDarkMode ? 0.16 : 0.08,
                  ),
                  error.withValues(
                    alpha: context.isDarkMode ? 0.08 : 0.03,
                  ),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: error.withValues(
                  alpha: context.isDarkMode ? 0.45 : 0.30,
                ),
                width: 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: error.withValues(
                    alpha: context.isDarkMode ? 0.20 : 0.06,
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
                  pulseColor: error,
                  maxRadius: 8,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: error,
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

                // 2. Breaking label + Headline + Subtitle
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 2.5,
                        ),
                        decoration: BoxDecoration(
                          color: error,
                          borderRadius: NagrikRadii.borderRadiusXs,
                        ),
                        child: Text(
                          strings.breakingTag,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      const SizedBox(height: 5),

                      Text(
                        urgentPost.title,
                        style: context.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          height: 1.25,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),

                      Text(
                        urgentPost.body,
                        style: context.textTheme.bodySmall?.copyWith(
                          color: context.nagrikTheme.textSecondary,
                          height: 1.25,
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
                    color: error.withValues(
                      alpha: context.isDarkMode ? 0.18 : 0.10,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: error,
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
