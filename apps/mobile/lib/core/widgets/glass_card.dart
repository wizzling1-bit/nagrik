import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';

/// Flat tonal surface card.
///
/// One elevation treatment only: a 1dp border on a tonal surface. No
/// gradients, no specular rims, no glow shadows — depth comes from the
/// surface hierarchy, not decoration.
class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
    this.borderOpacity = 0.6,
    this.backgroundColor,
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final double borderOpacity;
  final Color? backgroundColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final radius = borderRadius ?? BorderRadius.circular(16);
    final cardColor = backgroundColor ?? context.nagrikTheme.level1Surface;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: radius,
        border: Border.all(
          color: context.nagrikTheme.border.withValues(
            alpha: isDark ? (borderOpacity * 0.75).clamp(0.2, 1.0) : borderOpacity,
          ),
          width: 0.85,
        ),
        boxShadow: [
          BoxShadow(
            color: isDark
                ? Colors.black.withValues(alpha: 0.28)
                : const Color(0xFF0A2647).withValues(alpha: 0.035),
            blurRadius: isDark ? 10 : 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        type: MaterialType.transparency,
        borderRadius: radius,
        child: InkWell(
          borderRadius: radius,
          splashColor: context.colorScheme.primary.withValues(alpha: 0.08),
          highlightColor: context.colorScheme.primary.withValues(alpha: 0.04),
          onTap: onTap,
          child: Padding(
            padding: padding ?? EdgeInsets.zero,
            child: child,
          ),
        ),
      ),
    );
  }
}
