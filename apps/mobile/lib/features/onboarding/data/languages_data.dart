import 'package:nagrik/features/onboarding/domain/models/app_language.dart';

/// Supported languages in Nagrik: English and Hindi.
const List<AppLanguage> kSupportedLanguages = [
  AppLanguage(code: 'en', englishName: 'English', nativeName: 'English', script: 'Latin'),
  AppLanguage(code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari'),
];
