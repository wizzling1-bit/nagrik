import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/ad_constants.dart';
import 'package:nagrik/core/ads/widgets/nagrik_adaptive_banner.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/glass_card.dart';

export 'package:google_mobile_ads/google_mobile_ads.dart' show TemplateType;

/// Production-ready, theme-adaptive Native Ad Card for Nagrik.
///
/// Designed with luxury editorial aesthetics:
/// - Distinct high-contrast "SPONSORED" badge adhering strictly to AdMob policies.
/// - Never mimics organic journalism badges, author headers, or verification ticks.
/// - Gracefully falls back to [NagrikAdaptiveBanner] if native inventory is unavailable.
/// - Proper lifecycle disposal to prevent native memory leaks.
class NagrikNativeAdCard extends ConsumerStatefulWidget {
  const NagrikNativeAdCard({
    super.key,
    this.templateType = TemplateType.medium,
    this.margin = const EdgeInsets.symmetric(
      horizontal: NagrikSpacing.space4,
      vertical: NagrikSpacing.space2,
    ),
  });

  final TemplateType templateType;
  final EdgeInsetsGeometry margin;

  @override
  ConsumerState<NagrikNativeAdCard> createState() => _NagrikNativeAdCardState();
}

class _NagrikNativeAdCardState extends ConsumerState<NagrikNativeAdCard> {
  NativeAd? _nativeAd;
  bool _isLoaded = false;
  bool _isLoading = false;
  bool _hasFailed = false;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  @override
  void initState() {
    super.initState();
    _loadNativeAd();
  }

  void _loadNativeAd() {
    if (_isLoaded || _isLoading || _nativeAd != null) return;

    final consent = ref.read(adConsentProvider);
    if (!consent.canRequestAds) {
      // Consent still pending or denied; do not permanently mark as failed yet
      return;
    }

    final config = ref.read(adConfigurationProvider);
    if (!config.nativeEnabled) {
      if (mounted) setState(() => _hasFailed = true);
      return;
    }

    _isLoading = true;

    final adUnitId = AdConstants.getAdUnitId(
      AdFormat.native,
      forceTestMode: config.forceTestAds,
    );

    final ad = NativeAd(
      adUnitId: adUnitId,
      factoryId: null, // Using Flutter native template
      nativeTemplateStyle: _buildTemplateStyle(),
      request: const AdRequest(),
      listener: NativeAdListener(
        onAdLoaded: (ad) {
          if (!mounted) {
            ad.dispose();
            return;
          }
          setState(() {
            _nativeAd = ad as NativeAd;
            _isLoaded = true;
            _isLoading = false;
            _hasFailed = false;
          });
        },
        onAdFailedToLoad: (ad, error) {
          _log(
            'Nagrik NativeAd: Failed to load [${error.code}]: ${error.message}',
          );
          ad.dispose();
          if (mounted) {
            setState(() {
              _nativeAd = null;
              _isLoaded = false;
              _isLoading = false;
              _hasFailed = true;
            });
          }
        },
        onAdImpression: (ad) {
          _log('Nagrik NativeAd: Impression registered.');
        },
        onAdClicked: (ad) {
          _log('Nagrik NativeAd: Ad clicked.');
        },
      ),
    );

    _nativeAd = ad;
    ad.load();
  }

  NativeTemplateStyle _buildTemplateStyle() {
    // Determine theme mode
    final isDark =
        WidgetsBinding.instance.platformDispatcher.platformBrightness ==
            Brightness.dark;

    final bgColor = isDark ? const Color(0xFF1A2333) : const Color(0xFFF8FAFC);
    final primaryTextColor =
        isDark ? const Color(0xFFE2E8F0) : const Color(0xFF0F172A);
    final secondaryTextColor =
        isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
    final ctaBgColor =
        isDark ? const Color(0xFF5A8EE8) : const Color(0xFF1A365D);

    return NativeTemplateStyle(
      templateType: widget.templateType,
      mainBackgroundColor: bgColor,
      cornerRadius: 14.0,
      callToActionTextStyle: NativeTemplateTextStyle(
        textColor: Colors.white,
        backgroundColor: ctaBgColor,
        style: NativeTemplateFontStyle.bold,
        size: 14.0,
      ),
      primaryTextStyle: NativeTemplateTextStyle(
        textColor: primaryTextColor,
        style: NativeTemplateFontStyle.bold,
        size: 15.0,
      ),
      secondaryTextStyle: NativeTemplateTextStyle(
        textColor: secondaryTextColor,
        style: NativeTemplateFontStyle.normal,
        size: 13.0,
      ),
      tertiaryTextStyle: NativeTemplateTextStyle(
        textColor: secondaryTextColor,
        style: NativeTemplateFontStyle.normal,
        size: 12.0,
      ),
    );
  }

  void _showAdInfoModal(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.isDarkMode
          ? context.nagrikTheme.level2Elevated
          : context.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(NagrikSpacing.space4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: context.colorScheme.primary.withValues(alpha: 0.12),
                      borderRadius: NagrikRadii.borderRadiusXs,
                    ),
                    child: Text(
                      'SPONSORED ADVERTISEMENT',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: context.colorScheme.primary,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'About This Advertisement',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 8),
              Text(
                'This advertisement is delivered through Google AdMob. Nagrik strictly separates editorial journalism from promotional partner content.',
                style: TextStyle(
                  fontSize: 13.5,
                  height: 1.45,
                  color: ctx.nagrikTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nativeAd?.dispose();
    _nativeAd = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AdConsentState>(adConsentProvider, (previous, next) {
      if (next.canRequestAds && !_isLoaded && !_isLoading && !_hasFailed) {
        _loadNativeAd();
      }
    });

    if (_hasFailed) {
      // Graceful fallback: show adaptive banner so space is monetized
      return NagrikAdaptiveBanner(margin: widget.margin);
    }

    if (!_isLoaded || _nativeAd == null) {
      // Hidden while loading so feed layout never jerks or displays empty space
      return const SizedBox.shrink();
    }

    final isDark = context.isDarkMode;
    final height = widget.templateType == TemplateType.medium ? 340.0 : 100.0;

    return Container(
      margin: widget.margin,
      child: GlassCard(
        padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Mandatory Sponsored Label & Info Trigger (AdMob Compliance)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 2.5,
                      ),
                      decoration: BoxDecoration(
                        color: isDark
                            ? Colors.white.withValues(alpha: 0.08)
                            : const Color(0xFFE2E8F0),
                        borderRadius: NagrikRadii.borderRadiusXs,
                        border: Border.all(
                          color: isDark
                              ? context.colorScheme.primary.withValues(alpha: 0.30)
                              : context.nagrikTheme.border.withValues(alpha: 0.60),
                          width: 0.8,
                        ),
                      ),
                      child: Text(
                        'AD',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: isDark
                              ? context.colorScheme.primary
                              : context.nagrikTheme.textSecondary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Sponsored Content',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                        color: context.nagrikTheme.textTertiary,
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => _showAdInfoModal(context),
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsets.all(4),
                    child: Icon(
                      Icons.info_outline_rounded,
                      size: 15,
                      color: context.nagrikTheme.textTertiary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Native Ad Surface
            SizedBox(
              height: height,
              child: AdWidget(ad: _nativeAd!),
            ),
          ],
        ),
      ),
    );
  }
}
