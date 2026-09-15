import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/ad_constants.dart';
import 'package:nagrik/core/ads/ad_frequency_manager.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Preloads and displays App Open Ads on eligible cold start & foreground resumes.
///
/// Policy & UX Protections:
/// - Never interrupts the animated brand splash screen.
/// - Never appears during first-time onboarding.
/// - Respects 4-hour cache expiry to avoid stale impressions.
/// - Enforces global full-screen cooldown via [AdFrequencyManager].
class AppOpenAdManager with WidgetsBindingObserver {
  AppOpenAdManager(this.ref) {
    WidgetsBinding.instance.addObserver(this);
  }

  final Ref ref;

  AppOpenAd? _appOpenAd;
  DateTime? _appOpenLoadTime;
  bool _isLoading = false;
  bool _isSplashCompleted = false;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  /// Google AdMob guidelines specify a maximum cache life of 4 hours for App Open ads.
  static const Duration _maxCacheDuration = Duration(hours: 4);

  bool get isAdAvailable {
    if (_appOpenAd == null || _appOpenLoadTime == null) return false;
    final isExpired =
        DateTime.now().difference(_appOpenLoadTime!) > _maxCacheDuration;
    if (isExpired) {
      _appOpenAd?.dispose();
      _appOpenAd = null;
      _appOpenLoadTime = null;
      return false;
    }
    return true;
  }

  /// Called when the splash screen narrative concludes.
  void markSplashCompleted() {
    _isSplashCompleted = true;
    preloadAd();
  }

  /// Preloads an App Open ad in the background.
  Future<void> preloadAd() async {
    final config = ref.read(adConfigurationProvider);
    if (!config.appOpenEnabled) return;

    final consent = ref.read(adConsentProvider);
    if (!consent.canRequestAds) return;

    if (isAdAvailable || _isLoading) return;
    _isLoading = true;

    final adUnitId = AdConstants.getAdUnitId(
      AdFormat.appOpen,
      forceTestMode: config.forceTestAds,
    );

    try {
      await AppOpenAd.load(
        adUnitId: adUnitId,
        request: const AdRequest(),
        adLoadCallback: AppOpenAdLoadCallback(
          onAdLoaded: (ad) {
            _log('Nagrik AppOpen: Ad loaded and cached successfully.');
            _appOpenAd = ad;
            _appOpenLoadTime = DateTime.now();
            _isLoading = false;
          },
          onAdFailedToLoad: (error) {
            _log(
              'Nagrik AppOpen: Failed to load [${error.code}]: ${error.message}',
            );
            _appOpenAd = null;
            _appOpenLoadTime = null;
            _isLoading = false;
          },
        ),
      );
    } catch (e) {
      _log('Nagrik AppOpen: Exception during load: $e');
      _appOpenAd = null;
      _isLoading = false;
    }
  }

  /// Shows the App Open ad if one is available and all frequency rules are satisfied.
  Future<bool> showAdIfAvailable({String reason = 'foreground_resume'}) async {
    // 1. Guard against displaying during splash or onboarding
    if (!_isSplashCompleted) return false;
    final hasCompletedOnboarding =
        ref.read(hasCompletedOnboardingProvider);
    if (!hasCompletedOnboarding) return false;

    final frequencyManager = ref.read(adFrequencyManagerProvider.notifier);

    // 2. Check cooldowns and eligibility
    if (!frequencyManager.canShowAppOpen()) {
      return false;
    }

    // 3. Ensure ad is available and fresh
    if (!isAdAvailable) {
      preloadAd();
      return false;
    }

    final ad = _appOpenAd!;
    _appOpenAd = null;
    _appOpenLoadTime = null;

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdShowedFullScreenContent: (ad) {
        _log('Nagrik AppOpen: Showing ad ($reason).');
        frequencyManager.recordAppOpenShown();
      },
      onAdDismissedFullScreenContent: (ad) {
        _log('Nagrik AppOpen: Ad dismissed by user ($reason).');
        frequencyManager.recordFullScreenDismissed();
        ad.dispose();
        preloadAd();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        _log(
          'Nagrik AppOpen: Failed to show [${error.code}]: ${error.message}',
        );
        frequencyManager.recordFullScreenDismissed();
        ad.dispose();
        preloadAd();
      },
      onAdImpression: (ad) {
        _log('Nagrik AppOpen: Impression logged ($reason).');
      },
      onAdClicked: (ad) {
        _log('Nagrik AppOpen: Click logged ($reason).');
      },
    );

    try {
      await ad.show();
      return true;
    } catch (e) {
      _log('Nagrik AppOpen: Error showing ad: $e');
      frequencyManager.recordFullScreenDismissed();
      ad.dispose();
      preloadAd();
      return false;
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      showAdIfAvailable(reason: 'app_foregrounded');
    }
  }

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _appOpenAd?.dispose();
    _appOpenAd = null;
  }
}

/// Provider for [AppOpenAdManager].
final appOpenAdManagerProvider = Provider<AppOpenAdManager>((ref) {
  final manager = AppOpenAdManager(ref);
  ref.onDispose(manager.dispose);
  return manager;
});
