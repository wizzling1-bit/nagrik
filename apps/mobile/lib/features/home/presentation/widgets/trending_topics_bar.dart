import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

/// Trending topic data item
class TrendingTopic {
  const TrendingTopic({
    required this.id,
    required this.title,
    required this.icon,
    required this.iconColor,
    this.slug,
    this.arrowColor,
  });

  final String id;
  final String title;
  final IconData icon;
  final Color iconColor;
  final String? slug;
  final Color? arrowColor;
}

/// Horizontal category strip driven by live GET /content/categories.
/// Renders nothing while loading/failed/empty — never fake topics.
class TrendingTopicsBar extends ConsumerWidget {
  const TrendingTopicsBar({
    super.key,
    this.selectedTopicId,
    this.onTopicTap,
    this.onSeeAllTap,
  });

  final String? selectedTopicId;
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
            iconColor: const Color(0xFFDE5227),
            slug: cat.slug,
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
                      color: const Color(0xFFDE5227).withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.local_fire_department_rounded,
                        size: 16,
                        color: Color(0xFFDE5227),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Trending Topics',
                    style: GoogleFonts.newsreader(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.2,
                      color: context.colorScheme.onSurface,
                    ).copyWith(
                      fontFamilyFallback: NagrikTypography.fontFallbacks,
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
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 12.0,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFDE5227),
                        ).copyWith(
                          fontFamilyFallback: NagrikTypography.fontFallbacks,
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
          height: 48,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(
              horizontal: NagrikSpacing.space4,
              vertical: 2,
            ),
            physics: const BouncingScrollPhysics(),
            scrollDirection: Axis.horizontal,
            itemCount: topics.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final topic = topics[index];
              final isSelected = selectedTopicId != null &&
                  (selectedTopicId == topic.id ||
                      (topic.slug != null && selectedTopicId == topic.slug) ||
                      selectedTopicId!.toLowerCase() == topic.title.toLowerCase());
              return _TrendingChip(
                topic: topic,
                isSelected: isSelected,
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
    required this.isSelected,
    required this.onTap,
  });

  final TrendingTopic topic;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Explore ${topic.title}',
      child: NagrikSpringPressable(
        onTap: () {
          NagrikMotion.selectionClick();
          onTap();
        },
        enableFeedback: false,
        scaleFactor: 0.95,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 44),
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color(0xFFDE5227)
                  : (isDark ? const Color(0xFF131A2A) : const Color(0xFFFAF8F5)),
              borderRadius: NagrikRadii.borderRadiusPill,
              border: Border.all(
                color: isSelected
                    ? const Color(0xFFDE5227)
                    : (isDark ? const Color(0xFF1C2537) : const Color(0xFFDDD5C8)),
                width: 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFFDE5227).withValues(alpha: 0.25),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ]
                  : [
                      BoxShadow(
                        color: isDark
                            ? Colors.black.withValues(alpha: 0.25)
                            : Colors.black.withValues(alpha: 0.03),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white.withValues(alpha: 0.20)
                        : (isDark
                            ? const Color(0xFF1E283E)
                            : const Color(0xFFEDE7DB)),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Icon(
                      topic.icon,
                      size: 13.5,
                      color: isSelected ? Colors.white : const Color(0xFFDE5227),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  topic.title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    fontSize: 12.5,
                    letterSpacing: -0.1,
                    color: isSelected
                        ? Colors.white
                        : (isDark ? const Color(0xFFF0F2F5) : const Color(0xFF0F172A)),
                  ).copyWith(
                    fontFamilyFallback: NagrikTypography.fontFallbacks,
                  ),
                ),
                const SizedBox(width: 6),
                Icon(
                  Icons.arrow_outward_rounded,
                  size: 13,
                  color: isSelected
                      ? Colors.white.withValues(alpha: 0.85)
                      : context.nagrikTheme.textTertiary,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
