import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  group('NagrikTheme.light()', () {
    testWidgets('uses Material 3 and light brightness', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
    });

    testWidgets('colorScheme uses brandPrimary orange and editorial surface', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.colorScheme.primary, NagrikLightColors.brandPrimary);
      expect(theme.colorScheme.surface, NagrikLightColors.surface);
      expect(theme.colorScheme.error, NagrikLightColors.error);
    });

    testWidgets('scaffold background is warm linen background (#F5F0E8)', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.scaffoldBackgroundColor, NagrikLightColors.background);
      expect(theme.scaffoldBackgroundColor, const Color(0xFFF5F0E8));
    });

    testWidgets('cardTheme uses editorial surface and warm border', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.cardTheme.color, NagrikLightColors.surface);
      final shape = theme.cardTheme.shape as RoundedRectangleBorder?;
      expect(shape, isNotNull);
      expect(shape!.side.color, NagrikLightColors.border);
    });

    testWidgets('navigationBarTheme uses primary alpha 0.12 indicator and brandPrimary selected', (tester) async {
      final theme = NagrikTheme.light();
      expect(
        theme.navigationBarTheme.indicatorColor,
        NagrikLightColors.brandPrimary.withValues(alpha: 0.12),
      );

      final iconTheme = theme.navigationBarTheme.iconTheme?.resolve({WidgetState.selected});
      expect(iconTheme?.color, NagrikLightColors.brandPrimary);
    });

    testWidgets('bottomNavigationBarTheme uses brandPrimary for selected item', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.bottomNavigationBarTheme.selectedItemColor, NagrikLightColors.brandPrimary);
      expect(theme.bottomNavigationBarTheme.unselectedItemColor, NagrikLightColors.textTertiary);
    });

    testWidgets('inputDecorationTheme uses warm linen fill and brandPrimary focus border', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.inputDecorationTheme.filled, isTrue);
      expect(theme.inputDecorationTheme.fillColor, NagrikLightColors.surfaceMuted);
      final focusedBorder = theme.inputDecorationTheme.focusedBorder as OutlineInputBorder?;
      expect(focusedBorder, isNotNull);
      expect(focusedBorder!.borderSide.color, NagrikLightColors.brandPrimary);

      final enabledBorder = theme.inputDecorationTheme.enabledBorder as OutlineInputBorder?;
      expect(enabledBorder, isNotNull);
      expect(enabledBorder!.borderSide.color, NagrikLightColors.border);
    });

    testWidgets('dialog and bottomSheet use pure white surface', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.dialogTheme.backgroundColor, NagrikLightColors.surfaceElevated);
      expect(theme.bottomSheetTheme.backgroundColor, NagrikLightColors.surfaceElevated);
    });

    testWidgets('includes NagrikThemeExtension with light tokens', (tester) async {
      final theme = NagrikTheme.light();
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.level0Background, NagrikLightColors.background);
      expect(ext.level1Surface, NagrikLightColors.surface);
      expect(ext.success, NagrikLightColors.success);
    });

    testWidgets('textTheme is initialized with required headline, body and metadata styles', (tester) async {
      final theme = NagrikTheme.light();
      expect(theme.textTheme.displayLarge, isNotNull);
      expect(theme.textTheme.headlineLarge, isNotNull);
      expect(theme.textTheme.bodyMedium, isNotNull);
      expect(theme.textTheme.labelSmall, isNotNull);
    });
  });

  group('NagrikTheme.dark()', () {
    testWidgets('uses Material 3 and dark brightness', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.dark);
    });

    testWidgets('colorScheme uses brandPrimary orange and level1Surface', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.colorScheme.primary, NagrikDarkColors.brandPrimary);
      expect(theme.colorScheme.surface, NagrikDarkColors.level1Surface);
      expect(theme.colorScheme.error, NagrikDarkColors.error);
    });

    testWidgets('scaffold background is midnight obsidian Level 0 (#10141C)', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.scaffoldBackgroundColor, NagrikDarkColors.level0Background);
      expect(theme.scaffoldBackgroundColor, const Color(0xFF10141C));
    });

    testWidgets('cardTheme uses Level 1 surface and dark border', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.cardTheme.color, NagrikDarkColors.level1Surface);
      final shape = theme.cardTheme.shape as RoundedRectangleBorder?;
      expect(shape, isNotNull);
      expect(shape!.side.color, NagrikDarkColors.border);
    });

    testWidgets('navigationBarTheme uses primary alpha 0.22 indicator and brandPrimary selected', (tester) async {
      final theme = NagrikTheme.dark();
      expect(
        theme.navigationBarTheme.indicatorColor,
        NagrikDarkColors.brandPrimary.withValues(alpha: 0.22),
      );

      final iconTheme = theme.navigationBarTheme.iconTheme?.resolve({WidgetState.selected});
      expect(iconTheme?.color, NagrikDarkColors.brandPrimary);
    });

    testWidgets('bottomNavigationBarTheme uses brandPrimary for selected item', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.bottomNavigationBarTheme.selectedItemColor, NagrikDarkColors.brandPrimary);
      expect(theme.bottomNavigationBarTheme.unselectedItemColor, NagrikDarkColors.textTertiary);
    });

    testWidgets('inputDecorationTheme uses level4Muted fill and brandPrimary focus border', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.inputDecorationTheme.filled, isTrue);
      expect(theme.inputDecorationTheme.fillColor, NagrikDarkColors.level4Muted);
      final focusedBorder = theme.inputDecorationTheme.focusedBorder as OutlineInputBorder?;
      expect(focusedBorder, isNotNull);
      expect(focusedBorder!.borderSide.color, NagrikDarkColors.brandPrimary);

      final enabledBorder = theme.inputDecorationTheme.enabledBorder as OutlineInputBorder?;
      expect(enabledBorder, isNotNull);
      expect(enabledBorder!.borderSide.color, NagrikDarkColors.border);
    });

    testWidgets('dialog and bottomSheet use level2Elevated (#1A2236)', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.dialogTheme.backgroundColor, NagrikDarkColors.level2Elevated);
      expect(theme.bottomSheetTheme.backgroundColor, NagrikDarkColors.level2Elevated);
    });

    testWidgets('includes NagrikThemeExtension with dark tokens', (tester) async {
      final theme = NagrikTheme.dark();
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.level0Background, NagrikDarkColors.level0Background);
      expect(ext.level1Surface, NagrikDarkColors.level1Surface);
      expect(ext.success, NagrikDarkColors.success);
    });

    testWidgets('textTheme is initialized with required headline, body and metadata styles', (tester) async {
      final theme = NagrikTheme.dark();
      expect(theme.textTheme.displayLarge, isNotNull);
      expect(theme.textTheme.headlineLarge, isNotNull);
      expect(theme.textTheme.bodyMedium, isNotNull);
      expect(theme.textTheme.labelSmall, isNotNull);
    });
  });
}
