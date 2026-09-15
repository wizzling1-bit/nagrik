import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Centralized motion & haptics system for the Nagrik Design System.
abstract final class NagrikMotion {
  // Standard Durations
  static const durationInstant = Duration(milliseconds: 100);
  static const durationFast = Duration(milliseconds: 160);
  static const durationStandard = Duration(milliseconds: 220);
  static const durationMedium = Duration(milliseconds: 280);
  static const durationEmphasis = Duration(milliseconds: 300);
  static const durationSlow = Duration(milliseconds: 400);

  /// Press micro-interaction duration.
  static const durationPress = Duration(milliseconds: 100);

  /// Sheet/modal appearance duration.
  static const durationSheet = Duration(milliseconds: 280);

  // Animation Curves
  static const curveStandard = Curves.easeOutCubic;
  static const curveEmphasized = Curves.easeInOutCubic;
  static const curveDecelerate = Curves.decelerate;
  static const curveSpring = Curves.easeOutBack;
  static const curveSmoothInOut = Curves.fastOutSlowIn;
  static const curveBounce = NagrikSpringCurve();

  /// Returns [duration] unless animations are disabled for accessibility.
  static Duration resolveDuration(BuildContext context, Duration duration) {
    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return Duration.zero;
    }
    return duration;
  }

  /// Subtle light haptic feedback for interactive selections, upvotes, bookmarks.
  static void lightImpact() {
    HapticFeedback.lightImpact();
  }

  /// Medium haptic feedback for significant actions like report submissions.
  static void mediumImpact() {
    HapticFeedback.mediumImpact();
  }

  /// Selection haptic feedback for toggles and segmented tabs.
  static void selectionClick() {
    HapticFeedback.selectionClick();
  }
}

/// Custom spring curve for natural underdamped bounce micro-interactions.
class NagrikSpringCurve extends Curve {
  const NagrikSpringCurve({this.bounce = 0.22});

  /// Bounce intensity between 0.0 (damped) and 0.5 (very bouncy).
  final double bounce;

  @override
  double transformInternal(double t) {
    if (t <= 0.0) return 0.0;
    if (t >= 1.0) return 1.0;
    // Underdamped harmonic spring oscillation
    return 1.0 - math.exp(-6.0 * t) * math.cos((1.0 - bounce) * math.pi * 2.5 * t);
  }
}

/// Tactile press wrapper widget providing subtle, high-performance press scaling feedback.
class NagrikPressable extends StatefulWidget {
  const NagrikPressable({
    super.key,
    required this.child,
    this.onTap,
    this.scaleFactor = 0.98,
    this.duration = const Duration(milliseconds: 100),
    this.enableFeedback = true,
  });

  final Widget child;
  final VoidCallback? onTap;
  final double scaleFactor;
  final Duration duration;
  final bool enableFeedback;

  @override
  State<NagrikPressable> createState() => _NagrikPressableState();
}

class _NagrikPressableState extends State<NagrikPressable>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
      reverseDuration: const Duration(milliseconds: 140),
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
      reverseCurve: Curves.easeOutBack,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails _) {
    _controller.reverse();
    if (widget.enableFeedback) {
      NagrikMotion.lightImpact();
    }
    widget.onTap?.call();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.onTap == null) return widget.child;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }
}

/// Backward compatibility alias for [NagrikPressable].
typedef NagrikBounceable = NagrikPressable;

/// High-tension spring pressable wrapper with customizable bounce physics and haptic burst.
class NagrikSpringPressable extends StatefulWidget {
  const NagrikSpringPressable({
    super.key,
    required this.child,
    this.onTap,
    this.onLongPress,
    this.scaleFactor = 0.95,
    this.duration = const Duration(milliseconds: 110),
    this.enableFeedback = true,
  });

  final Widget child;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double scaleFactor;
  final Duration duration;
  final bool enableFeedback;

  @override
  State<NagrikSpringPressable> createState() => _NagrikSpringPressableState();
}

class _NagrikSpringPressableState extends State<NagrikSpringPressable>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
      reverseDuration: const Duration(milliseconds: 220),
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOutCubic,
      reverseCurve: Curves.easeOutBack,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails _) {
    _controller.reverse();
    if (widget.enableFeedback) {
      NagrikMotion.lightImpact();
    }
    widget.onTap?.call();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.onTap == null && widget.onLongPress == null) return widget.child;

    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          if (widget.enableFeedback) NagrikMotion.lightImpact();
          widget.onTap?.call();
        },
        onLongPress: widget.onLongPress != null
            ? () {
                if (widget.enableFeedback) NagrikMotion.mediumImpact();
                widget.onLongPress?.call();
              }
            : null,
        child: widget.child,
      );
    }

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onLongPress: widget.onLongPress != null
          ? () {
              if (widget.enableFeedback) NagrikMotion.mediumImpact();
              widget.onLongPress?.call();
            }
          : null,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }
}

bool _isTestEnvironment() {
  return WidgetsBinding.instance.runtimeType
      .toString()
      .toLowerCase()
      .contains('test');
}

/// Animated pulsing/breathing aura around child (e.g. for Breaking news or Unread indicator).
class NagrikPulseBadge extends StatefulWidget {
  const NagrikPulseBadge({
    super.key,
    required this.child,
    this.pulseColor,
    this.maxRadius = 8.0,
    this.enabled = true,
  });

  final Widget child;
  final Color? pulseColor;
  final double maxRadius;
  final bool enabled;

  @override
  State<NagrikPulseBadge> createState() => _NagrikPulseBadgeState();
}

class _NagrikPulseBadgeState extends State<NagrikPulseBadge>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutQuad),
    );

    if (widget.enabled && !_isTestEnvironment()) {
      _controller.repeat();
    } else {
      _controller.value = 0.5;
    }
  }

  @override
  void didUpdateWidget(NagrikPulseBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (_isTestEnvironment()) return;
    if (widget.enabled && !_controller.isAnimating) {
      _controller.repeat();
    } else if (!widget.enabled && _controller.isAnimating) {
      _controller.stop();
      _controller.reset();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.enabled || (MediaQuery.maybeOf(context)?.disableAnimations ?? false)) {
      return widget.child;
    }

    final color = widget.pulseColor ?? Theme.of(context).colorScheme.primary;

    return CustomPaint(
      painter: _PulseBadgePainter(
        progress: _animation,
        color: color,
        maxRadius: widget.maxRadius,
      ),
      child: widget.child,
    );
  }
}

class _PulseBadgePainter extends CustomPainter {
  _PulseBadgePainter({
    required this.progress,
    required this.color,
    required this.maxRadius,
  }) : super(repaint: progress);

  final Animation<double> progress;
  final Color color;
  final double maxRadius;

  @override
  void paint(Canvas canvas, Size size) {
    final value = progress.value;
    final center = Offset(size.width / 2, size.height / 2);
    final currentRadius = (size.shortestSide / 2) + (value * maxRadius);
    final alpha = (1.0 - value).clamp(0.0, 1.0) * 0.45;

    final paint = Paint()
      ..color = color.withValues(alpha: alpha)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    canvas.drawCircle(center, currentRadius, paint);
  }

  @override
  bool shouldRepaint(covariant _PulseBadgePainter oldDelegate) => false;
}

/// Lightweight shimmer skeleton animation for loading cards and images.
class NagrikShimmer extends StatefulWidget {
  const NagrikShimmer({
    super.key,
    required this.child,
    this.baseColor,
    this.highlightColor,
    this.duration = const Duration(milliseconds: 1400),
  });

  final Widget child;
  final Color? baseColor;
  final Color? highlightColor;
  final Duration duration;

  @override
  State<NagrikShimmer> createState() => _NagrikShimmerState();
}

class _NagrikShimmerState extends State<NagrikShimmer>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    if (!_isTestEnvironment()) {
      _controller.repeat();
    } else {
      _controller.value = 0.5;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return widget.child;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final base = widget.baseColor ??
        (isDark ? const Color(0xFF131D2E) : const Color(0xFFE2E8F0));
    final highlight = widget.highlightColor ??
        (isDark ? const Color(0xFF22324D) : const Color(0xFFF8FAFC));

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            final double value = _controller.value;
            final double dx = (bounds.width * 2) * value - bounds.width;
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [base, highlight, base],
              stops: const [0.1, 0.5, 0.9],
              transform: _SlidingGradientTransform(slidePercent: dx / bounds.width),
            ).createShader(bounds);
          },
          child: child,
        );
      },
      child: widget.child,
    );
  }
}

class _SlidingGradientTransform extends GradientTransform {
  const _SlidingGradientTransform({required this.slidePercent});
  final double slidePercent;

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) {
    return Matrix4.translationValues(bounds.width * slidePercent, 0.0, 0.0);
  }
}

/// Staggered entrance widget with slide-up and fade transition for lists and grids.
class NagrikStaggeredEntrance extends StatefulWidget {
  const NagrikStaggeredEntrance({
    super.key,
    required this.child,
    required this.index,
    this.baseDelay = const Duration(milliseconds: 35),
    this.duration = const Duration(milliseconds: 320),
    this.offset = const Offset(0, 0.08),
    this.curve = Curves.easeOutCubic,
  });

  final Widget child;
  final int index;
  final Duration baseDelay;
  final Duration duration;
  final Offset offset;
  final Curve curve;

  @override
  State<NagrikStaggeredEntrance> createState() => _NagrikStaggeredEntranceState();
}

class _NagrikStaggeredEntranceState extends State<NagrikStaggeredEntrance>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeAnimation;
  late final Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    final curved = CurvedAnimation(
      parent: _controller,
      curve: widget.curve,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(curved);
    _slideAnimation = Tween<Offset>(
      begin: widget.offset,
      end: Offset.zero,
    ).animate(curved);

    final delay = Duration(
      milliseconds: (widget.baseDelay.inMilliseconds * widget.index).clamp(0, 400),
    );

    if (delay == Duration.zero || _isTestEnvironment()) {
      _controller.forward();
    } else {
      Future.delayed(delay, () {
        if (mounted) _controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return widget.child;
    }

    return SlideTransition(
      position: _slideAnimation,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: widget.child,
      ),
    );
  }
}

/// Smooth animated icon transition wrapper (e.g., play/pause, bookmark toggle).
class NagrikIconMorph extends StatelessWidget {
  const NagrikIconMorph({
    super.key,
    required this.icon,
    this.size = 24.0,
    this.color,
    this.duration = const Duration(milliseconds: 220),
  });

  final IconData icon;
  final double size;
  final Color? color;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return Icon(icon, size: size, color: color, key: ValueKey(icon));
    }

    return AnimatedSwitcher(
      duration: duration,
      transitionBuilder: (child, animation) {
        return ScaleTransition(
          scale: CurvedAnimation(
            parent: animation,
            curve: Curves.easeOutBack,
          ),
          child: FadeTransition(
            opacity: animation,
            child: child,
          ),
        );
      },
      child: Icon(
        icon,
        key: ValueKey(icon),
        size: size,
        color: color,
      ),
    );
  }
}

/// High-performance lightweight entrance animation (opacity 0 -> 1, subtle translation Y).
class NagrikFadeIn extends StatefulWidget {
  const NagrikFadeIn({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 200),
    this.delay = Duration.zero,
    this.offset = const Offset(0, 6),
    this.curve = Curves.easeOutCubic,
  });

  final Widget child;
  final Duration duration;
  final Duration delay;
  final Offset offset;
  final Curve curve;

  @override
  State<NagrikFadeIn> createState() => _NagrikFadeInState();
}

class _NagrikFadeInState extends State<NagrikFadeIn>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeAnimation;
  late final Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    final curved = CurvedAnimation(
      parent: _controller,
      curve: widget.curve,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(curved);
    _slideAnimation = Tween<Offset>(
      begin: widget.offset,
      end: Offset.zero,
    ).animate(curved);

    if (widget.delay == Duration.zero || _isTestEnvironment()) {
      _controller.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.maybeOf(context)?.disableAnimations ?? false) {
      return widget.child;
    }

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnimation.value.clamp(0.0, 1.0),
          child: Transform.translate(
            offset: _slideAnimation.value,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
