import 'package:flutter/material.dart';

/// Semantic subject category for feed filtering.
enum PostCategory {
  all('All', Icons.grid_view),
  civic('Civic', Icons.report_problem_outlined),
  traffic('Traffic', Icons.traffic_outlined),
  weather('Weather', Icons.cloud_outlined),
  events('Events', Icons.event_outlined),
  crime('Safety', Icons.local_police_outlined),
  jobs('Jobs', Icons.work_outline),
  utilities('Utilities', Icons.water_drop_outlined);

  const PostCategory(this.label, this.icon);
  final String label;
  final IconData icon;
}

PostCategory postCategoryFromApi(Object? value) {
  final raw = switch (value) {
    String text => text,
    Map<String, dynamic> map =>
      _readString(map, const ['slug', 'id', 'name', 'label', 'title']),
    Map map => _readString(
        map.cast<String, dynamic>(),
        const ['slug', 'id', 'name', 'label', 'title'],
      ),
    _ => '',
  };

  final normalized = raw
      .trim()
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z0-9]+'), '_')
      .replaceAll(RegExp(r'_+'), '_')
      .replaceAll(RegExp(r'^_|_$'), '');

  return switch (normalized) {
    'all' => PostCategory.all,
    'civic' || 'civic_updates' || 'public' || 'local_news' || 'politics' =>
      PostCategory.civic,
    'traffic' || 'transport' || 'metro' || 'road' => PostCategory.traffic,
    'weather' || 'rain' || 'rain_alert' => PostCategory.weather,
    'event' || 'events' || 'festival' || 'durga_puja' => PostCategory.events,
    'crime' || 'safety' || 'police' || 'public_safety' => PostCategory.crime,
    'job' || 'jobs' || 'opportunity' || 'opportunities' => PostCategory.jobs,
    'utility' ||
    'utilities' ||
    'water' ||
    'electricity' ||
    'infrastructure' =>
      PostCategory.utilities,
    _ => PostCategory.all,
  };
}

String postCategoryToApi(PostCategory category) {
  return category.name;
}

String _readString(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value == null) continue;
    final text = value.toString().trim();
    if (text.isNotEmpty) return text;
  }
  return '';
}
