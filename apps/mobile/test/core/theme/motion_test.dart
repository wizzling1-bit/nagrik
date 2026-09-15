import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/motion.dart';

void main() {
  group('NagrikMotion', () {
    test('standard duration tokens are configured properly', () {
      expect(NagrikMotion.durationInstant, const Duration(milliseconds: 100));
      expect(NagrikMotion.durationFast, const Duration(milliseconds: 160));
      expect(NagrikMotion.durationStandard, const Duration(milliseconds: 220));
      expect(NagrikMotion.durationMedium, const Duration(milliseconds: 280));
      expect(NagrikMotion.durationEmphasis, const Duration(milliseconds: 300));
      expect(NagrikMotion.durationSlow, const Duration(milliseconds: 400));
    });

    test('curves are configured', () {
      expect(NagrikMotion.curveStandard, Curves.easeOutCubic);
      expect(NagrikMotion.curveEmphasized, Curves.easeInOutCubic);
    });

    testWidgets('NagrikPressable responds to tap gesture', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NagrikPressable(
              onTap: () => tapped = true,
              child: const Text('Press Me'),
            ),
          ),
        ),
      );

      expect(find.text('Press Me'), findsOneWidget);
      await tester.tap(find.text('Press Me'));
      await tester.pumpAndSettle();
      expect(tapped, isTrue);
    });

    testWidgets('NagrikFadeIn animates in smoothly', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: NagrikFadeIn(
              child: Text('Fade Content'),
            ),
          ),
        ),
      );

      expect(find.text('Fade Content'), findsOneWidget);
      await tester.pump(const Duration(milliseconds: 100));
      await tester.pumpAndSettle();
      expect(find.text('Fade Content'), findsOneWidget);
    });
  });
}
