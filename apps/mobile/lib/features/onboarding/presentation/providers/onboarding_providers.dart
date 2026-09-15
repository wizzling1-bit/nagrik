import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/domain/models/app_language.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/domain/models/notification_preferences.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// App user preferences and onboarding state object.
class OnboardingState {
  const OnboardingState({
    required this.selectedLanguage,
    this.selectedLocation,
    this.notificationPreferences = const NotificationPreferences.defaults(),
    this.isCompleted = false,
  });

  final AppLanguage selectedLanguage;
  final LocationItem? selectedLocation;
  final NotificationPreferences notificationPreferences;
  final bool isCompleted;

  OnboardingState copyWith({
    AppLanguage? selectedLanguage,
    LocationItem? selectedLocation,
    bool clearLocation = false,
    NotificationPreferences? notificationPreferences,
    bool? isCompleted,
  }) {
    return OnboardingState(
      selectedLanguage: selectedLanguage ?? this.selectedLanguage,
      selectedLocation: clearLocation ? null : (selectedLocation ?? this.selectedLocation),
      notificationPreferences: notificationPreferences ?? this.notificationPreferences,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

/// Manages app preferences and onboarding state.
final onboardingStateProvider =
    NotifierProvider<OnboardingStateNotifier, OnboardingState>(
  OnboardingStateNotifier.new,
);

class OnboardingStateNotifier extends Notifier<OnboardingState> {
  static const _kLanguagePrefKey = 'nagrik_app_language_code';
  static const _kLocationPrefKey = 'nagrik_app_location_json';
  static const _kCompletedPrefKey = 'nagrik_onboarding_completed_v1';
  static const _kNotifPrefsKey = 'nagrik_notif_prefs_json';

  @override
  OnboardingState build() {
    _loadSavedPreferences();
    return OnboardingState(
      selectedLanguage: kSupportedLanguages.first,
    );
  }

  Future<void> _loadSavedPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isCompleted = prefs.getBool(_kCompletedPrefKey) ?? false;

      final code = prefs.getString(_kLanguagePrefKey);
      AppLanguage? lang;
      if (code != null) {
        lang = kSupportedLanguages.firstWhere(
          (l) => l.code == code,
          orElse: () => kSupportedLanguages.first,
        );
      }

      LocationItem? loc;
      final rawLoc = prefs.getString(_kLocationPrefKey);
      if (rawLoc != null && rawLoc.isNotEmpty) {
        try {
          final decoded = jsonDecode(rawLoc);
          if (decoded is Map<String, dynamic>) {
            loc = LocationItem.fromJson(decoded);
          } else if (decoded is Map) {
            loc = LocationItem.fromJson(decoded.cast<String, dynamic>());
          }
        } catch (_) {
          loc = null;
        }
      }

      NotificationPreferences notif = const NotificationPreferences.defaults();
      final rawNotif = prefs.getString(_kNotifPrefsKey);
      if (rawNotif != null && rawNotif.isNotEmpty) {
        try {
          final decoded = jsonDecode(rawNotif);
          if (decoded is Map<String, dynamic>) {
            notif = NotificationPreferences.fromJson(decoded);
          } else if (decoded is Map) {
            notif = NotificationPreferences.fromJson(decoded.cast<String, dynamic>());
          }
        } catch (_) {}
      }

      // Avoid overwriting newer in-memory selections that landed while loading.
      final current = state;
      state = current.copyWith(
        isCompleted: isCompleted || current.isCompleted,
        selectedLanguage: code != null ? (lang ?? current.selectedLanguage) : current.selectedLanguage,
        selectedLocation: rawLoc != null ? loc : current.selectedLocation,
        notificationPreferences: rawNotif != null ? notif : current.notificationPreferences,
      );
    } catch (_) {}
  }

  void selectLanguage(AppLanguage language) {
    state = state.copyWith(selectedLanguage: language);
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(_kLanguagePrefKey, language.code);
    }).catchError((_) {});
  }

  void selectLocation(LocationItem location) {
    state = state.copyWith(selectedLocation: location);
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(_kLocationPrefKey, jsonEncode(location.toJson()));
    }).catchError((_) {});
  }

  void updateNotificationPreferences(NotificationPreferences preferences) {
    state = state.copyWith(notificationPreferences: preferences);
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(_kNotifPrefsKey, jsonEncode(preferences.toJson()));
    }).catchError((_) {});
  }

  void completeOnboarding() {
    state = state.copyWith(isCompleted: true);
    SharedPreferences.getInstance().then((prefs) {
      prefs.setBool(_kCompletedPrefKey, true);
    }).catchError((_) {});
  }
}

/// Persistent onboarding completion tracker.
final hasCompletedOnboardingProvider = Provider<bool>((ref) {
  return ref.watch(onboardingStateProvider.select((s) => s.isCompleted));
});

/// Convenience selector for selected language.
final selectedLanguageProvider = Provider<AppLanguage>((ref) {
  return ref.watch(onboardingStateProvider.select((s) => s.selectedLanguage));
});

/// Convenience selector for selected location.
final selectedLocationProvider = Provider<LocationItem?>((ref) {
  return ref.watch(onboardingStateProvider.select((s) => s.selectedLocation));
});

/// Convenience selector for notification preferences.
final notificationPreferencesProvider = Provider<NotificationPreferences>((ref) {
  return ref.watch(onboardingStateProvider.select((s) => s.notificationPreferences));
});
