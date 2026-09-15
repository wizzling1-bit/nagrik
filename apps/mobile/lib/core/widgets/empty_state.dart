import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';

/// Reusable illustrated empty state component.
/// Enhanced with scale bounce icon entrance, ambient glow backdrop, and staggered text fade.
class NagrikEmptyState extends StatelessWidget {
  const NagrikEmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    this.actionLabel,
    this.onAction,
  });

  final IconData icon;
  final String title;
  final String description;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final brandColor = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(NagrikSpacing.space7),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Illustrated Floating Icon with Ambient Glow Aura
            NagrikFadeIn(
              duration: const Duration(milliseconds: 300),
              offset: const Offset(0, -8),
              child: Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  color: brandColor.withValues(alpha: isDark ? 0.12 : 0.08),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: brandColor.withValues(alpha: isDark ? 0.25 : 0.15),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: brandColor.withValues(alpha: isDark ? 0.2 : 0.1),
                      blurRadius: 24,
                      spreadRadius: 4,
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    icon,
                    size: 48,
                    color: brandColor,
                  ),
                ),
              ),
            ),
            const SizedBox(height: NagrikSpacing.space5),

            // Staggered Title
            NagrikFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Text(
                title,
                style: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                  letterSpacing: -0.2,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: NagrikSpacing.space2),

            // Staggered Description
            NagrikFadeIn(
              delay: const Duration(milliseconds: 180),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 320),
                child: Text(
                  description,
                  style: context.textTheme.bodyMedium?.copyWith(
                    color: context.nagrikTheme.textSecondary,
                    height: 1.45,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),

            // Action Button
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: NagrikSpacing.space6),
              NagrikFadeIn(
                delay: const Duration(milliseconds: 260),
                child: NagrikButton(
                  label: actionLabel!,
                  onPressed: onAction,
                  variant: NagrikButtonVariant.secondary,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
