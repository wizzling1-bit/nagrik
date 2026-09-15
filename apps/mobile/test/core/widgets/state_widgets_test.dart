import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/empty_state.dart';
import 'package:nagrik/core/widgets/error_state.dart';
import 'package:nagrik/core/widgets/skeleton_loading.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: NagrikTheme.light(),
      home: Scaffold(body: Center(child: child)),
    );
  }

  group('SkeletonBox', () {
    testWidgets('renders with specified dimensions', (tester) async {
      await tester.pumpWidget(buildApp(
        const SkeletonBox(width: 100, height: 20),
      ));

      final box = tester.getSize(find.byType(SkeletonBox));
      expect(box.width, 100.0);
      expect(box.height, 20.0);
    });
  });

  group('NagrikEmptyState', () {
    testWidgets('displays title and description', (tester) async {
      await tester.pumpWidget(buildApp(
        const NagrikEmptyState(
          icon: Icons.bookmark_outline,
          title: 'No saved updates yet',
          description: 'Save useful local stories to find them here later.',
        ),
      ));

      expect(find.text('No saved updates yet'), findsOneWidget);
      expect(
        find.text('Save useful local stories to find them here later.'),
        findsOneWidget,
      );
      expect(find.byIcon(Icons.bookmark_outline), findsOneWidget);
    });

    testWidgets('renders action button when provided', (tester) async {
      await tester.pumpWidget(buildApp(
        NagrikEmptyState(
          icon: Icons.explore,
          title: 'Nothing here',
          description: 'Start exploring.',
          actionLabel: 'Explore',
          onAction: () {},
        ),
      ));

      expect(find.text('Explore'), findsOneWidget);
    });
  });

  group('NagrikErrorState', () {
    testWidgets('displays error message and retry button', (tester) async {
      var retried = false;
      await tester.pumpWidget(buildApp(
        NagrikErrorState(
          message: "Couldn't load updates",
          onRetry: () => retried = true,
        ),
      ));

      expect(find.text("Couldn't load updates"), findsOneWidget);
      expect(find.text('Try again'), findsOneWidget);

      await tester.tap(find.text('Try again'));
      expect(retried, isTrue);
    });
  });
}
