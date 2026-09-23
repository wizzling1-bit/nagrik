import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('NagrikThemeExtension', () {
    test('light constructor maps to light colors', () {
      final ext = NagrikThemeExtension.light();
      expect(ext.level0Background, NagrikLightColors.background);
      expect(ext.level1Surface, NagrikLightColors.surface);
      expect(ext.level2Elevated, NagrikLightColors.surfaceElevated);
      expect(ext.level3Interactive, NagrikLightColors.surfaceInteractive);
      expect(ext.level4Muted, NagrikLightColors.surfaceMuted);
      expect(ext.surfaceMuted, NagrikLightColors.surfaceMuted);
      expect(ext.surfaceInteractive, NagrikLightColors.surfaceInteractive);
      expect(ext.textSecondary, NagrikLightColors.textSecondary);
      expect(ext.textTertiary, NagrikLightColors.textTertiary);
      expect(ext.brandPrimary, NagrikLightColors.brandPrimary);
      expect(ext.brandSecondary, NagrikLightColors.brandSecondary);
      expect(ext.brandBright, NagrikLightColors.brandBright);
      expect(ext.border, NagrikLightColors.border);
      expect(ext.borderStrong, NagrikLightColors.borderStrong);
      expect(ext.divider, NagrikLightColors.divider);
      expect(ext.success, NagrikLightColors.success);
      expect(ext.warning, NagrikLightColors.warning);
      expect(ext.info, NagrikLightColors.info);
    });

    test('dark constructor maps to dark colors', () {
      final ext = NagrikThemeExtension.dark();
      expect(ext.level0Background, NagrikDarkColors.level0Background);
      expect(ext.level1Surface, NagrikDarkColors.level1Surface);
      expect(ext.level2Elevated, NagrikDarkColors.level2Elevated);
      expect(ext.level3Interactive, NagrikDarkColors.level3Interactive);
      expect(ext.level4Muted, NagrikDarkColors.level4Muted);
      expect(ext.surfaceMuted, NagrikDarkColors.surfaceMuted);
      expect(ext.surfaceInteractive, NagrikDarkColors.level3Interactive);
      expect(ext.textSecondary, NagrikDarkColors.textSecondary);
      expect(ext.textTertiary, NagrikDarkColors.textTertiary);
      expect(ext.brandPrimary, NagrikDarkColors.brandPrimary);
      expect(ext.brandSecondary, NagrikDarkColors.brandSecondary);
      expect(ext.brandBright, NagrikDarkColors.brandBright);
      expect(ext.border, NagrikDarkColors.border);
      expect(ext.borderStrong, NagrikDarkColors.borderStrong);
      expect(ext.divider, NagrikDarkColors.divider);
      expect(ext.success, NagrikDarkColors.success);
      expect(ext.warning, NagrikDarkColors.warning);
      expect(ext.info, NagrikDarkColors.info);
    });

    test('copyWith creates a new instance with overrides', () {
      final ext = NagrikThemeExtension.light();
      final overridden = ext.copyWith(
        success: Colors.green,
        brandPrimary: const Color(0xFFDE5227),
      );
      expect(overridden.success, Colors.green);
      expect(overridden.brandPrimary, const Color(0xFFDE5227));
      expect(overridden.border, NagrikLightColors.border);
      expect(overridden.borderStrong, NagrikLightColors.borderStrong);
    });

    test('lerp interpolates between light and dark', () {
      final light = NagrikThemeExtension.light();
      final dark = NagrikThemeExtension.dark();
      final mid = light.lerp(dark, 0.5);
      expect(mid.surfaceMuted, isNotNull);
      // Lerped color should differ from both endpoints
      expect(mid.surfaceMuted, isNot(equals(light.surfaceMuted)));
      expect(mid.surfaceMuted, isNot(equals(dark.surfaceMuted)));
      expect(mid.borderStrong, isNotNull);
      expect(mid.borderStrong, isNot(equals(light.borderStrong)));
      expect(mid.borderStrong, isNot(equals(dark.borderStrong)));
    });
  });
}
