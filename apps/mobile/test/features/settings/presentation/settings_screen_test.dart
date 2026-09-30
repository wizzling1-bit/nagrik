import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/settings/presentation/settings_screen.dart';

void main() {
  group('SettingsScreen', () {
    testWidgets('renders consumer settings sections and preference controls',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 4000);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SettingsScreen(),
          ),
        ),
      );

      expect(find.text('Settings'), findsOneWidget);
      expect(find.text('LOCATION'), findsOneWidget);
      expect(find.text('PREFERENCES'), findsOneWidget);
      expect(find.text('ABOUT'), findsOneWidget);
      expect(find.text('Contact & Support Desk'), findsOneWidget);
      expect(find.text('Government Disclaimer'), findsOneWidget);
      expect(find.text('Information Sources Directory'), findsOneWidget);
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms of Service'), findsOneWidget);
      expect(find.text('APPLICATION'), findsOneWidget);
      expect(find.text('Exit Application'), findsOneWidget);
    });

    testWidgets('tapping Exit Application opens exit confirmation dialog',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 4000);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SettingsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('Exit Application'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Exit Application'));
      await tester.pumpAndSettle();

      expect(find.text('Exit Nagrik?'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);
      expect(find.text('Exit App'), findsOneWidget);
    });

    testWidgets('changing language in settings updates UI strings to selected language',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 4000);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SettingsScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Initial English
      expect(find.text('Settings'), findsOneWidget);
      expect(find.text('LOCATION'), findsOneWidget);
      expect(find.text('App Language'), findsOneWidget);

      // Tap Hindi directly on segmented switch
      await tester.tap(find.text('हिन्दी (Hindi)'));
      await tester.pumpAndSettle();

      // Verify Hindi strings appear across the settings screen
      expect(find.text('सेटिंग्स'), findsOneWidget);
      expect(find.text('स्थान'), findsOneWidget);
      expect(find.text('प्राथमिकताएं'), findsOneWidget);
      expect(find.text('के बारे में'), findsOneWidget);
      expect(find.text('गोपनीयता नीति'), findsOneWidget);
      expect(find.text('सेवा की शर्तें'), findsOneWidget);

      // Switch back to English directly on segmented switch
      await tester.tap(find.text('English'));
      await tester.pumpAndSettle();

      // Verify English strings appear across the settings screen
      expect(find.text('Settings'), findsOneWidget);
      expect(find.text('LOCATION'), findsOneWidget);
      expect(find.text('PREFERENCES'), findsOneWidget);
      expect(find.text('ABOUT'), findsOneWidget);
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms of Service'), findsOneWidget);
    });

    testWidgets('tapping Editorial & Public Policies opens policy sheet with canonical policies',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 4000);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SettingsScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Editorial & Public Policies'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Editorial & Public Policies'));
      await tester.pumpAndSettle();

      // Verify policy sheet opened
      expect(find.text('About Nagrik'), findsOneWidget);
      expect(find.text('Editorial Guidelines'), findsOneWidget);
      expect(find.text('Content Policy'), findsOneWidget);
      expect(find.text('Corrections Policy'), findsOneWidget);
    });
  });
}
