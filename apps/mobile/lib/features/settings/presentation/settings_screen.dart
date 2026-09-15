import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/strings/app_strings.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/exit_app_dialog.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:nagrik/features/settings/presentation/widgets/api_diagnostics_sheet.dart';
import 'package:nagrik/features/settings/presentation/widgets/appearance_settings_card.dart';
import 'package:nagrik/features/settings/presentation/widgets/language_settings_card.dart';
import 'package:nagrik/features/settings/presentation/widgets/notification_preferences_card.dart';

/// Screen #1: Minimal, luxury consumer settings screen with grouped specular cards.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = ref.watch(selectedLocationProvider);
    final strings = ref.watch(appStringsProvider);
    final isDark = context.isDarkMode;

    final bgColor = context.nagrikTheme.level0Background;
    final barBg = context.nagrikTheme.level1Surface;
    final dividerColor = context.nagrikTheme.divider.withValues(
      alpha: isDark ? 0.15 : 0.60,
    );

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: Text(
          strings.settings,
          style: context.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        elevation: 0,
        backgroundColor: barBg,
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                onPressed: () {
                  if (Navigator.of(context).canPop()) {
                    Navigator.of(context).pop();
                  }
                },
              )
            : null,
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 680),
          child: ListView(
            padding: const EdgeInsets.symmetric(
              horizontal: NagrikSpacing.space4,
              vertical: NagrikSpacing.space3,
            ),
            children: [
              // Section 1: Location
              NagrikStaggeredEntrance(
                index: 0,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _SectionHeader(title: strings.sectionLocation),
                    GlassCard(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: _SettingsTile(
                        icon: Icons.location_on_outlined,
                        title: strings.currentLocation,
                        subtitle:
                            location?.displayName ??
                            'Not selected (Tap to choose)',
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: () => showLocationSwitcher(context),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Section 2: Preferences
              NagrikStaggeredEntrance(
                index: 1,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _SectionHeader(title: strings.sectionPreferences),
                    GlassCard(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Column(
                        children: [
                          const AppearanceSettingsCard(),
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          const LanguageSettingsCard(),
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          const NotificationPreferencesCard(),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Section 3: About
              NagrikStaggeredEntrance(
                index: 2,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _SectionHeader(title: strings.sectionAbout),
                    GlassCard(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Column(
                        children: [
                          _SettingsTile(
                            icon: Icons.info_outline,
                            title: strings.version,
                            subtitle: NagrikStrings.appVersion,
                          ),
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          _SettingsTile(
                            icon: Icons.privacy_tip_outlined,
                            title: strings.privacyPolicy,
                            subtitle: strings.privacySubtitle,
                            trailing: const Icon(
                              Icons.arrow_outward_rounded,
                              size: 18,
                            ),
                            onTap: () {
                              showDialog<void>(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: Text(strings.privacyPolicy),
                                  content: Text(strings.privacyNotice),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(ctx).pop(),
                                      child: Text(strings.close),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          _SettingsTile(
                            icon: Icons.shield_outlined,
                            title: strings.adPrivacyChoices,
                            subtitle: strings.adPrivacySubtitle,
                            trailing: const Icon(
                              Icons.arrow_outward_rounded,
                              size: 18,
                            ),
                            onTap: () async {
                              NagrikMotion.lightImpact();
                              await ref
                                  .read(adConsentProvider.notifier)
                                  .showPrivacyOptionsForm();
                            },
                          ),
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          _SettingsTile(
                            icon: Icons.description_outlined,
                            title: strings.termsOfService,
                            subtitle: strings.termsSubtitle,
                            trailing: const Icon(
                              Icons.arrow_outward_rounded,
                              size: 18,
                            ),
                            onTap: () {
                              showDialog<void>(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: Text(strings.termsOfService),
                                  content: Text(strings.termsNotice),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(ctx).pop(),
                                      child: Text(strings.close),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Section 4: Application & Diagnostics
              NagrikStaggeredEntrance(
                index: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _SectionHeader(title: 'APPLICATION'),
                    GlassCard(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _SettingsTile(
                            icon: Icons.cloud_done_rounded,
                            iconColor: context.colorScheme.primary,
                            title: strings.backendStatusTitle,
                            subtitle: strings.backendStatusSubtitle,
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: context.colorScheme.primary
                                        .withValues(alpha: 0.12),
                                    borderRadius: NagrikRadii.borderRadiusPill,
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.network_check_rounded,
                                        size: 12,
                                        color: context.colorScheme.primary,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        strings.checkAction,
                                        style: context.textTheme.labelSmall
                                            ?.copyWith(
                                              color:
                                                  context.colorScheme.primary,
                                              fontWeight: FontWeight.w800,
                                            ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Icon(Icons.chevron_right_rounded),
                              ],
                            ),
                            onTap: () => showApiDiagnosticsSheet(context),
                          ),
                          Divider(
                            color: context.nagrikTheme.divider,
                            height: 1,
                            indent: NagrikSpacing.space4,
                            endIndent: NagrikSpacing.space4,
                          ),
                          _SettingsTile(
                            icon: Icons.power_settings_new_rounded,
                            iconColor: context.colorScheme.error,
                            title: 'Exit Application',
                            titleColor: context.colorScheme.error,
                            subtitle: 'Close and quit Nagrik',
                            trailing: const Icon(Icons.chevron_right_rounded),
                            onTap: () => showExitAppDialog(context),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        NagrikSpacing.space1,
        NagrikSpacing.space2,
        NagrikSpacing.space1,
        NagrikSpacing.space2,
      ),
      child: Text(
        title,
        style: context.textTheme.labelLarge?.copyWith(
          color: context.nagrikTheme.textSecondary,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.iconColor,
    this.titleColor,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final Color? iconColor;
  final Color? titleColor;

  @override
  Widget build(BuildContext context) {
    final primaryColor = iconColor ?? context.colorScheme.primary;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: 2,
      ),
      leading: Icon(icon, size: 20, color: primaryColor),
      title: Text(
        title,
        style: context.textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.w600,
          color: titleColor,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle!,
              style: context.textTheme.bodySmall?.copyWith(
                color: context.nagrikTheme.textSecondary,
              ),
            )
          : null,
      trailing: trailing,
      onTap: onTap != null
          ? () {
              NagrikMotion.lightImpact();
              onTap!();
            }
          : null,
    );
  }
}
