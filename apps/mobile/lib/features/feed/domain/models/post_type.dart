/// Only two feed primitives: News Post and Video Report.
enum PostType {
  news('News'),
  video('Video');

  const PostType(this.label);
  final String label;
}

PostType postTypeFromApi(Object? value) {
  final raw = value?.toString().trim().toLowerCase() ?? '';
  if (raw.contains('video') ||
      raw.contains('reel') ||
      raw.contains('short')) {
    return PostType.video;
  }
  return PostType.news;
}

String postTypeToApi(PostType type) {
  return type.name;
}
