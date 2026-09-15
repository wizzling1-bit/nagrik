import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/ads/ad_constants.dart';

void main() {
  group('AdConstants', () {
    test('production IDs match user requirements', () {
      expect(AdConstants.prodAppId, 'ca-app-pub-3435015056397165~2351220725');
      expect(AdConstants.prodBanner, 'ca-app-pub-3435015056397165/2346034641');
      expect(AdConstants.prodInterstitial, 'ca-app-pub-3435015056397165/8719871300');
      expect(AdConstants.prodRewardedInterstitial, 'ca-app-pub-3435015056397165/5224796077');
      expect(AdConstants.prodRewarded, 'ca-app-pub-3435015056397165/3382794465');
      expect(AdConstants.prodNative, 'ca-app-pub-3435015056397165/1945589712');
      expect(AdConstants.prodAppOpen, 'ca-app-pub-3435015056397165/2999651087');
    });

    test('resolves production ID by default without forceTestMode', () {
      expect(AdConstants.getAdUnitId(AdFormat.banner), AdConstants.prodBanner);
      expect(AdConstants.getAdUnitId(AdFormat.native), AdConstants.prodNative);
      expect(AdConstants.getAdUnitId(AdFormat.interstitial), AdConstants.prodInterstitial);
      expect(AdConstants.getAdUnitId(AdFormat.appOpen), AdConstants.prodAppOpen);
    });

    test('resolves production ID when forceTestMode is false', () {
      final bannerId = AdConstants.getAdUnitId(
        AdFormat.banner,
        forceTestMode: false,
      );
      expect(bannerId, AdConstants.prodBanner);

      final nativeId = AdConstants.getAdUnitId(
        AdFormat.native,
        forceTestMode: false,
      );
      expect(nativeId, AdConstants.prodNative);

      final interstitialId = AdConstants.getAdUnitId(
        AdFormat.interstitial,
        forceTestMode: false,
      );
      expect(interstitialId, AdConstants.prodInterstitial);

      final appOpenId = AdConstants.getAdUnitId(
        AdFormat.appOpen,
        forceTestMode: false,
      );
      expect(appOpenId, AdConstants.prodAppOpen);
    });

    test('resolves Google test IDs when forceTestMode is true', () {
      final bannerId = AdConstants.getAdUnitId(
        AdFormat.banner,
        forceTestMode: true,
      );
      expect(bannerId, contains('ca-app-pub-3940256099942544'));

      final nativeId = AdConstants.getAdUnitId(
        AdFormat.native,
        forceTestMode: true,
      );
      expect(nativeId, contains('ca-app-pub-3940256099942544'));
    });
  });
}
