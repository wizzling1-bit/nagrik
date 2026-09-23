import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/spacing.dart';

/// Verification badge with consistent verified blue coloring across light and dark modes.
class VerificationBadge extends StatelessWidget {
  const VerificationBadge({
    super.key,
    this.label,
    this.size = 15,
    this.color,
  });

  final String? label;
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    // Verified badge token: #047857 in light mode / #34D399 in dark mode
    final badgeColor = color ?? context.nagrikTheme.success;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.verified,
          size: size,
          color: badgeColor,
          semanticLabel: label ?? 'Verified',
        ),
        if (label != null) ...[
          const SizedBox(width: NagrikSpacing.space1),
          Text(
            label!,
            style: context.textTheme.labelSmall?.copyWith(
              color: badgeColor,
            ),
          ),
        ],
      ],
    );
  }
}
