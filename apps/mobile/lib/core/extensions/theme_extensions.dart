import 'package:flutter/material.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';

/// Convenient context extensions for quick theme and token access.
///
/// Usage:
/// ```dart
/// context.colorScheme.primary
/// context.textTheme.bodyMedium
/// context.nagrikTheme.level1Surface
/// context.isDarkMode
/// ```
extension ThemeContextExtensions on BuildContext {
  /// The current [ColorScheme].
  ColorScheme get colorScheme => Theme.of(this).colorScheme;

  /// The current [TextTheme].
  TextTheme get textTheme => Theme.of(this).textTheme;

  /// Nagrik-specific semantic design tokens.
  NagrikThemeExtension get nagrikTheme =>
      Theme.of(this).extension<NagrikThemeExtension>() ?? NagrikThemeExtension.light();

  /// Whether the current theme is dark mode.
  bool get isDarkMode => Theme.of(this).brightness == Brightness.dark;
}
