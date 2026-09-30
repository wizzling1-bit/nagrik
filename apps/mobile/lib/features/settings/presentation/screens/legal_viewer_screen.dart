import 'package:flutter/material.dart';
import 'package:nagrik/core/constants/legal_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/utils/url_helper.dart';
import 'package:nagrik/core/widgets/glass_card.dart';

/// Data model representing an in-app legal or compliance policy document.
class LegalDocData {
  const LegalDocData({
    required this.slug,
    required this.title,
    required this.subtitle,
    required this.webUrl,
    required this.sections,
  });

  final String slug;
  final String title;
  final String subtitle;
  final String webUrl;
  final List<LegalDocSection> sections;
}

class LegalDocSection {
  const LegalDocSection({
    required this.heading,
    required this.body,
    this.bulletPoints = const [],
  });

  final String heading;
  final String body;
  final List<String> bulletPoints;
}

/// In-app native viewer for legal policies, editorial guidelines, and compliance docs.
class LegalViewerScreen extends StatelessWidget {
  const LegalViewerScreen({
    super.key,
    required this.slug,
  });

  final String slug;

  static final Map<String, LegalDocData> _docs = {
    'editorial-guidelines': const LegalDocData(
      slug: 'editorial-guidelines',
      title: 'Editorial Guidelines',
      subtitle: 'Ethical standards, fact-checking, and journalistic independence',
      webUrl: LegalConstants.urlEditorialGuidelines,
      sections: [
        LegalDocSection(
          heading: '1. Commitment to Truth and Verification',
          body:
              'Nagrik operates as an independent journalistic platform under Wizzling Pvt Ltd. Every factual assertion, civic notification, and local news report is subject to verification against primary sources, on-ground reporters, or official press releases.',
          bulletPoints: [
            'All claims are corroborated with at least one verifiable public source or on-ground witness.',
            'Unsubstantiated rumors, hearsay, and unverified social media forwards are strictly excluded.',
            'Statistical and numerical data must cite the originating governmental or research agency.',
          ],
        ),
        LegalDocSection(
          heading: '2. Independence & Separation from State',
          body:
              'Nagrik is completely independent and is not an agency or arm of any government authority. Our editorial decisions are taken free from political patronage or external state influence.',
        ),
        LegalDocSection(
          heading: '3. Non-Government Disclaimers on Civic Reporting',
          body:
              'When reporting on government welfare schemes, public transport updates, or district administration notices, we explicitly cite the original issuing authority and provide a direct hyperlink to the official website so citizens can verify primary documents directly.',
        ),
        LegalDocSection(
          heading: '4. Commercial Separation',
          body:
              'Advertising, sponsorships, and paid promotional content are strictly separated from editorial reporting. Sponsored posts and commercial promotions are always prominently badged.',
        ),
      ],
    ),
    'content-policy': const LegalDocData(
      slug: 'content-policy',
      title: 'Content Policy',
      subtitle: 'Allowed standards, civic safety, and prohibited content',
      webUrl: LegalConstants.urlContentPolicy,
      sections: [
        LegalDocSection(
          heading: '1. Permitted Public Interest Content',
          body:
              'Nagrik accepts and publishes verified civic news, district announcements, traffic advisories, local sports, cultural reporting, weather forecasts, and community welfare updates.',
        ),
        LegalDocSection(
          heading: '2. Prohibited Categories',
          body:
              'To preserve public order, communal harmony, and user trust, the following categories are strictly prohibited on the platform:',
          bulletPoints: [
            'Hate speech, communal incitement, and discrimination based on caste, religion, gender, or origin.',
            'Misleading claims implying official government authority or state endorsement.',
            'Defamatory content, harassment, doxxing, or non-consensual personal data sharing.',
            'Graphic violence, sexually explicit media, and harmful disinformation.',
            'Financial fraud, deceptive schemes, and unregulated gambling promotions.',
          ],
        ),
        LegalDocSection(
          heading: '3. Enforcement and Takedowns',
          body:
              'Content violating this policy is subject to immediate removal upon identification by our editorial moderation team or upon receipt of a valid complaint through our Grievance Desk.',
        ),
      ],
    ),
    'corrections': const LegalDocData(
      slug: 'corrections',
      title: 'Corrections Policy',
      subtitle: 'Transparent error handling, updates, and retraction standards',
      webUrl: LegalConstants.urlCorrections,
      sections: [
        LegalDocSection(
          heading: '1. Transparent Error Correction',
          body:
              'When an error of fact occurs in a published article, Nagrik promptly issues a transparent correction notice rather than quietly deleting or altering text without context.',
        ),
        LegalDocSection(
          heading: '2. Types of Corrections',
          body: 'We distinguish clearly between updates and corrections:',
          bulletPoints: [
            'Minor Typographical / Clarifications: Corrected directly with an updated timestamp.',
            'Substantive Factual Corrections: Appended with a prominent "Correction Note" specifying what was corrected and the exact time of revision.',
            'Retractions: If a report is found to be fundamentally unfounded, it is retracted with a public statement explaining the basis for retraction.',
          ],
        ),
        LegalDocSection(
          heading: '3. How to Request a Correction',
          body:
              'Readers, authorities, or affected parties may submit correction requests with supporting evidence directly to wizzlingsupport@gmail.com.',
        ),
      ],
    ),
    'grievance': const LegalDocData(
      slug: 'grievance',
      title: 'Grievance Redressal Mechanism',
      subtitle: 'Statutory compliance under IT Rules 2021 & DPDP Act 2023',
      webUrl: LegalConstants.urlGrievance,
      sections: [
        LegalDocSection(
          heading: '1. Resident Grievance Officer',
          body:
              'In compliance with Rule 11(2)(a) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Nagrik has appointed a dedicated Resident Grievance Officer.',
          bulletPoints: [
            'Entity: Wizzling Pvt Ltd',
            'Officer: Resident Grievance Officer',
            'Email: wizzlingsupport@gmail.com',
            'Helpline: +91 8890043675',
            'Office Address: Koilwar, Arrah, Bhojpur, Bihar - 802163, India',
          ],
        ),
        LegalDocSection(
          heading: '2. Statutory Timelines',
          body:
              'Every formal grievance received by the Grievance Officer is acknowledged within 24 hours of receipt. A formal decision and redressal report is communicated to the complainant within 15 days.',
        ),
        LegalDocSection(
          heading: '3. Grievance Submission Procedure',
          body:
              'Please include the specific article or video URL, description of violation, and your contact information when submitting a complaint.',
        ),
      ],
    ),
    'privacy': const LegalDocData(
      slug: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'Data protection, permissions, and security commitments',
      webUrl: LegalConstants.urlPrivacyPolicy,
      sections: [
        LegalDocSection(
          heading: '1. Data Collection & Privacy First',
          body:
              'Nagrik is designed with privacy-first principles. We do not require users to register or log in to browse public news, local feeds, videos, or legal compliance pages.',
        ),
        LegalDocSection(
          heading: '2. Location Data Handling',
          body:
              'When location permissions are granted, Nagrik uses coarse geographic information solely to surface relevant district and regional news. We do not store precise GPS tracking history.',
        ),
        LegalDocSection(
          heading: '3. Digital Personal Data Protection (DPDP) Act 2023',
          body:
              'Users have the right to request data access, correction, and deletion at any time by contacting our Privacy Desk at wizzlingsupport@gmail.com.',
        ),
      ],
    ),
    'terms': const LegalDocData(
      slug: 'terms',
      title: 'Terms of Service',
      subtitle: 'User terms, legal agreement, and platform obligations',
      webUrl: LegalConstants.urlTermsOfService,
      sections: [
        LegalDocSection(
          heading: '1. Agreement to Terms',
          body:
              'By accessing and using the Nagrik mobile application or website operated by Wizzling Pvt Ltd, you agree to comply with these terms, our Content Policy, and applicable Indian laws.',
        ),
        LegalDocSection(
          heading: '2. Intellectual Property & User Rights',
          body:
              'All original journalism, software UI, logos, and trademarks are the property of Wizzling Pvt Ltd. Public government gazettes and official announcements cited remain the property of their respective issuing bodies.',
        ),
        LegalDocSection(
          heading: '3. Non-Government Operation Disclaimer',
          body:
              'You acknowledge that Nagrik is an independent media platform and not an official government portal. Users must verify official procedures through authoritative government portals.',
        ),
      ],
    ),
  };

  @override
  Widget build(BuildContext context) {
    final doc = _docs[slug] ?? _docs['editorial-guidelines']!;
    final primaryColor = context.colorScheme.primary;
    final secondaryTextColor = context.nagrikTheme.textSecondary;

    return Scaffold(
      backgroundColor: context.nagrikTheme.level0Background,
      appBar: AppBar(
        title: Text(
          doc.title,
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
        actions: [
          IconButton(
            tooltip: 'Open Web Policy',
            icon: const Icon(Icons.open_in_browser_rounded),
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            onPressed: () => UrlHelper.launchUrlSafe(context, doc.webUrl),
          ),
        ],
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
              // Header Badge
              GlassCard(
                padding: const EdgeInsets.all(NagrikSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: primaryColor.withValues(alpha: 0.12),
                            borderRadius: NagrikRadii.borderRadiusPill,
                          ),
                          child: Text(
                            'OFFICIAL POLICY',
                            style: TextStyle(
                              color: primaryColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Wizzling Pvt Ltd',
                          style: context.textTheme.labelSmall?.copyWith(
                            color: secondaryTextColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: NagrikSpacing.space2),
                    Text(
                      doc.title,
                      style: context.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      doc.subtitle,
                      style: context.textTheme.bodySmall?.copyWith(
                        color: secondaryTextColor,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: NagrikSpacing.space4),

              // Policy Sections
              ...doc.sections.map((section) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: NagrikSpacing.space3),
                  child: GlassCard(
                    padding: const EdgeInsets.all(NagrikSpacing.space4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          section.heading,
                          style: context.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: NagrikSpacing.space2),
                        SelectableText(
                          section.body,
                          style: context.textTheme.bodyMedium?.copyWith(
                            height: 1.5,
                          ),
                        ),
                        if (section.bulletPoints.isNotEmpty) ...[
                          const SizedBox(height: NagrikSpacing.space2),
                          ...section.bulletPoints.map(
                            (pt) => Padding(
                              padding: const EdgeInsets.only(
                                bottom: 6,
                                left: 4,
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    margin: const EdgeInsets.only(
                                      top: 6,
                                      right: 8,
                                    ),
                                    width: 5,
                                    height: 5,
                                    decoration: BoxDecoration(
                                      color: primaryColor,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  Expanded(
                                    child: SelectableText(
                                      pt,
                                      style: context.textTheme.bodySmall
                                          ?.copyWith(height: 1.45),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: NagrikSpacing.space3),

              // Footer Action
              Center(
                child: TextButton.icon(
                  onPressed: () => UrlHelper.launchUrlSafe(context, doc.webUrl),
                  icon: const Icon(Icons.open_in_browser_rounded, size: 16),
                  label: const Text('View Full Web Policy at nagrik.news'),
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
