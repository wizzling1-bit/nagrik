import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/trending_topics_bar.dart';

void main() {
  const mockCategories = [
    CategoryModel(id: 'c1', name: 'Local News', slug: 'local-news', displayOrder: 1),
    CategoryModel(id: 'c2', name: 'Politics', slug: 'politics', displayOrder: 2),
    CategoryModel(id: 'c3', name: 'Crime & Safety', slug: 'crime-safety', displayOrder: 3),
    CategoryModel(id: 'c4', name: 'Sports', slug: 'sports', displayOrder: 4),
  ];

  Widget buildWidget({
    List<CategoryModel>? categories,
    String? selectedTopicId,
    void Function(TrendingTopic)? onTopicTap,
    VoidCallback? onSeeAllTap,
    ThemeMode themeMode = ThemeMode.light,
  }) {
    return ProviderScope(
      overrides: [
        apiCategoriesProvider.overrideWith(
          (ref) => Future.value(categories ?? mockCategories),
        ),
      ],
      child: MaterialApp(
        theme: NagrikTheme.light(),
        darkTheme: NagrikTheme.dark(),
        themeMode: themeMode,
        home: Scaffold(
          body: TrendingTopicsBar(
            selectedTopicId: selectedTopicId,
            onTopicTap: onTopicTap,
            onSeeAllTap: onSeeAllTap,
          ),
        ),
      ),
    );
  }

  group('TrendingTopicsBar', () {
    testWidgets('renders SizedBox.shrink when categories list is empty', (tester) async {
      await tester.pumpWidget(buildWidget(categories: []));
      await tester.pumpAndSettle();

      expect(find.text('Trending Topics'), findsNothing);
      expect(find.byType(TrendingTopicsBar), findsOneWidget);
      expect(find.byType(ListView), findsNothing);
    });

    testWidgets('renders section header, flame icon, See all, and category chips', (tester) async {
      await tester.pumpWidget(buildWidget());
      await tester.pumpAndSettle();

      expect(find.text('Trending Topics'), findsOneWidget);
      expect(find.byIcon(Icons.local_fire_department_rounded), findsOneWidget);
      expect(find.text('See all'), findsOneWidget);

      expect(find.text('Local News'), findsOneWidget);
      expect(find.text('Politics'), findsOneWidget);
      expect(find.text('Crime & Safety'), findsOneWidget);
      expect(find.text('Sports'), findsOneWidget);

      // Verify BouncingScrollPhysics
      final listView = tester.widget<ListView>(find.byType(ListView));
      expect(listView.physics, isA<BouncingScrollPhysics>());
      expect(listView.scrollDirection, Axis.horizontal);
    });

    testWidgets('inactive chips use warm card surface and 1px border in light mode', (tester) async {
      await tester.pumpWidget(buildWidget(themeMode: ThemeMode.light));
      await tester.pumpAndSettle();

      final outerContainerFinder = find.ancestor(
        of: find.text('Politics'),
        matching: find.byType(Container),
      ).first;

      final outerContainer = tester.widget<Container>(outerContainerFinder);
      final decoration = outerContainer.decoration as BoxDecoration;

      expect(decoration.color, const Color(0xFFFAF8F5));
      expect(decoration.border, isNotNull);
      final border = decoration.border as Border;
      expect(border.top.color, const Color(0xFFDDD5C8));
      expect(border.top.width, 1.0);
    });

    testWidgets('inactive chips use midnight obsidian surface and 1px border in dark mode', (tester) async {
      await tester.pumpWidget(buildWidget(themeMode: ThemeMode.dark));
      await tester.pumpAndSettle();

      final outerContainerFinder = find.ancestor(
        of: find.text('Politics'),
        matching: find.byType(Container),
      ).first;

      final outerContainer = tester.widget<Container>(outerContainerFinder);
      final decoration = outerContainer.decoration as BoxDecoration;

      expect(decoration.color, const Color(0xFF131A2A));
      expect(decoration.border, isNotNull);
      final border = decoration.border as Border;
      expect(border.top.color, const Color(0xFF1C2537));
      expect(border.top.width, 1.0);
    });

    testWidgets('active chip highlights in solid brand orange with warm drop shadow and white text', (tester) async {
      await tester.pumpWidget(buildWidget(selectedTopicId: 'politics'));
      await tester.pumpAndSettle();

      final outerContainerFinder = find.ancestor(
        of: find.text('Politics'),
        matching: find.byType(Container),
      ).first;

      final outerContainer = tester.widget<Container>(outerContainerFinder);
      final decoration = outerContainer.decoration as BoxDecoration;

      // Active chip background is brand orange #DE5227
      expect(decoration.color, NagrikBrandColors.orangePrimary);

      // Active chip has warm ambient drop shadow
      expect(decoration.boxShadow, isNotNull);
      expect(
        decoration.boxShadow!.any(
          (s) => s.color.toARGB32() == NagrikBrandColors.orangePrimary.withValues(alpha: 0.25).toARGB32(),
        ),
        isTrue,
      );

      // Active chip text is white with w700 bold weight
      final textWidget = tester.widget<Text>(find.text('Politics'));
      expect(textWidget.style?.color, Colors.white);
      expect(textWidget.style?.fontWeight, FontWeight.w700);

      // Non-selected chip (Sports) remains inactive
      final sportsFinder = find.ancestor(
        of: find.text('Sports'),
        matching: find.byType(Container),
      ).first;
      final sportsOuter = tester.widget<Container>(sportsFinder);
      final sportsDecoration = sportsOuter.decoration as BoxDecoration;
      expect(sportsDecoration.color, const Color(0xFFFAF8F5));
    });

    testWidgets('tapping category chip invokes onTopicTap callback', (tester) async {
      TrendingTopic? tappedTopic;
      await tester.pumpWidget(
        buildWidget(
          onTopicTap: (topic) => tappedTopic = topic,
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Politics'));
      await tester.pumpAndSettle();

      expect(tappedTopic, isNotNull);
      expect(tappedTopic!.title, 'Politics');
      expect(tappedTopic!.slug, 'politics');
    });

    testWidgets('tapping See all invokes onSeeAllTap callback', (tester) async {
      bool seeAllTapped = false;
      await tester.pumpWidget(
        buildWidget(
          onSeeAllTap: () => seeAllTapped = true,
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('See all'));
      await tester.pumpAndSettle();

      expect(seeAllTapped, isTrue);
    });
  });
}
