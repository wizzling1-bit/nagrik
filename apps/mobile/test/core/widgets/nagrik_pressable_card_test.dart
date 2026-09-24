import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/widgets/nagrik_pressable_card.dart';

void main() {
  testWidgets('NagrikPressableCard animates scale on tap', (tester) async {
    bool tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: NagrikPressableCard(
            onTap: () => tapped = true,
            child: const SizedBox(width: 100, height: 100),
          ),
        ),
      ),
    );

    expect(find.byType(NagrikPressableCard), findsOneWidget);
    await tester.tap(find.byType(NagrikPressableCard));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });
}
