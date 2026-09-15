import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';

void main() {
  group('Supported Languages', () {
    test('contains only Hindi and English', () {
      expect(kSupportedLanguages.length, 2);
      final codes = kSupportedLanguages.map((l) => l.code).toSet();
      expect(codes, equals({'en', 'hi'}));
    });

    test('English and Hindi are present with accurate native names', () {
      final hindi = kSupportedLanguages.firstWhere((l) => l.code == 'hi');
      expect(hindi.nativeName, 'हिन्दी');
      final english = kSupportedLanguages.firstWhere((l) => l.code == 'en');
      expect(english.nativeName, 'English');
    });
  });

  group('Indian Locations', () {
    test('contains multiple diverse Indian cities and localities', () {
      expect(kIndianLocations.length, greaterThanOrEqualTo(15));
      final states = kIndianLocations.map((l) => l.state).toSet();
      expect(states.length, greaterThanOrEqualTo(8));
    });
  });
}
