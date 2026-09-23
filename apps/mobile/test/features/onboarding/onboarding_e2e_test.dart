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
    'first time install shows unified single screen with language and location setup',
    (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Single screen renders language and location simultaneously
      expect(find.text('Choose Language'), findsOneWidget);
      expect(find.text('Your Location'), findsOneWidget);
      expect(find.text('English'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);

      // Verify no legacy multi-step page indicator exists
      expect(find.text('Step 1 of 3'), findsNothing);
    },
  );

  testWidgets(
    'tapping Hindi language pill switches selected language to Hindi on the same screen',
    (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: NagrikApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Tap Hindi pill
      final hindiPill = find.text('हिंदी');
      expect(hindiPill, findsOneWidget);
      await tester.tap(hindiPill);
      await tester.pumpAndSettle();

      // Verifies screen stays on onboarding without page transition
      expect(find.text('Get Started'), findsOneWidget);
    },
  );
}
