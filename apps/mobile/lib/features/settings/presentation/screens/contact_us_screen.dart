import 'package:flutter/material.dart';
import 'package:nagrik/core/constants/legal_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/utils/url_helper.dart';
import 'package:nagrik/core/widgets/glass_card.dart';

/// Dedicated, public Contact & Corporate Information Screen.
/// Accessible without login to satisfy Google Play News & Magazines policy
/// and Indian IT Rules 2021 statutory contact standards.
class ContactUsScreen extends StatelessWidget {
  const ContactUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final primaryColor = context.colorScheme.primary;
    final secondaryTextColor = context.nagrikTheme.textSecondary;

    return Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        title: Text(
          'Contact & Support',
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
              // Header Card
              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: primaryColor.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.headset_mic_rounded,
                            color: primaryColor,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: NagrikSpacing.space3),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                LegalConstants.brandName,
                                style: context.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Independent digital news and civic information platform operated by ${LegalConstants.legalEntity}.',
                                style: context.textTheme.bodySmall?.copyWith(
                                  color: secondaryTextColor,
                                  height: 1.35,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'OFFICIAL CONTACT CHANNELS'),

              // Contact Cards
              _ContactChannelCard(
                icon: Icons.support_agent_rounded,
                title: 'User Support Desk',
                subtitle: 'App feedback, account questions, and general help',
                contactValue: LegalConstants.supportEmail,
                actionLabel: 'Send Email',
                onAction: () => UrlHelper.launchEmail(
                  context,
                  LegalConstants.supportEmail,
                  subject: 'Support Request - Nagrik Mobile App',
                ),
              ),
              const SizedBox(height: NagrikSpacing.space2),

              _ContactChannelCard(
                icon: Icons.newspaper_rounded,
                title: 'Editorial & Newsroom',
                subtitle: 'Press inquiries, news tips, and factual reporting',
                contactValue: LegalConstants.editorialEmail,
                actionLabel: 'Contact Desk',
                onAction: () => UrlHelper.launchEmail(
                  context,
                  LegalConstants.editorialEmail,
                  subject: 'Editorial Inquiry - Nagrik Newsroom',
                ),
              ),
              const SizedBox(height: NagrikSpacing.space2),

              _ContactChannelCard(
                icon: Icons.gavel_rounded,
                title: 'Resident Grievance Officer',
                subtitle:
                    'Statutory officer under Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.\nResponse: ${LegalConstants.grievanceResponseTime}',
                contactValue: LegalConstants.grievanceEmail,
                actionLabel: 'File Grievance',
                onAction: () => UrlHelper.launchEmail(
                  context,
                  LegalConstants.grievanceEmail,
                  subject: 'Formal Grievance Submission - Nagrik Platform',
                ),
              ),
              const SizedBox(height: NagrikSpacing.space2),

              _ContactChannelCard(
                icon: Icons.phone_in_talk_rounded,
                title: 'Official Helpline',
                subtitle: 'Direct telephonic support (Mon-Sat, 10 AM - 6 PM IST)',
                contactValue: LegalConstants.phoneNumber,
                actionLabel: 'Call Now',
                onAction: () => UrlHelper.launchPhone(
                  context,
                  LegalConstants.phoneNumber,
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'REGISTERED OFFICE & CORPORATE DETAILS'),

              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _InfoRow(
                      label: 'Legal Entity',
                      value: LegalConstants.legalEntity,
                    ),
                    const Divider(height: 20, thickness: 0.6),
                    const _InfoRow(
                      label: 'Registered Address',
                      value: LegalConstants.fullRegisteredAddress,
                    ),
                    const Divider(height: 20, thickness: 0.6),
                    const _InfoRow(
                      label: 'Jurisdiction',
                      value: '${LegalConstants.city}, ${LegalConstants.state}, ${LegalConstants.country} - ${LegalConstants.pincode}',
                    ),
                    const SizedBox(height: NagrikSpacing.space3),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => UrlHelper.copyToClipboard(
                              context,
                              LegalConstants.fullRegisteredAddress,
                              'Registered office address',
                            ),
                            icon: const Icon(Icons.copy_rounded, size: 16),
                            label: const Text('Copy Address'),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: NagrikRadii.borderRadiusSm,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: NagrikSpacing.space2),
                        Expanded(
                          child: FilledButton.tonalIcon(
                            onPressed: () => UrlHelper.launchUrlSafe(
                              context,
                              LegalConstants.urlContact,
                            ),
                            icon: const Icon(Icons.open_in_browser_rounded, size: 16),
                            label: const Text('Web Contact'),
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: NagrikRadii.borderRadiusSm,
                              ),
                            ),
                          ),
                        ),
                      ],
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

class _ContactChannelCard extends StatelessWidget {
  const _ContactChannelCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.contactValue,
    required this.actionLabel,
    required this.onAction,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final String contactValue;
  final String actionLabel;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    final primaryColor = context.colorScheme.primary;

    return GlassCard(
      padding: const EdgeInsets.all(NagrikSpacing.space3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: primaryColor.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: primaryColor, size: 20),
          ),
          const SizedBox(width: NagrikSpacing.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: context.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: context.textTheme.bodySmall?.copyWith(
                    color: context.nagrikTheme.textSecondary,
                    fontSize: 11.5,
                  ),
                ),
                const SizedBox(height: 6),
                SelectableText(
                  contactValue,
                  style: context.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: primaryColor,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          FilledButton.tonal(
            onPressed: onAction,
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              minimumSize: const Size(64, 34),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(
                borderRadius: NagrikRadii.borderRadiusSm,
              ),
            ),
            child: Text(
              actionLabel,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: context.textTheme.labelSmall?.copyWith(
            color: context.nagrikTheme.textSecondary,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 3),
        SelectableText(
          value,
          style: context.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
            height: 1.35,
          ),
        ),
      ],
    );
  }
}
