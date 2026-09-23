import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/breaking_hero_card.dart';

void main() {
  final testUrgentPost = Post(
    id: 'urgent_post_test',
    type: PostType.news,
    category: PostCategory.traffic,
    author: const PostAuthor(
      id: 'auth_traffic',
      name: 'Patna Traffic Cell',
      isVerified: true,
      badgeTitle: 'Official',
      distanceKm: 1.2,
    ),
    title: 'Severe Waterlogging on Boring Road Flyover',
    body: 'Continuous rainfall causes heavy congestion near crossing.',
    locality: 'Boring Road',
    city: 'Patna',
    createdAt: DateTime.now().subtract(const Duration(minutes: 10)),
    isUrgent: true,
  );

  Widget buildApp({
    Post? urgentPost,
    void Function(Post)? onTap,
    ThemeMode themeMode = ThemeMode.light,
  }) {
    return ProviderScope(
      overrides: [
        urgentAlertsProvider.overrideWithValue(urgentPost),
      ],
      child: MaterialApp(
        theme: NagrikTheme.light(),
        darkTheme: NagrikTheme.dark(),
        themeMode: themeMode,
        home: Scaffold(
          body: BreakingHeroCard(onTap: onTap),
        ),
      ),
    );
  }

  group('BreakingHeroCard', () {
    testWidgets('renders SizedBox.shrink when there is no urgent post',
        (tester) async {
      await tester.pumpWidget(buildApp(urgentPost: null));
      await tester.pumpAndSettle();

      expect(find.byType(NagrikPulseBadge), findsNothing);
      expect(find.byIcon(Icons.bolt_rounded), findsNothing);
      expect(find.text('BREAKING ALERT'), findsNothing);
    });

    testWidgets(
        'renders amber-crimson gradient card, pulse badge, and uppercase mono label',
        (tester) async {
      await tester.pumpWidget(buildApp(urgentPost: testUrgentPost));
      await tester.pumpAndSettle();

      // Pulse badge with lightning bolt
      expect(find.byType(NagrikPulseBadge), findsOneWidget);
      expect(find.byIcon(Icons.bolt_rounded), findsOneWidget);

      // Uppercase monospace BREAKING ALERT badge
      expect(find.text('BREAKING ALERT'), findsOneWidget);

      // Headline and body
      expect(
        find.text('Severe Waterlogging on Boring Road Flyover'),
        findsOneWidget,
      );
      expect(
        find.text('Continuous rainfall causes heavy congestion near crossing.'),
        findsOneWidget,
      );

      // Chevron action icon
      expect(find.byIcon(Icons.chevron_right_rounded), findsOneWidget);

      // Semantics
      expect(
        find.byWidgetPredicate(
          (w) =>
              w is Semantics &&
              w.properties.label ==
                  'Breaking news: Severe Waterlogging on Boring Road Flyover',
        ),
        findsOneWidget,
      );
    });

    testWidgets('triggers onTap callback when card is tapped', (tester) async {
      Post? receivedPost;
      await tester.pumpWidget(buildApp(
        urgentPost: testUrgentPost,
        onTap: (post) => receivedPost = post,
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.byType(BreakingHeroCard));
      await tester.pumpAndSettle();

      expect(receivedPost, isNotNull);
      expect(receivedPost?.id, 'urgent_post_test');
      expect(receivedPost?.title,
          'Severe Waterlogging on Boring Road Flyover');
    });

    testWidgets('renders cleanly in dark mode without overflow', (tester) async {
      await tester.pumpWidget(buildApp(
        urgentPost: testUrgentPost,
        themeMode: ThemeMode.dark,
      ));
      await tester.pumpAndSettle();

      expect(find.byType(NagrikPulseBadge), findsOneWidget);
      expect(find.text('BREAKING ALERT'), findsOneWidget);
      expect(
        find.text('Severe Waterlogging on Boring Road Flyover'),
        findsOneWidget,
      );
    });
  });
}
