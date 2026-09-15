import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/ad_constants.dart';
import 'package:nagrik/core/ads/ad_frequency_manager.dart';

/// Preloads and manages Interstitial Ads for natural transition points.
///
/// Features:
/// - Background pre-fetching so user navigation is never blocked.
/// - Frequency and cooldown gating through [AdFrequencyManager].
/// - Automatic disposal and re-preloading on dismissal.
/// - Duplicate load prevention.
class InterstitialAdManager {
  InterstitialAdManager(this.ref);

  final Ref ref;

  InterstitialAd? _interstitialAd;
  bool _isLoading = false;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  bool get isAdReady => _interstitialAd != null;

  /// Loads an Interstitial ad in the background ahead of time.
  Future<void> preloadAd() async {
    final consent = ref.read(adConsentProvider);
    if (!consent.canRequestAds) {
      _log('Nagrik Interstitial: Cannot request ads due to UMP consent status.');
      return;
    }

    final config = ref.read(adConfigurationProvider);
    if (!config.interstitialEnabled) return;

    if (_interstitialAd != null || _isLoading) return;
    _isLoading = true;

    final adUnitId = AdConstants.getAdUnitId(
      AdFormat.interstitial,
      forceTestMode: config.forceTestAds,
    );

    try {
      await InterstitialAd.load(
        adUnitId: adUnitId,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            _log('Nagrik Interstitial: Ad successfully loaded and preloaded.');
            _interstitialAd = ad;
            _isLoading = false;
          },
          onAdFailedToLoad: (error) {
            _log(
              'Nagrik Interstitial: Failed to load [${error.code}]: ${error.message}',
            );
            _interstitialAd = null;
            _isLoading = false;
          },
        ),
      );
    } catch (e) {
      _log('Nagrik Interstitial: Exception during load: $e');
      _interstitialAd = null;
      _isLoading = false;
    }
  }

  /// Evaluates frequency and cooldown rules, and displays the interstitial if eligible.
  ///
  /// Returns `true` if an ad was shown; `false` otherwise.
  /// Awaits user dismissal so navigation flows naturally without clipping views.
  Future<bool> maybeShowInterstitial({
    required String placement,
  }) async {
    final frequencyManager = ref.read(adFrequencyManagerProvider.notifier);

    // 1. Check eligibility with frequency manager
    if (!frequencyManager.canShowInterstitial()) {
      return false;
    }

    // 2. Check if an ad is loaded and ready
    if (_interstitialAd == null) {
      // Proactively request next ad so it's ready for future transitions
      preloadAd();
      return false;
    }

    final ad = _interstitialAd!;
    _interstitialAd = null;
    final completer = Completer<bool>();

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdShowedFullScreenContent: (ad) {
        _log('Nagrik Interstitial: Full screen content presented ($placement).');
        frequencyManager.recordInterstitialShown();
      },
      onAdDismissedFullScreenContent: (ad) {
        _log('Nagrik Interstitial: Ad dismissed by user ($placement).');
        frequencyManager.recordFullScreenDismissed();
        ad.dispose();
        preloadAd();
        if (!completer.isCompleted) completer.complete(true);
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        _log(
          'Nagrik Interstitial: Failed to show [${error.code}]: ${error.message}',
        );
        frequencyManager.recordFullScreenDismissed();
        ad.dispose();
        preloadAd();
        if (!completer.isCompleted) completer.complete(false);
      },
      onAdImpression: (ad) {
        _log('Nagrik Interstitial: Impression logged ($placement).');
      },
      onAdClicked: (ad) {
        _log('Nagrik Interstitial: Click recorded ($placement).');
      },
    );

    try {
      await ad.show();
      return await completer.future.timeout(
        const Duration(seconds: 8),
        onTimeout: () {
          _log('Nagrik Interstitial: Timed out waiting for ad dismissal.');
          return false;
        },
      );
    } catch (e) {
      _log('Nagrik Interstitial: Error showing ad: $e');
      frequencyManager.recordFullScreenDismissed();
      ad.dispose();
      preloadAd();
      return false;
    }
  }

  void dispose() {
    _interstitialAd?.dispose();
    _interstitialAd = null;
    _isLoading = false;
  }
}

/// Provider for [InterstitialAdManager].
final interstitialAdManagerProvider = Provider<InterstitialAdManager>((ref) {
  final manager = InterstitialAdManager(ref);
  ref.onDispose(manager.dispose);
  return manager;
});
