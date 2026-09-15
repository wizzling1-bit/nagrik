import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// State representation for dynamic search results.
class SearchState {
  const SearchState({
    this.query = '',
    this.selectedCategorySlug,
    this.results = const [],
    this.isLoading = false,
    this.errorMessage,
    this.hasSearched = false,
  });

  final String query;
  final String? selectedCategorySlug;
  final List<Post> results;
  final bool isLoading;
  final String? errorMessage;
  final bool hasSearched;

  SearchState copyWith({
    String? query,
    String? selectedCategorySlug,
    bool clearCategory = false,
    List<Post>? results,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
    bool? hasSearched,
  }) {
    return SearchState(
      query: query ?? this.query,
      selectedCategorySlug:
          clearCategory ? null : (selectedCategorySlug ?? this.selectedCategorySlug),
      results: results ?? this.results,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      hasSearched: hasSearched ?? this.hasSearched,
    );
  }
}

/// Dynamic Search Notifier with 300ms debounce and real GET /content/search API calls.
final searchStateProvider =
    NotifierProvider<SearchStateNotifier, SearchState>(SearchStateNotifier.new);

class SearchStateNotifier extends Notifier<SearchState> {
  Timer? _debounceTimer;
  int _requestId = 0;

  @override
  SearchState build() {
    ref.onDispose(() {
      _debounceTimer?.cancel();
    });
    return const SearchState();
  }

  /// Sets search query and triggers 300ms debounced search to backend API.
  void setQuery(String q) {
    _debounceTimer?.cancel();

    final trimmed = q.trim();
    if (trimmed.isEmpty) {
      state = state.copyWith(
        query: '',
        results: const [],
        isLoading: false,
        clearError: true,
        hasSearched: false,
      );
      return;
    }

    state = state.copyWith(query: q, isLoading: true, clearError: true);

    _debounceTimer = Timer(const Duration(milliseconds: 300), () {
      _executeSearch(trimmed, state.selectedCategorySlug);
    });
  }

  /// Refines active search by category slug.
  void selectCategory(String? categorySlug) {
    _debounceTimer?.cancel();
    final newSlug = state.selectedCategorySlug == categorySlug ? null : categorySlug;
    state = state.copyWith(
      selectedCategorySlug: newSlug,
      clearCategory: newSlug == null,
      isLoading: state.query.trim().isNotEmpty,
      clearError: true,
    );

    if (state.query.trim().isNotEmpty) {
      _executeSearch(state.query.trim(), newSlug);
    }
  }

  /// Explicitly runs search immediately (e.g. keyboard submit or retry).
  void executeImmediate([String? explicitQuery]) {
    _debounceTimer?.cancel();
    final q = explicitQuery?.trim() ?? state.query.trim();
    if (q.isNotEmpty) {
      _executeSearch(q, state.selectedCategorySlug);
    }
  }

  Future<void> _executeSearch(String query, String? categorySlug) async {
    final currentRequest = ++_requestId;
    state = state.copyWith(isLoading: true, clearError: true, hasSearched: true);

    final repo = ref.read(contentRepositoryProvider);
    final location = ref.read(selectedLocationProvider);
    List<Post> searchResult = const [];
    Object? failure;
    try {
      searchResult = await repo.searchContent(
        query: query,
        categoryId: categorySlug,
        city: location?.city.isNotEmpty == true ? location!.city : null,
      );
    } catch (e) {
      failure = e;
    }

    // Drop stale responses: a newer keystroke already superseded this call.
    if (currentRequest != _requestId) return;

    try {
      final connectivity = ref.read(connectivityStatusProvider.notifier);
      if (failure != null) {
        if (mapToAppError(failure) is NetworkError) connectivity.setOffline();
        state = state.copyWith(
          isLoading: false,
          errorMessage: friendlyErrorMessage(failure, fallback: 'Search failed. Please try again.'),
          hasSearched: true,
        );
        return;
      }
      connectivity.setOnline();
      state = state.copyWith(
        results: searchResult,
        isLoading: false,
        clearError: true,
        hasSearched: true,
      );
      // Persist successful queries to recents (fire-and-forget).
      if (query.trim().isNotEmpty) {
        ref.read(recentSearchesProvider.notifier).addSearch(query.trim());
      }
    } on StateError {
      // Provider disposed while searching — safe to drop.
    }
  }

  void clear() {
    _debounceTimer?.cancel();
    state = const SearchState();
  }
}

/// Backward compatible search query provider.
final searchQueryProvider = Provider<String>((ref) {
  return ref.watch(searchStateProvider.select((s) => s.query));
});

/// Backward compatible search results provider.
final searchResultsProvider = Provider<List<Post>>((ref) {
  return ref.watch(searchStateProvider.select((s) => s.results));
});

/// Persistent Recent Searches Notifier without fake hardcoded topics.
final recentSearchesProvider =
    NotifierProvider<RecentSearchesNotifier, List<String>>(
  RecentSearchesNotifier.new,
);

class RecentSearchesNotifier extends Notifier<List<String>> {
  static const String _storageKey = 'nagrik_recent_searches_v1';

  @override
  List<String> build() {
    Future.microtask(_loadRecent);
    return const [];
  }

  Future<void> _loadRecent() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_storageKey);
      if (list != null) {
        state = list;
      }
    } catch (_) {}
  }

  Future<void> addSearch(String query) async {
    final clean = query.trim();
    if (clean.isEmpty) return;

    final updated = [
      clean,
      ...state.where((s) => s.toLowerCase() != clean.toLowerCase()),
    ].take(10).toList();

    state = updated;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_storageKey, updated);
    } catch (_) {}
  }

  Future<void> removeSearch(String query) async {
    final updated = state.where((s) => s != query).toList();
    state = updated;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_storageKey, updated);
    } catch (_) {}
  }

  Future<void> clearAll() async {
    state = const [];
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_storageKey);
    } catch (_) {}
  }
}
