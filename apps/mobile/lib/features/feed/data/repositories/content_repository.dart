import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Repository managing content synchronization with stale-while-revalidate caching.
class ContentRepository {
  ContentRepository({
    required this.remoteDataSource,
    this.prefs,
  });

  final ContentRemoteDataSource remoteDataSource;
  SharedPreferences? prefs;

  void _log(String message) {
    if (kDebugMode) {
      debugPrint(message);
    }
  }

  static const String _kCachedFeedKey = 'nagrik_cached_feed_json';
  static const String _kCachedLocationsKey = 'nagrik_cached_locations_json';
  static const String _kCachedCategoriesKey = 'nagrik_cached_categories_json';
  static const String _kCacheVersionKey = 'nagrik_cache_version';
  static const int _kCacheVersion = 2;
  static const int _kMaxCachedPosts = 150;
  static const int _kMaxSavedPosts = 200;

  /// Exposed for [SavedRepository] eviction policy.
  static int get maxSavedPosts => _kMaxSavedPosts;

  final Set<String> _sessionViewedVideoIds = <String>{};

  Future<SharedPreferences> _getPrefs() async {
    prefs ??= await SharedPreferences.getInstance();
    await _ensureCacheVersion(prefs!);
    return prefs!;
  }

  Future<void> _ensureCacheVersion(SharedPreferences p) async {
    try {
      final v = p.getInt(_kCacheVersionKey);
      if (v == null || v != _kCacheVersion) {
        await p.remove(_kCachedFeedKey);
        await p.setInt(_kCacheVersionKey, _kCacheVersion);
      }
    } catch (_) {}
  }

  /// Fetches feed items supporting both editorial content and interleaved ads with pagination.
  /// Single remote attempt: on empty/throw it falls straight back to the
  /// local cache (never re-hits the network — fixes the old double-fetch stall).
  Future<({List<FeedItem> items, FeedPagination pagination})> getFeedWithItems({
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
    AppError? remoteError;
    try {
      final result = await remoteDataSource.getFeed(
        city: city,
        area: area,
        district: district,
        subdistrict: subdistrict,
        village: village,
        pincode: pincode,
        lat: lat,
        lng: lng,
        stateCode: stateCode,
        districtCode: districtCode,
        subdistrictCode: subdistrictCode,
        localBodyCode: localBodyCode,
        state: state,
        country: country,
        contentType: contentType,
        categoryId: categoryId,
        categorySlug: categorySlug,
        page: page,
        limit: limit,
        cursor: cursor,
      );

      if (result.items.isNotEmpty || page > 1) {
        if (result.posts.isNotEmpty) {
          await _cacheFeedLocally(result.posts);
        }
        return (items: result.items, pagination: result.pagination);
      }
    } catch (e) {
      remoteError = mapToAppError(e);
      _log('ContentRepository: Remote feed items fetch failed (${remoteError.message}). Using cache.');
    }

    // Straight to cache — no second network call.
    final cached = await _filterCachedFeed(city: city);
    if (cached.isNotEmpty) {
      final items = <FeedItem>[for (final p in cached) ContentFeedItem(post: p)];
      return (
        items: items,
        pagination: FeedPagination(page: page, limit: limit, totalItems: items.length, totalPages: 1),
      );
    }

    if (remoteError != null) {
      throw remoteError;
    }

    return (
      items: <FeedItem>[],
      pagination: FeedPagination(page: page, limit: limit, totalItems: 0, totalPages: 0),
    );
  }

  /// Fetches the feed as posts only (no ad items). Thin delegate over
  /// [getFeedWithItems] so remote/cache/seed fallback lives in one place.
  Future<List<Post>> getFeed({
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
    final result = await getFeedWithItems(
      city: city,
      area: area,
      district: district,
      subdistrict: subdistrict,
      village: village,
      pincode: pincode,
      lat: lat,
      lng: lng,
      stateCode: stateCode,
      districtCode: districtCode,
      subdistrictCode: subdistrictCode,
      localBodyCode: localBodyCode,
      state: state,
      country: country,
      contentType: contentType,
      categoryId: categoryId,
      categorySlug: categorySlug,
      page: page,
      limit: limit,
      cursor: cursor,
    );
    return result.items.whereType<ContentFeedItem>().map((i) => i.post).toList();
  }

  /// Returns cached posts, preferring [city] matches but falling back to the
  /// full real cache rather than jumping to fake seed content.
  Future<List<Post>> _filterCachedFeed({String? city}) async {
    final cached = await _getCachedFeed();
    if (cached.isEmpty) return const [];
    if (city != null && city.trim().isNotEmpty) {
      final matches = cached
          .where((p) => p.city.toLowerCase() == city.trim().toLowerCase())
          .toList();
      if (matches.isNotEmpty) return matches;
      return cached;
    }
    return cached;
  }

  /// Searches content across backend API, falling back to local search if offline.
  Future<List<Post>> searchContent({
    required String query,
    String? categoryId,
    String? city,
    String? type,
  }) async {
    try {
      final results = await remoteDataSource.search(
        query: query,
        categoryId: categoryId,
        city: city,
        type: type,
      );
      if (results.isNotEmpty) return results;
    } catch (e) {
      _log('ContentRepository: Remote search failed (${mapToAppError(e).message}). Filtering locally.');
    }

    // Fallback local search against cached posts
    final q = query.trim().toLowerCase();
    final all = await _getCachedFeed();
    if (all.isEmpty) return const [];
    final pool = all;
    final cat = categoryId?.trim().toLowerCase();

    return pool.where((p) {
      final matchesQuery = q.isEmpty ||
          p.title.toLowerCase().contains(q) ||
          p.body.toLowerCase().contains(q) ||
          p.locality.toLowerCase().contains(q);
      final matchesCity = city == null || city.isEmpty || p.city.toLowerCase() == city.toLowerCase();
      final matchesType = type == null || type.isEmpty || p.type.name.toLowerCase() == type.toLowerCase();
      final matchesCategory = cat == null ||
          cat.isEmpty ||
          cat == 'all' ||
          (p.categorySlug != null && p.categorySlug!.toLowerCase() == cat) ||
          p.category.name.toLowerCase() == cat;
      return matchesQuery && matchesCity && matchesType && matchesCategory;
    }).toList();
  }

  /// Retrieves available categories, with cache and local defaults.
  Future<List<CategoryModel>> getCategories() async {
    try {
      final categories = await remoteDataSource.getCategories();
      if (categories.isNotEmpty) {
        await _cacheCategories(categories);
        return categories;
      }
    } catch (e) {
      _log('ContentRepository: Remote categories fetch failed (${mapToAppError(e).message}).');
    }

    return _getCachedCategories();
  }

  /// Retrieves available locations, with cache and fallback.
  Future<List<LocationModel>> getLocations() async {
    try {
      final remoteLocations = await remoteDataSource.getLocations();
      if (remoteLocations.isNotEmpty) {
        final combined = _mergeLocations(remoteLocations, _getBuiltInLocations());
        await _cacheLocations(combined);
        return combined;
      }
    } catch (e) {
      _log('ContentRepository: Remote locations fetch failed (${mapToAppError(e).message}).');
    }

    final cached = await _getCachedLocations();
    if (cached.isNotEmpty) {
      return _mergeLocations(cached, _getBuiltInLocations());
    }

    return _getBuiltInLocations();
  }

  static final _uuidRegex = RegExp(
    r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  );

  /// Validates if an ID adheres to the standard UUID format required by PostgreSQL.
  static bool isUuid(String? id) {
    if (id == null) return false;
    return _uuidRegex.hasMatch(id.trim());
  }

  /// Retrieves details for single post/video.
  Future<Post?> getContentDetails(String id) async {
    if (!isUuid(id)) {
      // Local/fallback post: resolve from local cache without hitting remote DB
      final feed = await _getCachedFeed();
      return feed.where((p) => p.id == id).firstOrNull;
    }

    try {
      return await remoteDataSource.getContentDetails(id);
    } catch (e) {
      _log('ContentRepository: Remote content detail fetch failed ($e).');
      final feed = await _getCachedFeed();
      return feed.where((p) => p.id == id).firstOrNull;
    }
  }

  /// Toggles like remotely with optimistic safety.
  Future<({bool success, bool isLiked, int likes})> toggleLike(String id) async {
    if (!isUuid(id)) {
      return (success: false, isLiked: false, likes: 0);
    }
    try {
      return await remoteDataSource.toggleLike(id);
    } catch (e) {
      _log('ContentRepository: toggleLike API failed ($e).');
      return (success: false, isLiked: false, likes: 0);
    }
  }

  /// Toggles bookmark / save remotely.
  Future<({bool success, bool isSaved})> toggleSave(String id) async {
    if (!isUuid(id)) {
      return (success: false, isSaved: false);
    }
    try {
      return await remoteDataSource.toggleSave(id);
    } catch (e) {
      _log('ContentRepository: toggleSave API failed ($e).');
      return (success: false, isSaved: false);
    }
  }

  /// Submits content report to backend editorial team.
  /// Never throws: transport failures resolve to an unsuccessful response
  /// so sheets can render a friendly retry state.
  Future<ReportResponse> reportContent({
    required String id,
    required String reason,
  }) async {
    if (!isUuid(id)) {
      return const ReportResponse(
        success: false,
        message: 'Reports are available for published stories. This preview item cannot be reported.',
      );
    }
    try {
      return await remoteDataSource.reportContent(id: id, reason: reason);
    } catch (e) {
      _log('ContentRepository: reportContent failed (${mapToAppError(e).message}).');
      return ReportResponse(
        success: false,
        message: friendlyErrorMessage(e),
      );
    }
  }

  /// Registers video view adhering to 3-view ceiling monetization rule.
  /// Deduplicates within the active app session to avoid spamming the endpoint.
  Future<ViewRegistrationResponse?> registerVideoView({
    required String videoId,
  }) async {
    if (_sessionViewedVideoIds.contains(videoId)) {
      return null;
    }
    _sessionViewedVideoIds.add(videoId);

    if (!isUuid(videoId)) {
      // Local fallback video: skip remote API call to prevent PostgreSQL type uuid syntax error
      return null;
    }

    try {
      return await remoteDataSource.registerView(videoId: videoId);
    } catch (e) {
      _log('ContentRepository: registerView failed ($e).');
      return null;
    }
  }

  // --- Local Disk Persistence Helpers ---

  Future<void> _cacheFeedLocally(List<Post> posts) async {
    try {
      final prefs = await _getPrefs();
      final existing = await _getCachedFeed();
      final postMap = <String, Post>{for (final p in existing) p.id: p};
      for (final p in posts) {
        postMap[p.id] = p;
      }
      // Bound growth: keep the most recent N posts.
      final values = postMap.values.toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
      final trimmed = values.take(_kMaxCachedPosts).toList();
      final jsonList = trimmed.map((p) => p.toJson()).toList();
      await prefs.setString(_kCachedFeedKey, jsonEncode(jsonList));
    } catch (_) {}
  }

  Future<List<Post>> _getCachedFeed() async {
    try {
      final prefs = await _getPrefs();
      final raw = prefs.getString(_kCachedFeedKey);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw);
        if (decoded is List) {
          return decoded
              .map((item) => Post.fromJson((item as Map).cast<String, dynamic>()))
              .toList();
        }
      }
    } catch (_) {}
    return const [];
  }

  Future<void> _cacheCategories(List<CategoryModel> categories) async {
    try {
      final prefs = await _getPrefs();
      final list = categories.map((c) => c.toJson()).toList();
      await prefs.setString(_kCachedCategoriesKey, jsonEncode(list));
    } catch (_) {}
  }

  Future<List<CategoryModel>> _getCachedCategories() async {
    try {
      final prefs = await _getPrefs();
      final raw = prefs.getString(_kCachedCategoriesKey);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw);
        if (decoded is List) {
          return decoded
              .map((item) => CategoryModel.fromJson((item as Map).cast<String, dynamic>()))
              .toList();
        }
      }
    } catch (_) {}
    return const [
      CategoryModel(id: 'cat_all', name: 'All', slug: 'all', displayOrder: 0),
      CategoryModel(id: 'cat_local', name: 'Local', slug: 'local', displayOrder: 1),
      CategoryModel(id: 'cat_politics', name: 'Politics', slug: 'politics', displayOrder: 2),
      CategoryModel(id: 'cat_crime', name: 'Crime', slug: 'crime', displayOrder: 3),
      CategoryModel(id: 'cat_sports', name: 'Sports', slug: 'sports', displayOrder: 4),
      CategoryModel(id: 'cat_business', name: 'Business', slug: 'business', displayOrder: 5),
      CategoryModel(id: 'cat_entertainment', name: 'Entertainment', slug: 'entertainment', displayOrder: 6),
    ];
  }

  Future<void> _cacheLocations(List<LocationModel> locations) async {
    try {
      final prefs = await _getPrefs();
      final list = locations.map((l) => l.toJson()).toList();
      await prefs.setString(_kCachedLocationsKey, jsonEncode(list));
    } catch (_) {}
  }

  Future<List<LocationModel>> _getCachedLocations() async {
    try {
      final prefs = await _getPrefs();
      final raw = prefs.getString(_kCachedLocationsKey);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw);
        if (decoded is List) {
          final list = decoded
              .map((item) => LocationModel.fromJson((item as Map).cast<String, dynamic>()))
              .toList();
          if (list.isNotEmpty) return list;
        }
      }
    } catch (_) {}
    return _getBuiltInLocations();
  }

  static List<LocationModel> _getBuiltInLocations() {
    return kIndianLocations.map((item) {
      return LocationModel(
        country: 'India',
        state: item.state,
        city: item.city,
        area: item.locality,
        coordinates: item.latitude != null && item.longitude != null
            ? LocationCoordinates(latitude: item.latitude!, longitude: item.longitude!)
            : null,
      );
    }).toList();
  }

  static List<LocationModel> _mergeLocations(
    List<LocationModel> primary,
    List<LocationModel> secondary,
  ) {
    final seen = <String>{};
    final result = <LocationModel>[];
    for (final loc in primary) {
      final key = '${loc.city.trim().toLowerCase()}_${loc.area.trim().toLowerCase()}';
      if (seen.add(key)) result.add(loc);
    }
    for (final loc in secondary) {
      final key = '${loc.city.trim().toLowerCase()}_${loc.area.trim().toLowerCase()}';
      if (seen.add(key)) result.add(loc);
    }
    return result;
  }
}

/// Riverpod provider for ContentRepository.
final contentRepositoryProvider = Provider<ContentRepository>((ref) {
  final remoteDataSource = ref.watch(contentRemoteDataSourceProvider);
  return ContentRepository(remoteDataSource: remoteDataSource);
});
