import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Clean, flat list section managing notification preferences.
class NotificationPreferencesCard extends ConsumerWidget {
  const NotificationPreferencesCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch(notificationPreferencesProvider);
    final strings = ref.watch(appStringsProvider);
    final notifier = ref.read(onboardingStateProvider.notifier);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _PreferenceSwitchTile(
          title: strings.breakingNews,
          subtitle: strings.breakingNewsDesc,
          value: prefs.breakingNews,
          onChanged: (val) {
            notifier.updateNotificationPreferences(
              prefs.copyWith(breakingNews: val),
            );
          },
        ),
        Divider(height: 1, thickness: 0.8, color: context.nagrikTheme.divider),

        _PreferenceSwitchTile(
          title: strings.localNews,
          subtitle: strings.localNewsDesc,
          value: prefs.localNews,
          onChanged: (val) {
            notifier.updateNotificationPreferences(
              prefs.copyWith(localNews: val),
            );
          },
        ),
        Divider(height: 1, thickness: 0.8, color: context.nagrikTheme.divider),

        _PreferenceSwitchTile(
          title: strings.newVideos,
          subtitle: strings.newVideosDesc,
          value: prefs.newVideos,
          onChanged: (val) {
            notifier.updateNotificationPreferences(
              prefs.copyWith(newVideos: val),
            );
          },
        ),
      ],
    );
  }
}

class _PreferenceSwitchTile extends StatelessWidget {
  const _PreferenceSwitchTile({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space3,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: context.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: context.textTheme.bodyMedium?.copyWith(
                    color: context.nagrikTheme.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            activeTrackColor: context.colorScheme.primary,
            activeThumbColor: Colors.white,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
