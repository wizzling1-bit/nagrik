import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/utils/responsive.dart';

void main() {
  group('NagrikBreakpoints', () {
    test('phone max is 600', () {
      expect(NagrikBreakpoints.phone, 600.0);
    });

    test('tablet min is 600', () {
      expect(NagrikBreakpoints.tablet, 600.0);
    });

    test('expandedTablet min is 840', () {
      expect(NagrikBreakpoints.expandedTablet, 840.0);
    });
  });

  group('ResponsiveBuilder', () {
    testWidgets('renders phone builder for narrow width', (tester) async {
      tester.view.physicalSize = const Size(360, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        MaterialApp(
          home: ResponsiveBuilder(
            phone: (context) => const Text('phone'),
            tablet: (context) => const Text('tablet'),
          ),
        ),
      );

      expect(find.text('phone'), findsOneWidget);
      expect(find.text('tablet'), findsNothing);
    });

    testWidgets('renders tablet builder for wide width', (tester) async {
      tester.view.physicalSize = const Size(800, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        MaterialApp(
          home: ResponsiveBuilder(
            phone: (context) => const Text('phone'),
            tablet: (context) => const Text('tablet'),
          ),
        ),
      );

      expect(find.text('tablet'), findsOneWidget);
      expect(find.text('phone'), findsNothing);
    });
  });
}
