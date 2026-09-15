import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Consent status state for the UI and monetization engine.
@immutable
class AdConsentState {
  const AdConsentState({
    this.isConsentGathered = false,
    this.canRequestAds = true,
    this.isPrivacyOptionsRequired = false,
    this.errorMessage,
  });

  final bool isConsentGathered;
  final bool canRequestAds;
  final bool isPrivacyOptionsRequired;
  final String? errorMessage;

  AdConsentState copyWith({
    bool? isConsentGathered,
    bool? canRequestAds,
    bool? isPrivacyOptionsRequired,
    String? errorMessage,
  }) {
    return AdConsentState(
      isConsentGathered: isConsentGathered ?? this.isConsentGathered,
      canRequestAds: canRequestAds ?? this.canRequestAds,
      isPrivacyOptionsRequired:
          isPrivacyOptionsRequired ?? this.isPrivacyOptionsRequired,
      errorMessage: errorMessage,
    );
  }
}

/// Manages Google User Messaging Platform (UMP) consent flow.
///
/// Ensures compliance across EEA, UK, Switzerland, US state privacy requirements,
/// and worldwide jurisdictions without hardcoded geography.
class AdConsentManager extends StateNotifier<AdConsentState> {
  AdConsentManager() : super(const AdConsentState());

  bool _isGatheringConsent = false;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  /// Requests consent information update and presents the consent form if required.
  ///
  /// This should be invoked early during app startup, but runs asynchronously
  /// so it never blocks frame rendering or the brand splash animation.
  Future<void> gatherConsent({
    ConsentRequestParameters? parameters,
  }) async {
    if (_isGatheringConsent) return;
    _isGatheringConsent = true;

    final completer = Completer<void>();

    try {
      final params = parameters ?? ConsentRequestParameters();

      ConsentInformation.instance.requestConsentInfoUpdate(
        params,
        () async {
          // Consent info updated successfully. Present form if required by Google UMP.
          ConsentForm.loadAndShowConsentFormIfRequired(
            (FormError? formError) async {
              if (formError != null) {
                _log(
                  'Nagrik UMP: Consent form error [${formError.errorCode}]: ${formError.message}',
                );
              }

              await _refreshConsentStatus();
              _isGatheringConsent = false;
              if (!completer.isCompleted) completer.complete();
            },
          );
        },
        (FormError formError) async {
          _log(
            'Nagrik UMP: Consent info update failed [${formError.errorCode}]: ${formError.message}',
          );
          // If UMP fails or is unconfigured in non-EEA, do not block ads
          state = state.copyWith(
            isConsentGathered: true,
            canRequestAds: true,
            errorMessage: formError.message,
          );
          _isGatheringConsent = false;
          if (!completer.isCompleted) completer.complete();
        },
      );
    } catch (e) {
      _log('Nagrik UMP: Exception during consent gathering: $e');
      _isGatheringConsent = false;
      state = state.copyWith(
        isConsentGathered: true,
        canRequestAds: true,
        errorMessage: e.toString(),
      );
      if (!completer.isCompleted) completer.complete();
    }

    return completer.future.timeout(
      const Duration(seconds: 8),
      onTimeout: () {
        _log('Nagrik UMP: Consent gathering timed out; proceeding.');
        _isGatheringConsent = false;
      },
    );
  }

  /// Refreshes whether ads can be requested and whether privacy options entry point is required.
  Future<void> _refreshConsentStatus() async {
    try {
      final status =
          await ConsentInformation.instance.getPrivacyOptionsRequirementStatus();
      final isPrivacyRequired =
          status == PrivacyOptionsRequirementStatus.required;

      bool canRequest = await ConsentInformation.instance.canRequestAds();
      // If privacy options are not required (e.g. outside EEA/UK), allow ad requests
      if (!isPrivacyRequired) {
        canRequest = true;
      }

      state = state.copyWith(
        isConsentGathered: true,
        canRequestAds: canRequest,
        isPrivacyOptionsRequired: isPrivacyRequired,
      );
    } catch (e) {
      _log('Nagrik UMP: Failed to read consent info: $e');
      state = state.copyWith(
        isConsentGathered: true,
        canRequestAds: true,
      );
    }
  }

  /// Presents the Google UMP Privacy Options form.
  ///
  /// Accessible directly from Nagrik Settings screen to allow users to modify
  /// their consent preferences at any time as mandated by Google policies.
  Future<void> showPrivacyOptionsForm() async {
    final completer = Completer<void>();

    try {
      ConsentForm.showPrivacyOptionsForm((FormError? formError) async {
        if (formError != null) {
          _log(
            'Nagrik UMP: Error presenting privacy options [${formError.errorCode}]: ${formError.message}',
          );
        }
        await _refreshConsentStatus();
        if (!completer.isCompleted) completer.complete();
      });
    } catch (e) {
      _log('Nagrik UMP: Failed to show privacy options form: $e');
      if (!completer.isCompleted) completer.complete();
    }

    return completer.future;
  }
}

/// Provider for [AdConsentManager].
final adConsentProvider =
    StateNotifierProvider<AdConsentManager, AdConsentState>((ref) {
  return AdConsentManager();
});
