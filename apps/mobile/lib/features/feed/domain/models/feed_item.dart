import 'package:nagrik/features/feed/domain/models/post.dart';

/// Sealed feed item abstraction supporting both organic editorial content
/// and dynamically interleaved advertisements adhering to APIs.md contract.
sealed class FeedItem {
  const FeedItem();

  String get id;
}

/// Organic editorial news post or video report.
final class ContentFeedItem extends FeedItem {
  const ContentFeedItem({required this.post});

  final Post post;

  @override
  String get id => post.id;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ContentFeedItem && runtimeType == other.runtimeType && post == other.post;

  @override
  int get hashCode => post.hashCode;
}

/// Dynamically interleaved sponsor / advertisement item with clear, non-deceptive labeling.
final class AdvertisementFeedItem extends FeedItem {
  const AdvertisementFeedItem({
    required this.id,
    required this.title,
    required this.sponsorName,
    this.description,
    this.mediaUrl,
    this.targetUrl,
    this.ctaText = 'Learn more',
  });

  @override
  final String id;
  final String title;
  final String sponsorName;
  final String? description;
  final String? mediaUrl;
  final String? targetUrl;
  final String ctaText;

  factory AdvertisementFeedItem.fromJson(Map<String, dynamic> json) {
    final data = json.containsKey('data') && json['data'] is Map
        ? (json['data'] as Map).cast<String, dynamic>()
        : json;

    return AdvertisementFeedItem(
      id: data['id']?.toString() ??
          data['_id']?.toString() ??
          data['adId']?.toString() ??
          DateTime.now().millisecondsSinceEpoch.toString(),
      title: data['title']?.toString() ??
          data['headline']?.toString() ??
          'Sponsored Announcement',
      sponsorName: data['sponsorName']?.toString() ??
          data['sponsor']?.toString() ??
          data['clientName']?.toString() ??
          'Nagrik Partner',
      description: data['description']?.toString() ?? data['body']?.toString(),
      mediaUrl: data['mediaUrl']?.toString() ?? data['imageUrl']?.toString(),
      targetUrl: data['targetUrl']?.toString() ?? data['link']?.toString(),
      ctaText: data['ctaText']?.toString() ?? 'Learn more',
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AdvertisementFeedItem &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
