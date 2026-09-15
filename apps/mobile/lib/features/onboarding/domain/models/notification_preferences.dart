/// Minimal news and video notification preferences.
class NotificationPreferences {
  const NotificationPreferences({
    required this.breakingNews,
    required this.localNews,
    required this.newVideos,
  });

  const NotificationPreferences.defaults()
      : breakingNews = true,
        localNews = true,
        newVideos = false;

  final bool breakingNews;
  final bool localNews;
  final bool newVideos;

  NotificationPreferences copyWith({
    bool? breakingNews,
    bool? localNews,
    bool? newVideos,
  }) {
    return NotificationPreferences(
      breakingNews: breakingNews ?? this.breakingNews,
      localNews: localNews ?? this.localNews,
      newVideos: newVideos ?? this.newVideos,
    );
  }

  Map<String, dynamic> toJson() => {
        'breakingNews': breakingNews,
        'localNews': localNews,
        'newVideos': newVideos,
      };

  factory NotificationPreferences.fromJson(Map<String, dynamic> json) {
    bool readBool(String key, bool fallback) {
      final v = json[key];
      if (v is bool) return v;
      if (v is num) return v != 0;
      if (v is String) {
        final n = v.trim().toLowerCase();
        if (n == 'true' || n == '1' || n == 'yes') return true;
        if (n == 'false' || n == '0' || n == 'no') return false;
      }
      return fallback;
    }

    const d = NotificationPreferences.defaults();
    return NotificationPreferences(
      breakingNews: readBool('breakingNews', d.breakingNews),
      localNews: readBool('localNews', d.localNews),
      newVideos: readBool('newVideos', d.newVideos),
    );
  }
}
