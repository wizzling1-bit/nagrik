import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';

/// Reusable error state component with red glow aura and retry action.
class NagrikErrorState extends StatelessWidget {
  const NagrikErrorState({
    super.key,
    required this.message,
    required this.onRetry,
    this.description,
  });

  final String message;
  final VoidCallback onRetry;
  final String? description;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final errorColor = context.colorScheme.error;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(NagrikSpacing.space7),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Error Icon Badge with Ambient Red Glow
            NagrikFadeIn(
              duration: const Duration(milliseconds: 300),
              offset: const Offset(0, -6),
              child: Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  color: errorColor.withValues(alpha: isDark ? 0.16 : 0.08),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: errorColor.withValues(alpha: isDark ? 0.35 : 0.2),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: errorColor.withValues(alpha: isDark ? 0.25 : 0.12),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    Icons.error_outline_rounded,
                    size: 44,
                    color: errorColor,
                  ),
                ),
              ),
            ),
            const SizedBox(height: NagrikSpacing.space4),

            // Error Message (Title)
            NagrikFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Text(
                message,
                style: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                  fontSize: 17,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            if (description != null) ...[
              const SizedBox(height: NagrikSpacing.space2),
              NagrikFadeIn(
                delay: const Duration(milliseconds: 180),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 300),
                  child: Text(
                    description!,
                    style: context.textTheme.bodyMedium?.copyWith(
                      color: context.nagrikTheme.textSecondary,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],

            const SizedBox(height: NagrikSpacing.space6),

            // Retry Button
            NagrikFadeIn(
              delay: const Duration(milliseconds: 240),
              child: NagrikButton(
                label: 'Try again',
                onPressed: onRetry,
                variant: NagrikButtonVariant.secondary,
                icon: Icons.refresh_rounded,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
