import 'package:flutter/material.dart';

/// Centralized typography system.
///
/// Uses Inter for Latin UI and explicit Noto Sans regional fallbacks for
/// Indian scripts as specified in the Nagrik Design System.
/// All widgets should consume `Theme.of(context).textTheme`.
abstract final class NagrikTypography {
  static const String fontFamily = 'Inter';

  /// Explicit font fallbacks for supported Indian language scripts.
  static const List<String> fontFallbacks = [
    'Noto Sans',
    'Noto Sans Devanagari',
    'Noto Sans Bengali',
    'Noto Sans Tamil',
    'Noto Sans Telugu',
    'Noto Sans Kannada',
    'Noto Sans Malayalam',
    'Noto Sans Gujarati',
    'Noto Sans Gurmukhi',
    'Noto Sans Assamese',
    'Noto Sans Oriya',
  ];

  /// Builds the complete text theme with the given base [textColor].
  static TextTheme textTheme(Color textColor) {
    return TextTheme(
      // Display Large — splash & major onboarding headlines (40dp / 800 / line-height 1.20)
      displayLarge: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 40.0,
        fontWeight: FontWeight.w800,
        height: 1.20,
        letterSpacing: -0.5,
        color: textColor,
      ),
      // Display Medium — large section heroes (32dp / 700 / line-height 1.25)
      displayMedium: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 32.0,
        fontWeight: FontWeight.w700,
        height: 1.25,
        letterSpacing: -0.5,
        color: textColor,
      ),
      // H1 — major page titles (28dp / 700 / line-height 1.28)
      headlineLarge: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 28.0,
        fontWeight: FontWeight.w700,
        height: 1.28,
        letterSpacing: -0.25,
        color: textColor,
      ),
      // H2 — section titles (22dp / 700 / line-height 1.32)
      headlineMedium: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 22.0,
        fontWeight: FontWeight.w700,
        height: 1.32,
        letterSpacing: -0.15,
        color: textColor,
      ),
      // H3 — article headline / detail titles (20dp / 700 / line-height 1.30)
      headlineSmall: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 20.0,
        fontWeight: FontWeight.w700,
        height: 1.30,
        letterSpacing: -0.1,
        color: textColor,
      ),
      // H4 / Title Large — card / item titles (18dp / 600 / line-height 1.38)
      titleLarge: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 18.0,
        fontWeight: FontWeight.w600,
        height: 1.38,
        letterSpacing: -0.1,
        color: textColor,
      ),
      // Subtitle — secondary titles (16dp / 600 / line-height 1.40)
      titleMedium: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 16.0,
        fontWeight: FontWeight.w600,
        height: 1.40,
        color: textColor,
      ),
      // Subtitle Small — card/item sub-headings (14dp / 600 / line-height 1.43)
      titleSmall: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        height: 1.43,
        color: textColor,
      ),
      // Body Large — primary body text (17dp / 400 / line-height 1.55 for editorial comfort)
      bodyLarge: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 17.0,
        fontWeight: FontWeight.w400,
        height: 1.55,
        color: textColor,
      ),
      // Body — standard body text (15-16dp / 400 / line-height 1.45)
      bodyMedium: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 15.0,
        fontWeight: FontWeight.w400,
        height: 1.45,
        color: textColor,
      ),
      // Body Small — compact body text (13-14dp / 400 / line-height 1.40)
      bodySmall: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 13.0,
        fontWeight: FontWeight.w400,
        height: 1.40,
        color: textColor,
      ),
      // Label Large — buttons, prominent metadata (14dp / 600 / line-height 1.43)
      labelLarge: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        height: 1.43,
        letterSpacing: 0.1,
        color: textColor,
      ),
      // Label Medium — tags, filter chips (13dp / 600 / line-height 1.38)
      labelMedium: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 13.0,
        fontWeight: FontWeight.w600,
        height: 1.38,
        color: textColor,
      ),
      // Caption / Label Small — secondary metadata, timestamps (12dp / 500 / line-height 1.33)
      labelSmall: TextStyle(
        fontFamily: fontFamily,
        fontFamilyFallback: fontFallbacks,
        fontSize: 12.0,
        fontWeight: FontWeight.w500,
        height: 1.33,
        color: textColor,
      ),
    );
  }
}
