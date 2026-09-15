import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Provider for the app's [ThemeMode].
final themeModeProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>(ThemeModeNotifier.new);

class ThemeModeNotifier extends Notifier<ThemeMode> {
  static const _kThemePrefKey = 'nagrik_theme_mode_v1';
  static const _kThemePrefKeyLegacy = 'nagrik_theme_mode_pref';

  @override
  ThemeMode build() {
    _loadSavedTheme();
    return ThemeMode.system;
  }

  Future<void> _loadSavedTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      // Prefer name-based key (stable across enum reorder); fall back to
      // legacy index-based key for existing installs.
      final saved = prefs.getString(_kThemePrefKey) ??
          _legacyIndexToName(prefs.getInt(_kThemePrefKeyLegacy));
      final mode = _modeFromName(saved);
      if (mode != null && state != mode) {
        state = mode;
      }
    } catch (_) {}
  }

  /// Set the theme mode explicitly with optimistic UI update and async storage.
  void setThemeMode(ThemeMode mode) {
    state = mode;
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(_kThemePrefKey, mode.name);
      prefs.remove(_kThemePrefKeyLegacy);
    }).catchError((_) {});
  }

  /// Cycle through system → light → dark → system.
  void toggle() {
    final nextMode = switch (state) {
      ThemeMode.system => ThemeMode.light,
      ThemeMode.light => ThemeMode.dark,
      ThemeMode.dark => ThemeMode.system,
    };
    setThemeMode(nextMode);
  }
}

ThemeMode? _modeFromName(String? name) {
  if (name == null) return null;
  for (final m in ThemeMode.values) {
    if (m.name == name) return m;
  }
  return null;
}

String? _legacyIndexToName(int? index) {
  if (index == null) return null;
  // Legacy order of ThemeMode.values: system(0), light(1), dark(2).
  return switch (index) {
    0 => ThemeMode.system.name,
    1 => ThemeMode.light.name,
    2 => ThemeMode.dark.name,
    _ => null,
  };
}
