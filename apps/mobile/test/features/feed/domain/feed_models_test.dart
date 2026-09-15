import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';

void main() {
  group('Post model', () {
    const author = PostAuthor(
      id: 'auth_1',
      name: 'Kolkata Traffic Police',
      isVerified: true,
      badgeTitle: 'Official Agency',
      distanceKm: 1.2,
    );

    final post = Post(
      id: 'post_1',
      type: PostType.news,
      category: PostCategory.traffic,
      author: author,
      title: 'Waterlogging on EM Bypass near Ruby Hospital',
      body: 'Heavy showers caused slow traffic movement. Diverting light vehicles via Kasba connector.',
      locality: 'Kasba',
      city: 'Kolkata',
      createdAt: DateTime.now().subtract(const Duration(minutes: 15)),
      likesCount: 42,
      commentsCount: 7,
      sharesCount: 12,
      isLiked: false,
      isBookmarked: false,
    );

    test('instantiates with all attributes properly', () {
      expect(post.id, 'post_1');
      expect(post.type, PostType.news);
      expect(post.category, PostCategory.traffic);
      expect(post.author.name, 'Kolkata Traffic Police');
      expect(post.author.isVerified, isTrue);
      expect(post.author.distanceKm, 1.2);
      expect(post.likesCount, 42);
    });

    test('copyWith updates isLiked and isBookmarked optimistically', () {
      final likedPost = post.copyWith(isLiked: true, likesCount: 43);
      expect(likedPost.isLiked, isTrue);
      expect(likedPost.likesCount, 43);
      expect(likedPost.isBookmarked, isFalse);

      final bookmarkedPost = likedPost.copyWith(isBookmarked: true);
      expect(bookmarkedPost.isBookmarked, isTrue);
      expect(bookmarkedPost.isLiked, isTrue);
    });
  });
}
