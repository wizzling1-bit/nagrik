import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Immutable configuration model for Nagrik's monetization engine.
///
/// Centralizes all frequencies, cooldown durations, and feature flags.
/// Designed for future remote-config readiness without scattering parameters across UI screens.
@immutable
class AdConfiguration {
  const AdConfiguration({
    this.nativeFeedFrequency = 7,
    this.interstitialTransitionThreshold = 5,
    this.fullScreenCooldownSeconds = 45,
    this.appOpenCooldownSeconds = 120,
    this.minSavedCountForAds = 3,
    this.nativeEnabled = true,
    this.interstitialEnabled = true,
    this.appOpenEnabled = true,
    this.bannerEnabled = true,
    this.rewardedEnabled = false,
    this.rewardedInterstitialEnabled = false,
    this.forceTestAds = false,
  });

  /// Organic feed item interval between native ad insertions.
  /// (e.g. 7 means 1 native ad after every 7 organic items).
  final int nativeFeedFrequency;

  /// Meaningful content transitions required before an interstitial ad is considered.
  final int interstitialTransitionThreshold;

  /// Global cooldown period (in seconds) between any full-screen ads (Interstitial or App Open).
  final int fullScreenCooldownSeconds;

  /// Cooldown period (in seconds) between consecutive App Open ads.
  final int appOpenCooldownSeconds;

  /// Minimum bookmarks required on the Saved screen before rendering an ad.
  final int minSavedCountForAds;

  /// Feature flag for Native ads.
  final bool nativeEnabled;

  /// Feature flag for Interstitial ads.
  final bool interstitialEnabled;

  /// Feature flag for App Open ads.
  final bool appOpenEnabled;

  /// Feature flag for Adaptive Banner ads.
  final bool bannerEnabled;

  /// Feature flag for Rewarded ads (intentionally false until reward economy exists).
  final bool rewardedEnabled;

  /// Feature flag for Rewarded Interstitial ads (intentionally false).
  final bool rewardedInterstitialEnabled;

  /// Explicitly force test ads regardless of build mode. If null, defaults to [kDebugMode].
  final bool? forceTestAds;

  AdConfiguration copyWith({
    int? nativeFeedFrequency,
    int? interstitialTransitionThreshold,
    int? fullScreenCooldownSeconds,
    int? appOpenCooldownSeconds,
    int? minSavedCountForAds,
    bool? nativeEnabled,
    bool? interstitialEnabled,
    bool? appOpenEnabled,
    bool? bannerEnabled,
    bool? rewardedEnabled,
    bool? rewardedInterstitialEnabled,
    bool? forceTestAds,
  }) {
    return AdConfiguration(
      nativeFeedFrequency: nativeFeedFrequency ?? this.nativeFeedFrequency,
      interstitialTransitionThreshold: interstitialTransitionThreshold ??
          this.interstitialTransitionThreshold,
      fullScreenCooldownSeconds:
          fullScreenCooldownSeconds ?? this.fullScreenCooldownSeconds,
      appOpenCooldownSeconds:
          appOpenCooldownSeconds ?? this.appOpenCooldownSeconds,
      minSavedCountForAds: minSavedCountForAds ?? this.minSavedCountForAds,
      nativeEnabled: nativeEnabled ?? this.nativeEnabled,
      interstitialEnabled: interstitialEnabled ?? this.interstitialEnabled,
      appOpenEnabled: appOpenEnabled ?? this.appOpenEnabled,
      bannerEnabled: bannerEnabled ?? this.bannerEnabled,
      rewardedEnabled: rewardedEnabled ?? this.rewardedEnabled,
      rewardedInterstitialEnabled:
          rewardedInterstitialEnabled ?? this.rewardedInterstitialEnabled,
      forceTestAds: forceTestAds ?? this.forceTestAds,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AdConfiguration &&
          runtimeType == other.runtimeType &&
          nativeFeedFrequency == other.nativeFeedFrequency &&
          interstitialTransitionThreshold ==
              other.interstitialTransitionThreshold &&
          fullScreenCooldownSeconds == other.fullScreenCooldownSeconds &&
          appOpenCooldownSeconds == other.appOpenCooldownSeconds &&
          minSavedCountForAds == other.minSavedCountForAds &&
          nativeEnabled == other.nativeEnabled &&
          interstitialEnabled == other.interstitialEnabled &&
          appOpenEnabled == other.appOpenEnabled &&
          bannerEnabled == other.bannerEnabled &&
          rewardedEnabled == other.rewardedEnabled &&
          rewardedInterstitialEnabled == other.rewardedInterstitialEnabled &&
          forceTestAds == other.forceTestAds;

  @override
  int get hashCode => Object.hash(
        nativeFeedFrequency,
        interstitialTransitionThreshold,
        fullScreenCooldownSeconds,
        appOpenCooldownSeconds,
        minSavedCountForAds,
        nativeEnabled,
        interstitialEnabled,
        appOpenEnabled,
        bannerEnabled,
        rewardedEnabled,
        rewardedInterstitialEnabled,
        forceTestAds,
      );
}

/// State notifier provider for dynamic/remote ad configuration.
final adConfigurationProvider =
    StateNotifierProvider<AdConfigurationNotifier, AdConfiguration>((ref) {
  return AdConfigurationNotifier();
});

class AdConfigurationNotifier extends StateNotifier<AdConfiguration> {
  AdConfigurationNotifier() : super(const AdConfiguration());

  void updateConfiguration(AdConfiguration config) {
    state = config;
  }

  void setNativeFeedFrequency(int frequency) {
    state = state.copyWith(nativeFeedFrequency: frequency);
  }

  void setInterstitialThreshold(int threshold) {
    state = state.copyWith(interstitialTransitionThreshold: threshold);
  }

  void toggleTestMode(bool forceTest) {
    state = state.copyWith(forceTestAds: forceTest);
  }
}
