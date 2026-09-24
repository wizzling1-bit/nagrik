import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_overlay.dart';

void main() {
  testWidgets('VerticalVideoOverlay renders headline and actions', (tester) async {
    final post = Post(
      id: 'test-v1',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Ravi Kumar', isVerified: true),
      title: 'Major Road Repair Completed Ahead of Schedule',
      body: 'Civic authorities worked overnight to open lane.',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      createdAt: DateTime.now(),
      likesCount: 42,
      commentsCount: 7,
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoOverlay(
              post: post,
              isMuted: false,
              onToggleMute: () {},
              onLike: () {},
              onComment: () {},
              onShare: () {},
              onSave: () {},
              onReport: () {},
            ),
          ),
        ),
      ),
    );

    expect(find.text('Major Road Repair Completed Ahead of Schedule'), findsOneWidget);
    expect(find.text('Ravi Kumar'), findsOneWidget);
    expect(find.text('42'), findsOneWidget);
  });
}
