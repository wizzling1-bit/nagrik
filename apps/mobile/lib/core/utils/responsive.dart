import 'package:flutter/material.dart';

/// Centralized responsive breakpoints.
abstract final class NagrikBreakpoints {
  /// Phone max width. Below this is phone layout.
  static const double phone = 600.0;

  /// Tablet min width. At or above this is tablet layout.
  static const double tablet = 600.0;

  /// Expanded tablet min width. Used for two-column layouts.
  static const double expandedTablet = 840.0;

  /// Maximum content width on large screens.
  static const double maxContentWidth = 640.0;
}

/// Renders different widget trees based on screen width.
class ResponsiveBuilder extends StatelessWidget {
  const ResponsiveBuilder({
    super.key,
    required this.phone,
    required this.tablet,
  });

  final WidgetBuilder phone;
  final WidgetBuilder tablet;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= NagrikBreakpoints.tablet) {
          return tablet(context);
        }
        return phone(context);
      },
    );
  }
}
