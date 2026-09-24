import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Centralized offline caching service for Nagrik mobile application.
/// Provides persistent offline access to feeds, bookmarked news, and read history.
class OfflineCacheService {
  OfflineCacheService._();

  static const String _keyFeedCache = 'nagrik_offline_feed_cache_v1';
  static const String _keyBookmarks = 'nagrik_offline_bookmarks_v1';
  static const String _keyLastCacheTime = 'nagrik_offline_last_cached_time';

  /// Saves the latest feed posts for offline browsing
  static Future<void> saveFeedCache(List<Map<String, dynamic>> rawPosts) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      // Cap at 40 recent posts to avoid excessive memory consumption
      final cappedList = rawPosts.take(40).toList();
      final jsonString = jsonEncode(cappedList);
      await prefs.setString(_keyFeedCache, jsonString);
      await prefs.setInt(_keyLastCacheTime, DateTime.now().millisecondsSinceEpoch);
    } catch (_) {}
  }

  /// Retrieves cached feed posts when network is unavailable
  static Future<List<Map<String, dynamic>>> getFeedCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_keyFeedCache);
      if (jsonString != null && jsonString.isNotEmpty) {
        final decoded = jsonDecode(jsonString);
        if (decoded is List) {
          return decoded.cast<Map<String, dynamic>>();
        }
      }
    } catch (_) {}
    return [];
  }

  /// Save an individual story to offline bookmarks
  static Future<void> saveBookmark(Map<String, dynamic> post) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final bookmarks = await getBookmarks();
      final id = (post['id'] ?? post['_id'])?.toString();
      if (id == null) return;

      // Remove existing to place at top of list
      bookmarks.removeWhere((b) => (b['id'] ?? b['_id'])?.toString() == id);
      bookmarks.insert(0, post);

      // Store up to 100 offline bookmarks
      final capped = bookmarks.take(100).toList();
      await prefs.setString(_keyBookmarks, jsonEncode(capped));
    } catch (_) {}
  }

  /// Remove a story from offline bookmarks
  static Future<void> removeBookmark(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final bookmarks = await getBookmarks();
      bookmarks.removeWhere((b) => (b['id'] ?? b['_id'])?.toString() == id);
      await prefs.setString(_keyBookmarks, jsonEncode(bookmarks));
    } catch (_) {}
  }

  /// Check if a story is currently saved in offline bookmarks
  static Future<bool> isBookmarked(String id) async {
    try {
      final bookmarks = await getBookmarks();
      return bookmarks.any((b) => (b['id'] ?? b['_id'])?.toString() == id);
    } catch (_) {
      return false;
    }
  }

  /// Get all offline saved bookmarked stories
  static Future<List<Map<String, dynamic>>> getBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_keyBookmarks);
      if (jsonString != null && jsonString.isNotEmpty) {
        final decoded = jsonDecode(jsonString);
        if (decoded is List) {
          return decoded.cast<Map<String, dynamic>>();
        }
      }
    } catch (_) {}
    return [];
  }

  /// Clear offline feed cache
  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keyFeedCache);
      await prefs.remove(_keyLastCacheTime);
    } catch (_) {}
  }
}
