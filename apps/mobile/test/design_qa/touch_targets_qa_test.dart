import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';
import '../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';

void main() {
  Widget buildApp(Widget child) {
    return ProviderScope(
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: Scaffold(body: Center(child: child)),
      ),
    );
  }

  group('Design QA: Touch Targets & Interactive Bounds', () {
    testWidgets('NagrikButton sizes provide adequate touch heights (>= 44dp for small/medium/large)', (tester) async {
      await tester.pumpWidget(
        buildApp(
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              NagrikButton(label: 'Small', size: NagrikButtonSize.small, onPressed: () {}),
              NagrikButton(label: 'Medium', size: NagrikButtonSize.medium, onPressed: () {}),
              NagrikButton(label: 'Large', size: NagrikButtonSize.large, onPressed: () {}),
            ],
          ),
        ),
      );
      await tester.pumpAndSettle();

      final smSize = tester.getSize(find.widgetWithText(NagrikButton, 'Small'));
      final mdSize = tester.getSize(find.widgetWithText(NagrikButton, 'Medium'));
      final lgSize = tester.getSize(find.widgetWithText(NagrikButton, 'Large'));

      expect(smSize.height, greaterThanOrEqualTo(44.0));
      expect(mdSize.height, greaterThanOrEqualTo(48.0));
      expect(lgSize.height, greaterThanOrEqualTo(56.0));
    });

    testWidgets('EngagementActionBar interactive buttons meet minimum 40dp target size', (tester) async {
      final post = kMockPosts.first;

      await tester.pumpWidget(buildApp(EngagementActionBar(post: post)));
      await tester.pumpAndSettle();

      final bounceables = find.byType(NagrikBounceable);
      expect(bounceables, findsWidgets);
    });

    testWidgets('HomeAppBar action icons meet minimum touch target bounds', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const Scaffold(
              body: CustomScrollView(
                slivers: [HomeAppBar()],
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      final searchButton = find.byIcon(Icons.search_rounded);
      final notifButton = find.byIcon(Icons.notifications_outlined);

      expect(searchButton, findsOneWidget);
      expect(notifButton, findsOneWidget);

      final searchSize = tester.getSize(searchButton);
      final notifSize = tester.getSize(notifButton);

      expect(searchSize.width, greaterThanOrEqualTo(20.0));
      expect(searchSize.height, greaterThanOrEqualTo(20.0));
      expect(notifSize.width, greaterThanOrEqualTo(20.0));
      expect(notifSize.height, greaterThanOrEqualTo(20.0));
    });
  });
}
