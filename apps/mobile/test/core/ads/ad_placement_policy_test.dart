import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/ads/ad_placement_policy.dart';

void main() {
  group('AdPlacementPolicy', () {
    test('identifies ad positions correctly with frequency 7', () {
      // Frequency = 7
      // 0..6: organic items
      // 7: ad 1
      // 8..14: organic items
      // 15: ad 2
      expect(AdPlacementPolicy.isAdIndex(0, frequency: 7), isFalse);
      expect(AdPlacementPolicy.isAdIndex(6, frequency: 7), isFalse);
      expect(AdPlacementPolicy.isAdIndex(7, frequency: 7), isTrue);
      expect(AdPlacementPolicy.isAdIndex(8, frequency: 7), isFalse);
      expect(AdPlacementPolicy.isAdIndex(14, frequency: 7), isFalse);
      expect(AdPlacementPolicy.isAdIndex(15, frequency: 7), isTrue);
      expect(AdPlacementPolicy.isAdIndex(23, frequency: 7), isTrue);
    });

    test('maps combined index back to organic items correctly', () {
      // Index 0 -> organic 0
      expect(AdPlacementPolicy.getOrganicIndex(0, frequency: 7), 0);
      // Index 6 -> organic 6
      expect(AdPlacementPolicy.getOrganicIndex(6, frequency: 7), 6);
      // Index 7 is an ad -> returns -1
      expect(AdPlacementPolicy.getOrganicIndex(7, frequency: 7), -1);
      // Index 8 -> organic 7 (after 1 ad)
      expect(AdPlacementPolicy.getOrganicIndex(8, frequency: 7), 7);
      // Index 14 -> organic 13
      expect(AdPlacementPolicy.getOrganicIndex(14, frequency: 7), 13);
      // Index 15 is ad 2 -> returns -1
      expect(AdPlacementPolicy.getOrganicIndex(15, frequency: 7), -1);
      // Index 16 -> organic 14 (after 2 ads)
      expect(AdPlacementPolicy.getOrganicIndex(16, frequency: 7), 14);
    });

    test('calculates total count correctly including ad slots', () {
      // 14 organic items with frequency 7 -> 14 + 2 ads = 16 total
      expect(
        AdPlacementPolicy.getTotalCount(14, frequency: 7, adsEnabled: true),
        16,
      );

      // 6 organic items with frequency 7 -> 6 items, 0 ads = 6 total
      expect(
        AdPlacementPolicy.getTotalCount(6, frequency: 7, adsEnabled: true),
        6,
      );

      // Ads disabled -> organic count unchanged
      expect(
        AdPlacementPolicy.getTotalCount(14, frequency: 7, adsEnabled: false),
        14,
      );
    });

    test('ad sequence numbers are correct', () {
      expect(AdPlacementPolicy.getAdSequenceNumber(7, frequency: 7), 1);
      expect(AdPlacementPolicy.getAdSequenceNumber(15, frequency: 7), 2);
      expect(AdPlacementPolicy.getAdSequenceNumber(23, frequency: 7), 3);
      expect(AdPlacementPolicy.getAdSequenceNumber(0, frequency: 7), 0);
    });
  });
}
