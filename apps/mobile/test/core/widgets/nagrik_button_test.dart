import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';

void main() {
  group('NagrikButton Widget Tests', () {
    testWidgets('Renders label and triggers callback on tap', (tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Continue',
                onPressed: () => pressed = true,
              ),
            ),
          ),
        ),
      );

      expect(find.text('Continue'), findsOneWidget);
      await tester.tap(find.byType(NagrikButton));
      await tester.pumpAndSettle();

      expect(pressed, isTrue);
    });

    testWidgets('Loading state displays progress indicator', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.dark(),
          home: Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Submit',
                onPressed: () {},
                isLoading: true,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Submit'), findsNothing);
    });

    testWidgets('Meets minimum touch target height >= 44dp', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Action',
                onPressed: () {},
              ),
            ),
          ),
        ),
      );

      final buttonSize = tester.getSize(find.byType(NagrikButton));
      expect(buttonSize.height, greaterThanOrEqualTo(44.0));
    });
  });
}
