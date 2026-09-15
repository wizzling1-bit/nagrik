import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';

/// State representation of current ad session and frequency tracking.
@immutable
class AdFrequencyState {
  const AdFrequencyState({
    this.lastInterstitialTime,
    this.lastAppOpenTime,
    this.contentTransitionsCount = 0,
    this.sessionAdCount = 0,
    this.isVideoPlaying = false,
    this.isFullScreenAdShowing = false,
  });

  final DateTime? lastInterstitialTime;
  final DateTime? lastAppOpenTime;
  final int contentTransitionsCount;
  final int sessionAdCount;
  final bool isVideoPlaying;
  final bool isFullScreenAdShowing;

  AdFrequencyState copyWith({
    DateTime? lastInterstitialTime,
    DateTime? lastAppOpenTime,
    int? contentTransitionsCount,
    int? sessionAdCount,
    bool? isVideoPlaying,
    bool? isFullScreenAdShowing,
  }) {
    return AdFrequencyState(
      lastInterstitialTime: lastInterstitialTime ?? this.lastInterstitialTime,
      lastAppOpenTime: lastAppOpenTime ?? this.lastAppOpenTime,
      contentTransitionsCount:
          contentTransitionsCount ?? this.contentTransitionsCount,
      sessionAdCount: sessionAdCount ?? this.sessionAdCount,
      isVideoPlaying: isVideoPlaying ?? this.isVideoPlaying,
      isFullScreenAdShowing:
          isFullScreenAdShowing ?? this.isFullScreenAdShowing,
    );
  }
}

/// Centralized frequency manager and session-level protection engine.
///
/// Ensures the user never encounters back-to-back full-screen ads, prevents
/// ads from interrupting active video sessions, and maintains sustainable monetization
/// without degrading app retention.
class AdFrequencyManager extends StateNotifier<AdFrequencyState> {
  AdFrequencyManager(this.ref) : super(const AdFrequencyState());

  final Ref ref;

  /// Increments content transition counter (e.g. user finishes reading content
  /// and navigates back to the feed).
  void recordContentTransition() {
    state = state.copyWith(
      contentTransitionsCount: state.contentTransitionsCount + 1,
    );
  }

  /// Sets whether a video is actively playing in [NagrikVideoPlayer].
  ///
  /// Full-screen ads are strictly locked while video playback is active.
  void setVideoPlaying(bool isPlaying) {
    if (state.isVideoPlaying != isPlaying) {
      state = state.copyWith(isVideoPlaying: isPlaying);
    }
  }

  /// Sets whether a full-screen ad (Interstitial or App Open) is currently open on screen.
  void setFullScreenAdShowing(bool isShowing) {
    if (state.isFullScreenAdShowing != isShowing) {
      state = state.copyWith(isFullScreenAdShowing: isShowing);
    }
  }

  /// Evaluates whether an Interstitial ad is eligible to be shown right now.
  ///
  /// Requires:
  /// 1. Interstitials enabled in configuration.
  /// 2. Not currently displaying another full-screen ad.
  /// 3. No video actively playing.
  /// 4. Transition threshold met (e.g. >= 5 content transitions).
  /// 5. Global full-screen cooldown elapsed since the last Interstitial OR App Open.
  bool canShowInterstitial() {
    final config = ref.read(adConfigurationProvider);
    if (!config.interstitialEnabled) return false;
    if (state.isFullScreenAdShowing) return false;
    if (state.isVideoPlaying) return false;

    // Check transition threshold
    if (state.contentTransitionsCount <
        config.interstitialTransitionThreshold) {
      return false;
    }

    final now = DateTime.now();

    // Check cooldown since last interstitial
    if (state.lastInterstitialTime != null) {
      final elapsedSeconds =
          now.difference(state.lastInterstitialTime!).inSeconds;
      if (elapsedSeconds < config.fullScreenCooldownSeconds) {
        return false;
      }
    }

    // Check cooldown since last App Open ad (global full-screen protection)
    if (state.lastAppOpenTime != null) {
      final elapsedSeconds =
          now.difference(state.lastAppOpenTime!).inSeconds;
      if (elapsedSeconds < config.fullScreenCooldownSeconds) {
        return false;
      }
    }

    return true;
  }

  /// Evaluates whether an App Open ad is eligible to be shown on cold start / resume.
  ///
  /// Requires:
  /// 1. App Open enabled in configuration.
  /// 2. Not currently displaying another full-screen ad.
  /// 3. No video actively playing.
  /// 4. App Open cooldown period elapsed (e.g. 4 minutes).
  /// 5. Global full-screen cooldown elapsed.
  bool canShowAppOpen() {
    final config = ref.read(adConfigurationProvider);
    if (!config.appOpenEnabled) return false;
    if (state.isFullScreenAdShowing) return false;
    if (state.isVideoPlaying) return false;

    final now = DateTime.now();

    // Check cooldown since last App Open
    if (state.lastAppOpenTime != null) {
      final elapsedSeconds = now.difference(state.lastAppOpenTime!).inSeconds;
      if (elapsedSeconds < config.appOpenCooldownSeconds) {
        return false;
      }
    }

    // Check cooldown since last Interstitial (global full-screen protection)
    if (state.lastInterstitialTime != null) {
      final elapsedSeconds =
          now.difference(state.lastInterstitialTime!).inSeconds;
      if (elapsedSeconds < config.fullScreenCooldownSeconds) {
        return false;
      }
    }

    return true;
  }

  /// Records that an Interstitial ad has been displayed.
  /// Resets transition count and updates timestamps.
  void recordInterstitialShown() {
    state = state.copyWith(
      lastInterstitialTime: DateTime.now(),
      contentTransitionsCount: 0,
      sessionAdCount: state.sessionAdCount + 1,
      isFullScreenAdShowing: true,
    );
  }

  /// Records that an App Open ad has been displayed.
  void recordAppOpenShown() {
    state = state.copyWith(
      lastAppOpenTime: DateTime.now(),
      sessionAdCount: state.sessionAdCount + 1,
      isFullScreenAdShowing: true,
    );
  }

  /// Records when a full-screen ad has been closed or dismissed.
  void recordFullScreenDismissed() {
    state = state.copyWith(
      isFullScreenAdShowing: false,
    );
  }
}

/// Provider for [AdFrequencyManager].
final adFrequencyManagerProvider =
    StateNotifierProvider<AdFrequencyManager, AdFrequencyState>((ref) {
  return AdFrequencyManager(ref);
});
