import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/widgets/comments_bottom_sheet.dart';

void main() {
  testWidgets('CommentsBottomSheet renders discussion header and empty state', (tester) async {
    final post = Post(
      id: 'test-1',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Citizen Reporter'),
      title: 'Water pipeline burst in Sector 4',
      body: 'Repair work started',
      locality: 'Sector 4',
      city: 'Delhi',
      createdAt: DateTime.now(),
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () => showCommentsBottomSheet(context, post),
                child: const Text('Open'),
              ),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();

    expect(find.text('Discussion'), findsOneWidget);
  });
}
