import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';

void main() {
  group('NagrikBrandColors brand palette', () {
    test('orangePrimary is signature brand orange #DE5227', () {
      expect(NagrikBrandColors.orangePrimary, const Color(0xFFDE5227));
    });

    test('orangeAccessible is accessible button orange #C84318', () {
      expect(NagrikBrandColors.orangeAccessible, const Color(0xFFC84318));
    });

    test('orangeDark is hover/pressed tone #A83410', () {
      expect(NagrikBrandColors.orangeDark, const Color(0xFFA83410));
    });

    test('orangeLight is light tint #FEECE6', () {
      expect(NagrikBrandColors.orangeLight, const Color(0xFFFEECE6));
    });

    test('retains backwards compatible constants', () {
      expect(NagrikBrandColors.crimson, const Color(0xFFC53030));
      expect(NagrikBrandColors.midnight, const Color(0xFF0B1017));
      expect(NagrikBrandColors.royalNavy, const Color(0xFF0F1E36));
      expect(NagrikBrandColors.sapphireGlow, const Color(0xFF2A599B));
    });
  });

  group('NagrikLightColors semantic mapping (Warm Linen editorial)', () {
    test('background is warm linen #F5F0E8', () {
      expect(NagrikLightColors.background, const Color(0xFFF5F0E8));
    });

    test('surface is card #F9F6F1 and elevated is pure white #FFFFFF', () {
      expect(NagrikLightColors.surface, const Color(0xFFF9F6F1));
      expect(NagrikLightColors.surfaceElevated, const Color(0xFFFFFFFF));
    });

    test('surfaceMuted is #EDE7DB and surfaceInteractive is #E5DEC9', () {
      expect(NagrikLightColors.surfaceMuted, const Color(0xFFEDE7DB));
      expect(NagrikLightColors.surfaceInteractive, const Color(0xFFE5DEC9));
    });

    test('text hierarchy: primary #0F172A, secondary #5A6577, tertiary #8B8174', () {
      expect(NagrikLightColors.textPrimary, const Color(0xFF0F172A));
      expect(NagrikLightColors.textSecondary, const Color(0xFF5A6577));
      expect(NagrikLightColors.textTertiary, const Color(0xFF8B8174));
      expect(NagrikLightColors.textOnPrimary, const Color(0xFFFFFFFF));
    });

    test('brand accents: primary #DE5227, secondary #C84318, bright #F4835E', () {
      expect(NagrikLightColors.brandPrimary, const Color(0xFFDE5227));
      expect(NagrikLightColors.brandSecondary, const Color(0xFFC84318));
      expect(NagrikLightColors.brandBright, const Color(0xFFF4835E));
    });

    test('border is #DDD5C8, borderStrong is #C8BFAF, divider is #DDD5C8', () {
      expect(NagrikLightColors.border, const Color(0xFFDDD5C8));
      expect(NagrikLightColors.borderStrong, const Color(0xFFC8BFAF));
      expect(NagrikLightColors.divider, const Color(0xFFDDD5C8));
    });

    test('semantics: success #047857', () {
      expect(NagrikLightColors.success, const Color(0xFF047857));
    });
  });

  group('NagrikDarkColors semantic mapping (Soft Charcoal Non-Glare)', () {
    test('Level 0 background is soft charcoal #10141C', () {
      expect(NagrikDarkColors.level0Background, const Color(0xFF10141C));
      expect(NagrikDarkColors.background, const Color(0xFF10141C));
    });

    test('Level 1 surface is #161B26', () {
      expect(NagrikDarkColors.level1Surface, const Color(0xFF161B26));
      expect(NagrikDarkColors.surface, const Color(0xFF161B26));
    });

    test('Level 2 elevated is #1E2433', () {
      expect(NagrikDarkColors.level2Elevated, const Color(0xFF1E2433));
      expect(NagrikDarkColors.surfaceElevated, const Color(0xFF1E2433));
    });

    test('Level 3 interactive is #242C3D', () {
      expect(NagrikDarkColors.level3Interactive, const Color(0xFF242C3D));
      expect(NagrikDarkColors.surfaceInteractive, const Color(0xFF242C3D));
    });

    test('Level 4 muted is #121620', () {
      expect(NagrikDarkColors.level4Muted, const Color(0xFF121620));
      expect(NagrikDarkColors.surfaceMuted, const Color(0xFF121620));
    });

    test('text hierarchy: primary #E2E6EC, secondary #8F9CAE, tertiary #64748B', () {
      expect(NagrikDarkColors.textPrimary, const Color(0xFFE2E6EC));
      expect(NagrikDarkColors.textSecondary, const Color(0xFF8F9CAE));
      expect(NagrikDarkColors.textTertiary, const Color(0xFF64748B));
      expect(NagrikDarkColors.textOnPrimary, const Color(0xFFFFFFFF));
    });

    test('brand accents: primary #D96B43, secondary #C85A34, bright #E07A55', () {
      expect(NagrikDarkColors.brandPrimary, const Color(0xFFD96B43));
      expect(NagrikDarkColors.brandSecondary, const Color(0xFFC85A34));
      expect(NagrikDarkColors.brandBright, const Color(0xFFE07A55));
    });

    test('border is translucent #14FFFFFF, borderStrong is #24FFFFFF, divider is #14FFFFFF', () {
      expect(NagrikDarkColors.border, const Color(0x14FFFFFF));
      expect(NagrikDarkColors.borderStrong, const Color(0x24FFFFFF));
      expect(NagrikDarkColors.divider, const Color(0x14FFFFFF));
    });

    test('dark semantics: success #38B781', () {
      expect(NagrikDarkColors.success, const Color(0xFF38B781));
    });
  });
}
