import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/app/app.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  group('NagrikApp', () {
    testWidgets('renders MaterialApp and launches to Home screen when onboarding is completed', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            hasCompletedOnboardingProvider.overrideWithValue(true),
          ],
          child: const NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Should show home screen
      expect(find.text('LATEST NEAR YOU'), findsOneWidget);
    });

    testWidgets('respects dark theme mode configuration', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            hasCompletedOnboardingProvider.overrideWithValue(true),
          ],
          child: const NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      final materialApp = tester.widget<MaterialApp>(
        find.byType(MaterialApp),
      );
      expect(materialApp.theme, isNotNull);
      expect(materialApp.darkTheme, isNotNull);
    });
  });
}
