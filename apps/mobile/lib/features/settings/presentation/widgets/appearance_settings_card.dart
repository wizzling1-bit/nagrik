import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/theme_provider.dart';
import 'package:nagrik/core/widgets/nagrik_segmented_control.dart';

/// Flat, streamlined theme appearance selector.
class AppearanceSettingsCard extends ConsumerWidget {
  const AppearanceSettingsCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentMode = ref.watch(themeModeProvider);
    final strings = ref.watch(appStringsProvider);

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space2,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.palette_outlined,
                size: 20,
                color: context.colorScheme.primary,
              ),
              const SizedBox(width: NagrikSpacing.space2),
              Text(
                strings.appearance,
                style: context.textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                ),
              ),
            ],
          ),
          const SizedBox(height: NagrikSpacing.space2),
          NagrikSegmentedControl<ThemeMode>(
            padding: EdgeInsets.zero,
            selected: currentMode,
            onSelected: (mode) =>
                ref.read(themeModeProvider.notifier).setThemeMode(mode),
            segments: [
              NagrikSegment(
                value: ThemeMode.system,
                label: strings.themeSystem,
                icon: Icons.brightness_auto,
              ),
              NagrikSegment(
                value: ThemeMode.light,
                label: strings.themeLight,
                icon: Icons.light_mode_outlined,
              ),
              NagrikSegment(
                value: ThemeMode.dark,
                label: strings.themeDark,
                icon: Icons.dark_mode_outlined,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
