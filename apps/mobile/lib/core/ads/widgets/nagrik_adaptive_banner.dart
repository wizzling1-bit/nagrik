import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nagrik/core/ads/ad_configuration.dart';
import 'package:nagrik/core/ads/ad_consent_manager.dart';
import 'package:nagrik/core/ads/ad_constants.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';

/// Production-ready Adaptive Banner ad widget for Nagrik.
///
/// Features:
/// - Automatically computes anchored adaptive size matching device screen width.
/// - Gracefully collapses to [SizedBox.shrink] if loading fails or while loading.
/// - Padded to avoid proximity to navigation controls (AdMob accidental click prevention).
class NagrikAdaptiveBanner extends ConsumerStatefulWidget {
  const NagrikAdaptiveBanner({
    super.key,
    this.margin = const EdgeInsets.symmetric(
      horizontal: NagrikSpacing.space4,
      vertical: NagrikSpacing.space2,
    ),
  });

  final EdgeInsetsGeometry margin;

  @override
  ConsumerState<NagrikAdaptiveBanner> createState() =>
      _NagrikAdaptiveBannerState();
}

class _NagrikAdaptiveBannerState extends ConsumerState<NagrikAdaptiveBanner> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;
  bool _isLoading = false;
  bool _hasFailed = false;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadBanner();
  }

  Future<void> _loadBanner() async {
    final config = ref.read(adConfigurationProvider);
    if (!config.bannerEnabled) return;

    final consent = ref.read(adConsentProvider);
    if (!consent.canRequestAds) return;

    if (_bannerAd != null || _isLoading) return;
    _isLoading = true;

    final width = MediaQuery.sizeOf(context).width.truncate();
    final adSize =
        await AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(width);
    if (adSize == null || !mounted) {
      _isLoading = false;
      return;
    }

    final adUnitId = AdConstants.getAdUnitId(
      AdFormat.banner,
      forceTestMode: config.forceTestAds,
    );

    final banner = BannerAd(
      adUnitId: adUnitId,
      size: adSize,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          if (!mounted) {
            ad.dispose();
            return;
          }
          setState(() {
            _bannerAd = ad as BannerAd;
            _isLoaded = true;
            _isLoading = false;
            _hasFailed = false;
          });
        },
        onAdFailedToLoad: (ad, error) {
          _log(
            'Nagrik Banner: Failed to load [${error.code}]: ${error.message}',
          );
          ad.dispose();
          if (mounted) {
            setState(() {
              _bannerAd = null;
              _isLoaded = false;
              _isLoading = false;
              _hasFailed = true;
            });
          }
        },
        onAdImpression: (ad) {
          _log('Nagrik Banner: Impression logged.');
        },
        onAdClicked: (ad) {
          _log('Nagrik Banner: Click logged.');
        },
      ),
    );

    _bannerAd = banner;
    await banner.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    _bannerAd = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AdConsentState>(adConsentProvider, (previous, next) {
      if (next.canRequestAds && !_isLoaded && !_isLoading && !_hasFailed) {
        _loadBanner();
      }
    });

    if (_hasFailed || !_isLoaded || _bannerAd == null) {
      return const SizedBox.shrink();
    }

    final isDark = context.isDarkMode;

    return Container(
      margin: widget.margin,
      padding: const EdgeInsets.symmetric(vertical: 6),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: isDark
            ? context.nagrikTheme.level1Surface
            : context.colorScheme.surface,
        borderRadius: NagrikRadii.borderRadiusMd,
        border: Border.all(
          color: context.nagrikTheme.border.withValues(
            alpha: isDark ? 0.35 : 0.60,
          ),
          width: 0.8,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'ADVERTISEMENT',
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                    color: context.nagrikTheme.textTertiary,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: _bannerAd!.size.width.toDouble(),
            height: _bannerAd!.size.height.toDouble(),
            child: AdWidget(ad: _bannerAd!),
          ),
        ],
      ),
    );
  }
}
