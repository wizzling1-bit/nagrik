import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/core/network/offline_cache_service.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Provider for global video mute toggle state across vertical feed swipes.
final videosMutedProvider =
    NotifierProvider<VideosMutedNotifier, bool>(VideosMutedNotifier.new);

class VideosMutedNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void toggle() => state = !state;
  void setMuted(bool muted) => state = muted;
}

/// Primary provider for the vertical news video feed.
/// Strictly queries verified videos from Supabase PostGIS with location-prioritized ranking.
final videosFeedProvider =
    NotifierProvider<VideosFeedNotifier, FeedState>(VideosFeedNotifier.new);

class VideosFeedNotifier extends Notifier<FeedState> {
  @override
  FeedState build() {
    ref.listen(selectedLocationProvider, (prev, next) {
      if (prev?.id != next?.id ||
          prev?.locality != next?.locality ||
          prev?.district != next?.district ||
          prev?.latitude != next?.latitude ||
          prev?.longitude != next?.longitude) {
        refreshFeed();
      }
    });

    Future.microtask(_loadInitialVideos);

    return const FeedState(isLoading: true);
  }

  Future<void> _loadInitialVideos() async {
    final location = ref.read(selectedLocationProvider);
    final repo = ref.read(contentRepositoryProvider);

    // 1. Instant SWR Hydration: Hydrate from cache immediately (0ms)
    try {
      final cachedPosts = await OfflineCacheService.getFeedCache();
      if (cachedPosts.isNotEmpty && state.items.isEmpty) {
        final cachedVideoItems = <FeedItem>[];
        for (final raw in cachedPosts) {
          try {
            final post = Post.fromJson(raw);
            if (post.type == PostType.video || post.videoUrl != null) {
              cachedVideoItems.add(ContentFeedItem(post: post));
            }
          } catch (_) {}
        }
        if (cachedVideoItems.isNotEmpty && state.items.isEmpty) {
          state = state.copyWith(
            items: cachedVideoItems,
            isLoading: false,
            clearError: true,
          );
        }
      }
    } catch (_) {}

    // 2. Background Revalidation from Network
    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        district: location?.district,
        pincode: location?.pincode,
        lat: location?.latitude,
        lng: location?.longitude,
        state: location?.state,
        contentType: 'VIDEO',
        page: 1,
        limit: 20,
      );

      final hasMore = result.pagination.page < result.pagination.totalPages;

      state = state.copyWith(
        items: result.items,
        page: result.pagination.page,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
        hasMore: hasMore,
        isLoading: false,
        clearError: true,
      );
    } catch (e) {
      if (state.items.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: friendlyErrorMessage(e, fallback: 'Could not load news videos. Tap to retry.'),
        );
      }
    }
  }

  Future<void> refreshFeed() async {
    final location = ref.read(selectedLocationProvider);
    final repo = ref.read(contentRepositoryProvider);
    state = state.copyWith(isRefreshing: true, clearError: true);

    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        district: location?.district,
        pincode: location?.pincode,
        lat: location?.latitude,
        lng: location?.longitude,
        state: location?.state,
        contentType: 'VIDEO',
        page: 1,
        limit: 20,
      );

      state = state.copyWith(
        items: result.items,
        page: 1,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
        hasMore: result.pagination.page < result.pagination.totalPages,
        isRefreshing: false,
        clearError: true,
      );
    } catch (e) {
      state = state.copyWith(isRefreshing: false);
    }
  }

  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore || state.isLoading) return;

    state = state.copyWith(isLoadingMore: true);
    final nextPage = state.page + 1;
    final location = ref.read(selectedLocationProvider);
    final repo = ref.read(contentRepositoryProvider);

    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        district: location?.district,
        pincode: location?.pincode,
        lat: location?.latitude,
        lng: location?.longitude,
        state: location?.state,
        contentType: 'VIDEO',
        page: nextPage,
        limit: 20,
      );

      final combined = List<FeedItem>.from(state.items)..addAll(result.items);
      final hasMore = nextPage < result.pagination.totalPages;

      state = state.copyWith(
        items: combined,
        page: nextPage,
        hasMore: hasMore,
        isLoadingMore: false,
      );
    } catch (e) {
      state = state.copyWith(isLoadingMore: false);
    }
  }

  void toggleLike(String postId) {
    final updatedItems = state.items.map((item) {
      if (item is ContentFeedItem && item.post.id == postId) {
        final currentLiked = item.post.isLiked;
        final newCount = currentLiked
            ? (item.post.likesCount - 1).clamp(0, double.infinity).toInt()
            : item.post.likesCount + 1;
        return ContentFeedItem(
          post: item.post.copyWith(
            isLiked: !currentLiked,
            likesCount: newCount,
          ),
        );
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedItems);
    ref.read(contentRepositoryProvider).toggleLike(postId);
  }

  void toggleSave(String postId) {
    final updatedItems = state.items.map((item) {
      if (item is ContentFeedItem && item.post.id == postId) {
        final currentSaved = item.post.isBookmarked;
        return ContentFeedItem(
          post: item.post.copyWith(
            isBookmarked: !currentSaved,
            savesCount: currentSaved
                ? (item.post.savesCount - 1).clamp(0, double.infinity).toInt()
                : item.post.savesCount + 1,
          ),
        );
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedItems);
    ref.read(contentRepositoryProvider).toggleSave(postId);
  }
}
