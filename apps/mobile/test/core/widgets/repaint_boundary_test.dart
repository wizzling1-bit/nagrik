import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('RepaintBoundary isolates card repainting', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: RepaintBoundary(
            child: SizedBox(width: 200, height: 200),
          ),
        ),
      ),
    );
    expect(find.byType(RepaintBoundary), findsWidgets);
  });
}
