import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/post_card.dart';
import 'package:nagrik/features/home/presentation/home_screen.dart';
import 'package:nagrik/features/home/presentation/widgets/breaking_hero_card.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import '../../../fixtures/mock_feed_data.dart';

class _TestFeedStateNotifier extends FeedStateNotifier {
  @override
  FeedState build() {
    ref.listen(selectedLocationProvider, (prev, next) {
      if (next != null) {
        final locPosts = getLocalizedFallbackPosts(city: next.city, area: next.locality);
        state = state.copyWith(
          items: locPosts.map((p) => ContentFeedItem(post: p)).toList(),
          totalItems: locPosts.length,
          isLoading: false,
        );
      }
    });

    final loc = ref.read(selectedLocationProvider);
    final posts = getLocalizedFallbackPosts(city: loc?.city, area: loc?.locality);
    return FeedState(
      items: posts.map((p) => ContentFeedItem(post: p)).toList(),
      page: 1,
      totalItems: posts.length,
      totalPages: 1,
      isLoading: false,
      hasMore: false,
    );
  }
}

void main() {
  Widget buildApp(Widget child, [ProviderContainer? container]) {
    final c = container ??
        ProviderContainer(
          overrides: [
            feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
          ],
        );
    return UncontrolledProviderScope(
      container: c,
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: child,
      ),
    );
  }

  group('HomeScreen', () {
    testWidgets('renders compact app bar, breaking banner, Latest News header, and editorial posts',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final container = ProviderContainer(
        overrides: [
          feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(buildApp(const HomeScreen(), container));
      await tester.pumpAndSettle();

      expect(find.byType(HomeAppBar), findsOneWidget);
      expect(find.byType(BreakingHeroCard), findsOneWidget);
      expect(find.text('LATEST NEAR YOU'), findsOneWidget);
      expect(find.byType(PostCard), findsWidgets);
    });

    testWidgets('changing location updates feed posts and breaking banner to selected location',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final container = ProviderContainer(
        overrides: [
          feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(buildApp(const HomeScreen(), container));
      await tester.pumpAndSettle();

      // Change location to Boring Road, Patna
      container.read(onboardingStateProvider.notifier).selectLocation(
            const LocationItem(
              id: 'loc_patna_boring_road',
              locality: 'Boring Road',
              city: 'Patna',
              district: 'Patna',
              state: 'Bihar',
            ),
          );
      await tester.pumpAndSettle();

      // Verify that Patna breaking news and localized posts are displayed
      expect(find.textContaining('Boring Road Elevated Flyover Construction'), findsWidgets);
      final posts = container.read(feedPostsProvider);
      expect(posts.any((p) => p.city == 'Patna'), isTrue);
    });
  });
}

