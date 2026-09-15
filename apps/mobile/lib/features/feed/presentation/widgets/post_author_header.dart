import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/nagrik_avatar.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';

/// Reusable author header matching the reference design:
/// [Avatar with specular ring] [Name + Verified / Time • Locality]   [Trailing / 3-dots]
class PostAuthorHeader extends StatelessWidget {
  const PostAuthorHeader({
    super.key,
    required this.author,
    required this.locality,
    required this.timeAgo,
    this.categoryLabel,
    this.trailing,
    this.showDistance = false,
    this.onMorePressed,
  });

  factory PostAuthorHeader.fromPost(
    Post post, {
    bool showCategory = false,
    bool showDistance = false,
    Widget? trailing,
    VoidCallback? onMorePressed,
  }) {
    return PostAuthorHeader(
      author: post.author,
      locality: post.locality,
      timeAgo: post.timeAgo,
      categoryLabel: showCategory ? post.category.label : null,
      trailing: trailing,
      showDistance: showDistance,
      onMorePressed: onMorePressed,
    );
  }

  final PostAuthor author;
  final String locality;
  final String timeAgo;
  final String? categoryLabel;
  final Widget? trailing;
  final bool showDistance;
  final VoidCallback? onMorePressed;

  @override
  Widget build(BuildContext context) {
    final distance = showDistance ? author.formattedDistance : null;
    final isDark = context.isDarkMode;
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return Row(
      children: [
        // Verified Author Avatar with specular ring
        NagrikAvatar(
          name: author.name,
          imageUrl: author.avatarUrl,
          size: NagrikAvatarSize.sm,
        ),
        const SizedBox(width: NagrikSpacing.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Flexible(
                    child: Text(
                      author.name,
                      style: context.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        letterSpacing: -0.1,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (author.isVerified) ...[
                    const SizedBox(width: 4),
                    const VerificationBadge(size: 14),
                  ],
                ],
              ),
              const SizedBox(height: 2),
              Row(
                children: [
                  Flexible(
                    child: Text(
                      locality,
                      style: TextStyle(
                        color: subtextColor,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w400,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (distance != null)
                    Text(
                      ' • $distance',
                      style: TextStyle(
                        color: context.colorScheme.primary,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                      ),
                    )
                  else if (timeAgo.isNotEmpty)
                    Text(
                      ' • $timeAgo',
                      style: TextStyle(
                        color: subtextColor,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
        if (trailing != null)
          trailing!
        else if (categoryLabel != null)
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            child: Container(
              key: ValueKey(categoryLabel),
              padding: const EdgeInsets.symmetric(
                horizontal: 8,
                vertical: 3,
              ),
              decoration: BoxDecoration(
                color: context.colorScheme.primary.withValues(
                  alpha: isDark ? 0.14 : 0.08,
                ),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(
                  color: context.colorScheme.primary.withValues(
                    alpha: isDark ? 0.32 : 0.20,
                  ),
                  width: 0.8,
                ),
              ),
              child: Text(
                categoryLabel!,
                style: TextStyle(
                  color: context.colorScheme.primary,
                  fontWeight: FontWeight.w700,
                  fontSize: 11,
                ),
              ),
            ),
          )
        else if (onMorePressed != null)
          IconButton(
            icon: Icon(
              Icons.more_vert,
              size: 20,
              color: subtextColor,
            ),
            tooltip: 'More options',
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            onPressed: onMorePressed,
          )
        else
          Icon(
            Icons.more_vert,
            size: 18,
            color: subtextColor,
          ),
      ],
    );
  }
}
