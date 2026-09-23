import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
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

  group('NewsCard', () {
    testWidgets('renders 16:9 media, 5KM RADIUS geofence badge, category, and Newsreader headline',
        (tester) async {
      final post = kMockPosts.firstWhere(
        (p) => p.type == PostType.news && p.mediaUrls.isNotEmpty,
      );

      await tester.pumpWidget(buildApp(NewsCard(post: post)));
      await tester.pumpAndSettle();

      // Card structure
      expect(find.byType(NewsCard), findsOneWidget);
      expect(find.text(post.title), findsOneWidget);
      expect(find.text(post.body), findsOneWidget);

      // 5KM RADIUS Geofence Badge
      expect(find.text('5KM RADIUS'), findsOneWidget);
      expect(find.byIcon(Icons.location_on_rounded), findsOneWidget);

      // Monospace category tag in uppercase
      expect(find.text(post.category.label.toUpperCase()), findsOneWidget);

      // Ward / Locality
      final ward = post.locality.toUpperCase();
      expect(find.text(ward), findsOneWidget);
    });

    testWidgets('renders verified author byline with avatar and verification badge',
        (tester) async {
      final post = kMockPosts.firstWhere(
        (p) => p.type == PostType.news && p.author.isVerified,
      );

      await tester.pumpWidget(buildApp(NewsCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.text(post.author.name), findsOneWidget);
      expect(find.byType(VerificationBadge), findsOneWidget);
      expect(find.byIcon(Icons.verified), findsOneWidget);
    });

    testWidgets('featured variant renders with isFeatured layout', (tester) async {
      final post = kMockPosts.firstWhere(
        (p) => p.type == PostType.news && p.mediaUrls.isNotEmpty,
      );

      await tester.pumpWidget(buildApp(NewsCard(post: post, isFeatured: true)));
      await tester.pumpAndSettle();

      expect(find.byType(NewsCard), findsOneWidget);
      expect(find.text(post.title), findsOneWidget);
      expect(find.text('5KM RADIUS'), findsOneWidget);
    });

    testWidgets('tapping card invokes custom onTap handler', (tester) async {
      final post = kMockPosts.firstWhere((p) => p.type == PostType.news);
      var tapped = false;

      await tester.pumpWidget(
        buildApp(NewsCard(post: post, onTap: () => tapped = true)),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byType(NewsCard));
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });

    testWidgets('bookmark button toggles bookmark state', (tester) async {
      final container = makeContainer();
      addTearDown(container.dispose);

      final post = container
          .read(feedPostsProvider)
          .firstWhere((p) => p.type == PostType.news);

      await tester.pumpWidget(buildApp(NewsCard(post: post), container));
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

    testWidgets('renders in dark mode with dark theme tokens cleanly', (tester) async {
      final post = kMockPosts.firstWhere(
        (p) => p.type == PostType.news && p.mediaUrls.isNotEmpty,
      );

      await tester.pumpWidget(buildApp(
        NewsCard(post: post),
        null,
        NagrikTheme.dark(),
      ));
      await tester.pumpAndSettle();

      expect(find.byType(NewsCard), findsOneWidget);
      expect(find.text('5KM RADIUS'), findsOneWidget);
      expect(find.text(post.title), findsOneWidget);
    });
  });
}
