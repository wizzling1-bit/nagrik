import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  const testLocations = [
    LocationModel(
      country: 'India',
      state: 'Bihar',
      city: 'Patna',
      area: 'Boring Road',
    ),
  ];

  Widget buildApp({
    LocationItem? location,
    int unreadNotificationsCount = 0,
    VoidCallback? onMenuTap,
    VoidCallback? onLocationTap,
    VoidCallback? onSearchTap,
    VoidCallback? onNotificationsTap,
    ThemeMode themeMode = ThemeMode.light,
  }) {
    return ProviderScope(
      overrides: [
        if (location != null)
          selectedLocationProvider.overrideWithValue(location),
        unreadNotificationsCountProvider
            .overrideWithValue(unreadNotificationsCount),
        apiLocationsProvider.overrideWith((ref) => Future.value(testLocations)),
      ],
      child: MaterialApp(
        theme: NagrikTheme.light(),
        darkTheme: NagrikTheme.dark(),
        themeMode: themeMode,
        home: Scaffold(
          body: CustomScrollView(
            slivers: [
              HomeAppBar(
                onMenuTap: onMenuTap,
                onLocationTap: onLocationTap,
                onSearchTap: onSearchTap,
                onNotificationsTap: onNotificationsTap,
              ),
            ],
          ),
        ),
      ),
    );
  }

  group('HomeAppBar', () {
    testWidgets(
        'renders authentic NagrikLogo, default select location, and action icons',
        (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      // Brand Identity: NagrikLogo
      final logoFinder = find.byType(NagrikLogo);
      expect(logoFinder, findsOneWidget);
      final logo = tester.widget<NagrikLogo>(logoFinder);
      expect(logo.variant, NagrikLogoVariant.horizontal);
      expect(logo.size, NagrikLogoSize.sm);
      expect(logo.hideSubtitle, isTrue);
      expect(find.textContaining('nagrik'), findsOneWidget);
      expect(find.textContaining('.news'), findsOneWidget);

      // Location capsule default
      expect(find.text('Select Location'), findsOneWidget);
      expect(find.byIcon(Icons.location_on), findsOneWidget);
      expect(find.byIcon(Icons.keyboard_arrow_down_rounded), findsOneWidget);

      // Action triggers
      expect(find.byIcon(Icons.tune_rounded), findsOneWidget);
      expect(find.byIcon(Icons.search_rounded), findsOneWidget);
      expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);
    });

    testWidgets('renders active location when selected', (tester) async {
      const loc = LocationItem(
        id: 'loc_patna',
        locality: 'Boring Road',
        city: 'Patna',
        district: 'Patna',
        state: 'Bihar',
      );
      await tester.pumpWidget(buildApp(location: loc));
      await tester.pumpAndSettle();

      expect(find.text('Boring Road, Patna'), findsOneWidget);
      expect(find.byIcon(Icons.location_on), findsOneWidget);
    });

    testWidgets('triggers onMenuTap when menu button is tapped', (tester) async {
      var menuTapped = false;
      await tester.pumpWidget(buildApp(
        onMenuTap: () => menuTapped = true,
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.tune_rounded));
      await tester.pumpAndSettle();

      expect(menuTapped, isTrue);
    });

    testWidgets('triggers onSearchTap when search button is tapped',
        (tester) async {
      var searchTapped = false;
      await tester.pumpWidget(buildApp(
        onSearchTap: () => searchTapped = true,
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.search_rounded));
      await tester.pumpAndSettle();

      expect(searchTapped, isTrue);
    });

    testWidgets('triggers onNotificationsTap when notifications button is tapped',
        (tester) async {
      var notificationsTapped = false;
      await tester.pumpWidget(buildApp(
        onNotificationsTap: () => notificationsTapped = true,
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.notifications_outlined));
      await tester.pumpAndSettle();

      expect(notificationsTapped, isTrue);
    });

    testWidgets('triggers onLocationTap when location capsule is tapped',
        (tester) async {
      var locationTapped = false;
      await tester.pumpWidget(buildApp(
        onLocationTap: () => locationTapped = true,
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Select Location'));
      await tester.pumpAndSettle();

      expect(locationTapped, isTrue);
    });

    testWidgets(
        'opens LocationSwitcherSheet when location capsule is tapped without callback',
        (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Select Location'));
      await tester.pumpAndSettle();

      expect(find.byType(LocationSwitcherSheet), findsOneWidget);
      expect(find.text('Select your location'), findsOneWidget);
    });

    testWidgets(
        'renders unread count badge on notifications icon when unread count > 0',
        (tester) async {
      await tester.pumpWidget(buildApp(unreadNotificationsCount: 7));
      await tester.pumpAndSettle();

      expect(find.text('7'), findsOneWidget);
      expect(
        find.byWidgetPredicate(
          (w) =>
              w is Semantics &&
              w.properties.label == 'Notifications, 7 unread',
        ),
        findsOneWidget,
      );
    });

    testWidgets('renders dark mode styling correctly without errors',
        (tester) async {
      await tester.pumpWidget(buildApp(themeMode: ThemeMode.dark));
      await tester.pumpAndSettle();

      expect(find.byType(NagrikLogo), findsOneWidget);
      expect(find.text('Select Location'), findsOneWidget);
      expect(find.byIcon(Icons.search_rounded), findsOneWidget);
    });
  });
}
