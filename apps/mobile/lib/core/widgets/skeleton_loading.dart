import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';

/// Scope that provides a single shared animation controller for all child [SkeletonBox] instances.
class SkeletonScope extends StatefulWidget {
  const SkeletonScope({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 1400),
  });

  final Widget child;
  final Duration duration;

  static Animation<double>? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<_SkeletonScopeInherited>()?.animation;
  }

  @override
  State<SkeletonScope> createState() => _SkeletonScopeState();
}

bool _isTestEnvironment() {
  return WidgetsBinding.instance.runtimeType
      .toString()
      .toLowerCase()
      .contains('test');
}

class _SkeletonScopeState extends State<SkeletonScope>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    if (!_isTestEnvironment()) {
      _controller.repeat(reverse: true);
    } else {
      _controller.value = 0.5;
    }
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _SkeletonScopeInherited(
      animation: _animation,
      child: widget.child,
    );
  }
}

class _SkeletonScopeInherited extends InheritedWidget {
  const _SkeletonScopeInherited({
    required this.animation,
    required super.child,
  });

  final Animation<double> animation;

  @override
  bool updateShouldNotify(_SkeletonScopeInherited oldWidget) {
    return animation != oldWidget.animation;
  }
}

/// A content-shaped tonal skeleton placeholder.
///
/// Smoothly breathes between muted and elevated tonal levels without harsh shimmer.
class SkeletonBox extends StatefulWidget {
  const SkeletonBox({
    super.key,
    this.width,
    this.height,
    this.borderRadius,
    this.shape = BoxShape.rectangle,
  });

  final double? width;
  final double? height;
  final double? borderRadius;
  final BoxShape shape;

  @override
  State<SkeletonBox> createState() => _SkeletonBoxState();
}

class _SkeletonBoxState extends State<SkeletonBox>
    with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  Animation<double>? _animation;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final scopeAnimation = SkeletonScope.of(context);
    if (scopeAnimation == null && _controller == null) {
      _controller = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 1400),
      );
      if (!_isTestEnvironment()) {
        _controller!.repeat(reverse: true);
      } else {
        _controller!.value = 0.5;
      }
      _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _controller!, curve: Curves.easeInOut),
      );
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scopeAnimation = SkeletonScope.of(context);
    final animation = scopeAnimation ?? _animation;
    final isDark = context.isDarkMode;

    final colorStart = isDark
        ? context.nagrikTheme.level4Muted
        : context.nagrikTheme.surfaceMuted;
    final colorEnd = isDark
        ? context.nagrikTheme.level2Elevated
        : context.nagrikTheme.surfaceInteractive;

    final radius = widget.borderRadius ?? NagrikRadii.sm;

    Widget buildBox(double progress) {
      final color = Color.lerp(colorStart, colorEnd, progress) ?? colorStart;

      return Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: color,
          shape: widget.shape,
          borderRadius: widget.shape == BoxShape.circle
              ? null
              : BorderRadius.circular(radius),
        ),
      );
    }

    if (animation != null) {
      return AnimatedBuilder(
        animation: animation,
        builder: (context, child) => buildBox(animation.value),
      );
    }

    return buildBox(0.0);
  }
}
