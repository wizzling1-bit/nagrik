import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_frequency_manager.dart';

void main() {
  group('AdFrequencyManager', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer(
        overrides: [
          adConfigurationProvider.overrideWith((ref) {
            return AdConfigurationNotifier()
              ..updateConfiguration(
                const AdConfiguration(
                  interstitialTransitionThreshold: 3,
                  fullScreenCooldownSeconds: 60,
                  appOpenCooldownSeconds: 120,
                  interstitialEnabled: true,
                  appOpenEnabled: true,
                ),
              );
          }),
        ],
      );
    });

    tearDown(() {
      container.dispose();
    });

    test('interstitial requires transition threshold', () {
      final manager = container.read(adFrequencyManagerProvider.notifier);

      expect(manager.canShowInterstitial(), isFalse);

      manager.recordContentTransition();
      expect(manager.canShowInterstitial(), isFalse);

      manager.recordContentTransition();
      expect(manager.canShowInterstitial(), isFalse);

      // 3rd transition meets threshold of 3
      manager.recordContentTransition();
      expect(manager.canShowInterstitial(), isTrue);
    });

    test('showing interstitial resets transition counter and activates cooldown', () {
      final manager = container.read(adFrequencyManagerProvider.notifier);

      // Meet threshold
      manager.recordContentTransition();
      manager.recordContentTransition();
      manager.recordContentTransition();
      expect(manager.canShowInterstitial(), isTrue);

      manager.recordInterstitialShown();
      final state = container.read(adFrequencyManagerProvider);
      expect(state.contentTransitionsCount, 0);
      expect(state.sessionAdCount, 1);
      expect(state.isFullScreenAdShowing, isTrue);

      // Now cannot show because fullScreenAd is showing and cooldown is active
      expect(manager.canShowInterstitial(), isFalse);

      manager.recordFullScreenDismissed();
      expect(manager.canShowInterstitial(), isFalse); // transitions = 0, cooldown active
    });

    test('locks full-screen ads when video is playing', () {
      final manager = container.read(adFrequencyManagerProvider.notifier);

      manager.recordContentTransition();
      manager.recordContentTransition();
      manager.recordContentTransition();
      expect(manager.canShowInterstitial(), isTrue);

      // User starts watching a video
      manager.setVideoPlaying(true);
      expect(manager.canShowInterstitial(), isFalse);
      expect(manager.canShowAppOpen(), isFalse);

      // Video finishes / paused
      manager.setVideoPlaying(false);
      expect(manager.canShowInterstitial(), isTrue);
    });
  });
}
