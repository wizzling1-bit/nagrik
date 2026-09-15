import 'package:flutter/material.dart';

/// Raw Nagrik Brand Palette — for system brand reference.
/// In widgets and components, consume semantic tokens via Theme or NagrikThemeExtension.
abstract final class NagrikBrandColors {
  static const navy900 = Color(0xFF0F1E36);
  static const navy700 = Color(0xFF1B3A63);
  static const blue600 = Color(0xFF1E4CA1);
  static const blue500 = Color(0xFF2C64B5);
  static const blueBright = Color(0xFF3F7ED0);

  /// Crimson brand mark (splash flood, logo badge).
  static const crimson = Color(0xFFC53030);

  /// Deep navy launch backdrop for the splash scene in both modes.
  static const midnight = Color(0xFF0B1017);

  /// Royal Navy identity and luminous sapphire tokens
  static const royalNavy = Color(0xFF0F1E36);
  static const sapphireGlow = Color(0xFF2A599B);
}

/// Semantic Light Palette.
/// 60-70% neutral canvas/surface, 20-30% typography/content, 5-10% purposeful brand accent.
abstract final class NagrikLightColors {
  static const background = Color(0xFFF6F7F9);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceMuted = Color(0xFFEDF1F5);
  static const surfaceElevated = Color(0xFFFFFFFF);
  static const surfaceInteractive = Color(0xFFE8EEF5);

  static const textPrimary = Color(0xFF192333);
  static const textSecondary = Color(0xFF536378);
  static const textTertiary = Color(0xFF8697A8);
  static const textOnPrimary = Color(0xFFFFFFFF);

  static const brandPrimary = Color(0xFF1E4CA1);
  static const brandSecondary = Color(0xFF2C64B5);
  static const brandBright = Color(0xFF3F7ED0);

  static const border = Color(0xFFE2E7ED);
  static const divider = Color(0xFFEBEFF4);

  static const success = Color(0xFF15803D);
  static const successContainer = Color(0xFFDCFCE7);
  static const warning = Color(0xFFB45309);
  static const warningContainer = Color(0xFFFEF3C7);
  static const error = Color(0xFFC53030);
  static const errorContainer = Color(0xFFFEE2E2);
  static const info = Color(0xFF1E4CA1);
  static const infoContainer = Color(0xFFDBEAFE);

  static const overlay = Color(0x1A0A2647);
  static const scrim = Color(0x66000000);
}

/// Semantic Dark Palette (Premium Obsidian-Navy Tonal Hierarchy).
abstract final class NagrikDarkColors {
  /// Level 0: Canvas background (Deep Midnight Obsidian)
  static const level0Background = Color(0xFF0B1017);

  /// Level 1: Primary content surface / cards (Luminescent Navy Slate)
  static const level1Surface = Color(0xFF131A26);

  /// Level 2: Elevated surface / dialogs / modal sheets
  static const level2Elevated = Color(0xFF1A2333);

  /// Level 3: Selected / focused / active interactive surface
  static const level3Interactive = Color(0xFF222E42);

  /// Level 4 / Inset: Inset / muted surface / text fields / container backgrounds
  static const level4Muted = Color(0xFF0E1520);

  // Aliases
  static const background = level0Background;
  static const surface = level1Surface;
  static const surfaceElevated = level2Elevated;
  static const surfaceMuted = level4Muted;
  static const surfaceInteractive = level3Interactive;

  static const textPrimary = Color(0xFFE2E8F0);
  static const textSecondary = Color(0xFF94A3B8);
  static const textTertiary = Color(0xFF64748B);
  static const textOnPrimary = Color(0xFFFFFFFF);

  static const brandPrimary = Color(0xFF5A8EE8);
  static const brandSecondary = Color(0xFF3B6DAA);
  static const brandBright = Color(0xFF7CA6F2);

  static const border = Color(0xFF1E2736);
  static const divider = Color(0xFF18202D);

  static const success = Color(0xFF2EBD85);
  static const successContainer = Color(0xFF0C2E1F);
  static const warning = Color(0xFFE5A138);
  static const warningContainer = Color(0xFF332005);
  static const error = Color(0xFFE05656);
  static const errorContainer = Color(0xFF38151A);
  static const info = Color(0xFF5A8EE8);
  static const infoContainer = Color(0xFF12233D);

  static const overlay = Color(0x40000000);
  static const scrim = Color(0x99000000);
}

/// Curated social platform brand colors.
abstract final class NagrikSocialColors {
  static const whatsapp = Color(0xFF25D366);
  static const twitterX = Color(0xFF0F1419);
  static const telegram = Color(0xFF0088CC);
  static const copyLink = Color(0xFF3B82F6);
  static const shareMore = Color(0xFF8B5CF6);
}

typedef NagrikColors = NagrikBrandColors;
