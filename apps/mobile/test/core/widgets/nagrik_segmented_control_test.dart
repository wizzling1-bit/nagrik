import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_segmented_control.dart';

void main() {
  group('NagrikSegmentedControl', () {
    testWidgets('renders all segments and triggers selection on tap',
        (tester) async {
      var selectedValue = 'one';

      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: Scaffold(
            body: StatefulBuilder(
              builder: (context, setState) {
                return NagrikSegmentedControl<String>(
                  selected: selectedValue,
                  onSelected: (val) {
                    setState(() => selectedValue = val);
                  },
                  segments: const [
                    NagrikSegment(
                      value: 'one',
                      label: 'First Tab',
                      icon: Icons.star,
                    ),
                    NagrikSegment(
                      value: 'two',
                      label: 'Second Tab',
                      icon: Icons.favorite,
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      );

      expect(find.text('First Tab'), findsOneWidget);
      expect(find.text('Second Tab'), findsOneWidget);
      expect(find.byIcon(Icons.star), findsOneWidget);
      expect(find.byIcon(Icons.favorite), findsOneWidget);

      await tester.tap(find.text('Second Tab'));
      await tester.pumpAndSettle();

      expect(selectedValue, 'two');
    });
  });
}
