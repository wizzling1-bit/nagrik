import 'package:flutter/material.dart';
import 'package:nagrik/core/constants/legal_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/utils/url_helper.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/settings/presentation/screens/information_sources_screen.dart';

/// Dedicated Non-Government Affiliation Disclaimer screen.
/// Mandated for compliance with Google Play Misleading Claims policy.
class GovernmentDisclaimerScreen extends StatefulWidget {
  const GovernmentDisclaimerScreen({super.key});

  @override
  State<GovernmentDisclaimerScreen> createState() =>
      _GovernmentDisclaimerScreenState();
}

class _GovernmentDisclaimerScreenState
    extends State<GovernmentDisclaimerScreen> {
  int _selectedLanguageIndex = 0; // 0 = English, 1 = Hindi

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;

    final disclaimerText = _selectedLanguageIndex == 0
        ? LegalConstants.disclaimerFullEn
        : LegalConstants.disclaimerFullHi;

    return Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        title: Text(
          'Government Disclaimer',
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
              // Prominent Amber Disclaimer Banner
              Container(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                decoration: BoxDecoration(
                  color: const Color(0xFFD97706).withValues(alpha: 0.12),
                  borderRadius: NagrikRadii.borderRadiusLg,
                  border: Border.all(
                    color: const Color(0xFFD97706).withValues(alpha: 0.35),
                    width: 1.2,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.shield_outlined,
                      color: Color(0xFFD97706),
                      size: 26,
                    ),
                    const SizedBox(width: NagrikSpacing.space3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'OFFICIAL NON-AFFILIATION NOTICE',
                            style: context.textTheme.labelMedium?.copyWith(
                              color: const Color(0xFFD97706),
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Nagrik is operated by ${LegalConstants.legalEntity} and is not an official government service or agency.',
                            style: context.textTheme.bodySmall?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: isDark ? Colors.white : Colors.black87,
                              height: 1.35,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Language Toggle
              SegmentedButton<int>(
                segments: const [
                  ButtonSegment<int>(
                    value: 0,
                    label: Text('English Notice'),
                    icon: Icon(Icons.language_rounded, size: 16),
                  ),
                  ButtonSegment<int>(
                    value: 1,
                    label: Text('हिंदी सूचना'),
                    icon: Icon(Icons.translate_rounded, size: 16),
                  ),
                ],
                selected: {_selectedLanguageIndex},
                onSelectionChanged: (set) {
                  setState(() {
                    _selectedLanguageIndex = set.first;
                  });
                },
                style: const ButtonStyle(
                  visualDensity: VisualDensity.compact,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Full Statutory Statement Card
              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Statutory Transparency Declaration',
                      style: context.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const Divider(height: 24, thickness: 0.6),
                    SelectableText(
                      disclaimerText,
                      style: context.textTheme.bodyMedium?.copyWith(
                        height: 1.6,
                        color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Structured Disclosures
              const _DisclosurePillarCard(
                icon: Icons.account_balance_outlined,
                title: 'No Government Affiliation',
                description:
                    'Nagrik is not affiliated with, endorsed by, sponsored by, or operated by the Government of India, any State Government, District Administration, Municipal Corporation, or Panchayat authority.',
              ),
              const SizedBox(height: NagrikSpacing.space2),

              const _DisclosurePillarCard(
                icon: Icons.domain_verification_outlined,
                title: 'No Official Services',
                description:
                    'Nagrik does not issue government licenses, welfare benefits, permits, identity cards, or official certificates. We act solely as a journalistic news aggregator and community information platform.',
              ),
              const SizedBox(height: NagrikSpacing.space2),

              const _DisclosurePillarCard(
                icon: Icons.source_outlined,
                title: 'Publicly Sourced Reporting',
                description:
                    'All government-related information (gazette notices, weather bulletins, civic advisories) is curated from publicly available official portals and cited transparently.',
              ),
              const SizedBox(height: NagrikSpacing.space2),

              const _DisclosurePillarCard(
                icon: Icons.verified_user_outlined,
                title: 'Mandatory User Verification',
                description:
                    'Citizens are strongly advised to verify critical deadlines, recruitment notices, and legal policies on official governmental portals prior to making civic or financial decisions.',
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: FilledButton.icon(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const InformationSourcesScreen(),
                          ),
                        );
                      },
                      icon: const Icon(Icons.source_rounded, size: 18),
                      label: const Text('View Official Sources'),
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: NagrikRadii.borderRadiusSm,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: NagrikSpacing.space2),
              Center(
                child: TextButton.icon(
                  onPressed: () => UrlHelper.launchUrlSafe(
                    context,
                    LegalConstants.urlGovernmentDisclaimer,
                  ),
                  icon: const Icon(Icons.open_in_browser_rounded, size: 16),
                  label: const Text('View Web Disclaimer Notice'),
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

class _DisclosurePillarCard extends StatelessWidget {
  const _DisclosurePillarCard({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

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
                const SizedBox(height: 3),
                Text(
                  description,
                  style: context.textTheme.bodySmall?.copyWith(
                    color: context.nagrikTheme.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
