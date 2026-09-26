import 'dart:io';
import 'package:flutter/foundation.dart';

/// Available AdMob ad formats in Nagrik.
enum AdFormat {
  banner,
  interstitial,
  rewardedInterstitial,
  rewarded,
  native,
  appOpen,
}

/// Centralized repository of all production and test AdMob IDs.
///
/// Under NO circumstances should ad unit IDs be hardcoded in widgets.
/// During development, testing, and debugging (`kDebugMode`), official Google
/// Test Ad IDs are automatically served to protect against invalid traffic penalties.
abstract final class AdConstants {
  // ---------------------------------------------------------------------------
  // Production AdMob Configuration
  // ---------------------------------------------------------------------------
  static const String prodAppId = 'ca-app-pub-3435015056397165~2351220725';
  static const String prodBanner = 'ca-app-pub-3435015056397165/2346034641';
  static const String prodInterstitial = 'ca-app-pub-3435015056397165/8719871300';
  static const String prodRewardedInterstitial = 'ca-app-pub-3435015056397165/5224796077';
  static const String prodRewarded = 'ca-app-pub-3435015056397165/3382794465';
  static const String prodNative = 'ca-app-pub-3435015056397165/1945589712';
  static const String prodAppOpen = 'ca-app-pub-3435015056397165/2999651087';

  // ---------------------------------------------------------------------------
  // Google Official Test Ad Units (Android)
  // ---------------------------------------------------------------------------
  static const String testAndroidBanner = 'ca-app-pub-3940256099942544/6300978111';
  static const String testAndroidInterstitial = 'ca-app-pub-3940256099942544/1033173712';
  static const String testAndroidRewarded = 'ca-app-pub-3940256099942544/5224354917';
  static const String testAndroidRewardedInterstitial = 'ca-app-pub-3940256099942544/5354046379';
  static const String testAndroidNative = 'ca-app-pub-3940256099942544/2247696110';
  static const String testAndroidAppOpen = 'ca-app-pub-3940256099942544/9257390508';

  // ---------------------------------------------------------------------------
  // Google Official Test Ad Units (iOS)
  // ---------------------------------------------------------------------------
  static const String testIosBanner = 'ca-app-pub-3940256099942544/2934735716';
  static const String testIosInterstitial = 'ca-app-pub-3940256099942544/4411468910';
  static const String testIosRewarded = 'ca-app-pub-3940256099942544/1712485313';
  static const String testIosRewardedInterstitial = 'ca-app-pub-3940256099942544/6978759866';
  static const String testIosNative = 'ca-app-pub-3940256099942544/3986624511';
  static const String testIosAppOpen = 'ca-app-pub-3940256099942544/5575463023';

  /// Automatically defaults to test ads during debug builds (unless executing inside `flutter test`).
  static bool get defaultTestMode =>
      kDebugMode && !(!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'));

  /// Resolves the correct Ad Unit ID for the target platform and build mode.
  ///
  /// In debug mode during real app execution, official Google Test Ad IDs are served
  /// by default to prevent AdMob invalid traffic policy strikes.
  /// Set [forceTestMode] to override explicitly.
  static String getAdUnitId(AdFormat format, {bool? forceTestMode}) {
    final isTest = forceTestMode ?? defaultTestMode;
    final isIos = !kIsWeb && Platform.isIOS;

    if (isTest) {
      return switch (format) {
        AdFormat.banner => isIos ? testIosBanner : testAndroidBanner,
        AdFormat.interstitial => isIos ? testIosInterstitial : testAndroidInterstitial,
        AdFormat.rewardedInterstitial =>
          isIos ? testIosRewardedInterstitial : testAndroidRewardedInterstitial,
        AdFormat.rewarded => isIos ? testIosRewarded : testAndroidRewarded,
        AdFormat.native => isIos ? testIosNative : testAndroidNative,
        AdFormat.appOpen => isIos ? testIosAppOpen : testAndroidAppOpen,
      };
    }

    // Production IDs
    return switch (format) {
      AdFormat.banner => prodBanner,
      AdFormat.interstitial => prodInterstitial,
      AdFormat.rewardedInterstitial => prodRewardedInterstitial,
      AdFormat.rewarded => prodRewarded,
      AdFormat.native => prodNative,
      AdFormat.appOpen => prodAppOpen,
    };
  }
}
