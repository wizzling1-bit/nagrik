import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

/// Trending topic data item
class TrendingTopic {
  const TrendingTopic({
    required this.id,
    required this.title,
    required this.icon,
    required this.iconColor,
    this.arrowColor,
  });

  final String id;
  final String title;
  final IconData icon;
  final Color iconColor;
  final Color? arrowColor;
}

/// Horizontal category strip driven by live GET /content/categories.
/// Renders nothing while loading/failed/empty — never fake topics.
class TrendingTopicsBar extends ConsumerWidget {
  const TrendingTopicsBar({
    super.key,
    this.onTopicTap,
    this.onSeeAllTap,
  });

  final void Function(TrendingTopic topic)? onTopicTap;
  final VoidCallback? onSeeAllTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(apiCategoriesProvider);
    final topics = categoriesAsync.maybeWhen(
      data: (categories) {
        final visible = categories
            .where((c) => c.slug.toLowerCase() != 'all' && c.name.trim().isNotEmpty)
            .toList();
        if (visible.isEmpty) return const <TrendingTopic>[];
        return visible.map((cat) {
          final slug = cat.slug.toLowerCase();
          IconData icon = Icons.article_rounded;
          if (slug.contains('local')) {
            icon = Icons.location_on_rounded;
          } else if (slug.contains('politic')) {
            icon = Icons.account_balance_rounded;
          } else if (slug.contains('crime')) {
            icon = Icons.gavel_rounded;
          } else if (slug.contains('sport')) {
            icon = Icons.sports_cricket_rounded;
          } else if (slug.contains('business')) {
            icon = Icons.trending_up_rounded;
          } else if (slug.contains('entertain')) {
            icon = Icons.movie_filter_rounded;
          }

          return TrendingTopic(
            id: cat.id,
            title: cat.name,
            icon: icon,
            iconColor: context.colorScheme.primary,
          );
        }).toList();
      },
      orElse: () => const <TrendingTopic>[],
    );

    if (topics.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Section Header
        Padding(
          padding: const EdgeInsets.fromLTRB(
            NagrikSpacing.space4,
            NagrikSpacing.space3,
            NagrikSpacing.space4,
            NagrikSpacing.space2,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      color: context.colorScheme.error.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Icon(
                        Icons.local_fire_department_rounded,
                        size: 16,
                        color: context.colorScheme.error,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Trending Topics',
                    style: context.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.2,
                    ),
                  ),
                ],
              ),
              Semantics(
                button: true,
                label: ref.watch(appStringsProvider).seeAllTopics,
                child: NagrikSpringPressable(
                  onTap: onSeeAllTap ?? () => context.push('/search'),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
                    child: Center(
                      child: Text(
                        'See all',
                        style: context.textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: context.colorScheme.primary,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Horizontal Chips List
        SizedBox(
          height: 44,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: NagrikSpacing.space4),
            scrollDirection: Axis.horizontal,
            itemCount: topics.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final topic = topics[index];
              return _TrendingChip(
                topic: topic,
                onTap: () {
                  if (onTopicTap != null) {
                    onTopicTap!(topic);
                  } else {
                    context.push('/search?q=${Uri.encodeComponent(topic.title)}');
                  }
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

class _TrendingChip extends StatelessWidget {
  const _TrendingChip({
    required this.topic,
    required this.onTap,
  });

  final TrendingTopic topic;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    return Semantics(
      button: true,
      label: 'Explore ${topic.title}',
      child: NagrikSpringPressable(
        onTap: onTap,
        scaleFactor: 0.95,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 44),
          child: Container(
            decoration: BoxDecoration(
              color: isDark
                  ? context.nagrikTheme.level2Elevated
                  : Colors.white,
              borderRadius: NagrikRadii.borderRadiusPill,
              border: Border.all(
                color: isDark
                    ? context.nagrikTheme.border.withValues(alpha: 0.7)
                    : const Color(0xFFE2E8F0),
                width: 0.85,
              ),
              boxShadow: [
                BoxShadow(
                  color: isDark
                      ? Colors.black.withValues(alpha: 0.25)
                      : Colors.black.withValues(alpha: 0.03),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: topic.iconColor.withValues(
                      alpha: isDark ? 0.20 : 0.10,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Icon(
                      topic.icon,
                      size: 13.5,
                      color: topic.iconColor,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  topic.title,
                  style: context.textTheme.labelLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    fontSize: 12.5,
                    letterSpacing: -0.1,
                  ),
                ),
                const SizedBox(width: 5),
                Icon(
                  Icons.arrow_outward_rounded,
                  size: 13,
                  color: context.nagrikTheme.textTertiary,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
