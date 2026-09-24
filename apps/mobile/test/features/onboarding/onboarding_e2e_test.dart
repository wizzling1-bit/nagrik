import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/app/app.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  testWidgets(
    'app entry journey launches directly from Splash to Home Screen when onboarding is completed',
    (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            hasCompletedOnboardingProvider.overrideWithValue(true),
          ],
          child: const NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Directly lands on Home Feed with Brand Wordmark and NavigationBar
      expect(find.byType(NagrikLogo), findsOneWidget);
      expect(find.text('LATEST NEAR YOU'), findsOneWidget);
      expect(find.byType(NavigationBar), findsOneWidget);
    },
  );

  testWidgets(
    'first time install shows streamlined entry screen with location setup',
    (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Screen renders location setup with zero language distraction
      expect(find.text('Choose Language'), findsNothing);
      expect(find.text('Your Location'), findsOneWidget);
      expect(find.text('5KM WIRE'), findsOneWidget);
      expect(find.text('Use GPS'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);

      // Verify no legacy multi-step page indicator exists
      expect(find.text('Step 1 of 3'), findsNothing);
    },
  );

  testWidgets(
    'tapping quick pick city chip selects location on the entry screen',
    (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Tap Patna quick chip
      final patnaChip = find.text('Patna');
      expect(patnaChip, findsWidgets);
      await tester.ensureVisible(patnaChip.first);
      await tester.tap(patnaChip.first);
      await tester.pumpAndSettle();

      // Verifies screen updates and stays on onboarding without page transition
      expect(find.textContaining('Patna'), findsWidgets);
      expect(find.text('Get Started'), findsOneWidget);
    },
  );
}
