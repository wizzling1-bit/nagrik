import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_overlay.dart';

void main() {
  testWidgets('VerticalVideoOverlay shows play/pause action button', (tester) async {
    final post = Post(
      id: 'test-1',
      type: PostType.video,
      category: PostCategory.civic,
      author: const PostAuthor(id: 'a1', name: 'Arvind Verma', isVerified: true),
      title: 'Test Video Headline',
      body: 'Test body content description',
      locality: 'Patna Central',
      city: 'Patna',
      createdAt: DateTime(2026, 9, 24),
    );

    bool playPauseToggled = false;

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoOverlay(
              post: post,
              isMuted: false,
              isPlaying: false,
              onTogglePlayPause: () => playPauseToggled = true,
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

    final pauseButton = find.byKey(const Key('video_play_pause_action_btn'));
    expect(pauseButton, findsOneWidget);

    // Verify label says 'Play' when paused
    expect(find.text('Play'), findsOneWidget);

    await tester.tap(pauseButton);
    expect(playPauseToggled, isTrue);
  });
}
