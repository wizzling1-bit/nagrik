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
