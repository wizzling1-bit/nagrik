import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/spacing.dart';

/// Verification badge with consistent verified blue coloring across light and dark modes.
class VerificationBadge extends StatelessWidget {
  const VerificationBadge({
    super.key,
    this.label,
    this.size = 15,
  });

  final String? label;
  final double size;

  @override
  Widget build(BuildContext context) {
    final badgeColor = context.colorScheme.primary;

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
