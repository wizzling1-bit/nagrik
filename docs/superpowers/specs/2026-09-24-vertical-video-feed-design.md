# Nagrik Vertical News Video Feed Specification

**Date:** 2026-09-24  
**Status:** Approved  
**Author:** Pair Programming Agent & User  
**Target:** `apps/mobile` (Nagrik Flutter App)

---

## 1. Overview & Objective

Implement a dedicated **Videos** tab in the Nagrik Flutter mobile app (`apps/mobile`), providing citizens and journalists with a vertical, swipe-based, full-screen news video feed. The experience marries the fluid navigation of short-video platforms with the depth, credibility, and framing of civic journalism.

Key pillars:
1. **Hyperlocal Personalization**: Powered by Supabase PostGIS `get_personalized_feed` with `p_content_type: 'VIDEO'`, prioritizing the citizen's Village/Ward → Sub-District → District → State → National.
2. **Dual-Format Video Support**: Seamless presentation for both short citizen-witness clips and longer investigative news reports (with duration badges, scrubbable progress bar, and aspect ratio adaptation).
3. **High-Performance 3-Controller Sliding Window**: Zero playback delay on swipe up while strictly bounding memory and cellular data usage to current, previous, and next items.
4. **AdMob Integration**: Native sponsor cards interleaved non-intrusively every 4 items (skipping video 1), compliant with AdMob policies.
5. **Zero Mock Data**: 100% backed by real Supabase PostgreSQL data and Cloudflare R2 media streams.

---

## 2. Navigation Architecture

Update the bottom navigation bar from 4 tabs to 5 tabs:

```text
[ Home (0) ]  [ Videos (1) ]  [ Search (2) ]  [ Saved (3) ]  [ Settings (4) ]
```

### Route Specifications
- **Route Constant**: `AppRoutes.videos = '/videos'` in `apps/mobile/lib/app/router.dart`.
- **Navigation Branch**: Insert `StatefulShellBranch` at index 1:
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
- **Strings**:
  - `AppStrings.navVideos = 'Videos'`
  - `NagrikLocalizations.navVideos = 'Videos'` (English), `'वीडियो'` (Hindi).
- **Icons**:
  - Unselected: `Icons.play_circle_outline_rounded`
  - Selected: `Icons.play_circle_filled_rounded`
- **Back Button**: Pressing back on the Videos tab navigates back to Home (tab 0); pressing back twice on Home displays exit confirmation.

---

## 3. Data Flow & Personalization Engine

### Provider: `videosFeedProvider`
- Located in `apps/mobile/lib/features/videos/presentation/providers/videos_provider.dart`.
- Managed as a `NotifierProvider<VideosFeedNotifier, FeedState>`:
  - Listens to `selectedLocationProvider`. If the user switches location or permissions update, re-fetches the personalized video feed.
  - Calls `ContentRepository.getFeedWithItems(...)` with `contentType: 'VIDEO'`.
  - Supabase RPC: Calls `get_personalized_feed` with:
    - `p_lat`, `p_lng`
    - `p_state_code`, `p_district_code`, `p_subdistrict_code`, `p_local_body_code`
    - `p_content_type: 'VIDEO'`
    - `p_page`, `p_limit` (20 items per page)
  - Supports:
    - `refreshFeed()`: Pull-to-refresh without clearing the screen abruptly.
    - `loadMore()`: Fetches the next page when the user reaches within 3 items of the end.
    - `toggleLike(postId)`: Optimistic like toggle synced with backend RPC.
    - `toggleSave(postId)`: Optimistic bookmark toggle synced with backend RPC.

---

## 4. Playback & Preloading Architecture

### 3-Controller Sliding Window (`VideosScreenState`)
The vertical feed uses `PageView.builder(scrollDirection: Axis.vertical)`.

To ensure instant video startup on mobile cellular networks without Out-of-Memory (OOM) crashes:
```text
[ Page i - 1 ] : Kept initialized & paused (instant backward swipe)
[ Page i ]     : Active playback with audio, view count registered
[ Page i + 1 ] : Preloading & buffering 1st chunk (instant forward swipe)
[ Page i ± 2 ] : Disposed immediately
```

### Video Controller Map
- `Map<int, VideoPlayerController> _controllers = {};`
- On `onPageChanged(int index)`:
  - Pause previous active controller.
  - Dispose controllers for keys `< index - 1` and `> index + 1`.
  - Initialize/play controller for `index`.
  - Initialize/buffer controller for `index + 1`.
  - Register view count with `ContentRepository.registerVideoView(videoId: post.id)`.

### Lifecycle Handling
- Implements `WidgetsBindingObserver`:
  - `AppLifecycleState.paused` / `inactive`: Pauses active video playback immediately.
  - `AppLifecycleState.resumed`: Resumes playback if Videos screen is active.
- Shell branch switching: Pauses playback whenever the user leaves the Videos tab.

### Aspect Ratio & Visual Framing
- **Portrait (9:16)**: Renders full-screen using `BoxFit.cover`.
- **Landscape / Standard (16:9)**: Renders full video frame with `BoxFit.contain` centered, surrounded by a darkened, subtly blurred video thumbnail backdrop. This guarantees that broadcast chyrons, subtitles, and report graphics are never cropped or distorted.
- **Duration & Scrubbing**:
  - Displays total duration chip (e.g. `03:45`) for long reports.
  - Interactive bottom progress bar with scrub-to-seek functionality.

---

## 5. UI & Interaction Layer (`VerticalVideoItem`)

### Visual Overlays
- **Gradient Scrim**: Bottom-to-top scrim (`transparent` to `Colors.black87`) ensuring clear readability of text overlays across light or dark video scenes.
- **Top Bar**:
  - "Videos" / "वीडियो" title with live broadcast badge.
  - Sound toggle button (Mute / Unmute) with global state persistence.
- **Bottom Left Metadata**:
  - **Location Pill**: Pin icon + `${post.locality}, ${post.city}` + distance in km.
  - **Category Pill**: High-contrast badge with topic name.
  - **Author Row**: Avatar with fallback initial, Author Name, Verified badge icon, and Follow button.
  - **Headline**: Multi-line bold typography (max 2 lines with ellipsis).
  - **Description**: Expandable text toggle ("more" / "less").
  - **Published Time**: `${post.timeAgo}`.
- **Bottom Right Action Column**:
  - **Like Button**: Animated heart icon, like count, tap ripple.
  - **Comment Button**: Chat bubble icon, comment count; triggers `showCommentsBottomSheet`.
  - **Share Button**: Share arrow; triggers `showShareSheet(context, post)`.
  - **Save Button**: Bookmark icon, bookmark toggle.
  - **More / Report**: 3-dot overflow icon triggering `showReportContentSheet`.
- **Center Feedback**:
  - Tap video anywhere to toggle Play/Pause.
  - Animated play/pause icon overlay with smooth fade.

---

## 6. AdMob Interleaving Strategy

- Interleaved using `AdPlacementPolicy.isAdIndex(index, frequency: 4)`.
- Schedule:
  - Video 1 (Index 0): Editorial News Video
  - Video 2 (Index 1): Editorial News Video
  - Video 3 (Index 2): Editorial News Video
  - Video 4 (Index 3): Editorial News Video
  - Ad 1 (Index 4): Native Sponsor Card
  - Video 5 (Index 5): Editorial News Video
  - ...
- Ad Card (`VerticalVideoAdCard`):
  - Renders `NagrikNativeAdCard` / `NagrikAdaptiveBanner` centered in a full-height dark card.
  - Clean "SPONSORED" badge adhering to AdMob guidelines.
  - Swipe up moves directly to next video.
  - Video sound automatically mutes while on an ad slide.

---

## 7. Error & Offline Resilience

- **Poster Image**: Shows `thumbnailUrl` with blur transition while video initializes.
- **Buffering Indicator**: Sleek, circular brand indicator (`#FF5722`) during network buffering.
- **Error State**: Friendly error card with "Retry playback" button if video streaming URL fails or drops connection.
- **Offline Mode**: Uses cached video stories from `OfflineCacheService` when network is completely offline.

---

## 8. Verification & Test Plan

1. **Compilation & Static Analysis**:
   - Run `flutter analyze` in `apps/mobile` (target: 0 warnings, 0 errors).
2. **Unit & Widget Tests**:
   - Verify `AdPlacementPolicy` mapping in vertical feed.
   - Verify `VideosFeedNotifier` loads items and handles pagination.
3. **Interactive Validation**:
   - Test bottom navigation switching to Videos tab.
   - Test vertical swiping (play next, pause prev, dispose distant).
   - Test landscape 16:9 vs portrait 9:16 video rendering.
   - Test like, save, comment, share, and report sheets.
   - Test backgrounding app (pauses audio) and foregrounding (resumes).
