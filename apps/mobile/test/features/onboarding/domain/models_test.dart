import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/onboarding/domain/models/app_language.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/domain/models/notification_preferences.dart';

void main() {
  group('AppLanguage', () {
    test('instantiates with all fields', () {
      const lang = AppLanguage(
        code: 'hi',
        englishName: 'Hindi',
        nativeName: 'हिन्दी',
        script: 'Devanagari',
      );
      expect(lang.code, 'hi');
      expect(lang.englishName, 'Hindi');
      expect(lang.nativeName, 'हिन्दी');
      expect(lang.script, 'Devanagari');
    });

    test('matchesQuery searches english and native names', () {
      const lang = AppLanguage(
        code: 'bn',
        englishName: 'Bengali',
        nativeName: 'বাংলা',
        script: 'Bengali',
      );
      expect(lang.matchesQuery('beng'), isTrue);
      expect(lang.matchesQuery('বাং'), isTrue);
      expect(lang.matchesQuery('tamil'), isFalse);
    });
  });

  group('LocationItem', () {
    test('displayName formats locality and city properly', () {
      const location = LocationItem(
        id: 'loc_1',
        locality: 'Salt Lake Sector V',
        city: 'Kolkata',
        district: 'North 24 Parganas',
        state: 'West Bengal',
        pincode: '700091',
      );
      expect(location.displayName, 'Salt Lake Sector V, Kolkata');
      expect(location.fullAddress, 'Salt Lake Sector V, Kolkata, North 24 Parganas, West Bengal - 700091');
    });

    test('matchesQuery searches across locality, city, district, state', () {
      const location = LocationItem(
        id: 'loc_1',
        locality: 'Indiranagar',
        city: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
      );
      expect(location.matchesQuery('indira'), isTrue);
      expect(location.matchesQuery('bengaluru'), isTrue);
      expect(location.matchesQuery('karnataka'), isTrue);
      expect(location.matchesQuery('delhi'), isFalse);
    });
  });

  group('NotificationPreferences', () {
    test('default preferences enable breaking and local news', () {
      const prefs = NotificationPreferences.defaults();
      expect(prefs.breakingNews, isTrue);
      expect(prefs.localNews, isTrue);
      expect(prefs.newVideos, isFalse);
    });

    test('copyWith updates individual flags', () {
      const prefs = NotificationPreferences.defaults();
      final updated = prefs.copyWith(newVideos: true);
      expect(updated.newVideos, isTrue);
      expect(updated.breakingNews, isTrue);
      expect(updated.localNews, isTrue);
    });
  });
}
