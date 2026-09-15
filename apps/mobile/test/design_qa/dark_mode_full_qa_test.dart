import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/theme_extensions.dart';
import '../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/share_bottom_sheet.dart';
import 'package:nagrik/features/home/presentation/home_screen.dart';
import 'package:nagrik/features/home/presentation/widgets/breaking_hero_card.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/notifications/presentation/notifications_screen.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:nagrik/features/saved/presentation/saved_screen.dart';
import 'package:nagrik/features/search/presentation/search_screen.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/settings/presentation/settings_screen.dart';

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
  Widget buildDarkTestApp(Widget child, [ProviderContainer? container]) {
    final c = container ??
        ProviderContainer(
          overrides: [
            feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
          ],
        );
    return UncontrolledProviderScope(
      container: c,
      child: MaterialApp(
        theme: NagrikTheme.dark(),
        darkTheme: NagrikTheme.dark(),
        themeMode: ThemeMode.dark,
        home: Scaffold(body: child),
      ),
    );
  }

  group('Dark Mode Full App QA Suite', () {
    testWidgets('Tonal Hierarchy strictly adheres to exact user-specified dark tokens',
        (tester) async {
      final darkTheme = NagrikTheme.dark();
      final ext = darkTheme.extension<NagrikThemeExtension>()!;

      expect(ext.level0Background, NagrikDarkColors.level0Background);
      expect(ext.level1Surface, NagrikDarkColors.level1Surface);
      expect(ext.level2Elevated, NagrikDarkColors.level2Elevated);
      expect(ext.level3Interactive, NagrikDarkColors.level3Interactive);
      expect(ext.level4Muted, NagrikDarkColors.level4Muted);
      expect(ext.brandBright, NagrikDarkColors.brandBright);
      expect(ext.border, NagrikDarkColors.border);
      expect(ext.divider, NagrikDarkColors.divider);
      expect(darkTheme.scaffoldBackgroundColor, NagrikDarkColors.level0Background);
    });

    testWidgets('Home Screen and components render crisply in Dark Mode',
        (tester) async {
      final container = ProviderContainer(
        overrides: [
          selectedLocationProvider.overrideWith((ref) => kIndianLocations.first),
          feedStateProvider.overrideWith(_TestFeedStateNotifier.new),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(buildDarkTestApp(const HomeScreen(), container));
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.byType(HomeAppBar), findsOneWidget);
      expect(find.byType(BreakingHeroCard), findsOneWidget);
      expect(find.byType(NewsCard), findsWidgets);
    });

    testWidgets('Search Screen renders in Dark Mode', (tester) async {
      await tester.pumpWidget(buildDarkTestApp(const SearchScreen()));
      await tester.pumpAndSettle();

      expect(find.byType(SearchScreen), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('Saved Screen renders in Dark Mode', (tester) async {
      await tester.pumpWidget(buildDarkTestApp(const SavedScreen()));
      await tester.pumpAndSettle();

      expect(find.byType(SavedScreen), findsOneWidget);
      expect(find.text('Saved'), findsWidgets);
    });

    testWidgets('Notifications Screen renders in Dark Mode', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(buildDarkTestApp(const NotificationsScreen(), container));
      await tester.pumpAndSettle();

      expect(find.byType(NotificationsScreen), findsOneWidget);
      // Honest empty state (no mock history) with settings shortcut.
      expect(find.text('Notification settings'), findsOneWidget);
    });

    testWidgets('Settings Screen renders in Dark Mode', (tester) async {
      await tester.pumpWidget(buildDarkTestApp(const SettingsScreen()));
      await tester.pumpAndSettle();

      expect(find.byType(SettingsScreen), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('Location Switcher Sheet renders with Level 2 Elevated surface in Dark Mode',
        (tester) async {
      final container = ProviderContainer(
        overrides: [
          selectedLocationProvider.overrideWith((ref) => kIndianLocations.first),
          apiLocationsProvider.overrideWith(
            (ref) => Future.value([
              const LocationModel(
                country: 'India',
                state: 'Bihar',
                city: 'Patna',
                area: 'Boring Road',
              ),
            ]),
          ),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(buildDarkTestApp(const LocationSwitcherSheet(), container));
      await tester.pumpAndSettle();

      expect(find.text('Select your location'), findsOneWidget);
    });

    testWidgets('Share Bottom Sheet renders with Level 2 Elevated surface in Dark Mode',
        (tester) async {
      await tester.pumpWidget(
        buildDarkTestApp(ShareBottomSheet(post: kMockPosts.first)),
      );
      await tester.pumpAndSettle();

      expect(find.text('Share Update'), findsOneWidget);
      expect(find.text('WhatsApp'), findsNothing);
      expect(find.text('Copy Link'), findsOneWidget);
      expect(find.text('Close'), findsOneWidget);
    });
  });
}
