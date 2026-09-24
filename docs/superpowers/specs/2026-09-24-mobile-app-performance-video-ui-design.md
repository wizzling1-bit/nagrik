# Mobile App Optimization, Video Controls & UI Polish Design Specification

- **Date:** 2026-09-24
- **Target:** `apps/mobile` (Flutter 3.x / Dart)
- **Status:** Approved by User

---

## 1. Overview & Objectives

This specification defines the complete architecture for 8 key improvements to the Nagrik mobile application:
1. **Explicit Video Pause & Play Controls:** Persistent center pause indicator and dedicated action column pause button.
2. **3G / 4G / 5G Network Optimization:** Connection-aware adaptive media loading and aggressive latency minimization.
3. **Instant Performance & Cold-Start Acceleration:** Stale-While-Revalidate (SWR) cache hydration eliminating loading stalls.
4. **Hardware Tier Optimization:** GPU-friendly rendering on low-end chipsets, memory eviction, and isolated repaint boundaries.
5. **Professional & Smooth Animations:** Cohesive curve system, press micro-interactions, and shared-axis route transitions.
6. **Splash Screen Color Alignment:** Deep Charcoal/Obsidian (`#10141C`) across Android native layer and Flutter splash.
7. **New Official Logo Integration:** High-DPI asset rendering across splash, header, drawer, and launcher mipmaps.
8. **Soft Editorial Dark Mode Palette:** Eye-friendly, anti-glare charcoal surfaces, warm paper ivory typography, and soft terracotta saffron accents.

---

## 2. Detailed Technical Architecture

### Section 1: Video Controls & Dual Pause Architecture (Item 1)
- **Files Affected:**
  - `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart`
  - `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart`
  - `apps/mobile/lib/features/feed/presentation/widgets/video/nagrik_video_player.dart`
- **Center Overlay Behavior:**
  - When `controller.value.isPlaying == false`, display a centered frosted badge (68x68 dp, 44dp icon, `Icons.play_arrow_rounded` / `Icons.pause_rounded`) with scale-in bounce (`Curves.easeOutBack`) and translucent backdrop (`Colors.black54`).
  - Unlike the temporary 650ms ripple, this indicator remains visible whenever the video is paused so users always know the playback state.
- **Right Action Column Control:**
  - In `VerticalVideoOverlay`, add a dedicated **Play / Pause** toggle button above the Like button:
    - Icon: `Icons.pause_circle_filled_rounded` when playing, `Icons.play_circle_fill_rounded` (with warm terracotta tint `#DE5227`) when paused.
    - Label: "Pause" / "Play" matching the action rail typography (`NagrikSpacing`, `GoogleFonts.plusJakartaSans`).
- **Inline Feed Player (`NagrikVideoPlayer`):**
  - Add explicit paused state overlay with frosted play button that does not disappear while paused.

---

### Section 2: Network (3G/4G/5G) & Hardware Performance Engine (Items 2, 3, 4)
- **Files Affected:**
  - `apps/mobile/lib/core/network/network_profile_service.dart` (New service)
  - `apps/mobile/lib/features/feed/presentation/providers/feed_providers.dart`
  - `apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart`
  - `apps/mobile/lib/core/network/offline_cache_service.dart`
  - `apps/mobile/lib/features/feed/data/repositories/content_repository.dart`
- **Instant Cold Start (SWR):**
  - In `FeedStateNotifier._loadInitialFeed()`:
    1. Read local cache synchronously via microtask.
    2. Populate `FeedState(items: cachedItems, isLoading: false)` immediately.
    3. Trigger background network request without clearing or blanking the feed.
    4. When network data resolves, smoothly update state without disrupting scroll position.
- **Connection-Aware Adaptive Media Profile:**
  - Detect network type and latency via `Connectivity` / HTTP ping:
    - **3G / Low Bandwidth:**
      - Image decoders constrained to `memCacheWidth: 480`.
      - Only buffer the currently playing video; do not eagerly prefetch offscreen videos.
      - Network timeout lowered to 5 seconds with graceful fallback to cached feed.
    - **4G / Standard:**
      - Normal thumbnail cache (`memCacheWidth: 720`).
      - Sliding pre-buffer window: active video + next 1 video.
    - **5G / High Bandwidth:**
      - Full-fidelity image caching.
      - Active video + next 2 videos pre-buffered.
- **Low-End Hardware Optimization:**
  - **Conditional BackdropFilter:** On budget chipsets or when frame drops are detected, bypass heavy GPU shader blur and use solid alpha container (`#161B26` with `0.85` opacity), avoiding GPU pipeline stalls.
  - **RepaintBoundary Isolation:** Wrap every video surface and feed card in `RepaintBoundary` to isolate paint dirty flags.
  - **Memory Eviction:** Restrict active `VideoPlayerController` instances to at most 2, disposing distant controllers to prevent Out-Of-Memory (OOM) crashes on 2GB/3GB devices.

---

### Section 3: Professional Motion & Route Transitions (Item 5)
- **Files Affected:**
  - `apps/mobile/lib/app/router.dart`
  - `apps/mobile/lib/core/theme/motion.dart`
  - `apps/mobile/lib/core/widgets/nagrik_pressable_card.dart` (New component)
- **Route Transitions:**
  - Update `_smoothPageTransition` in `router.dart`:
    - Slide forward with 3% horizontal offset + opacity fade using `Curves.easeOutCubic` over 240ms.
    - Reverse transition over 180ms with `Curves.easeInCubic`.
    - Fully compatible with native Android back-swipe gestures.
- **Micro-Interactions:**
  - Implement `NagrikPressableCard`: interactive cards shrink to 0.985 scale on tap-down with gentle haptic click (`NagrikMotion.lightImpact()`), springing back smoothly.
  - Category filter pills: smooth animated sliding indicator between selected categories.

---

### Section 4: Splash Screen, Logo & Soft Dark Mode (Items 6, 7, 8)
- **Files Affected:**
  - `apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml`
  - `apps/mobile/android/app/src/main/res/drawable/launch_background.xml`
  - `apps/mobile/lib/features/onboarding/presentation/splash_screen.dart`
  - `apps/mobile/lib/core/widgets/nagrik_logo.dart`
  - `apps/mobile/lib/core/theme/color_tokens.dart`
  - `apps/mobile/lib/core/theme/app_theme.dart`
- **Splash Screen Color (Item 6):**
  - Native Android splash background: `#10141C` (Deep Obsidian Charcoal).
  - Flutter `SplashScreen`: update `bgColor` to `#10141C`. Ambient radial terracotta glow behind the emblem.
- **Official Brand Logo (Item 7):**
  - Verify clean usage of `assets/images/nagrik_logo.png` (matching `playstore-icon.png` from `LOCATION/android`).
  - Update `NagrikLogoMark` to display the crisp official image with 24% border radius and subtle drop shadow, deprecating misaligned legacy custom painter paths.
- **Soft Dark Mode Palette (Item 8):**
  - Refactor `NagrikDarkColors`:
    - `level0Background`: `#10141C` (Deep soft charcoal).
    - `level1Surface`: `#161B26` (Warm elevated slate-charcoal).
    - `level2Elevated`: `#1E2433`.
    - `level3Interactive`: `#242C3D`.
    - `level4Muted`: `#121620`.
    - `textPrimary`: `#E2E6EC` (Soft cream paper ivory, zero optical glare).
    - `textSecondary`: `#8F9CAE`.
    - `textTertiary`: `#64748B`.
    - `brandPrimary`: `#D96B43` (Soft warm terracotta saffron — vibrant yet non-blinding in dark mode).
    - `brandSecondary`: `#C85A34`.
    - `border`: `Color(0x14FFFFFF)` (Delicate 8% white border).
    - `divider`: `Color(0x14FFFFFF)`.
    - Semantic alerts: `#38B781` (Success), `#DDA046` (Warning), `#D95B5B` (Error).

---

## 3. Verification & Acceptance Criteria
1. **Video Pause:** Video screen has persistent center pause badge when stopped and an explicit toggle in the action rail; tapping pauses/plays instantly.
2. **Speed & Cold Start:** Feeds show cached posts in 0ms on startup without showing a blank spinner.
3. **Network & Device:** Images downscale decode sizes; video preloading adapts to connection speed; no `BackdropFilter` frame drops on budget devices.
4. **Animations:** Silky 60+ FPS route transitions and card tap feedback.
5. **Splash & Logo:** `#10141C` splash background with high-DPI new logo mark.
6. **Dark Mode:** Soft, premium, glare-free dark UI across home, feed, search, and settings.
7. **Compilation:** `flutter analyze` or unit tests pass with zero critical errors.
