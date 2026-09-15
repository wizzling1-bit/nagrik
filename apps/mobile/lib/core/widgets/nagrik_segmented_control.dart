import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';

/// Reusable segmented control with Level 3 tonal selection and fluid sliding pill indicator.
///
/// Provides an accessible, pill-based tab selector used across the app for
/// consistent navigation within screens (Feed tabs, Report mode, Profile tabs, etc.).
class NagrikSegmentedControl<T> extends StatelessWidget {
  const NagrikSegmentedControl({
    super.key,
    required this.segments,
    required this.selected,
    required this.onSelected,
    this.padding = const EdgeInsets.symmetric(horizontal: NagrikSpacing.space4),
  });

  /// Available segment values with their display labels.
  final List<NagrikSegment<T>> segments;

  /// Currently selected segment value.
  final T selected;

  /// Callback when a segment is tapped.
  final ValueChanged<T> onSelected;

  /// Outer padding of the control.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    if (segments.isEmpty) return const SizedBox.shrink();

    final isDark = context.isDarkMode;
    final containerBg = isDark
        ? context.nagrikTheme.level4Muted
        : context.nagrikTheme.surfaceMuted;

    final selectedIndex = segments.indexWhere((s) => s.value == selected);
    final validIndex = selectedIndex >= 0 ? selectedIndex : 0;

    final activeFg = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;
    final inactiveFg = context.nagrikTheme.textSecondary;

    return Padding(
      padding: padding,
      child: Container(
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: containerBg,
          borderRadius: NagrikRadii.borderRadiusMd,
          border: Border.all(
            color: isDark
                ? const Color(0xFF1E2D4A).withValues(alpha: 0.80)
                : context.nagrikTheme.border.withValues(alpha: 0.50),
            width: 0.8,
          ),
        ),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final availableWidth = constraints.maxWidth;
            final segmentWidth = availableWidth / segments.length;

            return Stack(
              children: [
                // Fluid sliding pill background indicator
                AnimatedPositioned(
                  duration: NagrikMotion.resolveDuration(
                    context,
                    const Duration(milliseconds: 240),
                  ),
                  curve: Curves.easeOutCubic,
                  left: validIndex * segmentWidth,
                  top: 0,
                  bottom: 0,
                  width: segmentWidth,
                  child: Container(
                    decoration: BoxDecoration(
                      color: isDark
                          ? context.nagrikTheme.level2Elevated
                          : context.colorScheme.surface,
                      borderRadius: NagrikRadii.borderRadiusSm,
                      border: Border.all(
                        color: isDark
                            ? context.colorScheme.primary.withValues(alpha: 0.35)
                            : context.nagrikTheme.border.withValues(alpha: 0.60),
                        width: 0.9,
                      ),
                      boxShadow: isDark
                          ? [
                              BoxShadow(
                                color: context.colorScheme.primary
                                    .withValues(alpha: 0.12),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.06),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                    ),
                  ),
                ),
                // Tap targets and labels
                Row(
                  children: List.generate(segments.length, (index) {
                    final segment = segments[index];
                    final isSelected = index == validIndex;

                    return Expanded(
                      child: Semantics(
                        button: true,
                        selected: isSelected,
                        label: segment.label,
                        child: InkWell(
                          onTap: () {
                            if (!isSelected) {
                              NagrikMotion.selectionClick();
                              onSelected(segment.value);
                            }
                          },
                          borderRadius: NagrikRadii.borderRadiusSm,
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (segment.icon != null) ...[
                                  Icon(
                                    segment.icon,
                                    size: 16,
                                    color: isSelected ? activeFg : inactiveFg,
                                  ),
                                  const SizedBox(width: 6),
                                ],
                                Flexible(
                                  child: AnimatedDefaultTextStyle(
                                    duration: const Duration(milliseconds: 200),
                                    style: (context.textTheme.labelMedium ??
                                            const TextStyle())
                                        .copyWith(
                                      fontWeight: isSelected
                                          ? FontWeight.w700
                                          : FontWeight.w500,
                                      color: isSelected ? activeFg : inactiveFg,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    textAlign: TextAlign.center,
                                    child: Text(segment.label),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

/// A single segment within [NagrikSegmentedControl].
class NagrikSegment<T> {
  const NagrikSegment({
    required this.value,
    required this.label,
    this.icon,
  });

  final T value;
  final String label;
  final IconData? icon;
}
