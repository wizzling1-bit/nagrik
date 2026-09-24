import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Network connection speed and bandwidth tier.
enum NetworkTier {
  threeG,
  fourG,
  fiveGOrWifi,
}

/// Adaptive media and timeout configuration tuned for connection quality.
class NetworkProfile {
  const NetworkProfile({
    required this.tier,
    required this.maxImageCacheWidth,
    required this.videoPrefetchCount,
    required this.requestTimeout,
    required this.enableAggressivePrefetch,
  });

  final NetworkTier tier;
  final int maxImageCacheWidth;
  final int videoPrefetchCount;
  final Duration requestTimeout;
  final bool enableAggressivePrefetch;

  static NetworkProfile forTier(NetworkTier tier) {
    return switch (tier) {
      NetworkTier.threeG => const NetworkProfile(
          tier: NetworkTier.threeG,
          maxImageCacheWidth: 480,
          videoPrefetchCount: 0,
          requestTimeout: Duration(seconds: 5),
          enableAggressivePrefetch: false,
        ),
      NetworkTier.fourG => const NetworkProfile(
          tier: NetworkTier.fourG,
          maxImageCacheWidth: 720,
          videoPrefetchCount: 1,
          requestTimeout: Duration(seconds: 10),
          enableAggressivePrefetch: false,
        ),
      NetworkTier.fiveGOrWifi => const NetworkProfile(
          tier: NetworkTier.fiveGOrWifi,
          maxImageCacheWidth: 1080,
          videoPrefetchCount: 2,
          requestTimeout: Duration(seconds: 15),
          enableAggressivePrefetch: true,
        ),
    };
  }
}

/// Riverpod notifier managing active network profile.
class NetworkProfileNotifier extends Notifier<NetworkProfile> {
  @override
  NetworkProfile build() => NetworkProfile.forTier(NetworkTier.fourG);

  void setTier(NetworkTier tier) {
    state = NetworkProfile.forTier(tier);
  }
}

final networkProfileProvider =
    NotifierProvider<NetworkProfileNotifier, NetworkProfile>(
  NetworkProfileNotifier.new,
);
