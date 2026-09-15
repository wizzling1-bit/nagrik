import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/api_constants.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';

/// Contract and remote implementation for all Public Content APIs in APIs.md.
class ContentRemoteDataSource {
  ContentRemoteDataSource({
    required this.apiClient,
    DeviceIdService? deviceIdService,
  })  : _deviceIdService = deviceIdService ?? DeviceIdService.instance;

  final ApiClient apiClient;
  final DeviceIdService _deviceIdService;

  /// 1. GET /content/feed
  /// Retrieves location-prioritized news & video feed with pagination and interleaved ads.
  Future<({List<FeedItem> items, List<Post> posts, FeedPagination pagination})> getFeed({
    String? city,
    String? area,
    String? state,
    String? country,
    String? contentType,
    int page = 1,
    int limit = 20,
  }) async {
    final queryParams = <String, dynamic>{
      if (city != null && city.isNotEmpty) 'city': city,
      if (area != null && area.isNotEmpty) 'area': area,
      if (state != null && state.isNotEmpty) 'state': state,
      if (country != null && country.isNotEmpty) 'country': country,
      if (contentType != null && contentType.isNotEmpty) 'contentType': contentType,
      'page': page,
      'limit': limit,
    };

    final response = await apiClient.get(
      ApiConstants.feed,
      queryParameters: queryParams,
    );

    final feedItems = <FeedItem>[];
    FeedPagination pagination = const FeedPagination();

    if (response is Map<String, dynamic>) {
      if (response['pagination'] is Map<String, dynamic>) {
        pagination = FeedPagination.fromJson(
          response['pagination'] as Map<String, dynamic>,
        );
      }

      final items = response['items'];
      if (items is List) {
        for (final item in items) {
          if (item is Map<String, dynamic>) {
            final itemType = (item['itemType'] ?? 'CONTENT').toString().toUpperCase();
            if (itemType == 'CONTENT') {
              try {
                final post = Post.fromJson(item);
                feedItems.add(ContentFeedItem(post: post));
              } catch (_) {}
            } else if (itemType == 'ADVERTISEMENT') {
              try {
                feedItems.add(AdvertisementFeedItem.fromJson(item));
              } catch (_) {}
            }
          }
        }
      }
    }

    final posts = [
      for (final it in feedItems)
        if (it is ContentFeedItem) it.post,
    ];

    return (items: feedItems, posts: posts, pagination: pagination);
  }

  /// 2. GET /content/search
  /// Search content by query, category, city, or type (ARTICLE, VIDEO).
  Future<List<Post>> search({
    required String query,
    String? categoryId,
    String? city,
    String? type,
  }) async {
    final queryParams = <String, dynamic>{
      'q': query,
      if (categoryId != null && categoryId.isNotEmpty) 'categoryId': categoryId,
      if (city != null && city.isNotEmpty) 'city': city,
      if (type != null && type.isNotEmpty) 'type': type,
    };

    final response = await apiClient.get(
      ApiConstants.search,
      queryParameters: queryParams,
    );

    final posts = <Post>[];
    if (response is Map<String, dynamic>) {
      final contents = response['contents'] ?? response['items'];
      if (contents is List) {
        for (final item in contents) {
          if (item is Map<String, dynamic>) {
            try {
              posts.add(Post.fromJson(item));
            } catch (_) {}
          }
        }
      }
    }

    return posts;
  }

  /// 3. GET /content/categories
  /// Retrieves list of active categories.
  Future<List<CategoryModel>> getCategories() async {
    final response = await apiClient.get(ApiConstants.categories);
    final categories = <CategoryModel>[];

    if (response is Map<String, dynamic>) {
      final list = response['categories'];
      if (list is List) {
        for (final item in list) {
          if (item is Map<String, dynamic>) {
            categories.add(CategoryModel.fromJson(item));
          }
        }
      }
    }

    return categories;
  }

  /// 4. GET /content/locations
  /// Retrieves supported localities and cities for location switcher.
  Future<List<LocationModel>> getLocations() async {
    final response = await apiClient.get(ApiConstants.locations);
    final locations = <LocationModel>[];

    if (response is Map<String, dynamic>) {
      final list = response['locations'];
      if (list is List) {
        for (final item in list) {
          if (item is Map<String, dynamic>) {
            locations.add(LocationModel.fromJson(item));
          }
        }
      }
    }

    return locations;
  }

  /// 5. GET /content/{id}
  /// Retrieves full content / video details.
  Future<Post> getContentDetails(String id) async {
    final response = await apiClient.get(ApiConstants.contentDetail(id));

    if (response is Map<String, dynamic>) {
      final contentJson = response['content'] ?? response['data'] ?? response;
      if (contentJson is Map<String, dynamic>) {
        return Post.fromJson(contentJson);
      }
    }

    throw const FormatException('Invalid content details response');
  }

  /// 6. POST /content/{id}/like
  /// Toggle like status on article or video without login.
  Future<({bool success, bool isLiked, int likes})> toggleLike(String id) async {
    final response = await apiClient.post(ApiConstants.likeContent(id));

    if (response is Map<String, dynamic>) {
      return (
        success: response['success'] == true,
        isLiked: response['isLiked'] == true,
        likes: (response['likes'] as num?)?.toInt() ?? 0,
      );
    }

    return (success: false, isLiked: false, likes: 0);
  }

  /// 7. POST /content/{id}/save
  /// Toggle bookmark / save status on content.
  Future<({bool success, bool isSaved})> toggleSave(String id) async {
    final response = await apiClient.post(ApiConstants.saveContent(id));

    if (response is Map<String, dynamic>) {
      return (
        success: response['success'] == true,
        isSaved: response['isSaved'] == true,
      );
    }

    return (success: false, isSaved: false);
  }

  /// 8. POST /content/{id}/report
  /// Report inappropriate content with reason & device ID.
  Future<ReportResponse> reportContent({
    required String id,
    required String reason,
  }) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final body = ReportRequest(
      reason: reason,
      deviceId: deviceId,
    ).toJson();

    final response = await apiClient.post(
      ApiConstants.reportContent(id),
      body: body,
    );

    if (response is Map<String, dynamic>) {
      return ReportResponse.fromJson(response);
    }

    return const ReportResponse(
      success: false,
      message: 'Failed to submit report',
    );
  }

  /// 9. POST /views
  /// Enforces 3-view ceiling monetization rule for video tracking.
  Future<ViewRegistrationResponse> registerView({
    required String videoId,
  }) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final body = ViewRegistrationRequest(
      videoId: videoId,
      deviceId: deviceId,
    ).toJson();

    final response = await apiClient.post(
      ApiConstants.views,
      body: body,
    );

    if (response is Map<String, dynamic>) {
      return ViewRegistrationResponse.fromJson(response);
    }

    return const ViewRegistrationResponse(
      success: false,
      isEligibleView: false,
      currentCountedViews: 0,
      totalViews: 0,
      eligibleViews: 0,
    );
  }
}

/// Riverpod provider for ContentRemoteDataSource.
final contentRemoteDataSourceProvider = Provider<ContentRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ContentRemoteDataSource(apiClient: apiClient);
});
