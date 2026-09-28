import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/network/api_constants.dart';
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
    final isHindi = strings.localeCode == 'hi';

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
                          Divider(
                            height: 1,
                            thickness: 0.6,
                            color: dividerColor,
                          ),
                          _SettingsTile(
                            icon: Icons.policy_outlined,
                            title: isHindi
                                ? 'संपादकीय एवं सार्वजनिक नीतियां'
                                : 'Editorial & Public Policies',
                            subtitle: isHindi
                                ? 'दिशानिर्देश, स्रोत, सुधार एवं पारदर्शिता'
                                : 'Guidelines, sources, corrections & terms',
                            trailing: const Icon(
                              Icons.arrow_outward_rounded,
                              size: 18,
                            ),
                            onTap: () {
                              _showPolicyDocsSheet(context, isHindi);
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

class _PolicyLink {
  const _PolicyLink({
    required this.titleEn,
    required this.titleHi,
    required this.subtitleEn,
    required this.subtitleHi,
    required this.url,
    required this.icon,
  });

  final String titleEn;
  final String titleHi;
  final String subtitleEn;
  final String subtitleHi;
  final String url;
  final IconData icon;

  String title(bool isHindi) => isHindi ? titleHi : titleEn;
  String subtitle(bool isHindi) => isHindi ? subtitleHi : subtitleEn;
}

final _kNagrikPolicies = [
  _PolicyLink(
    titleEn: 'About Nagrik',
    titleHi: 'नागरिक के बारे में',
    subtitleEn: 'Mission, governance & hyperlocal journalism',
    subtitleHi: 'मिशन, संरचना एवं स्थानीय पत्रकारिता',
    url: ApiConstants.urlAbout,
    icon: Icons.info_outline,
  ),
  _PolicyLink(
    titleEn: 'Editorial Guidelines',
    titleHi: 'संपादकीय दिशानिर्देश',
    subtitleEn: '32-point standards, verification & ethics',
    subtitleHi: '32-बिंदु मानक, सत्यापन एवं नैतिकता',
    url: ApiConstants.urlEditorialGuidelines,
    icon: Icons.menu_book_outlined,
  ),
  _PolicyLink(
    titleEn: 'Content Policy',
    titleHi: 'कंटेंट नीति',
    subtitleEn: 'Allowed & prohibited content standards',
    subtitleHi: 'स्वीकृत एवं प्रतिबंधित सामग्री नियम',
    url: ApiConstants.urlContentPolicy,
    icon: Icons.rule_outlined,
  ),
  _PolicyLink(
    titleEn: 'Corrections Policy',
    titleHi: 'सुधार एवं संशोधन नीति',
    subtitleEn: 'Handling errors transparently with timestamps',
    subtitleHi: 'पारदर्शी त्रुटि निवारण एवं समय-मुहर',
    url: ApiConstants.urlCorrections,
    icon: Icons.edit_note_outlined,
  ),
  _PolicyLink(
    titleEn: 'Sources & Attribution',
    titleHi: 'स्रोत एवं श्रेय नीति',
    subtitleEn: 'Primary sources, citations & bylines',
    subtitleHi: 'प्राथमिक स्रोत, उद्धरण एवं बायलाइन',
    url: ApiConstants.urlSources,
    icon: Icons.source_outlined,
  ),
  _PolicyLink(
    titleEn: 'Publisher Guidelines',
    titleHi: 'प्रकाशक दिशानिर्देश',
    subtitleEn: 'Rules for local reporters & video journalists',
    subtitleHi: 'स्थानीय पत्रकारों और वीडियो रिपोर्टर्स हेतु',
    url: ApiConstants.urlPublisherGuidelines,
    icon: Icons.person_search_outlined,
  ),
  _PolicyLink(
    titleEn: 'Community Guidelines',
    titleHi: 'समुदाय दिशानिर्देश',
    subtitleEn: 'User safety & civil public discourse',
    subtitleHi: 'उपयोगकर्ता सुरक्षा एवं शिष्ट सहभागिता',
    url: ApiConstants.urlCommunityGuidelines,
    icon: Icons.groups_outlined,
  ),
  _PolicyLink(
    titleEn: 'Copyright & IP',
    titleHi: 'कॉपीराइट एवं बौद्धिक संपदा',
    subtitleEn: 'Rights protection & notice-and-takedown',
    subtitleHi: 'अधिकार संरक्षण एवं नोटिस प्रक्रिया',
    url: ApiConstants.urlCopyright,
    icon: Icons.copyright_outlined,
  ),
  _PolicyLink(
    titleEn: 'Terms of Service',
    titleHi: 'सेवा की शर्तें',
    subtitleEn: 'Canonical legal agreement & user terms',
    subtitleHi: 'वैधानिक अनुबंध एवं उपयोग की शर्तें',
    url: ApiConstants.urlTermsOfService,
    icon: Icons.description_outlined,
  ),
  _PolicyLink(
    titleEn: 'Privacy Policy',
    titleHi: 'गोपनीयता नीति',
    subtitleEn: 'Data collection, storage & security practices',
    subtitleHi: 'डेटा संग्रह, सुरक्षा एवं अधिकार',
    url: ApiConstants.urlPrivacyPolicy,
    icon: Icons.privacy_tip_outlined,
  ),
  _PolicyLink(
    titleEn: 'Advertising Policy',
    titleHi: 'विज्ञापन नीति',
    subtitleEn: 'Commercial separation & transparent labeling',
    subtitleHi: 'विज्ञापन व संपादकीय सामग्री का पृथक्करण',
    url: ApiConstants.urlAdvertising,
    icon: Icons.campaign_outlined,
  ),
  _PolicyLink(
    titleEn: 'Transparency & Publishing',
    titleHi: 'पारदर्शिता एवं रिपोर्टिंग',
    subtitleEn: 'Publishing framework & source attribution',
    subtitleHi: 'प्रकाशन ढांचा एवं स्रोत व्यवस्था',
    url: ApiConstants.urlTransparency,
    icon: Icons.visibility_outlined,
  ),
  _PolicyLink(
    titleEn: 'Accessibility Statement',
    titleHi: 'सुगमता वक्तव्य (Accessibility)',
    subtitleEn: 'Universal digital accessibility commitment',
    subtitleHi: 'समावेशी डिजिटल अनुभव के प्रति प्रतिबद्धता',
    url: ApiConstants.urlAccessibility,
    icon: Icons.accessibility_new_outlined,
  ),
  _PolicyLink(
    titleEn: 'Contact & Support',
    titleHi: 'संपर्क एवं सहायता',
    subtitleEn: 'Editorial, legal & grievance officers',
    subtitleHi: 'संपादकीय, कानूनी एवं शिकायत अधिकारी',
    url: ApiConstants.urlContact,
    icon: Icons.support_agent_outlined,
  ),
  _PolicyLink(
    titleEn: 'Report Content / Error',
    titleHi: 'सामग्री / त्रुटि रिपोर्ट करें',
    subtitleEn: 'Formal moderation & grievance desk',
    subtitleHi: 'औपचारिक शिकायत एवं सुधार निवारण',
    url: ApiConstants.urlReportContent,
    icon: Icons.report_problem_outlined,
  ),
];

void _showPolicyDocsSheet(BuildContext context, bool isHindi) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => DraggableScrollableSheet(
      initialChildSize: 0.75,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (ctx, scrollController) => Material(
        color: Theme.of(ctx).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withValues(alpha: 0.4),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isHindi
                              ? 'संपादकीय एवं सार्वजनिक नीतियां'
                              : 'Editorial & Public Policies',
                          style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          isHindi
                              ? 'nagrik.news पर पारदर्शी और संस्करण-नियंत्रित नीतियां'
                              : 'Transparent, version-controlled policies at nagrik.news',
                          style: Theme.of(ctx).textTheme.bodySmall?.copyWith(
                                color: Colors.grey,
                              ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: ListView.separated(
                controller: scrollController,
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _kNagrikPolicies.length,
                separatorBuilder: (c, i) =>
                    const Divider(height: 1, indent: 56),
                itemBuilder: (c, i) {
                  final item = _kNagrikPolicies[i];
                  return ListTile(
                    leading: Icon(
                      item.icon,
                      size: 22,
                      color: Theme.of(ctx).colorScheme.primary,
                    ),
                    title: Text(
                      item.title(isHindi),
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    subtitle: Text(
                      item.subtitle(isHindi),
                      style: const TextStyle(fontSize: 12),
                    ),
                    trailing: const Icon(Icons.copy_rounded, size: 16),
                    onTap: () async {
                      await Clipboard.setData(ClipboardData(text: item.url));
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              isHindi
                                  ? 'लिंक कॉपी किया गया: ${item.url}'
                                  : 'Link copied: ${item.url}',
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      }
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
