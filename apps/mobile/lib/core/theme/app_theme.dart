import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';
import 'package:nagrik/core/theme/typography.dart';

/// Builds complete, dedicated [ThemeData] for Light and Dark modes.
abstract final class NagrikTheme {
  /// Light Theme.
  static ThemeData light() {
    const colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: NagrikLightColors.brandPrimary,
      onPrimary: NagrikLightColors.textOnPrimary,
      secondary: NagrikLightColors.brandSecondary,
      onSecondary: NagrikLightColors.textOnPrimary,
      error: NagrikLightColors.error,
      onError: Colors.white,
      surface: NagrikLightColors.surface,
      onSurface: NagrikLightColors.textPrimary,
      surfaceContainerHighest: NagrikLightColors.surfaceMuted,
      outline: NagrikLightColors.border,
      outlineVariant: NagrikLightColors.divider,
    );

    final textTheme = NagrikTypography.textTheme(NagrikLightColors.textPrimary);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: NagrikLightColors.background,
      appBarTheme: AppBarTheme(
        backgroundColor: NagrikLightColors.surface,
        foregroundColor: NagrikLightColors.textPrimary,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        centerTitle: false,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
          systemNavigationBarColor: NagrikLightColors.surface,
          systemNavigationBarIconBrightness: Brightness.dark,
        ),
        titleTextStyle: textTheme.titleLarge,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: NagrikLightColors.surface,
        selectedItemColor: NagrikLightColors.brandPrimary,
        unselectedItemColor: NagrikLightColors.textTertiary,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: textTheme.labelSmall?.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: textTheme.labelSmall,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: NagrikLightColors.surface,
        elevation: 0,
        indicatorColor: NagrikLightColors.brandPrimary.withValues(alpha: 0.12),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        height: 64,
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(
              color: NagrikLightColors.brandPrimary,
              size: 24,
            );
          }
          return const IconThemeData(
            color: NagrikLightColors.textTertiary,
            size: 24,
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return textTheme.labelSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: NagrikLightColors.brandPrimary,
            );
          }
          return textTheme.labelSmall?.copyWith(
            color: NagrikLightColors.textTertiary,
          );
        }),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: NagrikLightColors.surfaceElevated,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSheet,
        ),
      ),
      cardTheme: CardThemeData(
        color: NagrikLightColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusCard,
          side: const BorderSide(color: NagrikLightColors.border, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      dividerTheme: const DividerThemeData(
        color: NagrikLightColors.divider,
        thickness: 1,
        space: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: NagrikLightColors.surfaceMuted,
        border: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikLightColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikLightColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(
            color: NagrikLightColors.brandPrimary,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikLightColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: NagrikLightColors.textTertiary,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: NagrikLightColors.surfaceMuted,
        selectedColor: NagrikLightColors.brandPrimary.withValues(alpha: 0.12),
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSm,
        ),
        side: BorderSide.none,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSm,
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: NagrikLightColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        showDragHandle: true,
      ),
      extensions: [NagrikThemeExtension.light()],
    );
  }

  /// Dark Theme (5-Level Tonal Hierarchy).
  static ThemeData dark() {
    const colorScheme = ColorScheme(
      brightness: Brightness.dark,
      primary: NagrikDarkColors.brandPrimary,
      onPrimary: NagrikDarkColors.textOnPrimary,
      secondary: NagrikDarkColors.brandBright,
      onSecondary: NagrikDarkColors.textOnPrimary,
      error: NagrikDarkColors.error,
      onError: Colors.white,
      surface: NagrikDarkColors.level1Surface,
      onSurface: NagrikDarkColors.textPrimary,
      surfaceContainerHighest: NagrikDarkColors.level4Muted,
      outline: NagrikDarkColors.border,
      outlineVariant: NagrikDarkColors.divider,
    );

    final textTheme = NagrikTypography.textTheme(NagrikDarkColors.textPrimary);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: NagrikDarkColors.level0Background,
      appBarTheme: AppBarTheme(
        backgroundColor: NagrikDarkColors.level1Surface,
        foregroundColor: NagrikDarkColors.textPrimary,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        centerTitle: false,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
          systemNavigationBarColor: NagrikDarkColors.level1Surface,
          systemNavigationBarIconBrightness: Brightness.light,
        ),
        titleTextStyle: textTheme.titleLarge,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: NagrikDarkColors.level1Surface,
        selectedItemColor: NagrikDarkColors.brandBright,
        unselectedItemColor: NagrikDarkColors.textTertiary,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: textTheme.labelSmall?.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: textTheme.labelSmall,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: NagrikDarkColors.level1Surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        indicatorColor: NagrikDarkColors.brandPrimary.withValues(alpha: 0.24),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        height: 64,
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(
              color: NagrikDarkColors.brandBright,
              size: 24,
            );
          }
          return const IconThemeData(
            color: NagrikDarkColors.textTertiary,
            size: 24,
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return textTheme.labelSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: NagrikDarkColors.brandBright,
            );
          }
          return textTheme.labelSmall?.copyWith(
            color: NagrikDarkColors.textTertiary,
          );
        }),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: NagrikDarkColors.level2Elevated,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSheet,
        ),
      ),
      cardTheme: CardThemeData(
        color: NagrikDarkColors.level1Surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusCard,
          side: const BorderSide(color: NagrikDarkColors.border, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      dividerTheme: const DividerThemeData(
        color: NagrikDarkColors.divider,
        thickness: 1,
        space: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: NagrikDarkColors.level4Muted,
        border: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikDarkColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikDarkColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(
            color: NagrikDarkColors.brandBright,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: NagrikRadii.borderRadiusMd,
          borderSide: const BorderSide(color: NagrikDarkColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: NagrikDarkColors.textTertiary,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: NagrikDarkColors.level4Muted,
        selectedColor: NagrikDarkColors.brandPrimary.withValues(alpha: 0.24),
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSm,
        ),
        side: BorderSide.none,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: NagrikRadii.borderRadiusSm,
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: NagrikDarkColors.level2Elevated,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        showDragHandle: true,
      ),
      extensions: [NagrikThemeExtension.dark()],
    );
  }
}
