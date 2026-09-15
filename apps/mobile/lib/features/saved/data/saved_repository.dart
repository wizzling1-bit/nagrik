import 'dart:async';
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';

final savedRepositoryProvider = Provider<SavedRepository>((ref) {
  final contentRepo = ref.watch(contentRepositoryProvider);
  return SavedRepository(contentRepo: contentRepo);
});

/// Production Local-First Saved Repository.
/// Resolves backend contract gap (backend provides POST /content/{id}/save,
/// but does not provide GET /content/saved).
/// 
/// Persists full Post JSON metadata across app launches, offline sessions,
/// and reboots, while keeping remote bookmark state synchronized.
class SavedRepository {
  SavedRepository({required this.contentRepo});

  final ContentRepository contentRepo;
  static const String _storageKey = 'nagrik_saved_posts_json_v1';

  /// Loads all saved stories from device persistent storage.
  Future<List<Post>> getSavedPosts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final rawList = prefs.getStringList(_storageKey);
      if (rawList == null || rawList.isEmpty) return const [];

      final posts = <Post>[];
      for (final raw in rawList) {
        try {
          final map = jsonDecode(raw) as Map<String, dynamic>;
          posts.add(Post.fromJson(map));
        } catch (_) {
          // Ignore individual corrupted entries
        }
      }
      return posts;
    } catch (_) {
      return const [];
    }
  }

  /// Checks whether a given post ID is currently saved locally.
  Future<bool> isPostSaved(String postId) async {
    final posts = await getSavedPosts();
    return posts.any((p) => p.id == postId);
  }

  /// Toggles saved status: updates local SharedPreferences immediately,
  /// then triggers remote POST /content/{id}/save in the background.
  /// Returns the new saved state (true = saved).
  Future<bool> toggleSave(Post post) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final current = await getSavedPosts();
      final existingIndex = current.indexWhere((p) => p.id == post.id);

      final isCurrentlySaved = existingIndex >= 0;
      final List<Post> updatedList = List.of(current);

      if (isCurrentlySaved) {
        updatedList.removeAt(existingIndex);
      } else {
        updatedList.insert(0, post.copyWith(isBookmarked: true));
      }

      final trimmed = updatedList.take(ContentRepository.maxSavedPosts).toList();
      final stringList = trimmed
          .map((p) => jsonEncode(p.copyWith(isBookmarked: true).toJson()))
          .toList();
      await prefs.setStringList(_storageKey, stringList);

      // Synchronize with backend API (background, best-effort).
      // Toggle semantics match the backend: one POST flips server state.
      unawaited(
        contentRepo.toggleSave(post.id).then((_) {}).catchError((_) {}),
      );

      return !isCurrentlySaved;
    } catch (_) {
      return false;
    }
  }

  /// Explicitly removes a post from saved list. Only contacts the backend
  /// when the post was actually saved (toggle endpoints would re-save).
  Future<void> removePost(String postId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final current = await getSavedPosts();
      final wasSaved = current.any((p) => p.id == postId);
      if (!wasSaved) return;
      final updatedList = current.where((p) => p.id != postId).toList();

      final stringList = updatedList
          .map((p) => jsonEncode(p.copyWith(isBookmarked: true).toJson()))
          .toList();
      await prefs.setStringList(_storageKey, stringList);

      unawaited(
        contentRepo.toggleSave(postId).then((_) {}).catchError((_) {}),
      );
    } catch (_) {}
  }

  /// Explicitly saves a post locally without toggling. Used by two-way sync
  /// when the feed already flipped its bookmark state.
  Future<void> ensureSaved(Post post) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final current = await getSavedPosts();
      if (current.any((p) => p.id == post.id)) return;
      final updated = [post.copyWith(isBookmarked: true), ...current]
          .take(ContentRepository.maxSavedPosts)
          .toList();
      await prefs.setStringList(
        _storageKey,
        updated.map((p) => jsonEncode(p.copyWith(isBookmarked: true).toJson())).toList(),
      );
    } catch (_) {}
  }

  /// Explicitly drops a post locally without contacting the backend.
  Future<void> ensureRemoved(String postId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final current = await getSavedPosts();
      if (!current.any((p) => p.id == postId)) return;
      final updated = current.where((p) => p.id != postId).toList();
      await prefs.setStringList(
        _storageKey,
        updated.map((p) => jsonEncode(p.copyWith(isBookmarked: true).toJson())).toList(),
      );
    } catch (_) {}
  }
}
