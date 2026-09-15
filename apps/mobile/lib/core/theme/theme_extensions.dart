import 'package:flutter/material.dart';
import 'package:nagrik/core/theme/color_tokens.dart';

/// Nagrik-specific semantic tokens extending Flutter's `ThemeData`.
///
/// Access via:
/// `context.nagrikTheme` or `Theme.of(context).extension<NagrikThemeExtension>()!`
class NagrikThemeExtension extends ThemeExtension<NagrikThemeExtension> {
  const NagrikThemeExtension({
    required this.level0Background,
    required this.level1Surface,
    required this.level2Elevated,
    required this.level3Interactive,
    required this.level4Muted,
    required this.surfaceMuted,
    required this.surfaceInteractive,
    required this.textSecondary,
    required this.textTertiary,
    required this.brandSecondary,
    required this.brandBright,
    required this.border,
    required this.divider,
    required this.success,
    required this.successContainer,
    required this.warning,
    required this.warningContainer,
    required this.error,
    required this.errorContainer,
    required this.info,
    required this.infoContainer,
    required this.overlay,
    required this.scrim,
  });

  /// Light theme semantic tokens.
  factory NagrikThemeExtension.light() => const NagrikThemeExtension(
        level0Background: NagrikLightColors.background,
        level1Surface: NagrikLightColors.surface,
        level2Elevated: NagrikLightColors.surfaceElevated,
        level3Interactive: NagrikLightColors.surfaceInteractive,
        level4Muted: NagrikLightColors.surfaceMuted,
        surfaceMuted: NagrikLightColors.surfaceMuted,
        surfaceInteractive: NagrikLightColors.surfaceInteractive,
        textSecondary: NagrikLightColors.textSecondary,
        textTertiary: NagrikLightColors.textTertiary,
        brandSecondary: NagrikLightColors.brandSecondary,
        brandBright: NagrikLightColors.brandBright,
        border: NagrikLightColors.border,
        divider: NagrikLightColors.divider,
        success: NagrikLightColors.success,
        successContainer: NagrikLightColors.successContainer,
        warning: NagrikLightColors.warning,
        warningContainer: NagrikLightColors.warningContainer,
        error: NagrikLightColors.error,
        errorContainer: NagrikLightColors.errorContainer,
        info: NagrikLightColors.info,
        infoContainer: NagrikLightColors.infoContainer,
        overlay: NagrikLightColors.overlay,
        scrim: NagrikLightColors.scrim,
      );

  /// Dark theme semantic tokens (5-Level Tonal Hierarchy).
  factory NagrikThemeExtension.dark() => const NagrikThemeExtension(
        level0Background: NagrikDarkColors.level0Background,
        level1Surface: NagrikDarkColors.level1Surface,
        level2Elevated: NagrikDarkColors.level2Elevated,
        level3Interactive: NagrikDarkColors.level3Interactive,
        level4Muted: NagrikDarkColors.level4Muted,
        surfaceMuted: NagrikDarkColors.level4Muted,
        surfaceInteractive: NagrikDarkColors.level3Interactive,
        textSecondary: NagrikDarkColors.textSecondary,
        textTertiary: NagrikDarkColors.textTertiary,
        brandSecondary: NagrikDarkColors.brandSecondary,
        brandBright: NagrikDarkColors.brandBright,
        border: NagrikDarkColors.border,
        divider: NagrikDarkColors.divider,
        success: NagrikDarkColors.success,
        successContainer: NagrikDarkColors.successContainer,
        warning: NagrikDarkColors.warning,
        warningContainer: NagrikDarkColors.warningContainer,
        error: NagrikDarkColors.error,
        errorContainer: NagrikDarkColors.errorContainer,
        info: NagrikDarkColors.info,
        infoContainer: NagrikDarkColors.infoContainer,
        overlay: NagrikDarkColors.overlay,
        scrim: NagrikDarkColors.scrim,
      );

  final Color level0Background;
  final Color level1Surface;
  final Color level2Elevated;
  final Color level3Interactive;
  final Color level4Muted;

  final Color surfaceMuted;
  final Color surfaceInteractive;
  final Color textSecondary;
  final Color textTertiary;
  final Color brandSecondary;
  final Color brandBright;
  final Color border;
  final Color divider;
  final Color success;
  final Color successContainer;
  final Color warning;
  final Color warningContainer;
  final Color error;
  final Color errorContainer;
  final Color info;
  final Color infoContainer;
  final Color overlay;
  final Color scrim;

  @override
  NagrikThemeExtension copyWith({
    Color? level0Background,
    Color? level1Surface,
    Color? level2Elevated,
    Color? level3Interactive,
    Color? level4Muted,
    Color? surfaceMuted,
    Color? surfaceInteractive,
    Color? textSecondary,
    Color? textTertiary,
    Color? brandSecondary,
    Color? brandBright,
    Color? border,
    Color? divider,
    Color? success,
    Color? successContainer,
    Color? warning,
    Color? warningContainer,
    Color? error,
    Color? errorContainer,
    Color? info,
    Color? infoContainer,
    Color? overlay,
    Color? scrim,
  }) {
    return NagrikThemeExtension(
      level0Background: level0Background ?? this.level0Background,
      level1Surface: level1Surface ?? this.level1Surface,
      level2Elevated: level2Elevated ?? this.level2Elevated,
      level3Interactive: level3Interactive ?? this.level3Interactive,
      level4Muted: level4Muted ?? this.level4Muted,
      surfaceMuted: surfaceMuted ?? this.surfaceMuted,
      surfaceInteractive: surfaceInteractive ?? this.surfaceInteractive,
      textSecondary: textSecondary ?? this.textSecondary,
      textTertiary: textTertiary ?? this.textTertiary,
      brandSecondary: brandSecondary ?? this.brandSecondary,
      brandBright: brandBright ?? this.brandBright,
      border: border ?? this.border,
      divider: divider ?? this.divider,
      success: success ?? this.success,
      successContainer: successContainer ?? this.successContainer,
      warning: warning ?? this.warning,
      warningContainer: warningContainer ?? this.warningContainer,
      error: error ?? this.error,
      errorContainer: errorContainer ?? this.errorContainer,
      info: info ?? this.info,
      infoContainer: infoContainer ?? this.infoContainer,
      overlay: overlay ?? this.overlay,
      scrim: scrim ?? this.scrim,
    );
  }

  @override
  NagrikThemeExtension lerp(
    covariant NagrikThemeExtension? other,
    double t,
  ) {
    if (other is! NagrikThemeExtension) return this;
    return NagrikThemeExtension(
      level0Background:
          Color.lerp(level0Background, other.level0Background, t)!,
      level1Surface: Color.lerp(level1Surface, other.level1Surface, t)!,
      level2Elevated: Color.lerp(level2Elevated, other.level2Elevated, t)!,
      level3Interactive:
          Color.lerp(level3Interactive, other.level3Interactive, t)!,
      level4Muted: Color.lerp(level4Muted, other.level4Muted, t)!,
      surfaceMuted: Color.lerp(surfaceMuted, other.surfaceMuted, t)!,
      surfaceInteractive:
          Color.lerp(surfaceInteractive, other.surfaceInteractive, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textTertiary: Color.lerp(textTertiary, other.textTertiary, t)!,
      brandSecondary: Color.lerp(brandSecondary, other.brandSecondary, t)!,
      brandBright: Color.lerp(brandBright, other.brandBright, t)!,
      border: Color.lerp(border, other.border, t)!,
      divider: Color.lerp(divider, other.divider, t)!,
      success: Color.lerp(success, other.success, t)!,
      successContainer:
          Color.lerp(successContainer, other.successContainer, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      warningContainer:
          Color.lerp(warningContainer, other.warningContainer, t)!,
      error: Color.lerp(error, other.error, t)!,
      errorContainer: Color.lerp(errorContainer, other.errorContainer, t)!,
      info: Color.lerp(info, other.info, t)!,
      infoContainer: Color.lerp(infoContainer, other.infoContainer, t)!,
      overlay: Color.lerp(overlay, other.overlay, t)!,
      scrim: Color.lerp(scrim, other.scrim, t)!,
    );
  }
}
