import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/typography.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  group('NagrikTypography', () {
    testWidgets('textTheme returns a complete TextTheme with all styles non-null', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.displayLarge, isNotNull);
      expect(theme.displayMedium, isNotNull);
      expect(theme.headlineLarge, isNotNull);
      expect(theme.headlineMedium, isNotNull);
      expect(theme.headlineSmall, isNotNull);
      expect(theme.titleLarge, isNotNull);
      expect(theme.titleMedium, isNotNull);
      expect(theme.titleSmall, isNotNull);
      expect(theme.bodyLarge, isNotNull);
      expect(theme.bodyMedium, isNotNull);
      expect(theme.bodySmall, isNotNull);
      expect(theme.labelLarge, isNotNull);
      expect(theme.labelMedium, isNotNull);
      expect(theme.labelSmall, isNotNull);
    });

    testWidgets('displayLarge uses correct size, weight, and line height', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.displayLarge!.fontSize, 40.0);
      expect(theme.displayLarge!.fontWeight, FontWeight.w800);
      expect(theme.displayLarge!.height, 1.20);
      expect(theme.displayLarge!.letterSpacing, -0.5);
    });

    testWidgets('bodyMedium uses correct size, weight, and line height', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      expect(theme.bodyMedium!.fontSize, 15.0);
      expect(theme.bodyMedium!.fontWeight, FontWeight.w400);
      expect(theme.bodyMedium!.height, 1.45);
    });

    testWidgets('text color is applied to all styles', (tester) async {
      const testColor = Color(0xFF0F172A);
      final customTheme = NagrikTypography.textTheme(testColor);
      expect(customTheme.displayLarge!.color, testColor);
      expect(customTheme.headlineLarge!.color, testColor);
      expect(customTheme.titleMedium!.color, testColor);
      expect(customTheme.bodyMedium!.color, testColor);
      expect(customTheme.labelMedium!.color, testColor);
      expect(customTheme.labelSmall!.color, testColor);
    });

    testWidgets('editorial headlines and titles use Newsreader font family', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      final headlineStyles = [
        theme.displayLarge,
        theme.displayMedium,
        theme.headlineLarge,
        theme.headlineMedium,
        theme.headlineSmall,
        theme.titleLarge,
      ];

      for (final style in headlineStyles) {
        expect(style, isNotNull);
        expect(
          style!.fontFamily,
          contains('Newsreader'),
          reason: 'Headline style should use Newsreader serif font family',
        );
      }
    });

    testWidgets('body text and UI styles use Plus Jakarta Sans font family', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      final bodyStyles = [
        theme.titleMedium,
        theme.titleSmall,
        theme.bodyLarge,
        theme.bodyMedium,
        theme.bodySmall,
        theme.labelLarge,
      ];

      for (final style in bodyStyles) {
        expect(style, isNotNull);
        expect(
          style!.fontFamily,
          contains('PlusJakartaSans'),
          reason: 'Body/UI style should use Plus Jakarta Sans font family',
        );
      }
    });

    testWidgets('badges and metadata styles use JetBrains Mono font family', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      final monoStyles = [
        theme.labelMedium,
        theme.labelSmall,
      ];

      for (final style in monoStyles) {
        expect(style, isNotNull);
        expect(
          style!.fontFamily,
          contains('JetBrainsMono'),
          reason: 'Badge/metadata style should use JetBrains Mono font family',
        );
      }
    });

    testWidgets('preserves all 11 Indian script font fallbacks on all styles', (tester) async {
      final theme = NagrikTypography.textTheme(Colors.black);
      const expectedFallbacks = [
        'Noto Sans',
        'Noto Sans Devanagari',
        'Noto Sans Bengali',
        'Noto Sans Tamil',
        'Noto Sans Telugu',
        'Noto Sans Kannada',
        'Noto Sans Malayalam',
        'Noto Sans Gujarati',
        'Noto Sans Gurmukhi',
        'Noto Sans Assamese',
        'Noto Sans Oriya',
      ];

      expect(NagrikTypography.fontFallbacks, expectedFallbacks);
      expect(NagrikTypography.fontFallbacks.length, 11);

      // Verify across headline, body, and mono styles
      expect(theme.displayLarge!.fontFamilyFallback, expectedFallbacks);
      expect(theme.headlineLarge!.fontFamilyFallback, expectedFallbacks);
      expect(theme.bodyMedium!.fontFamilyFallback, expectedFallbacks);
      expect(theme.labelSmall!.fontFamilyFallback, expectedFallbacks);
    });

    testWidgets('typography static constants and helpers are correctly configured', (tester) async {
      expect(NagrikTypography.headlineFontFamily, 'Newsreader');
      expect(NagrikTypography.bodyFontFamily, 'Plus Jakarta Sans');
      expect(NagrikTypography.monoFontFamily, 'JetBrains Mono');
      expect(NagrikTypography.fontFamily, 'Plus Jakarta Sans');

      final headlineHelper = NagrikTypography.headline(fontSize: 24);
      expect(headlineHelper.fontFamily, contains('Newsreader'));
      expect(headlineHelper.fontFamilyFallback, NagrikTypography.fontFallbacks);

      final bodyHelper = NagrikTypography.body(fontSize: 16);
      expect(bodyHelper.fontFamily, contains('PlusJakartaSans'));
      expect(bodyHelper.fontFamilyFallback, NagrikTypography.fontFallbacks);

      final monoHelper = NagrikTypography.mono(fontSize: 12);
      expect(monoHelper.fontFamily, contains('JetBrainsMono'));
      expect(monoHelper.fontFamilyFallback, NagrikTypography.fontFallbacks);
    });
  });
}
