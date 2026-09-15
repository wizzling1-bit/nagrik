import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';

void main() {
  group('NagrikBrandColors brand palette', () {
    test('navy900 is correct hex', () {
      expect(NagrikBrandColors.navy900, const Color(0xFF0F1E36));
    });

    test('navy700 is correct hex', () {
      expect(NagrikBrandColors.navy700, const Color(0xFF1B3A63));
    });

    test('blue600 is correct hex', () {
      expect(NagrikBrandColors.blue600, const Color(0xFF1E4CA1));
    });

    test('blue500 is correct hex', () {
      expect(NagrikBrandColors.blue500, const Color(0xFF2C64B5));
    });

    test('blueBright is correct hex', () {
      expect(NagrikBrandColors.blueBright, const Color(0xFF3F7ED0));
    });
  });

  group('NagrikLightColors semantic mapping', () {
    test('background is warm neutral canvas', () {
      expect(NagrikLightColors.background, const Color(0xFFF6F7F9));
    });

    test('surface is white', () {
      expect(NagrikLightColors.surface, const Color(0xFFFFFFFF));
    });

    test('subtle surface is EDF1F5', () {
      expect(NagrikLightColors.surfaceMuted, const Color(0xFFEDF1F5));
    });

    test('textPrimary is velvety obsidian 192333', () {
      expect(NagrikLightColors.textPrimary, const Color(0xFF192333));
    });

    test('textSecondary is 536378', () {
      expect(NagrikLightColors.textSecondary, const Color(0xFF536378));
    });

    test('textTertiary is 8697A8', () {
      expect(NagrikLightColors.textTertiary, const Color(0xFF8697A8));
    });

    test('brandPrimary is sapphire 1E4CA1', () {
      expect(NagrikLightColors.brandPrimary, const Color(0xFF1E4CA1));
    });

    test('brandSecondary is 2C64B5', () {
      expect(NagrikLightColors.brandSecondary, const Color(0xFF2C64B5));
    });

    test('bright interaction is 3F7ED0', () {
      expect(NagrikLightColors.brandBright, const Color(0xFF3F7ED0));
    });

    test('border is E2E7ED and divider is EBEFF4', () {
      expect(NagrikLightColors.border, const Color(0xFFE2E7ED));
      expect(NagrikLightColors.divider, const Color(0xFFEBEFF4));
    });

    test('semantics: success 15803D, warning B45309, error C53030, info 1E4CA1', () {
      expect(NagrikLightColors.success, const Color(0xFF15803D));
      expect(NagrikLightColors.warning, const Color(0xFFB45309));
      expect(NagrikLightColors.error, const Color(0xFFC53030));
      expect(NagrikLightColors.info, const Color(0xFF1E4CA1));
    });
  });

  group('NagrikDarkColors semantic mapping', () {
    test('Level 0 background is deep midnight obsidian', () {
      expect(NagrikDarkColors.level0Background, const Color(0xFF0B1017));
    });

    test('Level 1 surface is 131A26', () {
      expect(NagrikDarkColors.level1Surface, const Color(0xFF131A26));
    });

    test('Level 2 elevated is 1A2333', () {
      expect(NagrikDarkColors.level2Elevated, const Color(0xFF1A2333));
    });

    test('Level 3 interactive is 222E42', () {
      expect(NagrikDarkColors.level3Interactive, const Color(0xFF222E42));
    });

    test('Level 4 muted is 0E1520', () {
      expect(NagrikDarkColors.level4Muted, const Color(0xFF0E1520));
    });

    test('textPrimary is E2E8F0, textSecondary is 94A3B8, textTertiary is 64748B', () {
      expect(NagrikDarkColors.textPrimary, const Color(0xFFE2E8F0));
      expect(NagrikDarkColors.textSecondary, const Color(0xFF94A3B8));
      expect(NagrikDarkColors.textTertiary, const Color(0xFF64748B));
    });

    test('brandPrimary is 5A8EE8 and brandBright is 7CA6F2', () {
      expect(NagrikDarkColors.brandPrimary, const Color(0xFF5A8EE8));
      expect(NagrikDarkColors.brandBright, const Color(0xFF7CA6F2));
    });

    test('border is 1E2736 and divider is 18202D', () {
      expect(NagrikDarkColors.border, const Color(0xFF1E2736));
      expect(NagrikDarkColors.divider, const Color(0xFF18202D));
    });

    test('dark semantics: success 2EBD85, warning E5A138, error E05656, info 5A8EE8', () {
      expect(NagrikDarkColors.success, const Color(0xFF2EBD85));
      expect(NagrikDarkColors.warning, const Color(0xFFE5A138));
      expect(NagrikDarkColors.error, const Color(0xFFE05656));
      expect(NagrikDarkColors.info, const Color(0xFF5A8EE8));
    });
  });
}
