import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('NagrikTheme.light()', () {
    late ThemeData theme;

    setUp(() {
      theme = NagrikTheme.light();
    });

    test('uses Material 3 and light brightness', () {
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
    });

    test('colorScheme uses brandPrimary orange and editorial surface', () {
      expect(theme.colorScheme.primary, NagrikLightColors.brandPrimary);
      expect(theme.colorScheme.surface, NagrikLightColors.surface);
      expect(theme.colorScheme.error, NagrikLightColors.error);
    });

    test('scaffold background is warm linen background (#F5F0E8)', () {
      expect(theme.scaffoldBackgroundColor, NagrikLightColors.background);
      expect(theme.scaffoldBackgroundColor, const Color(0xFFF5F0E8));
    });

    test('cardTheme uses editorial surface and warm border', () {
      expect(theme.cardTheme.color, NagrikLightColors.surface);
      final shape = theme.cardTheme.shape as RoundedRectangleBorder?;
      expect(shape, isNotNull);
      expect(shape!.side.color, NagrikLightColors.border);
    });

    test('appBarTheme uses surface background and textPrimary foreground', () {
      expect(theme.appBarTheme.backgroundColor, NagrikLightColors.surface);
      expect(theme.appBarTheme.foregroundColor, NagrikLightColors.textPrimary);
      expect(theme.appBarTheme.elevation, 0);
    });

    test('navigationBarTheme uses primary alpha 0.12 indicator and brandPrimary selected', () {
      expect(
        theme.navigationBarTheme.indicatorColor,
        NagrikLightColors.brandPrimary.withValues(alpha: 0.12),
      );

      final iconTheme = theme.navigationBarTheme.iconTheme?.resolve({WidgetState.selected});
      expect(iconTheme?.color, NagrikLightColors.brandPrimary);

      final unselectedIconTheme = theme.navigationBarTheme.iconTheme?.resolve({});
      expect(unselectedIconTheme?.color, NagrikLightColors.textTertiary);
    });

    test('bottomNavigationBarTheme uses brandPrimary for selected item', () {
      expect(theme.bottomNavigationBarTheme.selectedItemColor, NagrikLightColors.brandPrimary);
      expect(theme.bottomNavigationBarTheme.unselectedItemColor, NagrikLightColors.textTertiary);
    });

    test('inputDecorationTheme uses surfaceMuted fill and brandPrimary focus border', () {
      expect(theme.inputDecorationTheme.filled, isTrue);
      expect(theme.inputDecorationTheme.fillColor, NagrikLightColors.surfaceMuted);
      final focusedBorder = theme.inputDecorationTheme.focusedBorder as OutlineInputBorder?;
      expect(focusedBorder, isNotNull);
      expect(focusedBorder!.borderSide.color, NagrikLightColors.brandPrimary);

      final enabledBorder = theme.inputDecorationTheme.enabledBorder as OutlineInputBorder?;
      expect(enabledBorder, isNotNull);
      expect(enabledBorder!.borderSide.color, NagrikLightColors.border);
    });

    test('dialog and bottomSheet use surfaceElevated (#FFFFFF)', () {
      expect(theme.dialogTheme.backgroundColor, NagrikLightColors.surfaceElevated);
      expect(theme.bottomSheetTheme.backgroundColor, NagrikLightColors.surfaceElevated);
    });

    test('includes NagrikThemeExtension with light tokens', () {
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.level0Background, NagrikLightColors.background);
      expect(ext.level1Surface, NagrikLightColors.surface);
      expect(ext.success, NagrikLightColors.success);
    });

    test('textTheme wires Newsreader, Plus Jakarta Sans, and JetBrains Mono', () {
      expect(theme.textTheme.displayLarge!.fontFamily, contains('Newsreader'));
      expect(theme.textTheme.headlineLarge!.fontFamily, contains('Newsreader'));
      expect(theme.textTheme.bodyMedium!.fontFamily, contains('PlusJakartaSans'));
      expect(theme.textTheme.labelSmall!.fontFamily, contains('JetBrainsMono'));
    });
  });

  group('NagrikTheme.dark()', () {
    late ThemeData theme;

    setUp(() {
      theme = NagrikTheme.dark();
    });

    test('uses Material 3 and dark brightness', () {
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.dark);
    });

    test('colorScheme uses brandPrimary orange and level1Surface', () {
      expect(theme.colorScheme.primary, NagrikDarkColors.brandPrimary);
      expect(theme.colorScheme.surface, NagrikDarkColors.level1Surface);
      expect(theme.colorScheme.error, NagrikDarkColors.error);
    });

    test('scaffold background is midnight obsidian Level 0 (#0C1018)', () {
      expect(theme.scaffoldBackgroundColor, NagrikDarkColors.level0Background);
      expect(theme.scaffoldBackgroundColor, const Color(0xFF0C1018));
    });

    test('cardTheme uses Level 1 surface and dark border', () {
      expect(theme.cardTheme.color, NagrikDarkColors.level1Surface);
      final shape = theme.cardTheme.shape as RoundedRectangleBorder?;
      expect(shape, isNotNull);
      expect(shape!.side.color, NagrikDarkColors.border);
    });

    test('navigationBarTheme uses primary alpha 0.22 indicator and brandPrimary selected', () {
      expect(
        theme.navigationBarTheme.indicatorColor,
        NagrikDarkColors.brandPrimary.withValues(alpha: 0.22),
      );

      final iconTheme = theme.navigationBarTheme.iconTheme?.resolve({WidgetState.selected});
      expect(iconTheme?.color, NagrikDarkColors.brandPrimary);
    });

    test('bottomNavigationBarTheme uses brandPrimary for selected item', () {
      expect(theme.bottomNavigationBarTheme.selectedItemColor, NagrikDarkColors.brandPrimary);
      expect(theme.bottomNavigationBarTheme.unselectedItemColor, NagrikDarkColors.textTertiary);
    });

    test('inputDecorationTheme uses level4Muted fill and brandPrimary focus border', () {
      expect(theme.inputDecorationTheme.filled, isTrue);
      expect(theme.inputDecorationTheme.fillColor, NagrikDarkColors.level4Muted);
      final focusedBorder = theme.inputDecorationTheme.focusedBorder as OutlineInputBorder?;
      expect(focusedBorder, isNotNull);
      expect(focusedBorder!.borderSide.color, NagrikDarkColors.brandPrimary);

      final enabledBorder = theme.inputDecorationTheme.enabledBorder as OutlineInputBorder?;
      expect(enabledBorder, isNotNull);
      expect(enabledBorder!.borderSide.color, NagrikDarkColors.border);
    });

    test('dialog and bottomSheet use level2Elevated (#1A2236)', () {
      expect(theme.dialogTheme.backgroundColor, NagrikDarkColors.level2Elevated);
      expect(theme.bottomSheetTheme.backgroundColor, NagrikDarkColors.level2Elevated);
    });

    test('includes NagrikThemeExtension with dark tokens', () {
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.level0Background, NagrikDarkColors.level0Background);
      expect(ext.level1Surface, NagrikDarkColors.level1Surface);
      expect(ext.success, NagrikDarkColors.success);
    });

    test('textTheme wires Newsreader, Plus Jakarta Sans, and JetBrains Mono', () {
      expect(theme.textTheme.displayLarge!.fontFamily, contains('Newsreader'));
      expect(theme.textTheme.headlineLarge!.fontFamily, contains('Newsreader'));
      expect(theme.textTheme.bodyMedium!.fontFamily, contains('PlusJakartaSans'));
      expect(theme.textTheme.labelSmall!.fontFamily, contains('JetBrainsMono'));
    });
  });
}
