import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  final testLocations = [
    const LocationModel(
      country: 'India',
      state: 'Bihar',
      city: 'Patna',
      area: 'Boring Road',
    ),
    const LocationModel(
      country: 'India',
      state: 'Bihar',
      city: 'Patna',
      area: 'Kankarbagh',
    ),
  ];

  Widget buildApp(Widget child, ProviderContainer container) {
    return UncontrolledProviderScope(
      container: container,
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: Scaffold(body: child),
      ),
    );
  }

  group('LocationSwitcherSheet', () {
    testWidgets('displays title, search field, GPS CTA, and supported locations', (tester) async {
      final container = ProviderContainer(
        overrides: [
          apiLocationsProvider.overrideWith((ref) => Future.value(testLocations)),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        buildApp(const LocationSwitcherSheet(), container),
      );
      await tester.pumpAndSettle();

      expect(find.text('Select your location'), findsOneWidget);
      expect(find.text('Use current location'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('Boring Road, Patna'), findsOneWidget);
    });

    testWidgets('tapping a location selects it and closes the sheet', (tester) async {
      final container = ProviderContainer(
        overrides: [
          apiLocationsProvider.overrideWith((ref) => Future.value(testLocations)),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        buildApp(
          Builder(
            builder: (context) => ElevatedButton(
              onPressed: () => showLocationSwitcher(context),
              child: const Text('Open'),
            ),
          ),
          container,
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Select your location'), findsOneWidget);
      await tester.tap(find.text('Boring Road, Patna'));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(container.read(selectedLocationProvider)?.locality, 'Boring Road');
      expect(find.text('Select your location'), findsNothing);
    });
  });
}
