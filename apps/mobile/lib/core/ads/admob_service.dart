import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/managers/app_open_ad_manager.dart';
import 'package:nagrik/core/ads/managers/interstitial_ad_manager.dart';

/// Production monetization service orchestrating SDK initialization,
/// UMP consent, and pre-warming of eligible ad formats.
class AdMobService {
  AdMobService(this.ref);

  final Ref ref;

  bool _isInitialized = false;

  bool get isInitialized => _isInitialized;

  /// Early, non-blocking initialization of the Google Mobile Ads SDK.
  ///
  /// Executed in parallel with non-critical app launch tasks so cold-start
  /// performance is never degraded.
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // 1. Initialize Google Mobile Ads SDK
      await MobileAds.instance.initialize();
      _isInitialized = true;
      if (kDebugMode) {
        debugPrint('Nagrik AdMob: Google Mobile Ads SDK initialized successfully.');
      }

      // 2. Request UMP Consent update
      await ref.read(adConsentProvider.notifier).gatherConsent();

      // 3. If consent is granted or not required, preload interstitial & app open
      final consent = ref.read(adConsentProvider);
      if (consent.canRequestAds) {
        unawaited(ref.read(interstitialAdManagerProvider).preloadAd());
        unawaited(ref.read(appOpenAdManagerProvider).preloadAd());
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('Nagrik AdMob: Initialization warning (continuing app launch): $e');
      }
      _isInitialized = true;
    }
  }
}

/// Provider for [AdMobService].
final adMobServiceProvider = Provider<AdMobService>((ref) {
  return AdMobService(ref);
});
