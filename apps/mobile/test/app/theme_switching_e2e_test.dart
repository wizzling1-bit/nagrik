import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/app/app.dart';
import 'package:nagrik/core/theme/theme_provider.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  group('Theme Switching End-to-End Tests', () {
    testWidgets('App renders seamlessly and switches between Light and Dark themes',
        (tester) async {
      final container = ProviderContainer(
        overrides: [
          hasCompletedOnboardingProvider.overrideWithValue(true),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const NagrikApp(),
        ),
      );

      await tester.pumpAndSettle();

      // Verify Home Screen loaded with Brand Wordmark
      expect(find.text('Nagrik'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);

      // Verify default System theme mode
      expect(container.read(themeModeProvider), ThemeMode.system);

      // Switch to Dark mode
      container.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
      await tester.pumpAndSettle();
      expect(container.read(themeModeProvider), ThemeMode.dark);

      // Switch to Light mode
      container.read(themeModeProvider.notifier).setThemeMode(ThemeMode.light);
      await tester.pumpAndSettle();
      expect(container.read(themeModeProvider), ThemeMode.light);
    });
  });
}
