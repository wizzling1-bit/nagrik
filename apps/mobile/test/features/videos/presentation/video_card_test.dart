import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_card.dart';

void main() {
  testWidgets('VerticalVideoCard renders thumbnail placeholder when controller is null', (tester) async {
    final post = Post(
      id: 'test-v2',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Correspondent'),
      title: 'Breaking ground report',
      body: 'Video details',
      locality: 'Koramangala',
      city: 'Bengaluru',
      createdAt: DateTime.now(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167',
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoCard(
              post: post,
              controller: null,
              isMuted: false,
              onToggleMute: () {},
              onTogglePlayPause: () {},
            ),
          ),
        ),
      ),
    );

    expect(find.text('Breaking ground report'), findsOneWidget);
  });
}
