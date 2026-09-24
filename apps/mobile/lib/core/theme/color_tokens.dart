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

/// Semantic Dark Palette (Soft Charcoal Editorial Aesthetic — Non-Glare).
abstract final class NagrikDarkColors {
  /// Level 0: Soft Charcoal Canvas background (#10141C) — eliminates eye fatigue.
  static const level0Background = Color(0xFF10141C);

  /// Level 1: Primary card / content surface (#161B26).
  static const level1Surface = Color(0xFF161B26);

  /// Level 2: Elevated surface / dialogs / modal sheets (#1E2433).
  static const level2Elevated = Color(0xFF1E2433);

  /// Level 3: Selected / focused / active interactive surface (#242C3D).
  static const level3Interactive = Color(0xFF242C3D);

  /// Level 4 / Inset: Inset / muted surface / text fields (#121620).
  static const level4Muted = Color(0xFF121620);

  // Aliases
  static const background = level0Background;
  static const surface = level1Surface;
  static const surfaceElevated = level2Elevated;
  static const surfaceMuted = level4Muted;
  static const surfaceInteractive = level3Interactive;

  /// Soft ivory paper primary text (#E2E6EC) — no blinding glare.
  static const textPrimary = Color(0xFFE2E6EC);

  /// Soft slate secondary text (#8F9CAE).
  static const textSecondary = Color(0xFF8F9CAE);

  /// Muted metadata tertiary text (#64748B).
  static const textTertiary = Color(0xFF64748B);

  /// Clean button text (#FFFFFF).
  static const textOnPrimary = Color(0xFFFFFFFF);

  /// Soft warm terracotta brand orange (#D96B43) — reduced optical fatigue.
  static const brandPrimary = Color(0xFFD96B43);

  /// Deeper brand orange (#C85A34).
  static const brandSecondary = Color(0xFFC85A34);

  /// Warm luminous accent (#E07A55).
  static const brandBright = Color(0xFFE07A55);

  /// Delicate translucent borders (#14FFFFFF).
  static const border = Color(0x14FFFFFF);

  /// Stronger translucent border (#24FFFFFF).
  static const borderStrong = Color(0x24FFFFFF);

  /// Divider line (#14FFFFFF).
  static const divider = Color(0x14FFFFFF);

  /// Soft emerald success green (#38B781).
  static const success = Color(0xFF38B781);
  static const successContainer = Color(0xFF0F3022);

  /// Soft amber warning (#DDA046).
  static const warning = Color(0xFFDDA046);
  static const warningContainer = Color(0xFF332005);

  /// Soft coral error (#D95B5B).
  static const error = Color(0xFFD95B5B);
  static const errorContainer = Color(0xFF38151A);

  /// Soft azure info (#5586DC).
  static const info = Color(0xFF5586DC);
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
