import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/home/presentation/widgets/home_app_bar.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  Widget buildApp([LocationItem? location]) {
    return ProviderScope(
      overrides: [
        if (location != null)
          selectedLocationProvider.overrideWithValue(location),
      ],
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: const Scaffold(
          body: CustomScrollView(
            slivers: [
              HomeAppBar(),
            ],
          ),
        ),
      ),
    );
  }

  group('HomeAppBar', () {
    testWidgets('renders brand title, default select location, and action icons', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.text('Nagrik'), findsOneWidget);
      expect(find.text('Select Location'), findsOneWidget);
      expect(find.byIcon(Icons.search_rounded), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);
    });

    testWidgets('renders active location when selected', (tester) async {
      const loc = LocationItem(
        id: 'loc_patna',
        locality: 'Boring Road',
        city: 'Patna',
        district: 'Patna',
        state: 'Bihar',
      );
      await tester.pumpWidget(buildApp(loc));
      await tester.pumpAndSettle();

      expect(find.text('Boring Road, Patna'), findsOneWidget);
    });
  });
}
