import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/typography.dart';

void main() {
  group('NagrikTypography', () {
    test('textTheme returns a complete TextTheme', () {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.displayLarge, isNotNull);
      expect(theme.headlineLarge, isNotNull);
      expect(theme.headlineMedium, isNotNull);
      expect(theme.titleLarge, isNotNull);
      expect(theme.titleMedium, isNotNull);
      expect(theme.bodyLarge, isNotNull);
      expect(theme.bodyMedium, isNotNull);
      expect(theme.bodySmall, isNotNull);
      expect(theme.labelLarge, isNotNull);
      expect(theme.labelMedium, isNotNull);
      expect(theme.labelSmall, isNotNull);
    });

    test('displayLarge uses correct size and weight', () {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.displayLarge!.fontSize, 40.0);
      expect(theme.displayLarge!.fontWeight, FontWeight.w800);
    });

    test('bodyMedium uses correct size and weight', () {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.bodyMedium!.fontSize, 15.0);
      expect(theme.bodyMedium!.fontWeight, FontWeight.w400);
    });

    test('text color is applied to all styles', () {
      const testColor = Color(0xFF0A2647);
      final theme = NagrikTypography.textTheme(testColor);
      expect(theme.displayLarge!.color, testColor);
      expect(theme.bodyMedium!.color, testColor);
      expect(theme.labelSmall!.color, testColor);
    });

    test('font family is Inter with Noto Sans fallbacks', () {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.bodyMedium!.fontFamily, 'Inter');
      expect(theme.bodyMedium!.fontFamilyFallback, contains('Noto Sans'));
      expect(
        theme.bodyMedium!.fontFamilyFallback,
        contains('Noto Sans Devanagari'),
      );
      expect(
        theme.bodyMedium!.fontFamilyFallback,
        contains('Noto Sans Bengali'),
      );
    });
  });
}
