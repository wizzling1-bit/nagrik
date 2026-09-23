import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/radii.dart';
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

    testWidgets('Meets minimum touch target height >= 44dp for all sizes',
        (tester) async {
      for (final size in NagrikButtonSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            theme: NagrikTheme.light(),
            home: Scaffold(
              body: Center(
                child: NagrikButton(
                  label: 'Action',
                  size: size,
                  onPressed: () {},
                ),
              ),
            ),
          ),
        );

        final buttonSize = tester.getSize(find.byType(NagrikButton));
        expect(buttonSize.height, greaterThanOrEqualTo(44.0));
      }
    });

    testWidgets('Renders all 4 visual hierarchy tiers', (tester) async {
      final variants = [
        NagrikButtonVariant.primary,
        NagrikButtonVariant.secondary,
        NagrikButtonVariant.tertiary,
        NagrikButtonVariant.ghost,
        NagrikButtonVariant.destructive,
      ];

      for (final variant in variants) {
        await tester.pumpWidget(
          MaterialApp(
            theme: NagrikTheme.light(),
            home: Scaffold(
              body: Center(
                child: NagrikButton(
                  label: variant.name,
                  variant: variant,
                  onPressed: () {},
                ),
              ),
            ),
          ),
        );

        expect(find.text(variant.name), findsOneWidget);
      }
    });

    testWidgets('Uses 12dp border radius (NagrikRadii.borderRadiusMd)',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Radius Check',
                onPressed: () {},
              ),
            ),
          ),
        ),
      );

      final material = tester.widget<Material>(
        find.descendant(
          of: find.byType(NagrikButton),
          matching: find.byType(Material),
        ),
      );
      expect(material.borderRadius, equals(NagrikRadii.borderRadiusMd));
    });

    testWidgets('Disabled button does not trigger callback', (tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Disabled',
                onPressed: null,
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.byType(NagrikButton));
      await tester.pumpAndSettle();

      expect(pressed, isFalse);
    });

    testWidgets('Tactile spring recoil scales to 0.97 on press',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: Center(
              child: NagrikButton(
                label: 'Spring Press',
                onPressed: () {},
              ),
            ),
          ),
        ),
      );

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(NagrikButton)),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 120));

      final animatedScale =
          tester.widget<AnimatedScale>(find.byType(AnimatedScale));
      expect(animatedScale.scale, equals(0.97));

      await gesture.up();
      await tester.pumpAndSettle();

      final releasedScale =
          tester.widget<AnimatedScale>(find.byType(AnimatedScale));
      expect(releasedScale.scale, equals(1.0));
    });
  });
}
