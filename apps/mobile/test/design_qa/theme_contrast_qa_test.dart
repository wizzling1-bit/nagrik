import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('Design QA: Light & Dark Theme Tokens & Contrast', () {
    test('Light theme provides valid non-null semantic colors and extension', () {
      final lightTheme = NagrikTheme.light();

      expect(lightTheme.brightness, Brightness.light);
      expect(lightTheme.colorScheme.primary, NagrikLightColors.brandPrimary);
      expect(lightTheme.colorScheme.surface, isNotNull);
      expect(lightTheme.colorScheme.error, isNotNull);

      final extension = lightTheme.extension<NagrikThemeExtension>();
      expect(extension, isNotNull);
      expect(extension!.surfaceMuted, isNotNull);
      expect(extension.border, isNotNull);
      expect(extension.divider, isNotNull);
      expect(extension.textSecondary, isNotNull);
      expect(extension.textTertiary, isNotNull);
      expect(extension.success, isNotNull);
      expect(extension.warning, isNotNull);
    });

    test('Dark theme provides valid non-null semantic colors and extension', () {
      final darkTheme = NagrikTheme.dark();

      expect(darkTheme.brightness, Brightness.dark);
      expect(darkTheme.colorScheme.primary, NagrikDarkColors.brandPrimary);
      expect(darkTheme.colorScheme.surface, isNotNull);
      expect(darkTheme.colorScheme.error, isNotNull);

      final extension = darkTheme.extension<NagrikThemeExtension>();
      expect(extension, isNotNull);
      expect(extension!.surfaceMuted, isNotNull);
      expect(extension.border, isNotNull);
      expect(extension.divider, isNotNull);
      expect(extension.textSecondary, isNotNull);
      expect(extension.textTertiary, isNotNull);
      expect(extension.success, isNotNull);
      expect(extension.warning, isNotNull);
    });

    test('ThemeExtension supports lerp for smooth animated theme transitions', () {
      final lightExt = NagrikTheme.light().extension<NagrikThemeExtension>()!;
      final darkExt = NagrikTheme.dark().extension<NagrikThemeExtension>()!;

      final lerped = lightExt.lerp(darkExt, 0.5);
      expect(lerped, isNotNull);
      expect(lerped.surfaceMuted, isNotNull);
      expect(lerped.border, isNotNull);
    });
  });
}
