# Vertical News Video Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dedicated, full-screen vertical swipe news video feed in the Nagrik mobile app (`apps/mobile`), powered by real Supabase PostGIS data and Cloudflare R2 media with a 3-controller sliding window, AdMob native sponsor card interleaving, and location-prioritized personalization.

**Architecture:**
- **Navigation**: Update bottom navigation bar to 5 tabs (`Home | Videos | Search | Saved | Settings`) in `router.dart` and `routes.dart`.
- **State & Data**: `VideosFeedNotifier` querying Supabase PostGIS `get_personalized_feed` with `p_content_type: 'VIDEO'`, supporting pagination and location hierarchy syncing.
- **Playback Engine**: `VideosScreen` with `PageView.builder(scrollDirection: Axis.vertical)` and a 3-controller sliding window (`[i - 1, i, i + 1]`) ensuring instant startup, background pause, and zero decode memory leaks.
- **Presentation**: `VerticalVideoCard` with aspect-ratio adaptation (9:16 full-bleed cover vs 16:9 letterbox with ambient blur backdrop), scrubbable progress bar, and comprehensive journalistic overlay controls (Like, Comment, Share, Save, Report).
- **Monetization**: `VerticalVideoAdCard` interleaved every 4 videos using `AdPlacementPolicy` without showing on the first video.

**Tech Stack:** Flutter 3.44, Riverpod 2.6, GoRouter 14.8, `video_player` 2.14, `google_mobile_ads` 5.3, `share_plus` 13.3, Supabase PostgREST / PostGIS.

## Global Constraints
- Zero mock data: all video items fetched from real Supabase PostGIS endpoint (`get_personalized_feed`).
- Memory safety: controllers outside `[index - 1, index, index + 1]` must be disposed immediately.
- AdMob safety: ads must never appear on video 1, must be labeled "SPONSORED", and must pause any audio.
- Zero analyze warnings: `flutter analyze` must pass with 0 errors and 0 warnings.

---

### Task 1: Navigation and Routing Integration

**Files:**
- Modify: `apps/mobile/lib/app/router.dart:23-45, 140-180, 340-390`
- Modify: `apps/mobile/lib/core/strings/app_strings.dart:20-50`
- Modify: `apps/mobile/lib/core/localization/nagrik_localizations.dart:20-30, 165-175, 310-320, 450-465`
- Test: `apps/mobile/test/features/videos/presentation/navigation_test.dart`

**Interfaces:**
- Consumes: `AppRoutes`, `NagrikLocalizations`, `StatefulNavigationShell`
- Produces: `AppRoutes.videos = '/videos'`, 5th navigation destination in bottom nav

- [ ] **Step 1: Write the failing navigation test**

```dart
// apps/mobile/test/features/videos/presentation/navigation_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/app/router.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';

void main() {
  testWidgets('Bottom navigation includes Videos tab at index 1', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: Center(child: Text('Test')),
          ),
        ),
      ),
    );
    expect(AppRoutes.videos, '/videos');
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/navigation_test.dart`
Expected: FAIL with `Undefined name 'videos'` in `AppRoutes`.

- [ ] **Step 3: Update strings and localizations for Videos tab**

In `apps/mobile/lib/core/strings/app_strings.dart`:
```dart
  static const navVideos = 'Videos';
```

In `apps/mobile/lib/core/localization/nagrik_localizations.dart`:
Add `required this.navVideos,` to constructor, field `final String navVideos;`, English `'Videos'`, Hindi `'वीडियो'`.

- [ ] **Step 4: Update router routes, shell branches, and bottom nav**

In `apps/mobile/lib/app/router.dart`:
1. Add `static const videos = '/videos';` to `AppRoutes`.
2. Insert `StatefulShellBranch` at index 1:
```dart
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.videos,
                builder: (context, state) => const VideosScreen(),
              ),
            ],
          ),
```
3. Update `_ScaffoldWithNavBar` destinations to 5 items:
```dart
NavigationDestination(
  icon: const Icon(Icons.play_circle_outline_rounded),
  selectedIcon: const Icon(Icons.play_circle_filled_rounded),
  label: strings.navVideos,
  tooltip: strings.navVideos,
),
```
4. Update `_handleBackPress`:
```dart
if (widget.navigationShell.currentIndex != 0) {
  NagrikMotion.selectionClick();
  widget.navigationShell.goBranch(0);
  return;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/navigation_test.dart`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/lib/app/router.dart apps/mobile/lib/core/strings/app_strings.dart apps/mobile/lib/core/localization/nagrik_localizations.dart apps/mobile/test/features/videos/presentation/navigation_test.dart
git commit -m "feat(mobile): add dedicated videos route and 5-tab bottom navigation"
```

---

### Task 2: Videos Feed State & Location Personalization Provider

**Files:**
- Create: `apps/mobile/lib/features/videos/presentation/providers/videos_provider.dart`
- Test: `apps/mobile/test/features/videos/presentation/videos_provider_test.dart`

**Interfaces:**
- Consumes: `contentRepositoryProvider`, `selectedLocationProvider`
- Produces: `videosFeedProvider` (`NotifierProvider<VideosFeedNotifier, FeedState>`)

- [ ] **Step 1: Write unit test for videos provider**

```dart
// apps/mobile/test/features/videos/presentation/videos_provider_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/providers/videos_provider.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

void main() {
  test('videosFeedProvider initializes with loading state', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    final state = container.read(videosFeedProvider);
    expect(state.isLoading, true);
    expect(state.items, isEmpty);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/videos_provider_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...videos_provider.dart`.

- [ ] **Step 3: Implement `VideosFeedNotifier` and `videosFeedProvider`**

Create `apps/mobile/lib/features/videos/presentation/providers/videos_provider.dart`:
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

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

    state = state.copyWith(isLoading: true, clearError: true);

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
      state = state.copyWith(
        isLoading: false,
        errorMessage: friendlyErrorMessage(e, fallback: 'Could not load news videos. Tap to retry.'),
      );
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/videos_provider_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/videos/presentation/providers/videos_provider.dart apps/mobile/test/features/videos/presentation/videos_provider_test.dart
git commit -m "feat(mobile): add videosFeedProvider with location sync and pagination"
```

---

### Task 3: Shared Comments Bottom Sheet Component

**Files:**
- Create: `apps/mobile/lib/features/feed/presentation/widgets/comments_bottom_sheet.dart`
- Test: `apps/mobile/test/features/feed/presentation/comments_sheet_test.dart`

**Interfaces:**
- Consumes: `Post`, `NagrikLocalizations`, `NagrikRadii`
- Produces: `showCommentsBottomSheet(BuildContext context, Post post, {VoidCallback? onCommentAdded})`

- [ ] **Step 1: Write test for comments bottom sheet**

```dart
// apps/mobile/test/features/feed/presentation/comments_sheet_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/widgets/comments_bottom_sheet.dart';

void main() {
  testWidgets('CommentsBottomSheet renders discussion header and empty state', (tester) async {
    final post = Post(
      id: 'test-1',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Citizen Reporter'),
      title: 'Water pipeline burst in Sector 4',
      body: 'Repair work started',
      locality: 'Sector 4',
      city: 'Delhi',
      createdAt: DateTime.now(),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) => ElevatedButton(
              onPressed: () => showCommentsBottomSheet(context, post),
              child: const Text('Open'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();

    expect(find.text('Discussion'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/feed/presentation/comments_sheet_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...comments_bottom_sheet.dart`.

- [ ] **Step 3: Implement `CommentsBottomSheet`**

Create `apps/mobile/lib/features/feed/presentation/widgets/comments_bottom_sheet.dart` with header, verified citizen notice, comment list, and interactive comment input field with haptic feedback.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/feed/presentation/comments_sheet_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/feed/presentation/widgets/comments_bottom_sheet.dart apps/mobile/test/features/feed/presentation/comments_sheet_test.dart
git commit -m "feat(mobile): add reusable comments bottom sheet widget"
```

---

### Task 4: Vertical Video Overlay & Action Controls

**Files:**
- Create: `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart`
- Test: `apps/mobile/test/features/videos/presentation/video_overlay_test.dart`

**Interfaces:**
- Consumes: `Post`, `VideoPlayerController?`
- Produces: `VerticalVideoOverlay` widget containing headline, expandable body, creator chip, location, action column (like, comment, share, save, report), sound toggle, and scrubbable progress bar

- [ ] **Step 1: Write test for video overlay**

```dart
// apps/mobile/test/features/videos/presentation/video_overlay_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_overlay.dart';

void main() {
  testWidgets('VerticalVideoOverlay renders headline and actions', (tester) async {
    final post = Post(
      id: 'test-v1',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Ravi Kumar', isVerified: true),
      title: 'Major Road Repair Completed Ahead of Schedule',
      body: 'Civic authorities worked overnight to open lane.',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      createdAt: DateTime.now(),
      likesCount: 42,
      commentsCount: 7,
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoOverlay(
              post: post,
              isMuted: false,
              onToggleMute: () {},
              onLike: () {},
              onComment: () {},
              onShare: () {},
              onSave: () {},
              onReport: () {},
            ),
          ),
        ),
      ),
    );

    expect(find.text('Major Road Repair Completed Ahead of Schedule'), findsOneWidget);
    expect(find.text('Ravi Kumar'), findsOneWidget);
    expect(find.text('42'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/video_overlay_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...vertical_video_overlay.dart`.

- [ ] **Step 3: Implement `VerticalVideoOverlay`**

Create `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart`:
- High contrast bottom gradient overlay.
- Left column with location pill, category badge, author avatar + verified icon, 2-line title, expandable description toggle, time ago.
- Right column: Heart with count, Chat with count, Share with count, Bookmark, More (3 dots).
- Sound toggle button with mute/unmute state.
- Scrubbable progress bar with current timestamp and total duration.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/video_overlay_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart apps/mobile/test/features/videos/presentation/video_overlay_test.dart
git commit -m "feat(mobile): add VerticalVideoOverlay with action buttons and timeline"
```

---

### Task 5: Full-Bleed Video Card with 16:9 Ambient Framing

**Files:**
- Create: `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart`
- Test: `apps/mobile/test/features/videos/presentation/video_card_test.dart`

**Interfaces:**
- Consumes: `Post`, `VideoPlayerController?`, `VerticalVideoOverlay`
- Produces: `VerticalVideoCard` rendering video or poster image, aspect ratio adaptation (9:16 vs 16:9 with backdrop blur), tap to play/pause, and buffering indicator

- [ ] **Step 1: Write test for video card**

```dart
// apps/mobile/test/features/videos/presentation/video_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_card.dart';

void main() {
  testWidgets('VerticalVideoCard renders thumbnail placeholder when controller is null', (tester) async {
    final post = Post(
      id: 'test-v2',
      type: PostType.video,
      category: PostCategory.all,
      author: const PostAuthor(id: 'a1', name: 'Correspondent'),
      title: 'Breaking ground report',
      body: 'Video details',
      locality: 'Koramangala',
      city: 'Bengaluru',
      createdAt: DateTime.now(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167',
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoCard(
              post: post,
              controller: null,
              isMuted: false,
              onToggleMute: () {},
              onTogglePlayPause: () {},
            ),
          ),
        ),
      ),
    );

    expect(find.text('Breaking ground report'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/video_card_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...vertical_video_card.dart`.

- [ ] **Step 3: Implement `VerticalVideoCard`**

Create `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart`:
- Handles `controller != null && controller.value.isInitialized`:
  - If aspect ratio is landscape (< 1.0 or ~16:9), renders centered video with `BoxFit.contain` over a darkened blurred backdrop image/video frame.
  - If portrait (9:16), renders with full bleed `BoxFit.cover`.
- If controller is null or buffering, shows cached thumbnail image with blur transition and sleek circular loader.
- Center tap gesture toggles play/pause with central animated icon.
- Bottom overlay wired to actions (`toggleLike`, `showCommentsBottomSheet`, `showShareSheet`, `toggleSave`, `showReportContentSheet`).

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/video_card_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart apps/mobile/test/features/videos/presentation/video_card_test.dart
git commit -m "feat(mobile): add VerticalVideoCard with aspect ratio adaptation and playback gestures"
```

---

### Task 6: AdMob Native Video Card

**Files:**
- Create: `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_ad_card.dart`
- Test: `apps/mobile/test/features/videos/presentation/video_ad_card_test.dart`

**Interfaces:**
- Consumes: `NagrikNativeAdCard`, `GlassCard`, `NagrikBrandColors`
- Produces: `VerticalVideoAdCard` rendering native sponsor card centered in full-height feed slot

- [ ] **Step 1: Write test for video ad card**

```dart
// apps/mobile/test/features/videos/presentation/video_ad_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_ad_card.dart';

void main() {
  testWidgets('VerticalVideoAdCard renders SPONSORED badge and swipe indicator', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoAdCard(adIndex: 1),
          ),
        ),
      ),
    );

    expect(find.text('SPONSORED'), findsOneWidget);
    expect(find.text('Swipe up for next news story'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/video_ad_card_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...vertical_video_ad_card.dart`.

- [ ] **Step 3: Implement `VerticalVideoAdCard`**

Create `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_ad_card.dart`:
- Full-screen dark surface with subtle radial gradient.
- Centered `NagrikNativeAdCard` / `NagrikAdaptiveBanner`.
- Clear "SPONSORED" badge and "Swipe up for next story" hint with upward arrow.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/video_ad_card_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/videos/presentation/widgets/vertical_video_ad_card.dart apps/mobile/test/features/videos/presentation/video_ad_card_test.dart
git commit -m "feat(mobile): add VerticalVideoAdCard for clean AdMob interleaving"
```

---

### Task 7: Vertical Videos Screen with 3-Controller Sliding Window & Lifecycle

**Files:**
- Create: `apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart`
- Test: `apps/mobile/test/features/videos/presentation/videos_screen_test.dart`

**Interfaces:**
- Consumes: `videosFeedProvider`, `VerticalVideoCard`, `VerticalVideoAdCard`, `AdPlacementPolicy`
- Produces: `VideosScreen` widget hosted in `StatefulShellBranch(path: AppRoutes.videos)`

- [ ] **Step 1: Write test for VideosScreen**

```dart
// apps/mobile/test/features/videos/presentation/videos_screen_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/screens/videos_screen.dart';

void main() {
  testWidgets('VideosScreen shows loading or feed widget', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VideosScreen(),
          ),
        ),
      ),
    );

    expect(find.byType(VideosScreen), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/presentation/videos_screen_test.dart`
Expected: FAIL with `Target of URI doesn't exist: ...videos_screen.dart`.

- [ ] **Step 3: Implement `VideosScreen` with 3-Controller Sliding Window & Lifecycle Observer**

Create `apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart`:
- `ConsumerStatefulWidget` with `WidgetsBindingObserver`.
- `PageController` with vertical scrolling (`scrollDirection: Axis.vertical`).
- `Map<int, VideoPlayerController> _controllers = {};`
- `_initControllerForIndex(int index, String url)`:
  - Initializes `VideoPlayerController.networkUrl(Uri.parse(url))`.
  - Sets looping to true.
  - Sets volume according to `_isMuted`.
- `_onPageChanged(int page)`:
  - If current page is ad, mute and pause.
  - Otherwise, play active video controller, pause previous controller (`page - 1`), initialize/preload next video (`page + 1`), and dispose any controllers `< page - 1` or `> page + 1`.
  - Call `registerVideoView(videoId: post.id)` once.
  - If within 3 items of feed end, trigger `ref.read(videosFeedProvider.notifier).loadMore()`.
- `didChangeAppLifecycleState`:
  - On `AppLifecycleState.paused` or `inactive`, pause video.
  - On `AppLifecycleState.resumed`, resume if on screen.
- Clean empty state and network error retry button.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/presentation/videos_screen_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart apps/mobile/test/features/videos/presentation/videos_screen_test.dart
git commit -m "feat(mobile): implement VideosScreen with 3-controller sliding window and lifecycle handling"
```

---

### Task 8: Full Verification, Static Analysis & Integration

**Files:**
- Entire `apps/mobile` workspace

- [ ] **Step 1: Run flutter analyze**

Run: `flutter analyze` in `apps/mobile`
Expected: 0 warnings, 0 errors.

- [ ] **Step 2: Run full test suite**

Run: `flutter test` in `apps/mobile`
Expected: All tests pass.

- [ ] **Step 3: Commit final integration changes**

```bash
git add apps/mobile/
git commit -m "feat(mobile): complete dedicated vertical news video feed integration"
```
