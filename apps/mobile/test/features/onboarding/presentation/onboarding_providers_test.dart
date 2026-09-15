import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

void main() {
  group('OnboardingStateNotifier', () {
    test('initial state has default language English and isCompleted false on fresh install', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final state = container.read(onboardingStateProvider);
      expect(state.selectedLanguage.code, 'en');
      expect(state.selectedLocation, isNull);
      expect(state.isCompleted, isFalse);
    });

    test('selectLanguage updates selected language', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final hindi = kSupportedLanguages.firstWhere((l) => l.code == 'hi');
      container.read(onboardingStateProvider.notifier).selectLanguage(hindi);

      expect(container.read(onboardingStateProvider).selectedLanguage.code, 'hi');
      expect(container.read(selectedLanguageProvider).code, 'hi');
    });

    test('selectLocation updates location item', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final loc = kIndianLocations.first;
      container.read(onboardingStateProvider.notifier).selectLocation(loc);

      expect(container.read(onboardingStateProvider).selectedLocation, loc);
      expect(container.read(selectedLocationProvider), loc);
    });

    test('completeOnboarding marks state completed', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(onboardingStateProvider.notifier);
      notifier.completeOnboarding();

      expect(container.read(onboardingStateProvider).isCompleted, isTrue);
      expect(container.read(hasCompletedOnboardingProvider), isTrue);
    });
  });
}
