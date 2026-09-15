/// Author or publisher profile for a post.
class PostAuthor {
  const PostAuthor({
    required this.id,
    required this.name,
    this.avatarUrl,
    this.isVerified = false,
    this.badgeTitle,
    this.distanceKm,
  });

  final String id;
  final String name;
  final String? avatarUrl;
  final bool isVerified;
  final String? badgeTitle;
  final double? distanceKm;

  String? get formattedDistance {
    if (distanceKm == null) return null;
    if (distanceKm! < 1.0) {
      return '${(distanceKm! * 1000).round()} m away';
    }
    return '${distanceKm!.toStringAsFixed(1)} km away';
  }

  factory PostAuthor.fromJson(Map<String, dynamic> json) {
    final id = _readString(json, const ['id', '_id', 'authorId', 'sourceId']);
    final name = _readString(
      json,
      const ['name', 'displayName', 'sourceName', 'publisherName'],
    );

    if (id.isEmpty && name.isEmpty) {
      throw const FormatException('Author id or name is required.');
    }

    return PostAuthor(
      id: id.isNotEmpty ? id : name,
      name: name.isNotEmpty ? name : 'Nagrik Desk',
      avatarUrl: _readNullableString(
        json,
        const ['avatarUrl', 'avatar_url', 'imageUrl', 'logoUrl'],
      ),
      isVerified: _readBool(
        json,
        const ['isVerified', 'verified', 'is_verified'],
      ),
      badgeTitle: _readNullableString(
        json,
        const ['badgeTitle', 'badge', 'verificationLabel'],
      ),
      distanceKm: _readDouble(json, const ['distanceKm', 'distance_km']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
      'isVerified': isVerified,
      if (badgeTitle != null) 'badgeTitle': badgeTitle,
      if (distanceKm != null) 'distanceKm': distanceKm,
    };
  }
}

String _readString(Map<String, dynamic> json, List<String> keys) {
  return _readNullableString(json, keys) ?? '';
}

String? _readNullableString(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value == null) continue;
    final text = value.toString().trim();
    if (text.isNotEmpty) return text;
  }
  return null;
}

bool _readBool(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value is bool) return value;
    if (value is num) return value != 0;
    if (value is String) {
      final normalized = value.trim().toLowerCase();
      if (normalized == 'true' || normalized == '1' || normalized == 'yes') {
        return true;
      }
      if (normalized == 'false' || normalized == '0' || normalized == 'no') {
        return false;
      }
    }
  }
  return false;
}

double? _readDouble(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
  }
  return null;
}
