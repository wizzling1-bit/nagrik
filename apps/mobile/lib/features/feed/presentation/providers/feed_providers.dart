import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:nagrik/features/saved/data/saved_repository.dart';
import 'package:nagrik/features/saved/presentation/providers/saved_providers.dart';

/// State representation for the production news feed with real pagination and ad interleaving.
class FeedState {
  const FeedState({
    this.items = const [],
    this.page = 1,
    this.limit = 20,
    this.totalItems = 0,
    this.totalPages = 1,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.isRefreshing = false,
    this.hasMore = false,
    this.errorMessage,
  });

  final List<FeedItem> items;
  final int page;
  final int limit;
  final int totalItems;
  final int totalPages;
  final bool isLoading;
  final bool isLoadingMore;
  final bool isRefreshing;
  final bool hasMore;
  final String? errorMessage;

  /// Convenience getter extracting all organic posts from the feed items.
  List<Post> get posts => [
        for (final item in items)
          if (item is ContentFeedItem) item.post,
      ];

  FeedState copyWith({
    List<FeedItem>? items,
    int? page,
    int? limit,
    int? totalItems,
    int? totalPages,
    bool? isLoading,
    bool? isLoadingMore,
    bool? isRefreshing,
    bool? hasMore,
    String? errorMessage,
    bool clearError = false,
  }) {
    return FeedState(
      items: items ?? this.items,
      page: page ?? this.page,
      limit: limit ?? this.limit,
      totalItems: totalItems ?? this.totalItems,
      totalPages: totalPages ?? this.totalPages,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      hasMore: hasMore ?? this.hasMore,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

/// Content Mode tab for feed filtering.
enum FeedTab {
  all('All News'),
  videos('Videos');

  const FeedTab(this.label);
  final String label;
}

/// Provider for selected content mode tab.
final feedTabProvider =
    NotifierProvider<FeedTabNotifier, FeedTab>(FeedTabNotifier.new);

class FeedTabNotifier extends Notifier<FeedTab> {
  @override
  FeedTab build() => FeedTab.all;

  void setTab(FeedTab tab) => state = tab;
}

/// Provider for active category filter.
///
/// Backend-driven taxonomy: [selectedCategorySlug] (`null` = All) is the
/// source of truth, fed by `GET /content/categories`. The legacy
/// [feedCategoryFilterProvider] ([PostCategory] enum) is kept only for
/// backward compatibility until M2 migrates the last chips UI.
final feedCategoryFilterProvider =
    NotifierProvider<FeedCategoryNotifier, PostCategory>(FeedCategoryNotifier.new);

class FeedCategoryNotifier extends Notifier<PostCategory> {
  @override
  PostCategory build() => PostCategory.all;

  void setCategory(PostCategory category) {
    state = category;
    // Keep the slug filter in sync when the legacy enum is used directly.
    if (category == PostCategory.all) {
      ref.read(feedCategorySlugFilterProvider.notifier).clear();
    }
  }
}

/// Backend category slug filter. `null` means "All".
final feedCategorySlugFilterProvider =
    NotifierProvider<FeedCategorySlugNotifier, String?>(FeedCategorySlugNotifier.new);

class FeedCategorySlugNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void setSlug(String? slug) {
    final clean = slug?.trim().toLowerCase();
    state = (clean == null || clean.isEmpty || clean == 'all') ? null : clean;
  }

  void clear() => state = null;
}

/// Primary feed state notifier managing real pagination, ad interleaving, and location sync.
final feedStateProvider =
    NotifierProvider<FeedStateNotifier, FeedState>(FeedStateNotifier.new);

class FeedStateNotifier extends Notifier<FeedState> {
  @override
  FeedState build() {
    ref.listen(selectedLocationProvider, (prev, next) {
      if (prev?.city != next?.city || prev?.locality != next?.locality) {
        refreshFeed();
      }
    });
    ref.listen(feedTabProvider, (prev, next) {
      if (prev != next) refreshFeed();
    });

    Future.microtask(_loadInitialFeed);

    return const FeedState(
      isLoading: true,
    );
  }

  String? _contentTypeForTab(FeedTab tab) => switch (tab) {
        FeedTab.all => null,
        FeedTab.videos => 'VIDEO',
      };

  /// Records observed connectivity: any transport failure marks offline,
  /// any success marks online. Never throws (safe after dispose).
  void _noteOutcome(Object? error) {
    try {
      final connectivity = ref.read(connectivityStatusProvider.notifier);
      if (error == null) {
        connectivity.setOnline();
      } else if (mapToAppError(error) is NetworkError) {
        connectivity.setOffline();
      }
    } on StateError {
      // Provider disposed while the request was in flight — safe to drop.
    }
  }

  Future<void> _loadInitialFeed() async {
    final location = ref.read(selectedLocationProvider);
    final repo = ref.read(contentRepositoryProvider);
    final tab = ref.read(feedTabProvider);

    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        state: location?.state,
        contentType: _contentTypeForTab(tab),
        page: 1,
        limit: state.limit,
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
      _noteOutcome(null);
    } catch (e) {
      _noteOutcome(e);
      state = state.copyWith(
        isLoading: false,
        errorMessage: friendlyErrorMessage(e, fallback: 'Could not load your feed. Please retry.'),
      );
    }
  }

  /// Refreshes feed while retaining visible content to avoid blank screen jumps.
  Future<void> refreshFeed() async {
    final location = ref.read(selectedLocationProvider);
    state = state.copyWith(isRefreshing: true, clearError: true);

    final repo = ref.read(contentRepositoryProvider);
    final tab = ref.read(feedTabProvider);

    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        state: location?.state,
        contentType: _contentTypeForTab(tab),
        page: 1,
        limit: state.limit,
      );

      final hasMore = result.pagination.page < result.pagination.totalPages;

      state = state.copyWith(
        items: result.items,
        page: result.pagination.page,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
        hasMore: hasMore,
        isRefreshing: false,
        clearError: true,
      );
      _noteOutcome(null);
    } catch (e) {
      _noteOutcome(e);
      state = state.copyWith(
        isRefreshing: false,
        errorMessage: friendlyErrorMessage(e, fallback: 'Refresh failed. Please try again.'),
      );
    }
  }

  /// Loads the next page of content adhering to API pagination. Prevents duplicate calls.
  Future<void> loadNextPage() async {
    if (state.isLoading || state.isLoadingMore || !state.hasMore) {
      return;
    }

    final location = ref.read(selectedLocationProvider);
    final repo = ref.read(contentRepositoryProvider);
    final tab = ref.read(feedTabProvider);
    final nextPage = state.page + 1;

    state = state.copyWith(isLoadingMore: true, clearError: true);

    try {
      final result = await repo.getFeedWithItems(
        city: location?.city,
        area: location?.locality,
        state: location?.state,
        contentType: _contentTypeForTab(tab),
        page: nextPage,
        limit: state.limit,
      );

      // Append new items while avoiding duplicate IDs
      final existingIds = {for (final it in state.items) it.id};
      final newUniqueItems = result.items.where((it) => !existingIds.contains(it.id)).toList();

      final combined = [...state.items, ...newUniqueItems];
      final hasMore = nextPage < result.pagination.totalPages;

      state = state.copyWith(
        items: combined,
        page: nextPage,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
        hasMore: hasMore,
        isLoadingMore: false,
        clearError: true,
      );
      _noteOutcome(null);
    } catch (e) {
      _noteOutcome(e);
      state = state.copyWith(
        isLoadingMore: false,
        errorMessage: friendlyErrorMessage(e, fallback: 'Could not load more stories.'),
      );
    }
  }

  void toggleLike(String postId) {
    Post? previous;
    for (final item in state.items) {
      if (item is ContentFeedItem && item.post.id == postId) {
        previous = item.post;
        break;
      }
    }
    if (previous == null) return;
    final prev = previous;
    final flipped = prev.copyWith(
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked
          ? (prev.likesCount > 0 ? prev.likesCount - 1 : 0)
          : prev.likesCount + 1,
    );

    state = state.copyWith(
      items: [
        for (final item in state.items)
          if (item is ContentFeedItem && item.post.id == postId)
            ContentFeedItem(post: flipped)
          else
            item,
      ],
    );

    // Local-only content (seed/preview IDs): keep the optimistic state as the
    // source of truth — there is no server row to reconcile against.
    if (!ContentRepository.isUuid(postId)) return;

    // Optimistic API sync with rollback on failure.
    ref.read(contentRepositoryProvider).toggleLike(postId).then((result) {
      try {
        if (result.success) {
          state = state.copyWith(
            items: [
              for (final item in state.items)
                if (item is ContentFeedItem && item.post.id == postId)
                  ContentFeedItem(
                    post: item.post.copyWith(
                      isLiked: result.isLiked,
                      likesCount: result.likes,
                    ),
                  )
                else
                  item,
            ],
          );
        } else {
          // Backend rejected: roll back to the pre-tap state.
          state = state.copyWith(
            items: [
              for (final item in state.items)
                if (item is ContentFeedItem && item.post.id == postId)
                  ContentFeedItem(post: prev)
                else
                  item,
            ],
          );
        }
      } on StateError {
        // Provider disposed while the request was in flight — safe to drop.
      }
    }).catchError((_) {
      try {
        state = state.copyWith(
          items: [
            for (final item in state.items)
              if (item is ContentFeedItem && item.post.id == postId)
                ContentFeedItem(post: prev)
              else
                item,
          ],
        );
      } on StateError {
        // Provider disposed while the request was in flight — safe to drop.
      }
    });
  }

  /// Optimistic bookmark toggle with two-way sync. Persists once via
  /// [SavedRepository], then syncs [savedPostsProvider] memory without a
  /// second repository round-trip.
  Future<void> toggleBookmark(String postId) async {
    ContentFeedItem? foundItem;
    for (final item in state.items) {
      if (item is ContentFeedItem && item.post.id == postId) {
        foundItem = item;
        break;
      }
    }

    if (foundItem == null) return;
    final currentPost = foundItem.post;
    final nextStatus = !currentPost.isBookmarked;

    state = state.copyWith(
      items: [
        for (final item in state.items)
          if (item is ContentFeedItem && item.post.id == postId)
            ContentFeedItem(
              post: item.post.copyWith(
                isBookmarked: nextStatus,
              ),
            )
          else
            item,
      ],
    );

    try {
      final repo = ref.read(savedRepositoryProvider);
      final savedNow = await repo.toggleSave(currentPost);
      // Reconcile in case disk state disagreed (e.g. concurrent Saved edit).
      if (savedNow != nextStatus) {
        state = state.copyWith(
          items: [
            for (final item in state.items)
              if (item is ContentFeedItem && item.post.id == postId)
                ContentFeedItem(post: item.post.copyWith(isBookmarked: savedNow))
              else
                item,
          ],
        );
      }
      ref.read(savedPostsProvider.notifier).syncSaved(
            currentPost.copyWith(isBookmarked: savedNow),
            savedNow,
          );
    } on StateError {
      // Provider disposed while persisting — safe to drop.
    } catch (_) {
      // Roll back optimistic flip; repo already reports failure as false
      // in most paths, but a throw still needs a revert.
      try {
        state = state.copyWith(
          items: [
            for (final item in state.items)
              if (item is ContentFeedItem && item.post.id == postId)
                ContentFeedItem(post: currentPost)
              else
                item,
          ],
        );
      } on StateError {
        // Provider disposed while persisting — safe to drop.
      }
    }
  }

  /// Memory-only bookmark sync, called by the Saved screen after it persists.
  void syncBookmark(String postId, bool isSaved) {
    state = state.copyWith(
      items: [
        for (final item in state.items)
          if (item is ContentFeedItem && item.post.id == postId)
            ContentFeedItem(post: item.post.copyWith(isBookmarked: isSaved))
          else
            item,
      ],
    );
  }
}

/// Backward compatible feedPostsProvider providing `List<Post>` for screens and widgets.
final feedPostsProvider =
    NotifierProvider<FeedPostsNotifier, List<Post>>(FeedPostsNotifier.new);

class FeedPostsNotifier extends Notifier<List<Post>> {
  @override
  List<Post> build() {
    return ref.watch(feedStateProvider.select((s) => s.posts));
  }

  Future<void> refreshFeed() async {
    await ref.read(feedStateProvider.notifier).refreshFeed();
  }

  void toggleLike(String postId) {
    ref.read(feedStateProvider.notifier).toggleLike(postId);
  }

  void toggleBookmark(String postId) {
    ref.read(feedStateProvider.notifier).toggleBookmark(postId);
  }
}

/// Filtered posts derived from active tab, category, and location.
///
/// Category filtering prefers the backend slug taxonomy
/// ([feedCategorySlugFilterProvider]); the legacy [PostCategory] enum filter
/// applies only when no slug is selected.
final filteredFeedPostsProvider = Provider<List<Post>>((ref) {
  final allPosts = ref.watch(feedPostsProvider);
  final activeTab = ref.watch(feedTabProvider);
  final activeCategory = ref.watch(feedCategoryFilterProvider);
  final activeSlug = ref.watch(feedCategorySlugFilterProvider);
  final selectedLocation = ref.watch(selectedLocationProvider);

  return allPosts.where((post) {
    // 1. Filter by Content Mode Tab
    final matchesTab = switch (activeTab) {
      FeedTab.all => true,
      FeedTab.videos => post.type == PostType.video,
    };
    if (!matchesTab) return false;

    // 2. Filter by Category (backend slug wins; legacy enum is fallback)
    if (activeSlug != null) {
      final slug = post.categorySlug?.toLowerCase();
      if (slug != activeSlug.toLowerCase()) return false;
    } else if (activeCategory != PostCategory.all && post.category != activeCategory) {
      return false;
    }

    // 3. Filter by City/Locality if user selected a specific city
    if (selectedLocation != null &&
        selectedLocation.city.isNotEmpty &&
        post.city.isNotEmpty &&
        post.city.toLowerCase() != selectedLocation.city.toLowerCase()) {
      return false;
    }

    return true;
  }).toList();
});

/// Urgent breaking alerts for top emergency banner.
final urgentAlertsProvider = Provider<Post?>((ref) {
  final posts = ref.watch(feedPostsProvider);
  final selectedLocation = ref.watch(selectedLocationProvider);

  return posts.where((p) {
    if (!p.isUrgent) return false;
    if (selectedLocation != null &&
        selectedLocation.city.isNotEmpty &&
        p.city.isNotEmpty &&
        p.city.toLowerCase() != selectedLocation.city.toLowerCase()) {
      return false;
    }
    return true;
  }).firstOrNull ?? posts.where((p) => p.isUrgent).firstOrNull;
});

/// Dynamic categories fetched from GET /content/categories
final apiCategoriesProvider = FutureProvider<List<CategoryModel>>((ref) {
  return ref.watch(contentRepositoryProvider).getCategories();
});

/// Dynamic locations fetched from GET /content/locations
final apiLocationsProvider = FutureProvider<List<LocationModel>>((ref) {
  return ref.watch(contentRepositoryProvider).getLocations();
});
