import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/screens/videos_screen.dart';

void main() {
  testWidgets('VideosScreen mounts cleanly and handles state without errors', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VideosScreen(),
          ),
        ),
      ),
    );

    expect(find.byType(VideosScreen), findsOneWidget);
  });
}
