import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/network/network_profile_service.dart';

void main() {
  group('NetworkProfileService', () {
    test('3G profile has conservative limits and low latency timeout', () {
      final profile = NetworkProfile.forTier(NetworkTier.threeG);
      expect(profile.maxImageCacheWidth, 480);
      expect(profile.videoPrefetchCount, 0);
      expect(profile.requestTimeout.inSeconds, 5);
      expect(profile.enableAggressivePrefetch, isFalse);
    });

    test('4G profile has standard balance', () {
      final profile = NetworkProfile.forTier(NetworkTier.fourG);
      expect(profile.maxImageCacheWidth, 720);
      expect(profile.videoPrefetchCount, 1);
      expect(profile.requestTimeout.inSeconds, 10);
      expect(profile.enableAggressivePrefetch, isFalse);
    });

    test('5G/WiFi profile allows maximum fidelity and aggressive prefetch', () {
      final profile = NetworkProfile.forTier(NetworkTier.fiveGOrWifi);
      expect(profile.maxImageCacheWidth, 1080);
      expect(profile.videoPrefetchCount, 2);
      expect(profile.requestTimeout.inSeconds, 15);
      expect(profile.enableAggressivePrefetch, isTrue);
    });
  });
}
