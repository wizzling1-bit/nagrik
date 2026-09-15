import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import '../../../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/engagement_action_bar.dart';
import 'package:nagrik/features/feed/presentation/widgets/share_bottom_sheet.dart';

class _TestFeedStateNotifier extends FeedStateNotifier {
  @override
  FeedState build() {
    return FeedState(
      items: kMockPosts.map((p) => ContentFeedItem(post: p)).toList(),
      page: 1,
      totalItems: kMockPosts.length,
      totalPages: 1,
      isLoading: false,
      hasMore: false,
    );
  }
}

void main() {
  ProviderContainer makeContainer() => ProviderContainer(
        overrides: [
          feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
        ],
      );

  Widget buildApp(Widget child, ProviderContainer container) {
    return UncontrolledProviderScope(
      container: container,
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: Scaffold(body: child),
      ),
    );
  }

  group('EngagementActionBar', () {
    testWidgets('tapping like toggles like icon and count in provider', (tester) async {
      final container = makeContainer();
      addTearDown(container.dispose);

      final post = container.read(feedPostsProvider).first;
      await tester.pumpWidget(buildApp(EngagementActionBar(post: post), container));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.favorite_border), findsOneWidget);
      expect(find.text(post.likesCount.toString()), findsOneWidget);

      await tester.tap(find.byIcon(Icons.favorite_border));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.favorite), findsOneWidget);
      expect(find.text((post.likesCount + 1).toString()), findsOneWidget);

      final updatedPost = container.read(feedPostsProvider).firstWhere((p) => p.id == post.id);
      expect(updatedPost.isLiked, isTrue);
      expect(updatedPost.likesCount, post.likesCount + 1);
    });

    testWidgets('tapping bookmark updates provider and shows SnackBar', (tester) async {
      final container = makeContainer();
      addTearDown(container.dispose);

      final post = container.read(feedPostsProvider).first;
      await tester.pumpWidget(buildApp(EngagementActionBar(post: post), container));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.bookmark_border));
      await tester.pumpAndSettle();

      final updatedPost = container.read(feedPostsProvider).firstWhere((p) => p.id == post.id);
      expect(updatedPost.isBookmarked, isTrue);
      expect(find.text('Saved to your bookmarks'), findsOneWidget);
    });
  });

  group('ShareBottomSheet', () {
    testWidgets('renders only real share actions', (tester) async {
      final post = kMockPosts.first;

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: Scaffold(
              body: ShareBottomSheet(post: post),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Share Update'), findsOneWidget);
      expect(find.text('Share'), findsOneWidget);
      expect(find.text('Copy Link'), findsOneWidget);
      expect(find.text('Close'), findsOneWidget);
      expect(find.text('WhatsApp'), findsNothing);
      expect(find.text('More'), findsNothing);

      await tester.tap(find.text('Copy Link'));
      await tester.pumpAndSettle();
      expect(find.text('Link copied to clipboard'), findsOneWidget);
    });
  });
}
