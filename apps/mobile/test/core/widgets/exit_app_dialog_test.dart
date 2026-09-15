import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/exit_app_dialog.dart';

void main() {
  group('ExitAppDialog Widget Tests', () {
    testWidgets('renders title, description, and action buttons in light mode', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () => showExitAppDialog(context),
                  child: const Text('Open Dialog'),
                );
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      expect(find.text('Exit Nagrik?'), findsOneWidget);
      expect(
        find.text('Are you sure you want to close and exit the application?'),
        findsOneWidget,
      );
      expect(find.text('Cancel'), findsOneWidget);
      expect(find.text('Exit App'), findsOneWidget);

      // Tapping Cancel dismisses the dialog
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      expect(find.text('Exit Nagrik?'), findsNothing);
    });

    testWidgets('renders properly in dark mode', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.dark(),
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () => showExitAppDialog(context),
                  child: const Text('Open Dialog'),
                );
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      expect(find.text('Exit Nagrik?'), findsOneWidget);
      expect(find.byIcon(Icons.power_settings_new_rounded), findsOneWidget);
    });
  });
}
