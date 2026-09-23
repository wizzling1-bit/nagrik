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

    test('NagrikDarkColors matches website midnight obsidian palette', () {
      expect(NagrikDarkColors.level0Background, const Color(0xFF0C1018));
      expect(NagrikDarkColors.level1Surface, const Color(0xFF131A2A));
      expect(NagrikDarkColors.level2Elevated, const Color(0xFF1A2236));
      expect(NagrikDarkColors.level3Interactive, const Color(0xFF1E283E));
      expect(NagrikDarkColors.level4Muted, const Color(0xFF0F1520));
      expect(NagrikDarkColors.border, const Color(0xFF1C2537));
      expect(NagrikDarkColors.borderStrong, const Color(0xFF2A3650));
      expect(NagrikDarkColors.divider, const Color(0xFF1C2537));
      expect(NagrikDarkColors.textPrimary, const Color(0xFFF0F2F5));
      expect(NagrikDarkColors.textSecondary, const Color(0xFF8E9DB5));
      expect(NagrikDarkColors.textTertiary, const Color(0xFF5E6D84));
      expect(NagrikDarkColors.brandPrimary, const Color(0xFFDE5227));
      expect(NagrikDarkColors.brandSecondary, const Color(0xFFC84318));
      expect(NagrikDarkColors.brandBright, const Color(0xFFF4835E));
      expect(NagrikDarkColors.success, const Color(0xFF34D399));
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
      expect(ext.level0Background, const Color(0xFF0C1018));
      expect(ext.level1Surface, const Color(0xFF131A2A));
      expect(ext.level2Elevated, const Color(0xFF1A2236));
      expect(ext.level3Interactive, const Color(0xFF1E283E));
      expect(ext.level4Muted, const Color(0xFF0F1520));
      expect(ext.surfaceMuted, const Color(0xFF0F1520));
      expect(ext.surfaceInteractive, const Color(0xFF1E283E));
      expect(ext.textSecondary, const Color(0xFF8E9DB5));
      expect(ext.textTertiary, const Color(0xFF5E6D84));
      expect(ext.brandSecondary, const Color(0xFFC84318));
      expect(ext.brandBright, const Color(0xFFF4835E));
      expect(ext.border, const Color(0xFF1C2537));
      expect(ext.borderStrong, const Color(0xFF2A3650));
      expect(ext.divider, const Color(0xFF1C2537));
      expect(ext.success, const Color(0xFF34D399));
    });
  });
}
