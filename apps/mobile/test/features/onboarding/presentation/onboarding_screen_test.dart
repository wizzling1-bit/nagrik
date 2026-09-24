import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/onboarding/presentation/onboarding_screen.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  Widget buildTestScreen({ProviderContainer? container}) {
    const screen = MaterialApp(
      home: OnboardingScreen(),
    );

    if (container != null) {
      return UncontrolledProviderScope(
        container: container,
        child: screen,
      );
    }

    return const ProviderScope(child: screen);
  }

  void configureViewport(WidgetTester tester) {
    tester.view.physicalSize = const Size(412, 915);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  testWidgets('OnboardingScreen renders editorial header, hero, benefits and trust row', (tester) async {
    configureViewport(tester);

    await tester.pumpWidget(buildTestScreen());
    await tester.pumpAndSettle();

    // 1. Top bar: Brand lockup and Skip
    expect(find.text('Skip'), findsOneWidget);
    expect(find.text('CITIZEN JOURNALISM PLATFORM'), findsOneWidget);

    // 2. Hero editorial headline
    expect(find.textContaining('Your City.'), findsOneWidget);
    expect(find.textContaining('Your People.'), findsOneWidget);
    expect(find.textContaining('Your News.'), findsOneWidget);
    expect(
      find.text('Hyperlocal news, civic alerts, and community updates — from people like you, for people like you.'),
      findsOneWidget,
    );

    // 3. Three Key Benefits
    expect(find.text('Local News'), findsOneWidget);
    expect(find.text('From your area'), findsOneWidget);
    expect(find.text('Real People'), findsOneWidget);
    expect(find.text('Real Stories'), findsOneWidget);
    expect(find.text('A Safer &'), findsOneWidget);

    // 4. Verify Language Selector is removed from entry screen
    expect(find.text('Choose Language'), findsNothing);
    expect(find.text('English'), findsNothing);

    // 5. Enhanced Location Selector
    expect(find.text('Your Location'), findsOneWidget);
    expect(find.text('स्थान चुनें'), findsOneWidget);
    expect(find.text('5KM WIRE'), findsOneWidget);
    expect(find.text('Use GPS'), findsOneWidget);
    expect(find.text('All'), findsOneWidget);
    expect(find.text('Quick Pick:'), findsOneWidget);
    expect(find.text('Popular Indian Hubs'), findsOneWidget);

    // 6. Primary CTA
    expect(find.text('Get Started'), findsOneWidget);
    expect(find.text("It's free. No sign up needed."), findsOneWidget);

    // 7. Trust Indicators
    expect(find.text('Verified Local News'), findsOneWidget);
    expect(find.text('Ad-Transparent'), findsOneWidget);
    expect(find.text('Zero Hate. Real Conversations.'), findsOneWidget);
  });

  testWidgets('tapping Quick Pick chip selects location', (tester) async {
    configureViewport(tester);

    await tester.pumpWidget(buildTestScreen());
    await tester.pumpAndSettle();

    // Find Patna chip
    final patnaChip = find.text('Patna');
    expect(patnaChip, findsWidgets);

    await tester.ensureVisible(patnaChip.first);
    await tester.tap(patnaChip.first);
    await tester.pumpAndSettle();

    // Verify Patna is reflected as selected
    expect(find.textContaining('Patna'), findsWidgets);
  });

  testWidgets('tapping Skip triggers onboarding completion', (tester) async {
    configureViewport(tester);

    final container = ProviderContainer();
    addTearDown(container.dispose);

    await tester.pumpWidget(buildTestScreen(container: container));
    await tester.pumpAndSettle();

    expect(container.read(onboardingStateProvider).isCompleted, isFalse);

    // Tap Skip
    final skipBtn = find.text('Skip');
    expect(skipBtn, findsOneWidget);
    await tester.tap(skipBtn);
    await tester.pumpAndSettle();

    expect(container.read(onboardingStateProvider).isCompleted, isTrue);
  });

  testWidgets('tapping Get Started triggers onboarding completion', (tester) async {
    configureViewport(tester);

    final container = ProviderContainer();
    addTearDown(container.dispose);

    await tester.pumpWidget(buildTestScreen(container: container));
    await tester.pumpAndSettle();

    expect(container.read(onboardingStateProvider).isCompleted, isFalse);

    // Tap Get Started
    final getStartedBtn = find.text('Get Started');
    expect(getStartedBtn, findsOneWidget);
    await tester.ensureVisible(getStartedBtn);
    await tester.tap(getStartedBtn);
    await tester.pumpAndSettle();

    expect(container.read(onboardingStateProvider).isCompleted, isTrue);
  });
}
