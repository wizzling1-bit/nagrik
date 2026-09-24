import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_ad_card.dart';

void main() {
  testWidgets('VerticalVideoAdCard renders SPONSORED badge and swipe indicator', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoAdCard(adIndex: 1),
          ),
        ),
      ),
    );

    expect(find.text('SPONSORED'), findsOneWidget);
    expect(find.text('Swipe up for next news story'), findsOneWidget);
  });
}
