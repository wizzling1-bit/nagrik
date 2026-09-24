import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/skeleton_loading.dart';

/// Content-shaped skeleton card mimicking feed cards during loading states.
class FeedCardSkeleton extends StatelessWidget {
  const FeedCardSkeleton({
    super.key,
    this.hasMedia = true,
  });

  final bool hasMedia;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;

    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: NagrikRadii.borderRadiusMd,
        side: BorderSide(
          color: isDark
              ? context.nagrikTheme.border.withValues(alpha: 0.5)
              : context.nagrikTheme.border,
        ),
      ),
      color: context.nagrikTheme.level1Surface,
      child: NagrikShimmer(
        highlightColor: isDark
            ? context.nagrikTheme.level3Interactive
            : context.nagrikTheme.level2Elevated,
        child: Padding(
          padding: const EdgeInsets.all(NagrikSpacing.space4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Author header skeleton
              const Row(
              children: [
                SkeletonBox(
                  width: 32,
                  height: 32,
                  shape: BoxShape.circle,
                ),
                SizedBox(width: NagrikSpacing.space3),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SkeletonBox(
                        width: 120,
                        height: 12,
                        borderRadius: NagrikRadii.xs,
                      ),
                      SizedBox(height: 4),
                      SkeletonBox(
                        width: 80,
                        height: 10,
                        borderRadius: NagrikRadii.xs,
                      ),
                    ],
                  ),
                ),
                SkeletonBox(
                  width: 48,
                  height: 18,
                  borderRadius: NagrikRadii.xs,
                ),
              ],
            ),
            const SizedBox(height: NagrikSpacing.space3),

            // Title line 1 & 2
            const SkeletonBox(
              width: double.infinity,
              height: 14,
              borderRadius: NagrikRadii.xs,
            ),
            const SizedBox(height: 6),
            const SkeletonBox(
              width: 200,
              height: 14,
              borderRadius: NagrikRadii.xs,
            ),
            const SizedBox(height: NagrikSpacing.space2),

            // Body preview line
            const SkeletonBox(
              width: double.infinity,
              height: 11,
              borderRadius: NagrikRadii.xs,
            ),
            const SizedBox(height: 4),
            const SkeletonBox(
              width: 260,
              height: 11,
              borderRadius: NagrikRadii.xs,
            ),

            // Media box skeleton
            if (hasMedia) ...[
              const SizedBox(height: NagrikSpacing.space3),
              ClipRRect(
                borderRadius: NagrikRadii.borderRadiusSm,
                child: const AspectRatio(
                  aspectRatio: 16 / 9,
                  child: SkeletonBox(
                    width: double.infinity,
                    height: double.infinity,
                  ),
                ),
              ),
            ],

            const SizedBox(height: NagrikSpacing.space3),
            Divider(color: context.nagrikTheme.divider, height: 1),
            const SizedBox(height: NagrikSpacing.space2),

            // Engagement buttons skeleton
            const Row(
              children: [
                SkeletonBox(
                  width: 50,
                  height: 20,
                  borderRadius: NagrikRadii.xs,
                ),
                SizedBox(width: NagrikSpacing.space4),
                SkeletonBox(
                  width: 50,
                  height: 20,
                  borderRadius: NagrikRadii.xs,
                ),
                SizedBox(width: NagrikSpacing.space4),
                SkeletonBox(
                  width: 50,
                  height: 20,
                  borderRadius: NagrikRadii.xs,
                ),
                Spacer(),
                SkeletonBox(
                  width: 24,
                  height: 24,
                  borderRadius: NagrikRadii.xs,
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

/// List of feed skeleton items for loading state.
class FeedListSkeleton extends StatelessWidget {
  const FeedListSkeleton({
    super.key,
    this.itemCount = 3,
  });

  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return SkeletonScope(
      child: Column(
        children: List.generate(
          itemCount,
          (index) => FeedCardSkeleton(hasMedia: index.isEven),
        ),
      ),
    );
  }
}
