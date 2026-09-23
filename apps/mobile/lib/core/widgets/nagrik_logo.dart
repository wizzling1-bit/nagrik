import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
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
  /// Base icon mark dimensions matching web SVG aspect ratio (100:112).
  Size get markDimensions => switch (this) {
        NagrikLogoSize.sm => const Size(30.0, 34.0),
        NagrikLogoSize.md => const Size(38.0, 42.0),
        NagrikLogoSize.lg => const Size(48.0, 54.0),
        NagrikLogoSize.xl => const Size(64.0, 72.0),
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

/// Authentic vector brand crest mark for Nagrik.
///
/// Paints the authentic squircle container, apex triangle, signal radio arcs,
/// bold `N` glyph, and tricolor accent dots with pixel-perfect fidelity
/// to `apps/web/src/components/NagrikLogo.tsx`.
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
      child: CustomPaint(
        size: Size(w, h),
        painter: const NagrikLogoMarkPainter(),
      ),
    );
  }
}

/// Custom painter for the Nagrik brand crest vector mark.
///
/// Canonical coordinate system: 100 x 112 viewBox.
class NagrikLogoMarkPainter extends CustomPainter {
  const NagrikLogoMarkPainter();

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width <= 0 || size.height <= 0) return;

    final scale = math.min(size.width / 100.0, size.height / 112.0);
    final dx = (size.width - 100.0 * scale) / 2.0;
    final dy = (size.height - 112.0 * scale) / 2.0;

    canvas.save();
    canvas.translate(dx, dy);
    canvas.scale(scale, scale);

    // 1. Main Squircle Container
    // <rect x="5" y="4" width="90" height="84" rx="26" fill="url(#nagrik_brand_grad)" />
    final squircleRRect = RRect.fromRectAndRadius(
      const Rect.fromLTWH(5.0, 4.0, 90.0, 84.0),
      const Radius.circular(26.0),
    );
    final squirclePaint = Paint()
      ..shader = ui.Gradient.linear(
        const Offset(5.0, 4.0),
        const Offset(95.0, 88.0),
        const [
          Color(0xFFEA580C),
          Color(0xFFC2410C),
        ],
      )
      ..style = PaintingStyle.fill;
    canvas.drawRRect(squircleRRect, squirclePaint);

    // 2. Bottom Pointer Triangle
    // <path d="M50 100 L41 87 L59 87 Z" fill="#D9562B" />
    final trianglePath = Path()
      ..moveTo(50.0, 100.0)
      ..lineTo(41.0, 87.0)
      ..lineTo(59.0, 87.0)
      ..close();
    final trianglePaint = Paint()
      ..color = const Color(0xFFD9562B)
      ..style = PaintingStyle.fill;
    canvas.drawPath(trianglePath, trianglePaint);

    // 3. Signal Radio Arcs
    // <path d="M66 28 C70 32 72 38 72 45 C72 52 70 57 66 61" stroke="#FEE7DE" strokeWidth="4.5" strokeLinecap="round" />
    // <path d="M75 20 C83 26 86 35 86 45 C86 55 83 64 75 70" stroke="#FEE7DE" strokeWidth="4.5" strokeLinecap="round" />
    final arcPaint = Paint()
      ..color = const Color(0xFFFEE7DE)
      ..strokeWidth = 4.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final arc1 = Path()
      ..moveTo(66.0, 28.0)
      ..cubicTo(70.0, 32.0, 72.0, 38.0, 72.0, 45.0)
      ..cubicTo(72.0, 52.0, 70.0, 57.0, 66.0, 61.0);
    canvas.drawPath(arc1, arcPaint);

    final arc2 = Path()
      ..moveTo(75.0, 20.0)
      ..cubicTo(83.0, 26.0, 86.0, 35.0, 86.0, 45.0)
      ..cubicTo(86.0, 55.0, 83.0, 64.0, 75.0, 70.0);
    canvas.drawPath(arc2, arcPaint);

    // 4. Bold N Glyph
    // <path d="M27 30 L27 68 M27 30 L64 68 M64 30 L64 68" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="square" strokeLinejoin="miter" />
    final nPaint = Paint()
      ..color = const Color(0xFFFFFFFF)
      ..strokeWidth = 11.0
      ..strokeCap = StrokeCap.square
      ..strokeJoin = StrokeJoin.miter
      ..style = PaintingStyle.stroke;

    final nPath = Path()
      ..moveTo(27.0, 30.0)
      ..lineTo(27.0, 68.0)
      ..moveTo(27.0, 30.0)
      ..lineTo(64.0, 68.0)
      ..moveTo(64.0, 30.0)
      ..lineTo(64.0, 68.0);
    canvas.drawPath(nPath, nPaint);

    // 5. Tricolor Accent Base Dots
    // <rect x="33" y="104" width="9" height="4" rx="2" fill="#F58220" />
    // <rect x="45.5" y="104" width="9" height="4" rx="2" fill="#CBD5E1" />
    // <rect x="58" y="104" width="9" height="4" rx="2" fill="#22C55E" />
    const dotRadius = Radius.circular(2.0);

    final saffronDot = RRect.fromRectAndRadius(
      const Rect.fromLTWH(33.0, 104.0, 9.0, 4.0),
      dotRadius,
    );
    canvas.drawRRect(
      saffronDot,
      Paint()
        ..color = const Color(0xFFF58220)
        ..style = PaintingStyle.fill,
    );

    final slateDot = RRect.fromRectAndRadius(
      const Rect.fromLTWH(45.5, 104.0, 9.0, 4.0),
      dotRadius,
    );
    canvas.drawRRect(
      slateDot,
      Paint()
        ..color = const Color(0xFFCBD5E1)
        ..style = PaintingStyle.fill,
    );

    final emeraldDot = RRect.fromRectAndRadius(
      const Rect.fromLTWH(58.0, 104.0, 9.0, 4.0),
      dotRadius,
    );
    canvas.drawRRect(
      emeraldDot,
      Paint()
        ..color = const Color(0xFF22C55E)
        ..style = PaintingStyle.fill,
    );

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Private alias for compatibility with briefs and specs referencing [_NagrikLogoMarkPainter].
typedef _NagrikLogoMarkPainter = NagrikLogoMarkPainter;

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
