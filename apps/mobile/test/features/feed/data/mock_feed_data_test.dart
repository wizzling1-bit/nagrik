import 'package:flutter_test/flutter_test.dart';
import '../../../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';

void main() {
  group('Mock Feed Data', () {
    test('contains realistic local news posts and video reports', () {
      expect(kMockPosts, isNotEmpty);

      final types = kMockPosts.map((p) => p.type).toSet();
      expect(types, containsAll([PostType.news, PostType.video]));
    });

    test('urgent breaking news post exists in dataset', () {
      final urgentPosts = kMockPosts.where((p) => p.isUrgent).toList();
      expect(urgentPosts, isNotEmpty);
    });

    test('video posts have thumbnail and duration', () {
      final videoPosts = kMockPosts.where((p) => p.type == PostType.video).toList();
      expect(videoPosts, isNotEmpty);
      expect(videoPosts.every((v) => v.videoDuration != null), isTrue);
      expect(videoPosts.every((v) => v.mediaUrls.isNotEmpty), isTrue);
    });
  });
}
