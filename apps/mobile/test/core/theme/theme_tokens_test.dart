import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('Nagrik Semantic Theme Engine Tests', () {
    test('Light theme provides correct semantic tokens and background', () {
      final lightTheme = NagrikTheme.light();
      expect(lightTheme.brightness, Brightness.light);
      expect(lightTheme.scaffoldBackgroundColor, NagrikLightColors.background);

      final ext = lightTheme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.surfaceMuted, NagrikLightColors.surfaceMuted);
      expect(ext.border, NagrikLightColors.border);
      expect(ext.divider, NagrikLightColors.divider);
      expect(ext.textSecondary, NagrikLightColors.textSecondary);
      expect(ext.textTertiary, NagrikLightColors.textTertiary);
      expect(ext.success, NagrikLightColors.success);
      expect(ext.warning, NagrikLightColors.warning);
      expect(ext.error, NagrikLightColors.error);
      expect(ext.info, NagrikLightColors.info);
    });

    test('Dark theme provides strict 5-level tonal hierarchy', () {
      final darkTheme = NagrikTheme.dark();
      expect(darkTheme.brightness, Brightness.dark);
      expect(darkTheme.scaffoldBackgroundColor, NagrikDarkColors.level0Background);

      final ext = darkTheme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.level0Background, NagrikDarkColors.level0Background);
      expect(ext.level1Surface, NagrikDarkColors.level1Surface);
      expect(ext.level2Elevated, NagrikDarkColors.level2Elevated);
      expect(ext.level3Interactive, NagrikDarkColors.level3Interactive);
      expect(ext.level4Muted, NagrikDarkColors.level4Muted);
      expect(ext.border, NagrikDarkColors.border);
      expect(ext.divider, NagrikDarkColors.divider);
      expect(ext.textSecondary, NagrikDarkColors.textSecondary);
      expect(ext.textTertiary, NagrikDarkColors.textTertiary);
      expect(ext.brandBright, NagrikDarkColors.brandBright);
    });

    test('NagrikThemeExtension lerp blends properties smoothly', () {
      final lightExt = NagrikThemeExtension.light();
      final darkExt = NagrikThemeExtension.dark();

      final midExt = lightExt.lerp(darkExt, 0.5);
      expect(midExt, isNotNull);
      expect(midExt.border, Color.lerp(lightExt.border, darkExt.border, 0.5));
    });
  });
}
