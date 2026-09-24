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
      relevanceScore: 112.5,
      locationTier: 'LOCAL_AREA',
      distanceKm: 1.45,
    );

    test('instantiates with all attributes properly', () {
      expect(post.id, 'post_1');
      expect(post.type, PostType.news);
      expect(post.category, PostCategory.traffic);
      expect(post.author.name, 'Kolkata Traffic Police');
      expect(post.author.isVerified, isTrue);
      expect(post.author.distanceKm, 1.2);
      expect(post.likesCount, 42);
      expect(post.relevanceScore, 112.5);
      expect(post.locationTier, 'LOCAL_AREA');
      expect(post.distanceKm, 1.45);
    });

    test('copyWith updates isLiked and isBookmarked optimistically', () {
      final likedPost = post.copyWith(isLiked: true, likesCount: 43);
      expect(likedPost.isLiked, isTrue);
      expect(likedPost.likesCount, 43);
      expect(likedPost.isBookmarked, isFalse);
      expect(likedPost.relevanceScore, 112.5);
      expect(likedPost.locationTier, 'LOCAL_AREA');
      expect(likedPost.distanceKm, 1.45);

      final bookmarkedPost = likedPost.copyWith(isBookmarked: true);
      expect(bookmarkedPost.isBookmarked, isTrue);
      expect(bookmarkedPost.isLiked, isTrue);

      final updatedPost = post.copyWith(
        relevanceScore: 95.0,
        locationTier: 'SUB_DISTRICT',
        distanceKm: 4.8,
      );
      expect(updatedPost.relevanceScore, 95.0);
      expect(updatedPost.locationTier, 'SUB_DISTRICT');
      expect(updatedPost.distanceKm, 4.8);
    });

    test('fromJson and toJson roundtrips relevanceScore, locationTier, distanceKm', () {
      final json = post.toJson();
      expect(json['relevanceScore'], 112.5);
      expect(json['locationTier'], 'LOCAL_AREA');
      expect(json['distanceKm'], 1.45);

      final revived = Post.fromJson(json);
      expect(revived.id, post.id);
      expect(revived.relevanceScore, 112.5);
      expect(revived.locationTier, 'LOCAL_AREA');
      expect(revived.distanceKm, 1.45);
    });
  });
}
