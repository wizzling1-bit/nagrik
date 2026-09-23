import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/app/router.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  group('Nagrik Router & Shell Navigation Tests', () {
    testWidgets('Renders bottom navigation bar with all 4 destinations when onboarding is completed', (tester) async {
      final container = ProviderContainer(
        overrides: [
          hasCompletedOnboardingProvider.overrideWithValue(true),
        ],
      );
      addTearDown(container.dispose);

      final router = container.read(routerProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp.router(
            theme: NagrikTheme.light(),
            darkTheme: NagrikTheme.dark(),
            routerConfig: router,
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Search'), findsOneWidget);
      expect(find.text('Saved'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);

      // Verify HomeScreen content is visible and has positive height
      final homeAppBarFinder = find.byType(NagrikLogo);
      expect(homeAppBarFinder, findsOneWidget);
      final rect = tester.getRect(homeAppBarFinder);
      expect(rect.width, greaterThan(0));
      expect(rect.height, greaterThan(0));
      expect(rect.top, greaterThanOrEqualTo(0));

      // Verify NavigationBar is anchored at the bottom and does not take full screen height
      final navBarFinder = find.byType(NavigationBar);
      expect(navBarFinder, findsOneWidget);
      final navBarRect = tester.getRect(navBarFinder);
      expect(navBarRect.height, inInclusiveRange(50.0, 80.0));
      expect(navBarRect.bottom, equals(600.0));
      expect(navBarRect.top, greaterThan(500.0));

      // Verify NavigationBarTheme uses brand orange indicator
      final themeFinder = find.byType(NavigationBarTheme);
      expect(themeFinder, findsOneWidget);
      final navBarTheme = tester.widget<NavigationBarTheme>(themeFinder);
      expect(
        navBarTheme.data.indicatorColor,
        const Color(0xFFDE5227).withValues(alpha: 0.12),
      );
    });

    testWidgets('Renders docked navigation bar in dark mode with dark border and indicator', (tester) async {
      final container = ProviderContainer(
        overrides: [
          hasCompletedOnboardingProvider.overrideWithValue(true),
        ],
      );
      addTearDown(container.dispose);

      final router = container.read(routerProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp.router(
            theme: NagrikTheme.dark(),
            routerConfig: router,
          ),
        ),
      );

      await tester.pumpAndSettle();

      final themeFinder = find.byType(NavigationBarTheme);
      expect(themeFinder, findsOneWidget);
      final navBarTheme = tester.widget<NavigationBarTheme>(themeFinder);
      expect(
        navBarTheme.data.indicatorColor,
        const Color(0xFFDE5227).withValues(alpha: 0.22),
      );
    });

    testWidgets('Tapping Search and Saved navigates between tabs smoothly', (tester) async {
      final container = ProviderContainer(
        overrides: [
          hasCompletedOnboardingProvider.overrideWithValue(true),
        ],
      );
      addTearDown(container.dispose);

      final router = container.read(routerProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp.router(
            theme: NagrikTheme.light(),
            routerConfig: router,
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap Search
      await tester.tap(find.text('Search'));
      await tester.pumpAndSettle();

      final navBar = tester.widget<NavigationBar>(find.byType(NavigationBar));
      expect(navBar.selectedIndex, 1);

      // Tap Saved
      await tester.tap(find.text('Saved'));
      await tester.pumpAndSettle();

      final navBar2 = tester.widget<NavigationBar>(find.byType(NavigationBar));
      expect(navBar2.selectedIndex, 2);
    });
  });
}
