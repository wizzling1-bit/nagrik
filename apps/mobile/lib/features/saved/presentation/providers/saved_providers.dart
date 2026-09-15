import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/saved/data/saved_repository.dart';

/// Production StateNotifier managing saved/bookmarked news and video reports.
/// Synchronizes local-first storage with remote POST /content/{id}/save API.
final savedPostsProvider =
    NotifierProvider<SavedPostsNotifier, List<Post>>(SavedPostsNotifier.new);

class SavedPostsNotifier extends Notifier<List<Post>> {
  @override
  List<Post> build() {
    Future.microtask(_loadSaved);
    return const [];
  }

  Future<void> _loadSaved() async {
    try {
      final repo = ref.read(savedRepositoryProvider);
      final saved = await repo.getSavedPosts();
      state = saved;
    } catch (_) {}
  }

  /// Toggles post bookmark: updates memory state immediately, writes to
  /// persistent SharedPreferences, and triggers remote API sync.
  Future<bool> toggleSave(Post post) async {
    bool isSaved = false;
    try {
      final repo = ref.read(savedRepositoryProvider);
      isSaved = await repo.toggleSave(post);
    } on StateError {
      return isSaved;
    } catch (_) {
      return false;
    }

    try {
      if (isSaved) {
        if (!state.any((p) => p.id == post.id)) {
          state = [post.copyWith(isBookmarked: true), ...state];
        }
      } else {
        state = state.where((p) => p.id != post.id).toList();
      }
    } on StateError {
      // Disposed while persisting — the local write already completed.
    }
    return isSaved;
  }

  /// Removes a post from saved collection.
  Future<void> removePost(String postId) async {
    try {
      final repo = ref.read(savedRepositoryProvider);
      await repo.removePost(postId);
    } on StateError {
      return;
    } catch (_) {
      return;
    }
    try {
      state = state.where((p) => p.id != postId).toList();
    } on StateError {
      // Disposed while persisting — the local write already completed.
    }
  }

  /// Memory-only sync used by the feed's bookmark toggle to avoid a second
  /// repository round-trip (the feed already persisted via [SavedRepository]).
  void syncSaved(Post post, bool isSaved) {
    if (isSaved) {
      if (!state.any((p) => p.id == post.id)) {
        state = [post.copyWith(isBookmarked: true), ...state];
      } else {
        state = [
          for (final p in state)
            if (p.id == post.id) p.copyWith(isBookmarked: true) else p,
        ];
      }
    } else {
      state = state.where((p) => p.id != post.id).toList();
    }
  }

  /// Re-syncs from local disk storage.
  Future<void> reload() async {
    await _loadSaved();
  }
}
