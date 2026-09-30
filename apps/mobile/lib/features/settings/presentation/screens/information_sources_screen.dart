import 'package:flutter/material.dart';
import 'package:nagrik/core/constants/legal_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/utils/url_helper.dart';
import 'package:nagrik/core/widgets/glass_card.dart';

/// Screen listing verified public and governmental information sources
/// referenced by Nagrik editorial desk.
class InformationSourcesScreen extends StatelessWidget {
  const InformationSourcesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final primaryColor = context.colorScheme.primary;
    final secondaryTextColor = context.nagrikTheme.textSecondary;

    return Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        title: Text(
          'Information Sources',
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
              // Mandatory Transparency Statement Card
              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: primaryColor.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(Icons.verified_outlined, color: primaryColor, size: 20),
                        ),
                        const SizedBox(width: NagrikSpacing.space2),
                        Expanded(
                          child: Text(
                            'Sourcing & Verification Principles',
                            style: context.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 20, thickness: 0.6),
                    Container(
                      padding: const EdgeInsets.all(NagrikSpacing.space3),
                      decoration: BoxDecoration(
                        color: primaryColor.withValues(alpha: 0.06),
                        borderRadius: NagrikRadii.borderRadiusSm,
                        border: Border(
                          left: BorderSide(
                            color: primaryColor,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Text(
                        '"Nagrik uses publicly available official sources when reporting government, civic, weather, traffic, public-service and other official information."',
                        style: context.textTheme.bodyMedium?.copyWith(
                          fontStyle: FontStyle.italic,
                          fontWeight: FontWeight.w600,
                          height: 1.45,
                        ),
                      ),
                    ),
                    const SizedBox(height: NagrikSpacing.space3),
                    Text(
                      'Every civic bulletin, weather advisory, and public-notice report published on Nagrik includes direct attribution and a link to the original issuing portal wherever available.',
                      style: context.textTheme.bodySmall?.copyWith(
                        color: secondaryTextColor,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'VERIFIED OFFICIAL PORTALS DIRECTORY'),

              // Verified Portals
              ...LegalConstants.verifiedOfficialSources.map((source) {
                final name = source['name'] ?? '';
                final url = source['url'] ?? '';
                final desc = source['description'] ?? '';

                return Padding(
                  padding: const EdgeInsets.only(bottom: NagrikSpacing.space3),
                  child: GlassCard(
                    padding: const EdgeInsets.all(NagrikSpacing.space3),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0284C7).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(
                                Icons.public_rounded,
                                color: Color(0xFF0284C7),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: NagrikSpacing.space3),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    name,
                                    style: context.textTheme.titleSmall?.copyWith(
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  SelectableText(
                                    url,
                                    style: context.textTheme.bodySmall?.copyWith(
                                      color: const Color(0xFF0284C7),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: NagrikSpacing.space2),
                        Text(
                          desc,
                          style: context.textTheme.bodySmall?.copyWith(
                            color: secondaryTextColor,
                            height: 1.35,
                          ),
                        ),
                        const Divider(height: 16, thickness: 0.6),
                        Align(
                          alignment: Alignment.centerRight,
                          child: FilledButton.tonalIcon(
                            onPressed: () => UrlHelper.launchUrlSafe(context, url),
                            icon: const Icon(Icons.arrow_outward_rounded, size: 14),
                            label: const Text('Open Official Portal'),
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              minimumSize: const Size(0, 32),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(
                                borderRadius: NagrikRadii.borderRadiusSm,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: NagrikSpacing.space4),
              const _SectionLabel(title: 'EDITORIAL PROVENANCE STANDARDS'),

              const GlassCard(
                padding: EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _StandardItem(
                      number: '1',
                      title: 'Explicit Provenance & Bylines',
                      body:
                          'Every report on Nagrik identifies whether it is Original Nagrik Reporting, Government / Public Notice, Third-Party Reporting, or Press Release.',
                    ),
                    Divider(height: 20, thickness: 0.6),
                    _StandardItem(
                      number: '2',
                      title: 'Direct Link to Original Notice',
                      body:
                          'For all public advisories, reader action buttons link directly to the authoritative government website.',
                    ),
                    Divider(height: 20, thickness: 0.6),
                    _StandardItem(
                      number: '3',
                      title: 'Transparent Error Corrections',
                      body:
                          'When facts or advisories are updated by the issuing authority, Nagrik updates the article timestamp and appends a visible correction log.',
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

class _StandardItem extends StatelessWidget {
  const _StandardItem({
    required this.number,
    required this.title,
    required this.body,
  });

  final String number;
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 22,
          height: 22,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: context.colorScheme.primary.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: Text(
            number,
            style: TextStyle(
              color: context.colorScheme.primary,
              fontWeight: FontWeight.w800,
              fontSize: 12,
            ),
          ),
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
                body,
                style: context.textTheme.bodySmall?.copyWith(
                  color: context.nagrikTheme.textSecondary,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
