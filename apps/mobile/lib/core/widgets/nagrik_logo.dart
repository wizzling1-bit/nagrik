import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/typography.dart';

/// Available sizes for [NagrikLogo].
enum NagrikLogoSize {
  sm,
  md,
  lg,
  xl,
}

/// Available display variants for [NagrikLogo].
enum NagrikLogoVariant {
  icon,
  horizontal,
  full,
}

/// Size extensions for [NagrikLogoSize] geometry and typography scale.
extension NagrikLogoSizeX on NagrikLogoSize {
  /// Base icon mark dimensions matching the 1:1 brand mark.
  Size get markDimensions => switch (this) {
        NagrikLogoSize.sm => const Size(32.0, 32.0),
        NagrikLogoSize.md => const Size(40.0, 40.0),
        NagrikLogoSize.lg => const Size(48.0, 48.0),
        NagrikLogoSize.xl => const Size(64.0, 64.0),
      };

  /// Main headline wordmark font size.
  double get titleFontSize => switch (this) {
        NagrikLogoSize.sm => 16.0,
        NagrikLogoSize.md => 18.0,
        NagrikLogoSize.lg => 20.0,
        NagrikLogoSize.xl => 24.0,
      };

  /// Editorial subtitle font size.
  double get subtitleFontSize => switch (this) {
        NagrikLogoSize.sm => 10.0,
        NagrikLogoSize.md => 11.0,
        NagrikLogoSize.lg => 12.0,
        NagrikLogoSize.xl => 13.0,
      };

  /// Horizontal spacing between icon and wordmark.
  double get horizontalSpacing => switch (this) {
        NagrikLogoSize.sm => 8.0,
        NagrikLogoSize.md => 10.0,
        NagrikLogoSize.lg => 12.0,
        NagrikLogoSize.xl => 14.0,
      };

  /// Vertical spacing between icon and wordmark.
  double get verticalSpacing => switch (this) {
        NagrikLogoSize.sm => 6.0,
        NagrikLogoSize.md => 8.0,
        NagrikLogoSize.lg => 10.0,
        NagrikLogoSize.xl => 12.0,
      };
}

/// Authentic brand mark for Nagrik.
///
/// Renders the official high-resolution brand image with a graceful
/// vector fallback painter.
class NagrikLogoMark extends StatelessWidget {
  const NagrikLogoMark({
    super.key,
    this.size = NagrikLogoSize.md,
    this.width,
    this.height,
  });

  final NagrikLogoSize size;
  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    final dimensions = size.markDimensions;
    final w = width ?? dimensions.width;
    final h = height ?? dimensions.height;

    return RepaintBoundary(
      child: Container(
        width: w,
        height: h,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(w * 0.24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(w * 0.24),
          child: CustomPaint(
            size: Size(w, h),
            painter: const NagrikLogoMarkPainter(),
            child: Image.asset(
              'assets/images/nagrik_logo.png',
              width: w,
              height: h,
              fit: BoxFit.cover,
              filterQuality: FilterQuality.high,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),
          ),
        ),
      ),
    );
  }
}

/// Custom painter for the Nagrik brand crest vector mark.
///
/// Canonical coordinate system: 100 x 100 viewBox.
class NagrikLogoMarkPainter extends CustomPainter {
  const NagrikLogoMarkPainter();

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width <= 0 || size.height <= 0) return;

    final scale = math.min(size.width / 100.0, size.height / 100.0);
    final dx = (size.width - 100.0 * scale) / 2.0;
    final dy = (size.height - 100.0 * scale) / 2.0;

    canvas.save();
    canvas.translate(dx, dy);
    canvas.scale(scale, scale);

    // 1. Dark Base Squircle Container
    final squircleRRect = RRect.fromRectAndRadius(
      const Rect.fromLTWH(0.0, 0.0, 100.0, 100.0),
      const Radius.circular(22.0),
    );
    final bgPaint = Paint()
      ..shader = ui.Gradient.linear(
        const Offset(0.0, 0.0),
        const Offset(100.0, 100.0),
        const [
          Color(0xFF14171F),
          Color(0xFF080A0E),
        ],
      )
      ..style = PaintingStyle.fill;
    canvas.drawRRect(squircleRRect, bgPaint);

    // 2. 3D Gradient Orange Ribbon N
    final ribbonPaint = Paint()
      ..shader = ui.Gradient.linear(
        const Offset(20.0, 20.0),
        const Offset(80.0, 80.0),
        const [
          Color(0xFFFF9100),
          Color(0xFFFF5722),
          Color(0xFFE64A19),
        ],
        const [0.0, 0.5, 1.0],
      )
      ..style = PaintingStyle.fill;

    // Left Stem
    final leftStem = RRect.fromRectAndRadius(
      const Rect.fromLTWH(18.0, 20.0, 18.0, 60.0),
      const Radius.circular(9.0),
    );
    canvas.drawRRect(leftStem, ribbonPaint);

    // Diagonal Fold
    final diagPath = Path()
      ..moveTo(20.0, 28.0)
      ..lineTo(36.0, 20.0)
      ..lineTo(78.0, 72.0)
      ..lineTo(62.0, 80.0)
      ..close();
    canvas.drawPath(diagPath, ribbonPaint);

    // Right Upright Pin
    const pinCenter = Offset(70.0, 36.0);
    final pinPaint = Paint()
      ..shader = ui.Gradient.linear(
        const Offset(55.0, 20.0),
        const Offset(85.0, 60.0),
        const [
          Color(0xFFFF9100),
          Color(0xFFFF5722),
        ],
      )
      ..style = PaintingStyle.fill;
    canvas.drawCircle(pinCenter, 14.0, pinPaint);

    final rightStem = RRect.fromRectAndRadius(
      const Rect.fromLTWH(61.0, 36.0, 18.0, 44.0),
      const Radius.circular(9.0),
    );
    canvas.drawRRect(rightStem, pinPaint);

    // Pin Hole
    final holePaint = Paint()
      ..color = const Color(0xFF0C1018)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(pinCenter, 5.5, holePaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Authentic vector brand crest and wordmark widget for Nagrik.
///
/// Features:
/// - Exact geometry and colors matching the website's brand identity
/// - 4 standardized sizes: [NagrikLogoSize.sm], [NagrikLogoSize.md], [NagrikLogoSize.lg], [NagrikLogoSize.xl]
/// - 3 variants: [NagrikLogoVariant.icon], [NagrikLogoVariant.horizontal], [NagrikLogoVariant.full]
/// - Seamless dark/light theme support with optional overrides
/// - Full accessibility semantics
class NagrikLogo extends StatelessWidget {
  const NagrikLogo({
    super.key,
    this.size = NagrikLogoSize.md,
    this.variant = NagrikLogoVariant.horizontal,
    this.theme,
    this.brightness,
    this.hideSubtitle = false,
  });

  /// Factory constructor for standalone icon crest.
  const NagrikLogo.icon({
    super.key,
    this.size = NagrikLogoSize.md,
    this.theme,
    this.brightness,
  })  : variant = NagrikLogoVariant.icon,
        hideSubtitle = true;

  /// Factory constructor for horizontal logo with wordmark.
  const NagrikLogo.horizontal({
    super.key,
    this.size = NagrikLogoSize.md,
    this.theme,
    this.brightness,
    this.hideSubtitle = false,
  }) : variant = NagrikLogoVariant.horizontal;

  /// Factory constructor for stacked/full logo with wordmark.
  const NagrikLogo.full({
    super.key,
    this.size = NagrikLogoSize.md,
    this.theme,
    this.brightness,
    this.hideSubtitle = false,
  }) : variant = NagrikLogoVariant.full;

  /// Display size. Defaults to [NagrikLogoSize.md].
  final NagrikLogoSize size;

  /// Layout variant. Defaults to [NagrikLogoVariant.horizontal].
  final NagrikLogoVariant variant;

  /// Optional theme override. Can be [Brightness], [ThemeMode], or String ('light'/'dark').
  final dynamic theme;

  /// Explicit [Brightness] override.
  final Brightness? brightness;

  /// Whether to hide the "Citizen Journalism Platform" subtitle. Defaults to `false`.
  final bool hideSubtitle;

  Brightness _resolveBrightness(BuildContext context) {
    if (brightness != null) return brightness!;
    if (theme != null) {
      if (theme is Brightness) return theme as Brightness;
      if (theme is ThemeMode) {
        final mode = theme as ThemeMode;
        if (mode == ThemeMode.dark) return Brightness.dark;
        if (mode == ThemeMode.light) return Brightness.light;
        return MediaQuery.platformBrightnessOf(context);
      }
      if (theme is String) {
        if (theme == 'dark') return Brightness.dark;
        if (theme == 'light') return Brightness.light;
      }
    }
    return Theme.of(context).brightness;
  }

  Widget _buildWordmark({
    required Brightness resolvedBrightness,
    required bool isCentered,
  }) {
    final isDark = resolvedBrightness == Brightness.dark;
    final textColor = isDark ? const Color(0xFFFFFFFF) : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF8E9DB5) : const Color(0xFF5A6577);
    const accentColor = Color(0xFFE36138);

    final titleStyle = GoogleFonts.plusJakartaSans(
      fontSize: size.titleFontSize,
      fontWeight: FontWeight.w900,
      letterSpacing: -0.5,
      height: 1.15,
      color: textColor,
    ).copyWith(
      fontFamilyFallback: NagrikTypography.fontFallbacks,
    );

    final subtitleStyle = GoogleFonts.plusJakartaSans(
      fontSize: size.subtitleFontSize,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.25,
      height: 1.25,
      color: subtextColor,
    ).copyWith(
      fontFamilyFallback: NagrikTypography.fontFallbacks,
    );

    final wordmarkText = Text.rich(
      TextSpan(
        style: titleStyle,
        children: const [
          TextSpan(text: 'nagrik'),
          TextSpan(
            text: '.news',
            style: TextStyle(color: accentColor),
          ),
        ],
      ),
      style: titleStyle,
      textAlign: isCentered ? TextAlign.center : TextAlign.start,
    );

    if (hideSubtitle) {
      return wordmarkText;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment:
          isCentered ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        wordmarkText,
        const SizedBox(height: 2.0),
        Text(
          'Citizen Journalism Platform',
          style: subtitleStyle,
          textAlign: isCentered ? TextAlign.center : TextAlign.start,
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final resolvedBrightness = _resolveBrightness(context);
    final mark = NagrikLogoMark(size: size);

    final content = switch (variant) {
      NagrikLogoVariant.icon => mark,
      NagrikLogoVariant.horizontal => Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            mark,
            SizedBox(width: size.horizontalSpacing),
            _buildWordmark(
              resolvedBrightness: resolvedBrightness,
              isCentered: false,
            ),
          ],
        ),
      NagrikLogoVariant.full => Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            mark,
            SizedBox(height: size.verticalSpacing),
            _buildWordmark(
              resolvedBrightness: resolvedBrightness,
              isCentered: true,
            ),
          ],
        ),
    };

    return Semantics(
      label: hideSubtitle
          ? 'Nagrik.news'
          : 'Nagrik.news - Citizen Journalism Platform',
      header: true,
      child: content,
    );
  }
}
