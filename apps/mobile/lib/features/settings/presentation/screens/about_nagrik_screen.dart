import 'package:flutter/material.dart';
import 'package:nagrik/core/constants/legal_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/strings/app_strings.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/settings/presentation/screens/contact_us_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/government_disclaimer_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/information_sources_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/legal_viewer_screen.dart';

/// Dedicated About Nagrik screen displaying mission, legal entity,
/// transparency standards, and compliance links.
class AboutNagrikScreen extends StatelessWidget {
  const AboutNagrikScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final primaryColor = context.colorScheme.primary;
    final secondaryTextColor = context.nagrikTheme.textSecondary;
    final dividerColor = context.nagrikTheme.divider.withValues(
      alpha: isDark ? 0.15 : 0.60,
    );

    return Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        title: Text(
          'About Nagrik',
          style: context.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        backgroundColor: context.nagrikTheme.level1Surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 680),
          child: ListView(
            padding: const EdgeInsets.symmetric(
              horizontal: NagrikSpacing.space4,
              vertical: NagrikSpacing.space4,
            ),
            children: [
              // Hero Brand Card
              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: NagrikBrandColors.orangePrimary,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: NagrikBrandColors.orangePrimary.withValues(alpha: 0.35),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        'ना',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const SizedBox(height: NagrikSpacing.space3),
                    Text(
                      LegalConstants.brandName,
                      style: context.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      LegalConstants.tagline,
                      textAlign: TextAlign.center,
                      style: context.textTheme.bodyMedium?.copyWith(
                        color: secondaryTextColor,
                      ),
                    ),
                    const SizedBox(height: NagrikSpacing.space2),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: primaryColor.withValues(alpha: 0.10),
                        borderRadius: NagrikRadii.borderRadiusPill,
                      ),
                      child: Text(
                        'Version ${NagrikStrings.appVersion}',
                        style: TextStyle(
                          color: primaryColor,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'TRUST & COMPLIANCE DESK'),

              // Trust & Governance Group
              GlassCard(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Column(
                  children: [
                    _NavTile(
                      icon: Icons.shield_outlined,
                      iconColor: const Color(0xFFD97706),
                      title: 'Government Disclaimer',
                      subtitle: 'Statutory non-government affiliation declaration',
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const GovernmentDisclaimerScreen(),
                          ),
                        );
                      },
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.source_outlined,
                      iconColor: const Color(0xFF0284C7),
                      title: 'Information Sources',
                      subtitle: 'Directory of official & verified public portals',
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const InformationSourcesScreen(),
                          ),
                        );
                      },
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.support_agent_rounded,
                      iconColor: primaryColor,
                      title: 'Contact Us',
                      subtitle: 'Newsroom, Support, Grievance Officer & Helpline',
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const ContactUsScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'EDITORIAL & LEGAL POLICIES'),

              // Legal Policies Group
              GlassCard(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Column(
                  children: [
                    _NavTile(
                      icon: Icons.menu_book_outlined,
                      title: 'Editorial Guidelines',
                      subtitle: 'Ethical standards, fact checking & verification',
                      onTap: () => _openLegal(context, 'editorial-guidelines'),
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.rule_outlined,
                      title: 'Content Policy',
                      subtitle: 'Community safety, permitted & prohibited content',
                      onTap: () => _openLegal(context, 'content-policy'),
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.edit_note_outlined,
                      title: 'Corrections Policy',
                      subtitle: 'Transparent error corrections and retractions',
                      onTap: () => _openLegal(context, 'corrections'),
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.gavel_rounded,
                      title: 'Grievance Redressal',
                      subtitle: 'Statutory Grievance Officer under IT Rules 2021',
                      onTap: () => _openLegal(context, 'grievance'),
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.privacy_tip_outlined,
                      title: 'Privacy Policy',
                      subtitle: 'Zero background tracking & DPDP Act compliance',
                      onTap: () => _openLegal(context, 'privacy'),
                    ),
                    Divider(height: 1, thickness: 0.6, color: dividerColor),
                    _NavTile(
                      icon: Icons.description_outlined,
                      title: 'Terms of Service',
                      subtitle: 'User agreement, publisher rules & obligations',
                      onTap: () => _openLegal(context, 'terms'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'CORPORATE INFORMATION'),

              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      LegalConstants.legalEntity,
                      style: context.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    SelectableText(
                      LegalConstants.fullRegisteredAddress,
                      style: context.textTheme.bodySmall?.copyWith(
                        color: secondaryTextColor,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: NagrikSpacing.space2),
                    SelectableText(
                      'Email: ${LegalConstants.supportEmail}  •  Phone: ${LegalConstants.phoneNumber}',
                      style: context.textTheme.bodySmall?.copyWith(
                        color: primaryColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space5),
            ],
          ),
        ),
      ),
    );
  }

  void _openLegal(BuildContext context, String slug) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => LegalViewerScreen(slug: slug),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        left: NagrikSpacing.space1,
        bottom: NagrikSpacing.space2,
      ),
      child: Text(
        title,
        style: context.textTheme.labelMedium?.copyWith(
          color: context.nagrikTheme.textSecondary,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}

class _NavTile extends StatelessWidget {
  const _NavTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.iconColor,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final color = iconColor ?? context.colorScheme.primary;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: 2,
      ),
      leading: Icon(icon, color: color, size: 22),
      title: Text(
        title,
        style: context.textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.w700,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: context.textTheme.bodySmall?.copyWith(
          color: context.nagrikTheme.textSecondary,
          fontSize: 11.5,
        ),
      ),
      trailing: const Icon(Icons.chevron_right_rounded, size: 20),
      onTap: onTap,
    );
  }
}
