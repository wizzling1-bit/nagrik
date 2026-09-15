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

    test('uses Material 3', () {
      expect(theme.useMaterial3, isTrue);
    });

    test('brightness is light', () {
      expect(theme.brightness, Brightness.light);
    });

    test('primary color is blue600', () {
      expect(theme.colorScheme.primary, NagrikLightColors.brandPrimary);
    });

    test('scaffold background is light background', () {
      expect(
        theme.scaffoldBackgroundColor,
        NagrikLightColors.background,
      );
    });

    test('includes NagrikThemeExtension', () {
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.success, NagrikLightColors.success);
    });

    test('textTheme has correct display style', () {
      expect(theme.textTheme.displayLarge, isNotNull);
      expect(theme.textTheme.displayLarge!.fontSize, 40.0);
    });
  });

  group('NagrikTheme.dark()', () {
    late ThemeData theme;

    setUp(() {
      theme = NagrikTheme.dark();
    });

    test('uses Material 3', () {
      expect(theme.useMaterial3, isTrue);
    });

    test('brightness is dark', () {
      expect(theme.brightness, Brightness.dark);
    });

    test('primary color is blue500', () {
      expect(theme.colorScheme.primary, NagrikDarkColors.brandPrimary);
    });

    test('scaffold background is dark background', () {
      expect(
        theme.scaffoldBackgroundColor,
        NagrikDarkColors.background,
      );
    });

    test('includes NagrikThemeExtension', () {
      final ext = theme.extension<NagrikThemeExtension>();
      expect(ext, isNotNull);
      expect(ext!.success, NagrikDarkColors.success);
    });
  });
}
