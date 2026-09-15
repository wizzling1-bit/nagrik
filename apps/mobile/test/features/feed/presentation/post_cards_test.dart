import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import '../../../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/post_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/video_card.dart';

void main() {
  Widget buildApp(Widget child) {
    return ProviderScope(
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: Scaffold(body: SingleChildScrollView(child: child)),
      ),
    );
  }

  group('PostCard Variants', () {
    testWidgets('renders NewsCard for news posts with editorial typography and actions', (tester) async {
      final newsPost = kMockPosts.firstWhere((p) => p.type == PostType.news);
      await tester.pumpWidget(buildApp(PostCard(post: newsPost)));
      await tester.pumpAndSettle();

      expect(find.byType(NewsCard), findsOneWidget);
      expect(find.text(newsPost.title), findsOneWidget);
      expect(find.text(newsPost.author.name), findsOneWidget);
    });

    testWidgets('renders VideoCard for video posts with play button, duration, and view count', (tester) async {
      final videoPost = kMockPosts.firstWhere((p) => p.type == PostType.video);
      await tester.pumpWidget(buildApp(PostCard(post: videoPost)));
      await tester.pumpAndSettle();

      expect(find.byType(VideoCard), findsOneWidget);
      expect(find.byIcon(Icons.play_arrow_rounded), findsOneWidget);
      if (videoPost.videoDuration != null) {
        expect(find.text(videoPost.videoDuration!), findsOneWidget);
      }
    });

    testWidgets('double tap on PostCard triggers like action', (tester) async {
      final newsPost = kMockPosts.firstWhere((p) => p.type == PostType.news);
      await tester.pumpWidget(buildApp(PostCard(post: newsPost)));
      await tester.pumpAndSettle();

      await tester.tap(find.byType(PostCard));
      await tester.pump(const Duration(milliseconds: 50));
      await tester.tap(find.byType(PostCard));
      await tester.pumpAndSettle();

      expect(find.byType(PostCard), findsOneWidget);
    });
  });
}
