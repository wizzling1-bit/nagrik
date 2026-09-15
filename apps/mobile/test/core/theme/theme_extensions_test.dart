import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('NagrikThemeExtension', () {
    test('light constructor maps to light colors', () {
      final ext = NagrikThemeExtension.light();
      expect(ext.surfaceMuted, NagrikLightColors.surfaceMuted);
      expect(ext.textSecondary, NagrikLightColors.textSecondary);
      expect(ext.border, NagrikLightColors.border);
      expect(ext.divider, NagrikLightColors.divider);
      expect(ext.success, NagrikLightColors.success);
      expect(ext.warning, NagrikLightColors.warning);
      expect(ext.info, NagrikLightColors.info);
    });

    test('dark constructor maps to dark colors', () {
      final ext = NagrikThemeExtension.dark();
      expect(ext.surfaceMuted, NagrikDarkColors.surfaceMuted);
      expect(ext.textSecondary, NagrikDarkColors.textSecondary);
      expect(ext.border, NagrikDarkColors.border);
      expect(ext.divider, NagrikDarkColors.divider);
      expect(ext.success, NagrikDarkColors.success);
      expect(ext.warning, NagrikDarkColors.warning);
      expect(ext.info, NagrikDarkColors.info);
    });

    test('copyWith creates a new instance with overrides', () {
      final ext = NagrikThemeExtension.light();
      final overridden = ext.copyWith(success: Colors.green);
      expect(overridden.success, Colors.green);
      expect(overridden.border, NagrikLightColors.border);
    });

    test('lerp interpolates between light and dark', () {
      final light = NagrikThemeExtension.light();
      final dark = NagrikThemeExtension.dark();
      final mid = light.lerp(dark, 0.5);
      expect(mid.surfaceMuted, isNotNull);
      // Lerped color should differ from both endpoints
      expect(mid.surfaceMuted, isNot(equals(light.surfaceMuted)));
      expect(mid.surfaceMuted, isNot(equals(dark.surfaceMuted)));
    });
  });
}
