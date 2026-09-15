import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/ads/managers/app_open_ad_manager.dart';

/// Premium animated brand introduction (~3000 ms) with a 5-act cinematic
/// narrative that tells the Nagrik hyperlocal identity story:
///
/// 1. **Signal Origin** (0–600 ms)  – A single point of sapphire light pulses
///    to life on a deep navy void, like a local signal awakening.
/// 2. **Location Beacon** (400–1200 ms) – Concentric signal rings propagate
///    outward; subtle editorial line fragments drift near the rings.
/// 3. **Brand Reveal** (1000–2000 ms) – The Nagrik "N-pin" emblem emerges
///    from the signal energy with a luminous glow.
/// 4. **Identity Settle** (1800–2600 ms) – The wordmark and tagline appear
///    with a confirmation pulse.
/// 5. **Handoff** (2500–3000 ms) – Subtle scale and fade toward the Home
///    screen with zero blank frames.
///
/// The animation runs in parallel with app initialization. If the app is
/// ready before the animation ends, it transitions immediately after
/// completion. Users can skip at any time.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({
    super.key,
    this.onInitialized,
    this.totalDuration = const Duration(milliseconds: 3000),
  });

  final VoidCallback? onInitialized;
  final Duration totalDuration;

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  Timer? _watchdog;
  bool _hasCompleted = false;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: widget.totalDuration,
    );

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _finish();
      }
    });

    _controller.forward();

    // Safety net: never trap the user on splash if navigation stalls.
    _watchdog = Timer(
      widget.totalDuration + const Duration(seconds: 3),
      _finish,
    );
  }

  void _finish() {
    if (_hasCompleted || !mounted) return;
    _hasCompleted = true;
    ref.read(appOpenAdManagerProvider).markSplashCompleted();
    widget.onInitialized?.call();
  }

  void _skip() {
    if (_hasCompleted) return;
    _controller.stop();
    _finish();
  }

  @override
  void dispose() {
    _watchdog?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduceMotion =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    const bgColor = NagrikBrandColors.midnight;

    if (reduceMotion) {
      return GestureDetector(
        onTap: _skip,
        child: Scaffold(
          backgroundColor: bgColor,
          body: Semantics(
            label: 'Nagrik — Your City. Your News.',
            child: const Center(
              child: _StaticBrandIdentity(
                tagline: 'Your city. Your updates.',
              ),
            ),
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: _skip,
      child: Scaffold(
        backgroundColor: bgColor,
        body: Semantics(
          label: 'Nagrik — Your City. Your News.',
          excludeSemantics: true,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, _) {
              final t = _controller.value;
              return Stack(
                fit: StackFit.expand,
                children: [
                  // Act 1+2: Signal field + location beacon rings
                  CustomPaint(
                    painter: _SignalFieldPainter(progress: t),
                    size: Size.infinite,
                  ),

                  // Act 3+4: Brand emblem, wordmark, tagline
                  _BrandRevealLayer(
                    progress: t,
                    tagline: 'Your city. Your updates.',
                  ),

                  // Act 5: Exit overlay (fade out the entire scene)
                  if (t > 0.83)
                    Positioned.fill(
                      child: IgnorePointer(
                        child: ColoredBox(
                          color: bgColor.withValues(
                            alpha: _exitOpacity(t),
                          ),
                        ),
                      ),
                    ),

                  // Skip affordance — always available
                  Positioned(
                    right: 12,
                    bottom: 24,
                    child: TextButton(
                      onPressed: _skip,
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white.withValues(alpha: 0.65),
                        minimumSize: const Size(48, 44),
                      ),
                      child: Text(ref.watch(appStringsProvider).skipAction),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  /// Act 5 exit: ramps from 0 → 1 over the final 17% of the timeline.
  double _exitOpacity(double t) {
    return Curves.easeInCubic.transform(
      ((t - 0.83) / 0.17).clamp(0.0, 1.0),
    );
  }
}

// ---------------------------------------------------------------------------
// STATIC BRAND IDENTITY (reduced-motion fallback)
// ---------------------------------------------------------------------------

class _StaticBrandIdentity extends StatelessWidget {
  const _StaticBrandIdentity({required this.tagline});

  final String tagline;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Logo emblem
          const _LogoEmblem(opacity: 1.0, scale: 1.0),
          const SizedBox(height: 18),
          // Wordmark
          Text(
            'Nagrik',
            style: context.textTheme.displayMedium?.copyWith(
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: -0.5,
              height: 1.1,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          // Sub-wordmark
          Text(
            'N A G R I K',
            style: context.textTheme.labelMedium?.copyWith(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              letterSpacing: 6.0,
              color: Colors.white.withValues(alpha: 0.9),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          // Tagline
          Text(
            tagline,
            style: context.textTheme.bodyMedium?.copyWith(
              color: Colors.white.withValues(alpha: 0.85),
              fontWeight: FontWeight.w600,
              letterSpacing: 0.3,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// LOGO EMBLEM WIDGET
// ---------------------------------------------------------------------------

class _LogoEmblem extends StatelessWidget {
  const _LogoEmblem({required this.opacity, required this.scale});

  final double opacity;
  final double scale;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity.clamp(0.0, 1.0),
      child: Transform.scale(
        scale: scale,
        child: Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.45),
                blurRadius: 28,
                offset: const Offset(0, 10),
              ),
              BoxShadow(
                color: NagrikBrandColors.sapphireGlow.withValues(alpha: 0.35),
                blurRadius: 32,
                spreadRadius: 2,
              ),
            ],
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.20),
              width: 1.2,
            ),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(21),
            child: Image.asset(
              'assets/images/nagrik_logo.png',
              fit: BoxFit.cover,
              filterQuality: FilterQuality.high,
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// BRAND REVEAL LAYER (Acts 3–4)
// ---------------------------------------------------------------------------

class _BrandRevealLayer extends StatelessWidget {
  const _BrandRevealLayer({
    required this.progress,
    required this.tagline,
  });

  final double progress;
  final String tagline;

  @override
  Widget build(BuildContext context) {
    // Act 3: Emblem reveal (0.33 – 0.56)
    final emblemAppear = _interval(progress, 0.33, 0.50);
    final emblemOpacity = Curves.easeOutCubic.transform(emblemAppear);
    final emblemScale = 0.6 + (0.4 * Curves.easeOutCubic.transform(emblemAppear));

    // Act 4: Wordmark (0.52 – 0.68)
    final wordmarkAppear = _interval(progress, 0.52, 0.66);
    final wordmarkOpacity = Curves.easeOut.transform(wordmarkAppear);
    final wordmarkSlide = 8.0 * (1.0 - Curves.easeOutCubic.transform(wordmarkAppear));

    // Act 4: Tagline (0.62 – 0.76)
    final taglineAppear = _interval(progress, 0.62, 0.76);
    final taglineOpacity = Curves.easeOut.transform(taglineAppear);
    final taglineSlide = 6.0 * (1.0 - Curves.easeOutCubic.transform(taglineAppear));

    // Act 4: Confirmation pulse (0.72 – 0.82)
    final pulseAppear = _interval(progress, 0.72, 0.82);

    // Act 5: Gentle scale-up of entire brand group during exit
    final exitProgress = _interval(progress, 0.83, 1.0);
    final exitScale = 1.0 + (0.03 * Curves.easeInCubic.transform(exitProgress));

    return Center(
      child: Transform.scale(
        scale: exitScale,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Confirmation pulse ring (behind emblem)
              Stack(
                alignment: Alignment.center,
                children: [
                  if (pulseAppear > 0.0)
                    _ConfirmationPulse(progress: pulseAppear),
                  _LogoEmblem(
                    opacity: emblemOpacity,
                    scale: emblemScale,
                  ),
                ],
              ),
              const SizedBox(height: 18),
              // Wordmark
              Opacity(
                opacity: wordmarkOpacity.clamp(0.0, 1.0),
                child: Transform.translate(
                  offset: Offset(0, wordmarkSlide),
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      'Nagrik',
                      style: context.textTheme.displayMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -0.5,
                        height: 1.1,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 6),
              // Tracked Sub-Wordmark
              Opacity(
                opacity: wordmarkOpacity.clamp(0.0, 1.0),
                child: Text(
                  'N A G R I K',
                  style: context.textTheme.labelMedium?.copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 6.0,
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              // Tagline
              Opacity(
                opacity: taglineOpacity.clamp(0.0, 1.0),
                child: Transform.translate(
                  offset: Offset(0, taglineSlide),
                  child: Text(
                    tagline,
                    style: context.textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withValues(alpha: 0.85),
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.3,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// CONFIRMATION PULSE (Act 4)
// ---------------------------------------------------------------------------

class _ConfirmationPulse extends StatelessWidget {
  const _ConfirmationPulse({required this.progress});

  final double progress;

  @override
  Widget build(BuildContext context) {
    final scale = 1.0 + (0.6 * Curves.easeOut.transform(progress));
    final opacity = (1.0 - Curves.easeInCubic.transform(progress)) * 0.35;

    return Opacity(
      opacity: opacity.clamp(0.0, 1.0),
      child: Transform.scale(
        scale: scale,
        child: Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: NagrikBrandColors.sapphireGlow,
              width: 1.5,
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// SIGNAL FIELD PAINTER (Acts 1–2)
// ---------------------------------------------------------------------------

/// Custom painter for the hyperlocal signal field animation:
/// - Act 1 (0–0.20): A central point of light breathes to life.
/// - Act 2 (0.13–0.40): Concentric signal rings propagate outward.
/// - Editorial line fragments drift near the rings (0.20–0.38).
/// - The entire field fades out as the brand reveal takes over (0.38–0.55).
class _SignalFieldPainter extends CustomPainter {
  const _SignalFieldPainter({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    // ----- Global fade-out (signal field dissolves as brand reveals) -----
    final fadeOut = _interval(progress, 0.40, 0.58);
    final globalAlpha = 1.0 - Curves.easeInCubic.transform(fadeOut);
    if (globalAlpha <= 0.01) return;

    // ----- Act 1: Origin glow -----
    final originAppear = _interval(progress, 0.0, 0.15);
    final originBreath = math.sin(progress * math.pi * 3.5);
    final originRadius = 4.0 + (12.0 * Curves.easeOutCubic.transform(originAppear));
    final originAlpha = (0.5 + 0.3 * originBreath) *
        Curves.easeOutCubic.transform(originAppear) *
        globalAlpha;

    if (originAlpha > 0.01) {
      final originPaint = Paint()
        ..shader = RadialGradient(
          colors: [
            NagrikBrandColors.sapphireGlow.withValues(alpha: originAlpha),
            NagrikBrandColors.sapphireGlow.withValues(alpha: originAlpha * 0.3),
            Colors.transparent,
          ],
          stops: const [0.0, 0.5, 1.0],
        ).createShader(
          Rect.fromCircle(center: center, radius: originRadius * 3),
        );
      canvas.drawCircle(center, originRadius * 3, originPaint);

      // Solid core dot
      final corePaint = Paint()
        ..color = NagrikBrandColors.sapphireGlow.withValues(
          alpha: (originAlpha * 1.2).clamp(0.0, 1.0),
        )
        ..style = PaintingStyle.fill;
      canvas.drawCircle(center, originRadius * 0.35, corePaint);
    }

    // ----- Act 2: Signal rings -----
    const ringCount = 3;
    for (int i = 0; i < ringCount; i++) {
      final ringDelay = 0.10 + (i * 0.07);
      final ringProgress = _interval(progress, ringDelay, ringDelay + 0.28);
      if (ringProgress <= 0.0) continue;

      final maxDim = math.max(size.width, size.height);
      final maxRadius = maxDim * 0.38;
      final ringRadius = maxRadius * Curves.easeOutCubic.transform(ringProgress);

      // Rings fade in then out
      double ringAlpha;
      if (ringProgress < 0.3) {
        ringAlpha = ringProgress / 0.3;
      } else {
        ringAlpha = 1.0 - ((ringProgress - 0.3) / 0.7);
      }
      ringAlpha = (ringAlpha * 0.28 * globalAlpha).clamp(0.0, 1.0);

      if (ringAlpha > 0.01) {
        final ringPaint = Paint()
          ..color = NagrikBrandColors.sapphireGlow.withValues(alpha: ringAlpha)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2 - (i * 0.2);
        canvas.drawCircle(center, ringRadius, ringPaint);
      }
    }

    // ----- Act 2b: Editorial line fragments (subtle information cues) -----
    final linesAppear = _interval(progress, 0.22, 0.32);
    final linesFade = _interval(progress, 0.34, 0.44);
    final linesAlpha = (Curves.easeOut.transform(linesAppear) *
            (1.0 - Curves.easeIn.transform(linesFade)) *
            0.22 *
            globalAlpha)
        .clamp(0.0, 1.0);

    if (linesAlpha > 0.01) {
      final linePaint = Paint()
        ..color = Colors.white.withValues(alpha: linesAlpha)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.0
        ..strokeCap = StrokeCap.round;

      // Four short editorial lines arranged around center
      const lineOffsets = [
        _EditorialLine(dx: -60, dy: -35, length: 28, angle: 0),
        _EditorialLine(dx: 45, dy: -20, length: 22, angle: 0),
        _EditorialLine(dx: -50, dy: 30, length: 18, angle: 0),
        _EditorialLine(dx: 55, dy: 40, length: 24, angle: 0),
      ];

      final lineSlide = 6.0 * (1.0 - Curves.easeOutCubic.transform(linesAppear));

      for (final line in lineOffsets) {
        final start = Offset(
          center.dx + line.dx,
          center.dy + line.dy + lineSlide,
        );
        final end = Offset(
          start.dx + line.length * math.cos(line.angle),
          start.dy + line.length * math.sin(line.angle),
        );
        canvas.drawLine(start, end, linePaint);
      }

      // A tiny play-triangle (video cue) near bottom-right
      final playAlpha = linesAlpha * 0.8;
      if (playAlpha > 0.01) {
        final playPaint = Paint()
          ..color = Colors.white.withValues(alpha: playAlpha)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 0.8
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round;

        final playCenter = Offset(center.dx + 38, center.dy + 12 + lineSlide);
        const playSize = 6.0;
        final path = Path()
          ..moveTo(playCenter.dx - playSize * 0.4, playCenter.dy - playSize * 0.5)
          ..lineTo(playCenter.dx + playSize * 0.6, playCenter.dy)
          ..lineTo(playCenter.dx - playSize * 0.4, playCenter.dy + playSize * 0.5)
          ..close();
        canvas.drawPath(path, playPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _SignalFieldPainter old) =>
      old.progress != progress;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/// Normalized progress within [begin, end], clamped to [0, 1].
double _interval(double t, double begin, double end) {
  return ((t - begin) / (end - begin)).clamp(0.0, 1.0);
}

/// Metadata for an editorial line fragment in the signal field.
class _EditorialLine {
  const _EditorialLine({
    required this.dx,
    required this.dy,
    required this.length,
    required this.angle,
  });

  final double dx;
  final double dy;
  final double length;
  final double angle;
}
