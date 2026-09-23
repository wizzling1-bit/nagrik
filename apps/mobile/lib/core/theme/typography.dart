import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Centralized typography system.
///
/// Implements the Nagrik editorial design triad:
/// - Headlines & Titles: Newsreader (editorial serif)
/// - Body Text & UI: Plus Jakarta Sans (clean, legible sans-serif)
/// - Badges & Metadata: JetBrains Mono (crisp technical monospace)
///
/// Preserves explicit Noto Sans regional fallbacks for all 11 supported
/// Indian scripts as specified in the Nagrik Design System.
/// All widgets should consume `Theme.of(context).textTheme`.
abstract final class NagrikTypography {
  /// Primary headline & editorial serif font family.
  static const String headlineFontFamily = 'Newsreader';

  /// Primary body & UI sans-serif font family.
  static const String bodyFontFamily = 'Plus Jakarta Sans';

  /// Badges & monospace metadata font family.
  static const String monoFontFamily = 'JetBrains Mono';

  /// Default UI font family alias (backwards compatibility).
  static const String fontFamily = 'Plus Jakarta Sans';

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

  /// Editorial serif text style helper.
  static TextStyle headline({
    double fontSize = 20.0,
    FontWeight fontWeight = FontWeight.w700,
    double? height,
    double? letterSpacing,
    Color? color,
  }) {
    WidgetsFlutterBinding.ensureInitialized();
    return GoogleFonts.newsreader(
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    ).copyWith(
      fontFamilyFallback: fontFallbacks,
    );
  }

  /// Body / UI sans-serif text style helper.
  static TextStyle body({
    double fontSize = 15.0,
    FontWeight fontWeight = FontWeight.w400,
    double? height,
    double? letterSpacing,
    Color? color,
  }) {
    WidgetsFlutterBinding.ensureInitialized();
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    ).copyWith(
      fontFamilyFallback: fontFallbacks,
    );
  }

  /// Monospace / metadata text style helper for badges and stats.
  static TextStyle mono({
    double fontSize = 12.0,
    FontWeight fontWeight = FontWeight.w500,
    double? height,
    double? letterSpacing,
    Color? color,
  }) {
    WidgetsFlutterBinding.ensureInitialized();
    return GoogleFonts.jetBrainsMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    ).copyWith(
      fontFamilyFallback: fontFallbacks,
    );
  }

  /// Builds the complete text theme with the given base [textColor].
  static TextTheme textTheme(Color textColor) {
    WidgetsFlutterBinding.ensureInitialized();

    return TextTheme(
      // Display Large — splash & major onboarding headlines (40dp / 800 / line-height 1.20)
      displayLarge: GoogleFonts.newsreader(
        fontSize: 40.0,
        fontWeight: FontWeight.w800,
        height: 1.20,
        letterSpacing: -0.5,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Display Medium — large section heroes (32dp / 700 / line-height 1.25)
      displayMedium: GoogleFonts.newsreader(
        fontSize: 32.0,
        fontWeight: FontWeight.w700,
        height: 1.25,
        letterSpacing: -0.5,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // H1 — major page titles (28dp / 700 / line-height 1.28)
      headlineLarge: GoogleFonts.newsreader(
        fontSize: 28.0,
        fontWeight: FontWeight.w700,
        height: 1.28,
        letterSpacing: -0.25,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // H2 — section titles (22dp / 700 / line-height 1.32)
      headlineMedium: GoogleFonts.newsreader(
        fontSize: 22.0,
        fontWeight: FontWeight.w700,
        height: 1.32,
        letterSpacing: -0.15,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // H3 — article headline / detail titles (20dp / 700 / line-height 1.30)
      headlineSmall: GoogleFonts.newsreader(
        fontSize: 20.0,
        fontWeight: FontWeight.w700,
        height: 1.30,
        letterSpacing: -0.1,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // H4 / Title Large — card / item titles (18dp / 600 / line-height 1.38)
      titleLarge: GoogleFonts.newsreader(
        fontSize: 18.0,
        fontWeight: FontWeight.w600,
        height: 1.38,
        letterSpacing: -0.1,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Subtitle — secondary titles (16dp / 600 / line-height 1.40)
      titleMedium: GoogleFonts.plusJakartaSans(
        fontSize: 16.0,
        fontWeight: FontWeight.w600,
        height: 1.40,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Subtitle Small — card/item sub-headings (14dp / 600 / line-height 1.43)
      titleSmall: GoogleFonts.plusJakartaSans(
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        height: 1.43,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Body Large — primary body text (17dp / 400 / line-height 1.55 for editorial comfort)
      bodyLarge: GoogleFonts.plusJakartaSans(
        fontSize: 17.0,
        fontWeight: FontWeight.w400,
        height: 1.55,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Body — standard body text (15-16dp / 400 / line-height 1.45)
      bodyMedium: GoogleFonts.plusJakartaSans(
        fontSize: 15.0,
        fontWeight: FontWeight.w400,
        height: 1.45,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Body Small — compact body text (13-14dp / 400 / line-height 1.40)
      bodySmall: GoogleFonts.plusJakartaSans(
        fontSize: 13.0,
        fontWeight: FontWeight.w400,
        height: 1.40,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Label Large — buttons, prominent UI (14dp / 600 / line-height 1.43)
      labelLarge: GoogleFonts.plusJakartaSans(
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        height: 1.43,
        letterSpacing: 0.1,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Label Medium — badges, tags, filter chips (13dp / 600 / line-height 1.38)
      labelMedium: GoogleFonts.jetBrainsMono(
        fontSize: 13.0,
        fontWeight: FontWeight.w600,
        height: 1.38,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
      // Caption / Label Small — secondary badges, metadata, timestamps (12dp / 500 / line-height 1.33)
      labelSmall: GoogleFonts.jetBrainsMono(
        fontSize: 12.0,
        fontWeight: FontWeight.w500,
        height: 1.33,
        color: textColor,
      ).copyWith(
        fontFamilyFallback: fontFallbacks,
      ),
    );
  }
}
