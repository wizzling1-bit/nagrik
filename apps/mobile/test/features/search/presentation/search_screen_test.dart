import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import '../../../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/search/presentation/providers/search_providers.dart';
import 'package:nagrik/features/search/presentation/search_screen.dart';

class _TestRecentSearchesNotifier extends RecentSearchesNotifier {
  _TestRecentSearchesNotifier(this._initial);
  final List<String> _initial;

  @override
  List<String> build() => _initial;
}

class _TestSearchStateNotifier extends SearchStateNotifier {
  @override
  SearchState build() => const SearchState();

  @override
  void setQuery(String q) {
    if (q.trim().isNotEmpty) {
      state = state.copyWith(
        query: q,
        results: [kMockPosts.first],
        hasSearched: true,
        isLoading: false,
      );
    } else {
      state = const SearchState();
    }
  }
}

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
  group('SearchScreen', () {
    testWidgets('renders search text field and recent searches',
        (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
            searchStateProvider.overrideWith(_TestSearchStateNotifier.new),
            recentSearchesProvider.overrideWith(
              () => _TestRecentSearchesNotifier(['Patna Metro', 'Ganga Pathway']),
            ),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SearchScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('RECENT SEARCHES'), findsOneWidget);
      expect(find.text('Patna Metro'), findsOneWidget);
      expect(find.text('Ganga Pathway'), findsOneWidget);

      // Perform a search
      await tester.enterText(find.byType(TextField), 'Metro');
      await tester.pumpAndSettle();

      expect(find.text('RECENT SEARCHES'), findsNothing);
      expect(find.byType(NewsCard), findsWidgets);
    });

    testWidgets('typing query updates search results live', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            searchStateProvider.overrideWith(_TestSearchStateNotifier.new),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SearchScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'Patna');
      await tester.pumpAndSettle();

      expect(find.text('RECENT SEARCHES'), findsNothing);
      expect(find.byType(NewsCard), findsWidgets);
    });

    testWidgets('renders live suggested searches and explore stories when no recent searches exist', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
            recentSearchesProvider.overrideWith(
              () => _TestRecentSearchesNotifier([]),
            ),
            // Live categories (network is stubbed in widget tests).
            apiCategoriesProvider.overrideWith(
              (ref) => Future.value(const [
                CategoryModel(id: 'c1', name: 'Politics', slug: 'politics', displayOrder: 1),
                CategoryModel(id: 'c2', name: 'Sports', slug: 'sports', displayOrder: 2),
              ]),
            ),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const SearchScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // No hardcoded popular terms: suggestions come from live categories.
      expect(find.text('POPULAR SEARCHES'), findsNothing);
      expect(find.text('Metro Route'), findsNothing);
      expect(find.text('SUGGESTED'), findsOneWidget);
      expect(find.text('Politics'), findsWidgets);
      expect(find.text('Explore Stories Near You'), findsOneWidget);
      expect(find.byType(NewsCard), findsWidgets);
    });
  });
}
