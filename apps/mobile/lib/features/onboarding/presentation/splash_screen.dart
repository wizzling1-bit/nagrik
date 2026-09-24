import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/ads/managers/app_open_ad_manager.dart';

/// Premium animated brand introduction (~3 s).
///
/// Five clean phases over a solid midnight-navy backdrop:
///
/// 1. **Background** (0.0–0.14)  — Deep navy with barely-visible editorial
///    contour lines drifting slowly, almost imperceptibly.
/// 2. **Logo Entrance** (0.10–0.36) — Nagrik logo fades in + scales 0.94→1.0.
/// 3. **Brand Name** (0.25–0.46) — `nagrik.news` slides in horizontally.
/// 4. **Platform Label** (0.36–0.57) — `CITIZEN JOURNALISM PLATFORM` fades in.
/// 5. **Tagline** (0.46–0.68) — `Your City. Your News.` fades in.
/// 6. **Hold + Exit** (0.68–1.0) — Brief hold, then fade to midnight.
///
/// The animation runs in parallel with app initialisation. Users can skip
/// at any time by tapping anywhere or pressing the Skip button.
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
      if (status == AnimationStatus.completed) _finish();
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
    const bgColor = Color(0xFF10141C);

    if (reduceMotion) {
      return GestureDetector(
        onTap: _skip,
        child: Scaffold(
          backgroundColor: bgColor,
          body: Semantics(
            label: 'Nagrik — Your City. Your News.',
            child: const Center(child: _StaticBrandIdentity()),
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
                  // Subtle editorial contour ambience
                  CustomPaint(
                    painter: _AmbiencePainter(progress: t),
                    size: Size.infinite,
                  ),

                  // Brand reveal
                  _BrandRevealLayer(progress: t),

                  // Exit overlay — seamless fade to midnight
                  if (t > 0.80)
                    Positioned.fill(
                      child: IgnorePointer(
                        child: ColoredBox(
                          color: bgColor.withValues(
                            alpha: _exitOpacity(t),
                          ),
                        ),
                      ),
                    ),

                  // Skip affordance
                  Positioned(
                    right: 12,
                    bottom: 24,
                    child: TextButton(
                      onPressed: _skip,
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white.withValues(alpha: 0.4),
                        minimumSize: const Size(48, 44),
                      ),
                      child: const Text('Skip'),
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

  /// Exit: ramps from 0 → 1 over the final 20% of the timeline.
  double _exitOpacity(double t) {
    return Curves.easeInCubic.transform(
      ((t - 0.80) / 0.20).clamp(0.0, 1.0),
    );
  }
}

// ---------------------------------------------------------------------------
// STATIC BRAND IDENTITY (reduced-motion fallback)
// ---------------------------------------------------------------------------

class _StaticBrandIdentity extends StatelessWidget {
  const _StaticBrandIdentity();

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const _LogoEmblem(opacity: 1.0, scale: 1.0),
          const SizedBox(height: 24),
          Text(
            'nagrik.news',
            style: tt.titleLarge?.copyWith(
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'CITIZEN JOURNALISM PLATFORM',
            style: tt.labelSmall?.copyWith(
              fontWeight: FontWeight.w600,
              letterSpacing: 2.5,
              color: Colors.white.withValues(alpha: 0.45),
              fontSize: 10,
            ),
          ),
          const SizedBox(height: 18),
          Text.rich(
            TextSpan(
              children: [
                TextSpan(
                  text: 'Your City. ',
                  style: tt.bodyMedium?.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                TextSpan(
                  text: 'Your News.',
                  style: tt.bodyMedium?.copyWith(
                    color: NagrikBrandColors.orangePrimary.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// LOGO EMBLEM
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
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Soft warm terracotta ambient backlight glow
            Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFFD96B43).withValues(alpha: 0.28),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFD96B43).withValues(alpha: 0.35),
                    blurRadius: 24,
                    offset: const Offset(0, 4),
                  ),
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.6),
                    blurRadius: 28,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(
                  'assets/images/nagrik_logo.png',
                  fit: BoxFit.cover,
                  filterQuality: FilterQuality.high,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// BRAND REVEAL LAYER
// ---------------------------------------------------------------------------

class _BrandRevealLayer extends StatelessWidget {
  const _BrandRevealLayer({required this.progress});

  final double progress;

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    // Phase 1: Logo entrance (0.10 – 0.36)
    final logoT = _interval(progress, 0.10, 0.36);
    final logoOpacity = Curves.easeOutCubic.transform(logoT);
    final logoScale = 0.94 + (0.06 * Curves.easeOutCubic.transform(logoT));

    // Phase 2: nagrik.news — horizontal slide + fade (0.25 – 0.46)
    final nameT = _interval(progress, 0.25, 0.46);
    final nameOpacity = Curves.easeOut.transform(nameT);
    final nameSlideX = 12.0 * (1.0 - Curves.easeOutCubic.transform(nameT));

    // Phase 3: CITIZEN JOURNALISM PLATFORM (0.36 – 0.57)
    final labelT = _interval(progress, 0.36, 0.57);
    final labelOpacity = Curves.easeOut.transform(labelT);

    // Phase 4: Your City. Your News. (0.46 – 0.68)
    final tagT = _interval(progress, 0.46, 0.68);
    final tagOpacity = Curves.easeOut.transform(tagT);
    final tagSlide = 5.0 * (1.0 - Curves.easeOutCubic.transform(tagT));

    // Exit: gentle scale-up
    final exitT = _interval(progress, 0.80, 1.0);
    final exitScale = 1.0 + (0.015 * Curves.easeInCubic.transform(exitT));

    return Center(
      child: Transform.scale(
        scale: exitScale,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Logo
              _LogoEmblem(opacity: logoOpacity, scale: logoScale),
              const SizedBox(height: 24),

              // nagrik.news — horizontal slide
              Opacity(
                opacity: nameOpacity.clamp(0.0, 1.0),
                child: Transform.translate(
                  offset: Offset(nameSlideX, 0),
                  child: Text(
                    'nagrik.news',
                    style: tt.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      letterSpacing: -0.3,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 6),

              // CITIZEN JOURNALISM PLATFORM
              Opacity(
                opacity: (labelOpacity * 0.45).clamp(0.0, 1.0),
                child: Text(
                  'CITIZEN JOURNALISM PLATFORM',
                  style: tt.labelSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    letterSpacing: 2.5,
                    color: Colors.white,
                    fontSize: 10,
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // Your City. Your News.
              Opacity(
                opacity: tagOpacity.clamp(0.0, 1.0),
                child: Transform.translate(
                  offset: Offset(0, tagSlide),
                  child: Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: 'Your City. ',
                          style: tt.bodyMedium?.copyWith(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        TextSpan(
                          text: 'Your News.',
                          style: tt.bodyMedium?.copyWith(
                            color: NagrikBrandColors.orangePrimary
                                .withValues(alpha: 0.9),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
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
// AMBIENCE PAINTER — barely-visible editorial contour lines
// ---------------------------------------------------------------------------

/// Paints 5 slow-drifting topographic/editorial contour lines at ~6% opacity.
/// Almost imperceptible movement — civic map geometry feel.
class _AmbiencePainter extends CustomPainter {
  const _AmbiencePainter({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    // Fade in gently over first 30%, hold, then fade with exit
    final fadeIn = _interval(progress, 0.0, 0.30);
    final fadeOut = _interval(progress, 0.75, 1.0);
    final alpha =
        (Curves.easeOut.transform(fadeIn) * (1.0 - Curves.easeIn.transform(fadeOut))) * 0.06;
    if (alpha < 0.005) return;

    final paint = Paint()
      ..color = Colors.white.withValues(alpha: alpha)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.6
      ..strokeCap = StrokeCap.round;

    final w = size.width;
    final h = size.height;

    // Very slow horizontal drift based on progress
    final drift = progress * 18.0;

    // 5 contour lines — gentle sine curves at different vertical positions
    for (int i = 0; i < 5; i++) {
      final yBase = h * (0.25 + i * 0.12);
      final amplitude = 8.0 + i * 3.0;
      final frequency = 0.008 + i * 0.002;
      final phase = i * 1.2 + drift;

      final path = Path();
      path.moveTo(-20, yBase + amplitude * math.sin(phase));
      for (double x = 0; x <= w + 20; x += 12) {
        final y = yBase + amplitude * math.sin(x * frequency + phase);
        path.lineTo(x, y);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _AmbiencePainter old) =>
      old.progress != progress;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/// Normalised progress within [begin, end], clamped to [0, 1].
double _interval(double t, double begin, double end) {
  return ((t - begin) / (end - begin)).clamp(0.0, 1.0);
}
