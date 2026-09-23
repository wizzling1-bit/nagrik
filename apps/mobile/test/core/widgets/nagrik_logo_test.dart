import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';

void main() {
  group('NagrikLogo Widget Tests', () {
    testWidgets('Renders icon variant without wordmark text', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikLogo(
                variant: NagrikLogoVariant.icon,
                size: NagrikLogoSize.md,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(NagrikLogoMark), findsOneWidget);
      expect(find.byType(CustomPaint), findsWidgets);
      expect(find.textContaining('nagrik'), findsNothing);
      expect(find.text('Citizen Journalism Platform'), findsNothing);
    });

    testWidgets('Renders horizontal variant with wordmark and subtitle',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikLogo(
                variant: NagrikLogoVariant.horizontal,
                size: NagrikLogoSize.md,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(NagrikLogoMark), findsOneWidget);
      expect(find.textContaining('nagrik'), findsOneWidget);
      expect(find.textContaining('.news'), findsOneWidget);
      expect(find.text('Citizen Journalism Platform'), findsOneWidget);

      // Verify horizontal arrangement
      expect(find.byType(Row), findsWidgets);
    });

    testWidgets('Renders full stacked variant with wordmark and subtitle',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikLogo(
                variant: NagrikLogoVariant.full,
                size: NagrikLogoSize.lg,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(NagrikLogoMark), findsOneWidget);
      expect(find.textContaining('nagrik'), findsOneWidget);
      expect(find.textContaining('.news'), findsOneWidget);
      expect(find.text('Citizen Journalism Platform'), findsOneWidget);

      // Verify column arrangement
      expect(find.byType(Column), findsWidgets);
    });

    testWidgets('hideSubtitle hides subtitle in horizontal and full variants',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikLogo.horizontal(
                hideSubtitle: true,
              ),
            ),
          ),
        ),
      );

      expect(find.textContaining('nagrik'), findsOneWidget);
      expect(find.text('Citizen Journalism Platform'), findsNothing);
    });

    testWidgets('Named constructors instantiate correct variants',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Column(
              children: [
                NagrikLogo.icon(key: ValueKey('icon_logo')),
                NagrikLogo.horizontal(key: ValueKey('horiz_logo')),
                NagrikLogo.full(key: ValueKey('full_logo')),
              ],
            ),
          ),
        ),
      );

      final iconLogo = tester.widget<NagrikLogo>(find.byKey(const ValueKey('icon_logo')));
      expect(iconLogo.variant, equals(NagrikLogoVariant.icon));

      final horizLogo =
          tester.widget<NagrikLogo>(find.byKey(const ValueKey('horiz_logo')));
      expect(horizLogo.variant, equals(NagrikLogoVariant.horizontal));

      final fullLogo = tester.widget<NagrikLogo>(find.byKey(const ValueKey('full_logo')));
      expect(fullLogo.variant, equals(NagrikLogoVariant.full));
    });

    testWidgets('Scales mark dimensions according to NagrikLogoSize',
        (tester) async {
      for (final size in NagrikLogoSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            theme: NagrikTheme.light(),
            home: Scaffold(
              body: Center(
                child: NagrikLogoMark(size: size),
              ),
            ),
          ),
        );

        final customPaint = tester.widget<CustomPaint>(
          find.descendant(
            of: find.byType(NagrikLogoMark),
            matching: find.byType(CustomPaint),
          ),
        );
        expect(customPaint.size, equals(size.markDimensions));
      }
    });

    testWidgets('Theme override adjusts wordmark color in dark mode',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikLogo(
                variant: NagrikLogoVariant.horizontal,
                theme: ThemeMode.dark,
              ),
            ),
          ),
        ),
      );

      final richTextFinder = find.descendant(
        of: find.byType(NagrikLogo),
        matching: find.byType(RichText),
      );
      expect(richTextFinder, findsWidgets);

      final titleRichText = tester.widget<RichText>(richTextFinder.first);
      expect(
        (titleRichText.text as TextSpan).style?.color,
        equals(const Color(0xFFFFFFFF)),
      );

      // Verify semantics header widget
      expect(
        find.byWidgetPredicate(
          (w) =>
              w is Semantics &&
              w.properties.label ==
                  'Nagrik.news - Citizen Journalism Platform',
        ),
        findsOneWidget,
      );
    });

    test('NagrikLogoMarkPainter paints to canvas without errors', () {
      const painter = NagrikLogoMarkPainter();
      final recorder = ui.PictureRecorder();
      final canvas = Canvas(recorder);

      // Normal paint
      painter.paint(canvas, const Size(100, 112));

      // Scaling paint
      painter.paint(canvas, const Size(30, 34));
      painter.paint(canvas, const Size(64, 72));

      // Zero-size edge case
      painter.paint(canvas, Size.zero);

      final picture = recorder.endRecording();
      expect(picture, isNotNull);
      expect(painter.shouldRepaint(const NagrikLogoMarkPainter()), isFalse);
    });
  });
}
