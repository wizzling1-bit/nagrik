import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import '../../../fixtures/mock_feed_data.dart';

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

  group('FeedProviders', () {
    test('feedTabProvider defaults to all', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(feedTabProvider), FeedTab.all);
    });

    test('switching feedTab updates tab state', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(feedTabProvider.notifier).setTab(FeedTab.videos);
      expect(container.read(feedTabProvider), FeedTab.videos);
    });

    test('feedPostsProvider filters by tab', () {
      final container = makeContainer();
      addTearDown(container.dispose);

      // Videos tab should only return video posts
      container.read(feedTabProvider.notifier).setTab(FeedTab.videos);
      final videoPosts = container.read(filteredFeedPostsProvider);
      expect(videoPosts.every((p) => p.type == PostType.video), isTrue);
    });

    test('toggleLike optimistically increments and decrements count', () {
      final container = makeContainer();
      addTearDown(container.dispose);

      final initialPosts = container.read(feedPostsProvider);
      final firstPost = initialPosts.first;
      final initialLikes = firstPost.likesCount;

      container.read(feedPostsProvider.notifier).toggleLike(firstPost.id);
      var updatedPost = container.read(feedPostsProvider).firstWhere((p) => p.id == firstPost.id);
      expect(updatedPost.isLiked, isTrue);
      expect(updatedPost.likesCount, initialLikes + 1);

      container.read(feedPostsProvider.notifier).toggleLike(firstPost.id);
      updatedPost = container.read(feedPostsProvider).firstWhere((p) => p.id == firstPost.id);
      expect(updatedPost.isLiked, isFalse);
      expect(updatedPost.likesCount, initialLikes);
    });

    test('toggleBookmark optimistically updates bookmark state', () {
      final container = makeContainer();
      addTearDown(container.dispose);

      final firstPost = container.read(feedPostsProvider).first;
      container.read(feedPostsProvider.notifier).toggleBookmark(firstPost.id);

      final updatedPost = container.read(feedPostsProvider).firstWhere((p) => p.id == firstPost.id);
      expect(updatedPost.isBookmarked, isTrue);
    });

    test('category filter narrows results', () {
      final container = makeContainer();
      addTearDown(container.dispose);

      container.read(feedCategoryFilterProvider.notifier).setCategory(PostCategory.traffic);
      final trafficPosts = container.read(filteredFeedPostsProvider);
      expect(trafficPosts.every((p) => p.category == PostCategory.traffic), isTrue);
    });
  });
}
