import 'package:flutter/material.dart';

/// Raw Nagrik Brand Palette — for system brand reference.
/// In widgets and components, consume semantic tokens via Theme or NagrikThemeExtension.
abstract final class NagrikBrandColors {
  /// Signature Nagrik Brand Orange (#DE5227).
  static const orangePrimary = Color(0xFFDE5227);

  /// Accessible Button Brand Orange (#C84318) for WCAG AA compliance on white text.
  static const orangeAccessible = Color(0xFFC84318);

  /// Dark hover / pressed brand orange tone (#A83410).
  static const orangeDark = Color(0xFFA83410);

  /// Light brand orange tint (#FEECE6).
  static const orangeLight = Color(0xFFFEECE6);

  /// Vibrant bright brand accent (#F4835E).
  static const orangeBright = Color(0xFFF4835E);

  // Backwards compatibility tokens
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

/// Semantic Light Palette (Warm Linen Newspaper Editorial Aesthetic).
/// 60-70% neutral warm canvas/surface, 20-30% typography/content, 5-10% purposeful brand orange accent.
abstract final class NagrikLightColors {
  /// Warm linen canvas background (#F5F0E8).
  static const background = Color(0xFFF5F0E8);

  /// Editorial card surface (#F9F6F1).
  static const surface = Color(0xFFF9F6F1);

  /// Pure white elevated surface / dialogs / popovers (#FFFFFF).
  static const surfaceElevated = Color(0xFFFFFFFF);

  /// Warm muted inset / container background (#EDE7DB).
  static const surfaceMuted = Color(0xFFEDE7DB);

  /// Warm subtle interactive surface (#E5DEC9).
  static const surfaceInteractive = Color(0xFFE5DEC9);

  /// Deep ink primary headline and body text (#0F172A).
  static const textPrimary = Color(0xFF0F172A);

  /// Muted slate secondary text (#5A6577).
  static const textSecondary = Color(0xFF5A6577);

  /// Faint warm stone tertiary text and metadata (#8B8174).
  static const textTertiary = Color(0xFF8B8174);

  /// High contrast white text for buttons and badges (#FFFFFF).
  static const textOnPrimary = Color(0xFFFFFFFF);

  /// Signature Nagrik Brand Orange (#DE5227).
  static const brandPrimary = Color(0xFFDE5227);

  /// Accessible Brand Orange (#C84318) for solid buttons.
  static const brandSecondary = Color(0xFFC84318);

  /// Vibrant brand accent orange (#F4835E).
  static const brandBright = Color(0xFFF4835E);

  /// Subtle warm border tone (#DDD5C8).
  static const border = Color(0xFFDDD5C8);

  /// Strong warm border tone (#C8BFAF).
  static const borderStrong = Color(0xFFC8BFAF);

  /// Divider line tone (#DDD5C8).
  static const divider = Color(0xFFDDD5C8);

  /// Editorial emerald success green (#047857).
  static const success = Color(0xFF047857);
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

/// Semantic Dark Palette (Midnight Obsidian Luxury Editorial Aesthetic).
abstract final class NagrikDarkColors {
  /// Level 0: Midnight Obsidian canvas background (#0C1018).
  static const level0Background = Color(0xFF0C1018);

  /// Level 1: Primary card / content surface (#131A2A).
  static const level1Surface = Color(0xFF131A2A);

  /// Level 2: Elevated surface / dialogs / modal sheets (#1A2236).
  static const level2Elevated = Color(0xFF1A2236);

  /// Level 3: Selected / focused / active interactive surface (#1E283E).
  static const level3Interactive = Color(0xFF1E283E);

  /// Level 4 / Inset: Inset / muted surface / text fields (#0F1520).
  static const level4Muted = Color(0xFF0F1520);

  // Aliases
  static const background = level0Background;
  static const surface = level1Surface;
  static const surfaceElevated = level2Elevated;
  static const surfaceMuted = level4Muted;
  static const surfaceInteractive = level3Interactive;

  /// Bright luminescent primary text (#F0F2F5).
  static const textPrimary = Color(0xFFF0F2F5);

  /// Muted obsidian secondary text (#8E9DB5).
  static const textSecondary = Color(0xFF8E9DB5);

  /// Faint tertiary metadata text (#5E6D84).
  static const textTertiary = Color(0xFF5E6D84);

  /// High contrast white text for solid buttons (#FFFFFF).
  static const textOnPrimary = Color(0xFFFFFFFF);

  /// Signature Nagrik Brand Orange (#DE5227).
  static const brandPrimary = Color(0xFFDE5227);

  /// Accessible Brand Orange (#C84318).
  static const brandSecondary = Color(0xFFC84318);

  /// Vibrant luminous brand orange accent (#F4835E).
  static const brandBright = Color(0xFFF4835E);

  /// Subtle dark border (#1C2537).
  static const border = Color(0xFF1C2537);

  /// Strong dark border (#2A3650).
  static const borderStrong = Color(0xFF2A3650);

  /// Divider line tone (#1C2537).
  static const divider = Color(0xFF1C2537);

  /// Mint emerald success green (#34D399).
  static const success = Color(0xFF34D399);
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
