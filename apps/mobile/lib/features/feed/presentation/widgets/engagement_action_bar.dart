import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/share_bottom_sheet.dart';

/// Numeric engagement action bar: ❤ 142  💬 29  ↗ 88  🔖
/// Clean, compact layout showing counts with heart pop bounce, ribbon tuck, and number roll transitions.
class EngagementActionBar extends ConsumerWidget {
  const EngagementActionBar({
    super.key,
    required this.post,
    this.onReportPressed,
  });

  final Post post;
  final VoidCallback? onReportPressed;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifier = ref.read(feedPostsProvider.notifier);
    final strings = ref.watch(appStringsProvider);
    final currentPost = ref.watch(
      feedPostsProvider.select(
        (posts) => posts.firstWhere((p) => p.id == post.id, orElse: () => post),
      ),
    );
    final isLiked = currentPost.isLiked;
    final isBookmarked = currentPost.isBookmarked;
    final isDark = context.isDarkMode;

    final brandColor = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;
    final mutedColor = context.nagrikTheme.textTertiary;

    return Row(
      children: [
        // ❤ Like with heart-pop spring bounce and animated number roll
        Semantics(
          button: true,
          label: isLiked ? 'Unlike post' : 'Like post',
          child: NagrikPressable(
            onTap: () {
              NagrikMotion.lightImpact();
              notifier.toggleLike(post.id);
            },
            scaleFactor: 0.92,
            child: _NumericAction(
              icon: isLiked ? Icons.favorite : Icons.favorite_border,
              iconColor: isLiked ? context.colorScheme.error : mutedColor,
              count: currentPost.likesCount,
              countColor: isLiked
                  ? context.colorScheme.error
                  : context.nagrikTheme.textSecondary,
              isActive: isLiked,
            ),
          ),
        ),
        const SizedBox(width: NagrikSpacing.space4),

        // 💬 Comment count with tap to open story discussion
        Semantics(
          button: true,
          label: 'Comments: ${currentPost.commentsCount}',
          child: NagrikPressable(
            onTap: () {
              NagrikMotion.lightImpact();
              context.push('/content/${post.id}', extra: post);
            },
            scaleFactor: 0.92,
            child: _NumericAction(
              icon: Icons.chat_bubble_outline_rounded,
              iconColor: mutedColor,
              count: currentPost.commentsCount,
              countColor: context.nagrikTheme.textSecondary,
            ),
          ),
        ),
        const SizedBox(width: NagrikSpacing.space4),

        // ↗ Share count with tactile spring bounce
        Semantics(
          button: true,
          label: 'Share post',
          child: NagrikPressable(
            onTap: () => showShareSheet(context, post),
            scaleFactor: 0.92,
            child: _NumericAction(
              icon: Icons.arrow_outward_rounded,
              iconColor: mutedColor,
              count: currentPost.sharesCount,
              countColor: context.nagrikTheme.textSecondary,
            ),
          ),
        ),

        const Spacer(),

        // 🔖 Bookmark with ribbon tuck-in spring animation
        Semantics(
          button: true,
          label: isBookmarked ? 'Remove bookmark' : 'Bookmark post',
          child: NagrikPressable(
            onTap: () {
              NagrikMotion.lightImpact();
              notifier.toggleBookmark(post.id);
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isBookmarked
                        ? strings.removedFromSaved
                        : strings.savedToBookmarks,
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            scaleFactor: 0.90,
            child: Padding(
              padding: const EdgeInsets.all(4),
              child: AnimatedScale(
                scale: isBookmarked ? 1.15 : 1.0,
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeOutBack,
                child: Icon(
                  isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                  color: isBookmarked ? brandColor : mutedColor,
                  size: 21,
                ),
              ),
            ),
          ),
        ),

        // 🚩 Flag/Report action
        if (onReportPressed != null) ...[
          const SizedBox(width: NagrikSpacing.space1),
          Semantics(
            button: true,
            label: 'Report story',
            child: NagrikPressable(
              onTap: onReportPressed,
              scaleFactor: 0.90,
              child: Padding(
                padding: const EdgeInsets.all(4),
                child: Icon(
                  Icons.flag_outlined,
                  color: mutedColor,
                  size: 20,
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// Compact icon + count engagement metric with animated roll transition.
class _NumericAction extends StatelessWidget {
  const _NumericAction({
    required this.icon,
    required this.iconColor,
    required this.count,
    required this.countColor,
    this.isActive = false,
  });

  final IconData icon;
  final Color iconColor;
  final int count;
  final Color countColor;
  final bool isActive;

  String _formatCount(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return n.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 44, minWidth: 44),
      padding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space1,
        vertical: NagrikSpacing.space1,
      ),
      alignment: Alignment.center,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedScale(
            scale: isActive ? 1.18 : 1.0,
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeOutBack,
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 5),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 180),
            transitionBuilder: (child, animation) {
              return SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.0, 0.3),
                  end: Offset.zero,
                ).animate(animation),
                child: FadeTransition(opacity: animation, child: child),
              );
            },
            child: Text(
              _formatCount(count),
              key: ValueKey<int>(count),
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: countColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
