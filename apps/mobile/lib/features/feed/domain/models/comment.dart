import 'package:nagrik/features/feed/domain/models/post_author.dart';

/// Comment on a feed post.
class Comment {
  const Comment({
    required this.id,
    required this.author,
    required this.text,
    required this.createdAt,
    this.likesCount = 0,
    this.isLiked = false,
  });

  final String id;
  final PostAuthor author;
  final String text;
  final DateTime createdAt;
  final int likesCount;
  final bool isLiked;

  factory Comment.fromJson(Map<String, dynamic> json) {
    final authorJson = json['author'] is Map
        ? (json['author'] as Map).cast<String, dynamic>()
        : <String, dynamic>{
            'id': json['user_id'] ?? json['userId'] ?? json['device_id'] ?? 'anon',
            'name': json['author_name'] ?? json['authorName'] ?? 'Citizen',
            'avatarUrl': json['author_avatar'] ?? json['authorAvatar'],
          };

    final createdStr = json['createdAt'] ?? json['created_at'];
    final created = createdStr != null
        ? DateTime.tryParse(createdStr.toString()) ?? DateTime.now()
        : DateTime.now();

    return Comment(
      id: json['id']?.toString() ?? 'cmt_${DateTime.now().millisecondsSinceEpoch}',
      author: PostAuthor.fromJson(authorJson),
      text: json['text']?.toString() ?? '',
      createdAt: created,
      likesCount: (json['likesCount'] ?? json['likes_count'] ?? json['likes'] as num?)?.toInt() ?? 0,
      isLiked: json['isLiked'] == true || json['is_liked'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'author': author.toJson(),
      'text': text,
      'createdAt': createdAt.toIso8601String(),
      'likesCount': likesCount,
      'isLiked': isLiked,
    };
  }

  Comment copyWith({
    int? likesCount,
    bool? isLiked,
  }) {
    return Comment(
      id: id,
      author: author,
      text: text,
      createdAt: createdAt,
      likesCount: likesCount ?? this.likesCount,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
