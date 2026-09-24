import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/onboarding/presentation/splash_screen.dart';

void main() {
  Widget buildApp({VoidCallback? onInitialized}) {
    return ProviderScope(
      child: MaterialApp(
        theme: NagrikTheme.light(),
        darkTheme: NagrikTheme.dark(),
        home: SplashScreen(onInitialized: onInitialized),
      ),
    );
  }

  group('SplashScreen', () {
    testWidgets('renders logo, brand name, platform label, and tagline',
        (tester) async {
      await tester.pumpWidget(buildApp());
      // Advance past all reveal phases
      await tester.pump(const Duration(milliseconds: 2000));

      expect(find.text('nagrik.news'), findsOneWidget);
      expect(find.text('CITIZEN JOURNALISM PLATFORM'), findsOneWidget);
      expect(find.textContaining('Your City.'), findsOneWidget);
      expect(find.textContaining('Your News.'), findsOneWidget);

      await tester.pump(const Duration(milliseconds: 1500));
    });

    testWidgets('calls onInitialized after animation completes',
        (tester) async {
      var initialized = false;
      await tester
          .pumpWidget(buildApp(onInitialized: () => initialized = true));

      await tester.pump(const Duration(milliseconds: 3100));
      await tester.pump(const Duration(milliseconds: 100));

      expect(initialized, isTrue);
    });

    testWidgets('skip button fires onInitialized immediately', (tester) async {
      var initialized = false;
      await tester
          .pumpWidget(buildApp(onInitialized: () => initialized = true));
      await tester.pump(const Duration(milliseconds: 500));

      await tester.tap(find.text('Skip'));
      await tester.pump();

      expect(initialized, isTrue);
    });

    testWidgets('tap anywhere skips splash', (tester) async {
      var initialized = false;
      await tester
          .pumpWidget(buildApp(onInitialized: () => initialized = true));
      await tester.pump(const Duration(milliseconds: 500));

      // Tap the center of the screen (GestureDetector wraps everything)
      await tester.tapAt(const Offset(200, 400));
      await tester.pump();

      expect(initialized, isTrue);
    });
  });
}
