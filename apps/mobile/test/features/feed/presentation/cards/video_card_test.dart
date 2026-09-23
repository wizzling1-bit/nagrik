import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/video_card.dart';
import '../../../../fixtures/mock_feed_data.dart';

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
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  ProviderContainer makeContainer() => ProviderContainer(
        overrides: [
          feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
        ],
      );

  Widget buildApp(Widget child, [ProviderContainer? container, ThemeData? theme]) {
    final c = container ?? makeContainer();
    return UncontrolledProviderScope(
      container: c,
      child: MaterialApp(
        theme: theme ?? NagrikTheme.light(),
        home: Scaffold(body: SingleChildScrollView(child: child)),
      ),
    );
  }

  group('VideoCard', () {
    testWidgets('renders 16:9 thumbnail, Play button, duration pill, and 5KM RADIUS badge',
        (tester) async {
      final post = kMockPosts.firstWhere((p) => p.type == PostType.video);

      await tester.pumpWidget(buildApp(VideoCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.byType(VideoCard), findsOneWidget);
      expect(find.text(post.title), findsOneWidget);

      // Play button
      expect(find.byIcon(Icons.play_arrow_rounded), findsOneWidget);

      // 5KM RADIUS Geofence Badge
      expect(find.text('5KM RADIUS'), findsOneWidget);

      // SHORT VIDEO badge
      expect(find.text('SHORT VIDEO'), findsOneWidget);

      // Duration pill if available
      if (post.videoDuration != null) {
        expect(find.text(post.videoDuration!), findsOneWidget);
      }
    });

    testWidgets('renders category, locality, and view count metadata in JetBrains Mono',
        (tester) async {
      final post = kMockPosts.firstWhere((p) => p.type == PostType.video);

      await tester.pumpWidget(buildApp(VideoCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.text(post.category.label.toUpperCase()), findsOneWidget);
      expect(find.text(post.locality.toUpperCase()), findsOneWidget);
      if (post.viewCount != null && post.viewCount! > 0) {
        expect(find.textContaining('VIEWS'), findsOneWidget);
      }
    });

    testWidgets('tapping video card triggers onTap callback', (tester) async {
      final post = kMockPosts.firstWhere((p) => p.type == PostType.video);
      var tapped = false;

      await tester.pumpWidget(
        buildApp(VideoCard(post: post, onTap: () => tapped = true)),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byType(VideoCard));
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });

    testWidgets('renders engagement action bar with bookmark toggle', (tester) async {
      final container = makeContainer();
      addTearDown(container.dispose);

      final post = container
          .read(feedPostsProvider)
          .firstWhere((p) => p.type == PostType.video);

      await tester.pumpWidget(buildApp(VideoCard(post: post), container));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.bookmark_border), findsOneWidget);

      await tester.ensureVisible(find.byIcon(Icons.bookmark_border));
      await tester.tap(find.byIcon(Icons.bookmark_border));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.bookmark), findsOneWidget);
      final updatedPost = container
          .read(feedPostsProvider)
          .firstWhere((p) => p.id == post.id);
      expect(updatedPost.isBookmarked, isTrue);
    });

    testWidgets('renders cleanly in dark mode', (tester) async {
      final post = kMockPosts.firstWhere((p) => p.type == PostType.video);

      await tester.pumpWidget(buildApp(
        VideoCard(post: post),
        null,
        NagrikTheme.dark(),
      ));
      await tester.pumpAndSettle();

      expect(find.byType(VideoCard), findsOneWidget);
      expect(find.text('5KM RADIUS'), findsOneWidget);
      expect(find.byIcon(Icons.play_arrow_rounded), findsOneWidget);
    });
  });
}
