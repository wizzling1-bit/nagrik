import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

void main() {
  group('Theme Parity Tests (Website Design Parity)', () {
    test('NagrikLightColors matches website warm linen palette', () {
      expect(NagrikLightColors.background, const Color(0xFFF5F0E8));
      expect(NagrikLightColors.surface, const Color(0xFFF9F6F1));
      expect(NagrikLightColors.surfaceElevated, const Color(0xFFFFFFFF));
      expect(NagrikLightColors.surfaceMuted, const Color(0xFFEDE7DB));
      expect(NagrikLightColors.surfaceInteractive, const Color(0xFFE5DEC9));
      expect(NagrikLightColors.border, const Color(0xFFDDD5C8));
      expect(NagrikLightColors.borderStrong, const Color(0xFFC8BFAF));
      expect(NagrikLightColors.divider, const Color(0xFFDDD5C8));
      expect(NagrikLightColors.textPrimary, const Color(0xFF0F172A));
      expect(NagrikLightColors.textSecondary, const Color(0xFF5A6577));
      expect(NagrikLightColors.textTertiary, const Color(0xFF8B8174));
      expect(NagrikLightColors.brandPrimary, const Color(0xFFDE5227));
      expect(NagrikLightColors.brandSecondary, const Color(0xFFC84318));
      expect(NagrikLightColors.brandBright, const Color(0xFFF4835E));
      expect(NagrikLightColors.success, const Color(0xFF047857));
    });

    test('NagrikDarkColors matches soft editorial dark palette', () {
      expect(NagrikDarkColors.level0Background, const Color(0xFF10141C));
      expect(NagrikDarkColors.level1Surface, const Color(0xFF161B26));
      expect(NagrikDarkColors.level2Elevated, const Color(0xFF1E2433));
      expect(NagrikDarkColors.level3Interactive, const Color(0xFF242C3D));
      expect(NagrikDarkColors.level4Muted, const Color(0xFF121620));
      expect(NagrikDarkColors.border, const Color(0x14FFFFFF));
      expect(NagrikDarkColors.borderStrong, const Color(0x24FFFFFF));
      expect(NagrikDarkColors.divider, const Color(0x14FFFFFF));
      expect(NagrikDarkColors.textPrimary, const Color(0xFFE2E6EC));
      expect(NagrikDarkColors.textSecondary, const Color(0xFF8F9CAE));
      expect(NagrikDarkColors.textTertiary, const Color(0xFF64748B));
      expect(NagrikDarkColors.brandPrimary, const Color(0xFFD96B43));
      expect(NagrikDarkColors.brandSecondary, const Color(0xFFC85A34));
      expect(NagrikDarkColors.brandBright, const Color(0xFFE07A55));
      expect(NagrikDarkColors.success, const Color(0xFF38B781));
    });

    test('NagrikThemeExtension light factory maps correctly', () {
      final ext = NagrikThemeExtension.light();
      expect(ext.level0Background, const Color(0xFFF5F0E8));
      expect(ext.level1Surface, const Color(0xFFF9F6F1));
      expect(ext.level2Elevated, const Color(0xFFFFFFFF));
      expect(ext.level3Interactive, const Color(0xFFE5DEC9));
      expect(ext.level4Muted, const Color(0xFFEDE7DB));
      expect(ext.surfaceMuted, const Color(0xFFEDE7DB));
      expect(ext.surfaceInteractive, const Color(0xFFE5DEC9));
      expect(ext.textSecondary, const Color(0xFF5A6577));
      expect(ext.textTertiary, const Color(0xFF8B8174));
      expect(ext.brandSecondary, const Color(0xFFC84318));
      expect(ext.brandBright, const Color(0xFFF4835E));
      expect(ext.border, const Color(0xFFDDD5C8));
      expect(ext.borderStrong, const Color(0xFFC8BFAF));
      expect(ext.divider, const Color(0xFFDDD5C8));
      expect(ext.success, const Color(0xFF047857));
    });

    test('NagrikThemeExtension dark factory maps correctly', () {
      final ext = NagrikThemeExtension.dark();
      expect(ext.level0Background, const Color(0xFF10141C));
      expect(ext.level1Surface, const Color(0xFF161B26));
      expect(ext.level2Elevated, const Color(0xFF1E2433));
      expect(ext.level3Interactive, const Color(0xFF242C3D));
      expect(ext.level4Muted, const Color(0xFF121620));
      expect(ext.surfaceMuted, const Color(0xFF121620));
      expect(ext.surfaceInteractive, const Color(0xFF242C3D));
      expect(ext.textSecondary, const Color(0xFF8F9CAE));
      expect(ext.textTertiary, const Color(0xFF64748B));
      expect(ext.brandSecondary, const Color(0xFFC85A34));
      expect(ext.brandBright, const Color(0xFFE07A55));
      expect(ext.border, const Color(0x14FFFFFF));
      expect(ext.borderStrong, const Color(0x24FFFFFF));
      expect(ext.divider, const Color(0x14FFFFFF));
      expect(ext.success, const Color(0xFF38B781));
    });
  });
}
