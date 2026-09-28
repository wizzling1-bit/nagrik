import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:share_plus/share_plus.dart';

Future<void> showShareSheet(BuildContext context, Post post) {
  final isDark = context.isDarkMode;
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor:
        isDark ? context.nagrikTheme.level2Elevated : context.colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
        top: Radius.circular(NagrikRadii.sheet),
      ),
    ),
    builder: (context) => ShareBottomSheet(post: post),
  );
}

class ShareBottomSheet extends ConsumerWidget {
  const ShareBottomSheet({super.key, required this.post});

  final Post post;

  String get _shareText => '${post.title}\n\nhttps://nagrik.news/post/${post.id}';

  Future<void> _shareSystem(BuildContext context, WidgetRef ref) async {
    NagrikMotion.lightImpact();
    ref.read(feedPostsProvider.notifier).incrementShare(post.id);
    Navigator.of(context).maybePop();
    try {
      await SharePlus.instance.share(
        ShareParams(text: _shareText, subject: post.title),
      );
    } catch (_) {
      if (context.mounted) {
        final strings = NagrikLocalizations.of(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(strings.shareFailedMsg)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(appStringsProvider);
    final isDark = context.isDarkMode;

    return SafeArea(
      child: Container(
        decoration: BoxDecoration(
          color: isDark
              ? context.nagrikTheme.level2Elevated
              : context.colorScheme.surface,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(NagrikRadii.sheet),
          ),
          border: Border(
            top: BorderSide(
              color: context.nagrikTheme.border,
              width: 1,
            ),
          ),
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: NagrikSpacing.space4,
          vertical: NagrikSpacing.space3,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: context.nagrikTheme.divider,
                  borderRadius: BorderRadius.circular(NagrikRadii.pill),
                ),
              ),
            ),
            const SizedBox(height: NagrikSpacing.space3),

            Text(
              strings.shareSheetTitle,
              style: context.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.2,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: NagrikSpacing.space1),
            Text(
              strings.shareSheetSubtitle,
              style: context.textTheme.bodySmall?.copyWith(
                color: context.nagrikTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: NagrikSpacing.space4),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _ShareAction(
                  index: 0,
                  icon: Icons.share_rounded,
                  label: strings.shareSystemAction,
                  color: context.colorScheme.primary,
                  semanticsLabel: strings.shareSystemAction,
                  onTap: () => _shareSystem(context, ref),
                ),
                _ShareAction(
                  index: 1,
                  icon: Icons.copy_rounded,
                  label: strings.copyLinkAction,
                  color: context.colorScheme.primary,
                  semanticsLabel: strings.copyLinkAction,
                  onTap: () {
                    NagrikMotion.lightImpact();
                    ref.read(feedPostsProvider.notifier).incrementShare(post.id);
                    Clipboard.setData(ClipboardData(text: _shareText));
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(strings.linkCopiedMsg)),
                      );
                      Navigator.of(context).maybePop();
                    }
                  },
                ),
                _ShareAction(
                  index: 2,
                  icon: Icons.close_rounded,
                  label: strings.close,
                  color: context.nagrikTheme.textSecondary,
                  semanticsLabel: strings.close,
                  onTap: () {
                    NagrikMotion.lightImpact();
                    Navigator.of(context).maybePop();
                  },
                ),
              ],
            ),
            const SizedBox(height: NagrikSpacing.space3),
          ],
        ),
      ),
    );
  }
}

class _ShareAction extends StatelessWidget {
  const _ShareAction({
    required this.index,
    required this.icon,
    required this.label,
    required this.color,
    required this.semanticsLabel,
    required this.onTap,
  });

  final int index;
  final IconData icon;
  final String label;
  final Color color;
  final String semanticsLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return NagrikStaggeredEntrance(
      index: index,
      baseDelay: const Duration(milliseconds: 60),
      child: Semantics(
        button: true,
        label: semanticsLabel,
        child: NagrikSpringPressable(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(NagrikSpacing.space2),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 54,
                  height: 54,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: color.withValues(alpha: 0.35),
                      width: 1.5,
                    ),
                  ),
                  child: Center(
                    child: Icon(icon, color: color, size: 24),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  label,
                  style: context.textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
