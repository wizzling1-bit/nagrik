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
    testWidgets('renders brand emblem, English wordmark, sub-wordmark, and tagline', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('Nagrik'), findsOneWidget);
      expect(find.text('N A G R I K'), findsOneWidget);
      expect(find.text('Your city. Your updates.'), findsOneWidget);

      await tester.pump(const Duration(milliseconds: 2000));
      await tester.pump(const Duration(milliseconds: 200));
    });

    testWidgets('calls onInitialized after animation completes', (tester) async {
      var initialized = false;
      await tester.pumpWidget(buildApp(onInitialized: () => initialized = true));

      await tester.pump(const Duration(milliseconds: 3100));
      await tester.pump(const Duration(milliseconds: 100));

      expect(initialized, isTrue);
    });
  });
}

