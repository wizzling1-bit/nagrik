/// Centralized placement policy for in-feed advertising.
///
/// Ensures advertisements are inserted at predictable intervals without counting
/// previous advertisements as organic content, preventing ad clustering.
abstract final class AdPlacementPolicy {
  /// Determines if a given list index should host an advertisement.
  ///
  /// For example, with [frequency] = 7:
  /// - Index 0..6: 7 organic items
  /// - Index 7: Ad #1
  /// - Index 8..14: 7 organic items
  /// - Index 15: Ad #2
  static bool isAdIndex(int index, {int frequency = 7}) {
    if (frequency <= 0) return false;
    final blockSize = frequency + 1;
    return (index % blockSize) == frequency;
  }

  /// Maps a combined feed list index back to its corresponding index in the organic items list.
  /// Returns -1 if the given [index] is an advertisement.
  static int getOrganicIndex(int index, {int frequency = 7}) {
    if (frequency <= 0) return index;
    if (isAdIndex(index, frequency: frequency)) return -1;
    final blockSize = frequency + 1;
    final precedingAds = index ~/ blockSize;
    return index - precedingAds;
  }

  /// Calculates the total combined item count (organic items + inserted ads).
  static int getTotalCount(
    int organicCount, {
    int frequency = 7,
    bool adsEnabled = true,
  }) {
    if (!adsEnabled || frequency <= 0 || organicCount <= 0) {
      return organicCount;
    }
    final adCount = organicCount ~/ frequency;
    return organicCount + adCount;
  }

  /// Returns the 1-based ad sequence number for a given ad index (e.g. 1st ad, 2nd ad).
  static int getAdSequenceNumber(int index, {int frequency = 7}) {
    if (!isAdIndex(index, frequency: frequency)) return 0;
    final blockSize = frequency + 1;
    return (index ~/ blockSize) + 1;
  }
}
