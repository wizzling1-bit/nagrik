import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/theme_provider.dart';

void main() {
  group('ThemeModeNotifier', () {
    test('defaults to system theme mode', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      expect(container.read(themeModeProvider), ThemeMode.system);
    });

    test('setThemeMode updates the state', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
      expect(container.read(themeModeProvider), ThemeMode.dark);
    });

    test('toggle cycles system -> light -> dark -> system', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      final notifier = container.read(themeModeProvider.notifier);

      // system -> light
      notifier.toggle();
      expect(container.read(themeModeProvider), ThemeMode.light);

      // light -> dark
      notifier.toggle();
      expect(container.read(themeModeProvider), ThemeMode.dark);

      // dark -> system
      notifier.toggle();
      expect(container.read(themeModeProvider), ThemeMode.system);
    });
  });
}
