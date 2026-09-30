import 'package:nagrik/features/feed/domain/models/comment.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';

/// Streamlined Post entity for the Nagrik Local News & Video Feed.
/// Adheres strictly to the APIs.md schema with full backwards compatibility.
class Post {
  const Post({
    required this.id,
    required this.type,
    required this.category,
    required this.author,
    required this.title,
    required this.body,
    required this.locality,
    required this.city,
    required this.createdAt,
    this.mediaUrls = const [],
    this.videoDuration,
    this.viewCount,
    this.isUrgent = false,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.sharesCount = 0,
    this.isLiked = false,
    this.isBookmarked = false,
    this.comments = const [],
    this.creatorId,
    this.state = '',
    this.country = 'India',
    this.latitude,
    this.longitude,
    this.videoUrl,
    this.thumbnailUrl,
    this.eligibleViews,
    this.savesCount = 0,
    this.categorySlug,
    this.relevanceScore,
    this.locationTier,
    this.distanceKm,
    this.authorName,
    this.sourceName,
    this.sourceUrl,
    this.mediaAttribution,
    this.isOriginal = true,
    this.correctionNote,
    this.correctionStatus = 'NONE',
    this.updatedAt,
  });

  final String id;
  final PostType type;
  final PostCategory category;
  final PostAuthor author;
  final String title;
  final String body;
  final String locality;
  final String city;
  final String state;
  final String country;
  final double? latitude;
  final double? longitude;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final List<String> mediaUrls;
  final String? videoUrl;
  final String? thumbnailUrl;
  final String? videoDuration;
  final int? viewCount;
  final int? eligibleViews;
  final bool isUrgent;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final int savesCount;
  final bool isLiked;
  final bool isBookmarked;
  final List<Comment> comments;
  final String? creatorId;

  // Source Transparency & Statutory Editorial Provenance
  final String? authorName;
  final String? sourceName;
  final String? sourceUrl;
  final String? mediaAttribution;
  final bool isOriginal;
  final String? correctionNote;
  final String? correctionStatus;

  /// Raw backend category slug (e.g. "politics", "sports"). Preserved
  /// verbatim so feed/search filtering can use the server taxonomy instead
  /// of the lossy local [PostCategory] enum mapping.
  final String? categorySlug;
  final double? relevanceScore;
  final String? locationTier;
  final double? distanceKm;

  String get timeAgo {
    final diff = DateTime.now().difference(createdAt);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
  }

  Post copyWith({
    String? id,
    PostType? type,
    PostCategory? category,
    PostAuthor? author,
    String? title,
    String? body,
    String? locality,
    String? city,
    String? state,
    String? country,
    double? latitude,
    double? longitude,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? mediaUrls,
    String? videoUrl,
    String? thumbnailUrl,
    String? videoDuration,
    int? viewCount,
    int? eligibleViews,
    bool? isUrgent,
    bool? isLiked,
    int? likesCount,
    bool? isBookmarked,
    int? commentsCount,
    int? sharesCount,
    int? savesCount,
    List<Comment>? comments,
    String? creatorId,
    String? categorySlug,
    double? relevanceScore,
    String? locationTier,
    double? distanceKm,
    String? authorName,
    String? sourceName,
    String? sourceUrl,
    String? mediaAttribution,
    bool? isOriginal,
    String? correctionNote,
    String? correctionStatus,
  }) {
    return Post(
      id: id ?? this.id,
      type: type ?? this.type,
      category: category ?? this.category,
      author: author ?? this.author,
      title: title ?? this.title,
      body: body ?? this.body,
      locality: locality ?? this.locality,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      mediaUrls: mediaUrls ?? this.mediaUrls,
      videoUrl: videoUrl ?? this.videoUrl,
      thumbnailUrl: thumbnailUrl ?? this.thumbnailUrl,
      videoDuration: videoDuration ?? this.videoDuration,
      viewCount: viewCount ?? this.viewCount,
      eligibleViews: eligibleViews ?? this.eligibleViews,
      isUrgent: isUrgent ?? this.isUrgent,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      savesCount: savesCount ?? this.savesCount,
      isLiked: isLiked ?? this.isLiked,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      comments: comments ?? this.comments,
      creatorId: creatorId ?? this.creatorId,
      categorySlug: categorySlug ?? this.categorySlug,
      relevanceScore: relevanceScore ?? this.relevanceScore,
      locationTier: locationTier ?? this.locationTier,
      distanceKm: distanceKm ?? this.distanceKm,
      authorName: authorName ?? this.authorName,
      sourceName: sourceName ?? this.sourceName,
      sourceUrl: sourceUrl ?? this.sourceUrl,
      mediaAttribution: mediaAttribution ?? this.mediaAttribution,
      isOriginal: isOriginal ?? this.isOriginal,
      correctionNote: correctionNote ?? this.correctionNote,
      correctionStatus: correctionStatus ?? this.correctionStatus,
    );
  }

  factory Post.fromJson(Map<String, dynamic> json) {
    // If the item is wrapped in feed envelope: { "itemType": "CONTENT", "data": { ... } }
    final sourceJson = json.containsKey('data') && json['data'] is Map
        ? (json['data'] as Map).cast<String, dynamic>()
        : json;

    final id = _readString(sourceJson, const ['id', '_id', 'contentId', 'content_id']);
    if (id.isEmpty) {
      throw const FormatException('Content id is required.');
    }

    final location = _readMap(sourceJson, const ['location', 'place']);
    final authorJson = _readMap(
      sourceJson,
      const ['author', 'source', 'publisher', 'creator'],
    );

    final area = _readString(sourceJson, const ['locality', 'area', 'neighborhood'])
        .ifEmpty(_readString(location, const ['locality', 'area', 'neighborhood']));
    final city = _readString(sourceJson, const ['city'])
        .ifEmpty(_readString(location, const ['city']));
    final state = _readString(sourceJson, const ['state'])
        .ifEmpty(_readString(location, const ['state']));
    final country = _readString(sourceJson, const ['country'])
        .ifEmpty(_readString(location, const ['country']))
        .ifEmpty('India');

    final coordMap = location != null ? _readMap(location, const ['coordinates', 'coord']) : null;
    final latitude = (coordMap?['latitude'] as num?)?.toDouble() ??
        (sourceJson['latitude'] as num?)?.toDouble();
    final longitude = (coordMap?['longitude'] as num?)?.toDouble() ??
        (sourceJson['longitude'] as num?)?.toDouble();

    final directMediaUrl = _readNullableString(
      sourceJson,
      const ['mediaUrl', 'media_url'],
    );
    final directThumbnailUrl = _readNullableString(
      sourceJson,
      const ['thumbnailUrl', 'thumbnail_url'],
    );

    final mediaList = _readStringList(sourceJson, const [
      'mediaUrls',
      'media_urls',
      'images',
      'imageUrls',
      'image_urls',
      'thumbnailUrls',
      'thumbnail_urls',
      'media',
    ]);

    final combinedMedia = <String>[...mediaList];
    if (directThumbnailUrl != null && !combinedMedia.contains(directThumbnailUrl)) {
      combinedMedia.insert(0, directThumbnailUrl);
    }
    if (directMediaUrl != null && !combinedMedia.contains(directMediaUrl)) {
      // If it's an image url or thumbnail, ensure it's available
      if (!directMediaUrl.endsWith('.mp4')) {
        combinedMedia.add(directMediaUrl);
      }
    }

    final postType = postTypeFromApi(
      _readAny(sourceJson, const ['type', 'contentType', 'content_type', 'mediaType']),
    );

    final creatorId = _readNullableString(sourceJson, const ['creatorId', 'creator_id']);

    final authorName = _readString(
      sourceJson,
      const ['authorName', 'sourceName', 'publisherName', 'creatorName'],
    ).ifEmpty(authorJson != null ? _readString(authorJson, const ['name', 'authorName']) : 'Nagrik Desk');

    final author = authorJson != null
        ? PostAuthor.fromJson(authorJson)
        : PostAuthor(
            id: creatorId ?? _readString(sourceJson, const ['authorId', 'sourceId', 'publisherId']),
            name: authorName,
            avatarUrl: _readNullableString(
              sourceJson,
              const ['authorAvatarUrl', 'sourceLogoUrl', 'creatorAvatarUrl'],
            ),
            isVerified: _readBool(
              sourceJson,
              const ['isVerified', 'verified', 'sourceVerified'],
            ),
          );

    // Prefer explicit slug keys: `toJson` emits both the lossy legacy
    // `category` enum name and the verbatim `categorySlug`, so the slug
    // must win or round-trips collapse every slug to the enum mapping.
    final rawCategory = _readAny(
      sourceJson,
      const ['categorySlug', 'category_slug', 'categoryId', 'category'],
    );
    final rawSlug = switch (rawCategory) {
      String text => text.trim().isEmpty ? null : text.trim().toLowerCase(),
      Map<String, dynamic> map =>
        _readNullableString(map, const ['slug', 'name'])?.toLowerCase(),
      Map map =>
        _readNullableString(map.cast<String, dynamic>(), const ['slug', 'name'])
            ?.toLowerCase(),
      _ => null,
    };

    return Post(
      id: id,
      type: postType,
      category: postCategoryFromApi(rawCategory),
      author: author,
      title: _readString(sourceJson, const ['title', 'headline', 'name']),
      body: _readString(
        sourceJson,
        const ['body', 'description', 'summary', 'content', 'excerpt'],
      ),
      locality: area,
      city: city,
      state: state,
      country: country,
      latitude: latitude,
      longitude: longitude,
      createdAt: _readDateTime(
        sourceJson,
        const ['createdAt', 'created_at', 'publishedAt', 'published_at'],
      ),
      mediaUrls: List.unmodifiable(combinedMedia),
      videoUrl: postType == PostType.video ? directMediaUrl : null,
      thumbnailUrl: directThumbnailUrl,
      videoDuration: _readNullableString(
        sourceJson,
        const ['videoDuration', 'video_duration', 'duration'],
      ),
      viewCount: _readInt(
        sourceJson,
        const ['viewCount', 'viewsCount', 'views', 'view_count'],
      ),
      eligibleViews: _readInt(
        sourceJson,
        const ['eligibleViews', 'eligible_views'],
      ),
      isUrgent: _readBool(
        sourceJson,
        const ['isUrgent', 'urgent', 'isBreaking', 'breaking'],
      ),
      likesCount: _readInt(
            sourceJson,
            const ['likesCount', 'likeCount', 'likes', 'likes_count'],
          ) ??
          0,
      commentsCount: _readInt(
            sourceJson,
            const ['commentsCount', 'commentCount', 'comments_count'],
          ) ??
          0,
      sharesCount: _readInt(
            sourceJson,
            const ['sharesCount', 'shareCount', 'shares', 'shares_count'],
          ) ??
          0,
      savesCount: _readInt(
            sourceJson,
            const ['savesCount', 'saveCount', 'saves', 'saves_count'],
          ) ??
          0,
      isLiked: _readBool(sourceJson, const ['isLiked', 'liked', 'hasLiked']),
      isBookmarked: _readBool(
        sourceJson,
        const ['isBookmarked', 'bookmarked', 'isSaved', 'saved', 'hasSaved'],
      ),
      creatorId: creatorId,
      categorySlug: rawSlug,
      relevanceScore: (sourceJson['relevanceScore'] as num?)?.toDouble(),
      locationTier: _readNullableString(sourceJson, const ['locationTier', 'location_tier']),
      distanceKm: (sourceJson['distanceKm'] as num?)?.toDouble(),
      authorName: _readNullableString(sourceJson, const ['authorName', 'author_name']),
      sourceName: _readNullableString(sourceJson, const ['sourceName', 'source_name']),
      sourceUrl: _readNullableString(sourceJson, const ['sourceUrl', 'source_url']),
      mediaAttribution: _readNullableString(sourceJson, const ['mediaAttribution', 'media_attribution']),
      isOriginal: _readBool(sourceJson, const ['isOriginal', 'is_original']) ||
          !sourceJson.containsKey('isOriginal') && !sourceJson.containsKey('is_original'),
      correctionNote: _readNullableString(sourceJson, const ['correctionNote', 'correction_note']),
      correctionStatus: _readString(sourceJson, const ['correctionStatus', 'correction_status']).ifEmpty('NONE'),
      updatedAt: sourceJson['updatedAt'] != null || sourceJson['updated_at'] != null
          ? _readDateTime(sourceJson, const ['updatedAt', 'updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': postTypeToApi(type).toUpperCase(),
      'category': postCategoryToApi(category),
      if (categorySlug != null) 'categorySlug': categorySlug,
      'author': author.toJson(),
      'title': title,
      'description': body,
      'location': {
        'country': country,
        'state': state,
        'city': city,
        'area': locality,
        if (latitude != null && longitude != null)
          'coordinates': {
            'latitude': latitude,
            'longitude': longitude,
          },
      },
      'createdAt': createdAt.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
      'mediaUrls': mediaUrls,
      if (videoUrl != null) 'mediaUrl': videoUrl,
      if (thumbnailUrl != null) 'thumbnailUrl': thumbnailUrl,
      if (videoDuration != null) 'videoDuration': videoDuration,
      if (viewCount != null) 'views': viewCount,
      if (eligibleViews != null) 'eligibleViews': eligibleViews,
      'isUrgent': isUrgent,
      'likes': likesCount,
      'commentsCount': commentsCount,
      'shares': sharesCount,
      'saves': savesCount,
      'isLiked': isLiked,
      'isSaved': isBookmarked,
      if (creatorId != null) 'creatorId': creatorId,
      if (relevanceScore != null) 'relevanceScore': relevanceScore,
      if (locationTier != null) 'locationTier': locationTier,
      if (distanceKm != null) 'distanceKm': distanceKm,
      if (authorName != null) 'authorName': authorName,
      if (sourceName != null) 'sourceName': sourceName,
      if (sourceUrl != null) 'sourceUrl': sourceUrl,
      if (mediaAttribution != null) 'mediaAttribution': mediaAttribution,
      'isOriginal': isOriginal,
      if (correctionNote != null) 'correctionNote': correctionNote,
      if (correctionStatus != null) 'correctionStatus': correctionStatus,
    };
  }
}

extension _StringFallback on String {
  String ifEmpty(String fallback) => isEmpty ? fallback : this;
}

Object? _readAny(Map<String, dynamic>? json, List<String> keys) {
  if (json == null) return null;
  for (final key in keys) {
    if (json.containsKey(key)) return json[key];
  }
  return null;
}

String _readString(Map<String, dynamic>? json, List<String> keys) {
  return _readNullableString(json, keys) ?? '';
}

String? _readNullableString(Map<String, dynamic>? json, List<String> keys) {
  if (json == null) return null;
  for (final key in keys) {
    final value = json[key];
    if (value == null) continue;
    final text = value.toString().trim();
    if (text.isNotEmpty) return text;
  }
  return null;
}

Map<String, dynamic>? _readMap(Map<String, dynamic>? json, List<String> keys) {
  if (json == null) return null;
  for (final key in keys) {
    final value = json[key];
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return value.cast<String, dynamic>();
  }
  return null;
}

List<String> _readStringList(Map<String, dynamic> json, List<String> keys) {
  final direct = _readNullableString(
    json,
    const [
      'imageUrl',
      'image_url',
      'thumbnailUrl',
      'thumbnail_url',
      'videoThumbnailUrl',
      'video_thumbnail_url',
    ],
  );
  final urls = <String>[
    ?direct,
  ];

  for (final key in keys) {
    final value = json[key];
    if (value is List) {
      for (final item in value) {
        if (item is String && item.trim().isNotEmpty) {
          urls.add(item.trim());
        } else if (item is Map) {
          final map = item.cast<String, dynamic>();
          final url = _readNullableString(
            map,
            const ['url', 'imageUrl', 'thumbnailUrl'],
          );
          if (url != null) urls.add(url);
        }
      }
    }
  }

  return List.unmodifiable(urls.toSet());
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

int? _readInt(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value is int) return value;
    if (value is num) return value.round();
    if (value is String) return int.tryParse(value);
  }
  return null;
}

DateTime _readDateTime(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value is DateTime) return value;
    if (value is String) {
      final parsed = DateTime.tryParse(value);
      if (parsed != null) return parsed;
    }
    if (value is int) {
      return DateTime.fromMillisecondsSinceEpoch(
        value > 9999999999 ? value : value * 1000,
      );
    }
  }
  return DateTime.now();
}
