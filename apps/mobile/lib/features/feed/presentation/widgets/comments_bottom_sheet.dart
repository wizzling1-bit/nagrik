import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/domain/models/comment.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';

/// Displays the interactive community discussion and verified citizen comments sheet.
Future<void> showCommentsBottomSheet(
  BuildContext context,
  Post post, {
  void Function(Comment comment)? onCommentAdded,
}) {
  final isDark = context.isDarkMode;
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: isDark
        ? context.nagrikTheme.level2Elevated
        : context.colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (modalCtx) => CommentsBottomSheet(
      post: post,
      onCommentAdded: onCommentAdded,
    ),
  );
}

class CommentsBottomSheet extends ConsumerStatefulWidget {
  const CommentsBottomSheet({
    super.key,
    required this.post,
    this.onCommentAdded,
  });

  final Post post;
  final void Function(Comment comment)? onCommentAdded;

  @override
  ConsumerState<CommentsBottomSheet> createState() =>
      _CommentsBottomSheetState();
}

class _CommentsBottomSheetState extends ConsumerState<CommentsBottomSheet> {
  final _commentController = TextEditingController();
  late List<Comment> _comments;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _comments = List<Comment>.from(widget.post.comments);
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _submitComment() {
    final text = _commentController.text.trim();
    if (text.isEmpty || _isSubmitting) return;

    NagrikMotion.lightImpact();
    setState(() => _isSubmitting = true);

    final newComment = Comment(
      id: 'local_${DateTime.now().millisecondsSinceEpoch}',
      author: const PostAuthor(
        id: 'me',
        name: 'You',
        isVerified: true,
      ),
      text: text,
      createdAt: DateTime.now(),
    );

    setState(() {
      _comments.insert(0, newComment);
      _isSubmitting = false;
    });

    _commentController.clear();
    widget.onCommentAdded?.call(newComment);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final primary = context.colorScheme.primary;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SafeArea(
        child: Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.75,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space4,
            vertical: NagrikSpacing.space3,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 38,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 14),
                  decoration: BoxDecoration(
                    color: context.nagrikTheme.border.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(
                        'Discussion',
                        style: context.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: primary.withValues(alpha: 0.12),
                          borderRadius: NagrikRadii.borderRadiusPill,
                        ),
                        child: Text(
                          '${_comments.length}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).maybePop(),
                  ),
                ],
              ),
              const Divider(height: 12),
              // Verified Citizen Notice
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level4Muted
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusSm,
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.verified_user_outlined,
                      size: 14,
                      color: context.nagrikTheme.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Verified citizen discourse. Reports are moderated for community safety.',
                        style: TextStyle(
                          fontSize: 11,
                          color: context.nagrikTheme.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Comments List
              Expanded(
                child: _comments.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.chat_bubble_outline_rounded,
                              size: 36,
                              color: context.nagrikTheme.textTertiary,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Be the first to share ground insights',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: context.nagrikTheme.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Your perspective helps verify local developments.',
                              style: TextStyle(
                                fontSize: 12,
                                color: context.nagrikTheme.textTertiary,
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.separated(
                        itemCount: _comments.length,
                        separatorBuilder: (_, _) => const Divider(height: 16),
                        itemBuilder: (ctx, idx) {
                          final cm = _comments[idx];
                          final authorInitial = cm.author.name.isNotEmpty
                              ? cm.author.name[0].toUpperCase()
                              : 'C';
                          final timeDiff =
                              DateTime.now().difference(cm.createdAt);
                          final timeText = timeDiff.inMinutes < 60
                              ? '${timeDiff.inMinutes}m ago'
                              : '${timeDiff.inHours}h ago';

                          return Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                radius: 14,
                                backgroundColor:
                                    primary.withValues(alpha: 0.15),
                                child: Text(
                                  authorInitial,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: primary,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          cm.author.name,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                        if (cm.author.isVerified) ...[
                                          const SizedBox(width: 4),
                                          Icon(
                                            Icons.verified_rounded,
                                            size: 13,
                                            color: primary,
                                          ),
                                        ],
                                        const SizedBox(width: 6),
                                        Text(
                                          timeText,
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: context
                                                .nagrikTheme
                                                .textTertiary,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      cm.text,
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: isDark
                                            ? const Color(0xFFCBD5E1)
                                            : const Color(0xFF334155),
                                        height: 1.35,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          );
                        },
                      ),
              ),
              const SizedBox(height: 8),
              // Comment Input Field
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _submitComment(),
                      decoration: InputDecoration(
                        hintText: 'Share local perspective...',
                        hintStyle: TextStyle(
                          fontSize: 13,
                          color: context.nagrikTheme.textTertiary,
                        ),
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 10,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: NagrikRadii.borderRadiusPill,
                          borderSide: BorderSide(
                            color: context.nagrikTheme.border,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: NagrikRadii.borderRadiusPill,
                          borderSide: BorderSide(
                            color: context.nagrikTheme.border,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: NagrikRadii.borderRadiusPill,
                          borderSide: BorderSide(
                            color: primary,
                            width: 1.5,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: _submitComment,
                    icon: _isSubmitting
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.send_rounded, size: 18),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
