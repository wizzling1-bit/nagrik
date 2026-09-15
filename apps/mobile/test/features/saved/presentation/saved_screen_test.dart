import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import '../../../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/post_card.dart';
import 'package:nagrik/features/saved/presentation/providers/saved_providers.dart';
import 'package:nagrik/features/saved/presentation/saved_screen.dart';

class _TestSavedNotifier extends SavedPostsNotifier {
  _TestSavedNotifier(this._initial);
  final List<Post> _initial;

  @override
  List<Post> build() => _initial;
}

void main() {
  group('SavedScreen', () {
    testWidgets('shows empty state when no posts are saved', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SavedScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Saved'), findsWidgets);
      expect(find.text('No saved stories yet'), findsOneWidget);
      expect(find.text('Save a story and it will appear here.'), findsOneWidget);
      expect(find.text('Browse latest news'), findsOneWidget);
    });

    testWidgets('renders saved articles when bookmarks exist in local state',
        (tester) async {
      final firstPost = kMockPosts.first.copyWith(isBookmarked: true);
      final container = ProviderContainer(
        overrides: [
          savedPostsProvider.overrideWith(() => _TestSavedNotifier([firstPost])),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SavedScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(PostCard), findsOneWidget);
      expect(find.text(firstPost.title), findsOneWidget);
    });
  });
}
