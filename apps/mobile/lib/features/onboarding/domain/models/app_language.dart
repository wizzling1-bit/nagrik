/// Represents a supported language in Nagrik.
class AppLanguage {
  const AppLanguage({
    required this.code,
    required this.englishName,
    required this.nativeName,
    required this.script,
  });

  final String code;
  final String englishName;
  final String nativeName;
  final String script;

  /// Case-insensitive search match on English or native language name.
  bool matchesQuery(String query) {
    if (query.trim().isEmpty) return true;
    final normalized = query.trim().toLowerCase();
    return englishName.toLowerCase().contains(normalized) ||
        nativeName.toLowerCase().contains(normalized) ||
        code.toLowerCase().contains(normalized);
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppLanguage &&
          runtimeType == other.runtimeType &&
          code == other.code;

  @override
  int get hashCode => code.hashCode;
}
