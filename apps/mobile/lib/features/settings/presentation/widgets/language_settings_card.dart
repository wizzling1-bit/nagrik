import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/nagrik_segmented_control.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Streamlined in-place language selector with premium segmented switch for English & Hindi.
class LanguageSettingsCard extends ConsumerWidget {
  const LanguageSettingsCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeLanguage = ref.watch(selectedLanguageProvider);
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
                Icons.translate_rounded,
                size: 20,
                color: context.colorScheme.primary,
              ),
              const SizedBox(width: NagrikSpacing.space2),
              Text(
                strings.appLanguage,
                style: context.textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                ),
              ),
            ],
          ),
          const SizedBox(height: NagrikSpacing.space2),
          NagrikSegmentedControl<String>(
            padding: EdgeInsets.zero,
            selected: activeLanguage.code,
            onSelected: (code) {
              final lang = kSupportedLanguages.firstWhere(
                (l) => l.code == code,
                orElse: () => kSupportedLanguages.first,
              );
              ref.read(onboardingStateProvider.notifier).selectLanguage(lang);
            },
            segments: const [
              NagrikSegment(
                value: 'en',
                label: 'English',
                icon: Icons.language_rounded,
              ),
              NagrikSegment(
                value: 'hi',
                label: 'हिन्दी (Hindi)',
                icon: Icons.translate_rounded,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
