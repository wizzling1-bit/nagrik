import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';

enum NagrikButtonVariant { primary, secondary, tertiary, destructive }

enum NagrikButtonSize { small, medium, large }

/// Design-system button component.
///
/// Features:
/// - Four variants: `primary`, `secondary`, `tertiary`, `destructive`
/// - Three sizes: `small` (44dp), `medium` (48dp), `large` (56dp)
/// - Spring tap recoil physics with tactile haptic feedback
/// - Full accessibility semantics and WCAG AAA/AA contrast compliance
class NagrikButton extends StatefulWidget {
  const NagrikButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = NagrikButtonVariant.primary,
    this.size = NagrikButtonSize.medium,
    this.isLoading = false,
    this.icon,
    this.fullWidth = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final NagrikButtonVariant variant;
  final NagrikButtonSize size;
  final bool isLoading;
  final IconData? icon;
  final bool fullWidth;

  @override
  State<NagrikButton> createState() => _NagrikButtonState();
}

class _NagrikButtonState extends State<NagrikButton> {
  bool _isPressed = false;

  bool get _isDisabled => widget.onPressed == null || widget.isLoading;

  double get _height => switch (widget.size) {
        NagrikButtonSize.small => 44.0,
        NagrikButtonSize.medium => 48.0,
        NagrikButtonSize.large => 56.0,
      };

  EdgeInsets get _padding => switch (widget.size) {
        NagrikButtonSize.small => const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space4,
          ),
        NagrikButtonSize.medium => const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space5,
          ),
        NagrikButtonSize.large => const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space6,
          ),
      };

  void _handleTapDown(TapDownDetails _) {
    if (_isDisabled) return;
    setState(() => _isPressed = true);
  }

  void _handleTapUp(TapUpDetails _) {
    if (_isDisabled) return;
    setState(() => _isPressed = false);
  }

  void _handleTapCancel() {
    if (_isDisabled) return;
    setState(() => _isPressed = false);
  }

  void _handleTap() {
    if (_isDisabled) return;
    NagrikMotion.lightImpact();
    widget.onPressed?.call();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colorScheme;
    final textStyle = context.textTheme.labelLarge;
    final isDark = context.isDarkMode;

    final (bgColor, fgColor, borderSide) = switch (widget.variant) {
      NagrikButtonVariant.primary => (
          _isDisabled
              ? colors.primary.withValues(alpha: 0.38)
              : colors.primary,
          colors.onPrimary,
          BorderSide.none,
        ),
      NagrikButtonVariant.secondary => (
          isDark
              ? context.nagrikTheme.level2Elevated
              : context.nagrikTheme.surfaceMuted,
          _isDisabled
              ? context.nagrikTheme.textTertiary
              : colors.onSurface,
          BorderSide(
            color: _isDisabled
                ? context.nagrikTheme.border.withValues(alpha: 0.38)
                : context.nagrikTheme.border,
            width: 1.0,
          ),
        ),
      NagrikButtonVariant.tertiary => (
          Colors.transparent,
          _isDisabled
              ? context.nagrikTheme.textTertiary
              : (isDark
                  ? context.nagrikTheme.brandBright
                  : colors.primary),
          BorderSide.none,
        ),
      NagrikButtonVariant.destructive => (
          _isDisabled
              ? colors.error.withValues(alpha: 0.38)
              : colors.error,
          colors.onError,
          BorderSide.none,
        ),
    };

    final content = AnimatedSwitcher(
      duration: const Duration(milliseconds: 180),
      child: widget.isLoading
          ? SizedBox(
              key: const ValueKey('loading'),
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2.2,
                valueColor: AlwaysStoppedAnimation(fgColor),
              ),
            )
          : Row(
              key: const ValueKey('content'),
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.icon != null) ...[
                  Icon(widget.icon, size: 18, color: fgColor),
                  const SizedBox(width: NagrikSpacing.space2),
                ],
                Text(
                  widget.label,
                  style: textStyle?.copyWith(
                    color: fgColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
    );

    return Semantics(
      button: true,
      enabled: !_isDisabled,
      label: widget.label,
      child: AnimatedScale(
        scale: _isPressed ? 0.95 : 1.0,
        duration: const Duration(milliseconds: 110),
        curve: _isPressed ? Curves.easeInOutCubic : Curves.easeOutBack,
        child: Container(
          width: widget.fullWidth ? double.infinity : null,
          height: _height,
          decoration: const BoxDecoration(),
          child: Material(
            color: bgColor,
            borderRadius: NagrikRadii.borderRadiusSm,
            child: InkWell(
              onTap: _isDisabled ? null : _handleTap,
              onTapDown: _handleTapDown,
              onTapUp: _handleTapUp,
              onTapCancel: _handleTapCancel,
              borderRadius: NagrikRadii.borderRadiusSm,
              child: Ink(
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: NagrikRadii.borderRadiusSm,
                  border: borderSide != BorderSide.none
                      ? Border.fromBorderSide(borderSide)
                      : null,
                ),
                padding: _padding,
                child: Center(
                  child: content,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
