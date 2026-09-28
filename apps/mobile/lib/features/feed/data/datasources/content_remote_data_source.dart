import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/api_constants.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/domain/models/comment.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';

/// Contract and remote implementation for all Public Content APIs in APIs.md.
/// Seamlessly operates against Production Supabase RPCs / PostgREST and standard REST API Gateway.
class ContentRemoteDataSource {
  ContentRemoteDataSource({
    required this.apiClient,
    DeviceIdService? deviceIdService,
  })  : _deviceIdService = deviceIdService ?? DeviceIdService.instance;

  final ApiClient apiClient;
  final DeviceIdService _deviceIdService;

  /// 1. GET /content/feed OR RPC /rpc/get_personalized_feed
  /// Retrieves location-prioritized news & video feed with PostGIS radar, LGD hierarchy, and interleaved ads.
  Future<({List<FeedItem> items, List<Post> posts, FeedPagination pagination})> getFeed({
    String? city,
    String? area,
    String? district,
    String? subdistrict,
    String? village,
    String? pincode,
    double? lat,
    double? lng,
    int? stateCode,
    int? districtCode,
    int? subdistrictCode,
    int? localBodyCode,
    String? state,
    String? country,
    String? contentType,
    String? categoryId,
    String? categorySlug,
    int page = 1,
    int limit = 20,
    String? cursor,
  }) async {
    final dynamic response;

    if (ApiConstants.isSupabase) {
      final rpcBody = <String, dynamic>{
        'p_lat': ?lat,
        'p_lng': ?lng,
        if (city != null && city.isNotEmpty) 'p_city': city,
        if (area != null && area.isNotEmpty) 'p_area': area,
        if (district != null && district.isNotEmpty) 'p_district': district,
        if (subdistrict != null && subdistrict.isNotEmpty) 'p_subdistrict': subdistrict,
        if (village != null && village.isNotEmpty) 'p_village': village,
        if (pincode != null && pincode.isNotEmpty) 'p_pincode': pincode,
        if (state != null && state.isNotEmpty) 'p_state': state,
        'p_state_code': ?stateCode,
        'p_district_code': ?districtCode,
        'p_subdistrict_code': ?subdistrictCode,
        'p_local_body_code': ?localBodyCode,
        if (contentType != null && contentType.isNotEmpty) 'p_content_type': contentType,
        if (categoryId != null && categoryId.isNotEmpty) 'p_category_id': categoryId,
        'p_page': page,
        'p_limit': limit,
        if (cursor != null && cursor.isNotEmpty) 'p_cursor': cursor,
      };
      response = await apiClient.post(
        ApiConstants.feedRpc,
        body: rpcBody,
      );
    } else {
      final queryParams = <String, dynamic>{
        if (city != null && city.isNotEmpty) 'city': city,
        if (area != null && area.isNotEmpty) 'area': area,
        if (district != null && district.isNotEmpty) 'district': district,
        if (subdistrict != null && subdistrict.isNotEmpty) 'subdistrict': subdistrict,
        if (village != null && village.isNotEmpty) 'village': village,
        if (pincode != null && pincode.isNotEmpty) 'pincode': pincode,
        'lat': ?lat,
        'lng': ?lng,
        'stateCode': ?stateCode,
        'districtCode': ?districtCode,
        'subdistrictCode': ?subdistrictCode,
        'localBodyCode': ?localBodyCode,
        if (state != null && state.isNotEmpty) 'state': state,
        if (country != null && country.isNotEmpty) 'country': country,
        if (contentType != null && contentType.isNotEmpty) 'contentType': contentType,
        if (categoryId != null && categoryId.isNotEmpty) 'categoryId': categoryId,
        if (categorySlug != null && categorySlug.isNotEmpty) 'categorySlug': categorySlug,
        'page': page,
        'limit': limit,
        if (cursor != null && cursor.isNotEmpty) 'cursor': cursor,
      };
      response = await apiClient.get(
        ApiConstants.feed,
        queryParameters: queryParams,
      );
    }

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

  /// 2. GET /content/search OR RPC /rpc/search_content
  /// Search content by query, category, city, or type (ARTICLE, VIDEO).
  Future<List<Post>> search({
    required String query,
    String? categoryId,
    String? city,
    String? type,
  }) async {
    final dynamic response;

    if (ApiConstants.isSupabase) {
      final rpcBody = <String, dynamic>{
        'p_query': query,
        if (categoryId != null && categoryId.isNotEmpty) 'p_category_id': categoryId,
        if (city != null && city.isNotEmpty) 'p_city': city,
        if (type != null && type.isNotEmpty) 'p_type': type,
      };
      response = await apiClient.post(
        ApiConstants.searchRpc,
        body: rpcBody,
      );
    } else {
      final queryParams = <String, dynamic>{
        'q': query,
        if (categoryId != null && categoryId.isNotEmpty) 'categoryId': categoryId,
        if (city != null && city.isNotEmpty) 'city': city,
        if (type != null && type.isNotEmpty) 'type': type,
      };
      response = await apiClient.get(
        ApiConstants.search,
        queryParameters: queryParams,
      );
    }

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

  /// 3. GET /content/categories OR PostgREST /categories
  /// Retrieves list of active categories.
  Future<List<CategoryModel>> getCategories() async {
    final dynamic response = await apiClient.get(
      ApiConstants.isSupabase ? ApiConstants.categoriesRest : ApiConstants.categories,
    );
    final categories = <CategoryModel>[];

    final dynamic list = response is List
        ? response
        : (response is Map<String, dynamic>
            ? (response['categories'] ?? response['data'])
            : null);

    if (list is List) {
      for (final item in list) {
        if (item is Map<String, dynamic>) {
          categories.add(CategoryModel.fromJson(item));
        }
      }
    }

    return categories;
  }

  /// 4. GET /content/locations OR PostgREST /locations
  /// Retrieves supported localities and cities for location switcher.
  Future<List<LocationModel>> getLocations() async {
    final dynamic response = await apiClient.get(
      ApiConstants.isSupabase ? ApiConstants.locationsRest : ApiConstants.locations,
    );
    final locations = <LocationModel>[];

    final dynamic list = response is List
        ? response
        : (response is Map<String, dynamic>
            ? (response['locations'] ?? response['data'])
            : null);

    if (list is List) {
      for (final item in list) {
        if (item is Map<String, dynamic>) {
          locations.add(LocationModel.fromJson(item));
        }
      }
    }

    return locations;
  }

  /// 5. GET /content/{id} OR RPC /rpc/get_content_detail
  /// Retrieves full content / video details.
  Future<Post> getContentDetails(String id) async {
    final dynamic response;
    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.detailRpc,
        body: {'p_id': id},
      );
    } else {
      response = await apiClient.get(ApiConstants.contentDetail(id));
    }

    if (response is Map<String, dynamic>) {
      final contentJson = response['content'] ?? response['data'] ?? response;
      if (contentJson is Map<String, dynamic>) {
        return Post.fromJson(contentJson);
      }
    }

    throw const FormatException('Invalid content details response');
  }

  /// 6. POST /content/{id}/like OR RPC /rpc/toggle_content_like
  /// Toggle like status on article or video without login.
  Future<({bool success, bool isLiked, int likes})> toggleLike(String id) async {
    final dynamic response;
    final deviceId = await _deviceIdService.getDeviceId();
    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.likeRpc,
        body: {
          'p_content_id': id,
          'p_device_id': deviceId,
        },
      );
    } else {
      response = await apiClient.post(ApiConstants.likeContent(id));
    }

    if (response is Map<String, dynamic>) {
      return (
        success: response['success'] == true,
        isLiked: response['isLiked'] == true,
        likes: (response['likes'] as num?)?.toInt() ?? 0,
      );
    }

    return (success: false, isLiked: false, likes: 0);
  }

  /// 6b. Increment share count on content
  Future<({bool success, int shares})> incrementShare(String id) async {
    final dynamic response;
    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.shareRpc,
        body: {'p_content_id': id},
      );
    } else {
      response = await apiClient.post(ApiConstants.shareContent(id));
    }

    if (response is Map<String, dynamic>) {
      return (
        success: response['success'] == true,
        shares: (response['shares'] as num?)?.toInt() ?? 0,
      );
    }

    return (success: false, shares: 0);
  }

  /// 6c. Get live comments for a content item
  Future<List<Comment>> getComments(
    String contentId, {
    int limit = 50,
    int offset = 0,
  }) async {
    final dynamic response;
    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.commentsRpc,
        body: {
          'p_content_id': contentId,
          'p_limit': limit,
          'p_offset': offset,
        },
      );
    } else {
      response = await apiClient.get(
        ApiConstants.contentComments(contentId),
        queryParameters: {'limit': limit, 'offset': offset},
      );
    }

    final comments = <Comment>[];
    if (response is Map<String, dynamic>) {
      final commentsList = response['comments'] ?? response['data'] ?? response['items'];
      if (commentsList is List) {
        for (final item in commentsList) {
          if (item is Map<String, dynamic>) {
            try {
              comments.add(Comment.fromJson(item));
            } catch (_) {}
          }
        }
      }
    }
    return comments;
  }

  /// 6d. Add comment to a content item
  Future<({bool success, Comment? comment, int commentsCount})> addComment({
    required String contentId,
    required String text,
    String? authorName,
  }) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final dynamic response;
    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.addCommentRpc,
        body: {
          'p_content_id': contentId,
          'p_text': text,
          if (authorName != null && authorName.isNotEmpty) 'p_author_name': authorName,
          'p_device_id': deviceId,
        },
      );
    } else {
      response = await apiClient.post(
        ApiConstants.contentComments(contentId),
        body: {
          'text': text,
          if (authorName != null && authorName.isNotEmpty) 'authorName': authorName,
          'deviceId': deviceId,
        },
      );
    }

    if (response is Map<String, dynamic> && response['success'] == true) {
      Comment? comment;
      if (response['comment'] is Map<String, dynamic>) {
        try {
          comment = Comment.fromJson(response['comment'] as Map<String, dynamic>);
        } catch (_) {}
      }
      return (
        success: true,
        comment: comment,
        commentsCount: (response['commentsCount'] as num?)?.toInt() ?? 0,
      );
    }

    return (success: false, comment: null, commentsCount: 0);
  }

  /// 7. POST /content/{id}/save OR RPC /rpc/toggle_content_save
  /// Toggle bookmark / save status on content.
  Future<({bool success, bool isSaved})> toggleSave(String id) async {
    final dynamic response;
    if (ApiConstants.isSupabase) {
      final deviceId = await _deviceIdService.getDeviceId();
      response = await apiClient.post(
        ApiConstants.saveRpc,
        body: {
          'p_content_id': id,
          'p_device_id': deviceId,
        },
      );
    } else {
      response = await apiClient.post(ApiConstants.saveContent(id));
    }

    if (response is Map<String, dynamic>) {
      return (
        success: response['success'] == true,
        isSaved: response['isSaved'] == true,
      );
    }

    return (success: false, isSaved: false);
  }

  /// 8. POST /content/{id}/report OR RPC /rpc/report_content
  /// Report inappropriate content with reason & device ID.
  Future<ReportResponse> reportContent({
    required String id,
    required String reason,
  }) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final dynamic response;

    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.reportRpc,
        body: {
          'p_content_id': id,
          'p_reason': reason,
          'p_device_id': deviceId,
        },
      );
    } else {
      final body = ReportRequest(
        reason: reason,
        deviceId: deviceId,
      ).toJson();
      response = await apiClient.post(
        ApiConstants.reportContent(id),
        body: body,
      );
    }

    if (response is Map<String, dynamic>) {
      return ReportResponse.fromJson(response);
    }

    return const ReportResponse(
      success: false,
      message: 'Failed to submit report',
    );
  }

  /// 9. POST /views OR RPC /rpc/track_video_view
  /// Enforces 3-view ceiling monetization rule for video tracking.
  Future<ViewRegistrationResponse> registerView({
    required String videoId,
  }) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final dynamic response;

    if (ApiConstants.isSupabase) {
      response = await apiClient.post(
        ApiConstants.viewsRpc,
        body: {
          'p_video_id': videoId,
          'p_device_id': deviceId,
        },
      );
    } else {
      final body = ViewRegistrationRequest(
        videoId: videoId,
        deviceId: deviceId,
      ).toJson();
      response = await apiClient.post(
        ApiConstants.views,
        body: body,
      );
    }

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
