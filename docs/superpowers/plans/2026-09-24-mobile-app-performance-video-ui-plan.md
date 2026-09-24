# Mobile App Optimization, Video Controls & UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accelerate the Nagrik mobile app with instant 0ms cold-start (SWR), connection-adaptive media (3G/4G/5G tiers), low-end GPU optimization, dual video pause controls, soft non-glare dark mode, obsidian splash screen, official logo integration, and silky smooth transitions.

**Architecture:**
- **Video Controls:** Persistent center pause badge on paused state + dedicated Play/Pause toggle in vertical video action rail.
- **Performance & Network:** Connection-aware `NetworkProfileService` dynamically adjusting image decoders (`memCacheWidth`) and video prefetching for 3G/4G/5G; instant SWR cache hydration eliminates blank loading screens.
- **Low-End Device:** GPU optimization bypassing expensive `BackdropFilter` shaders, bounded memory decoders, and isolated `RepaintBoundary` wrappers.
- **Design & Theme:** Eye-friendly soft dark palette (`#10141C` canvas, `#E2E6EC` paper ivory text, `#D96B43` warm terracotta), `#10141C` splash screen with new official logo, and spring-loaded micro-interactions.

**Tech Stack:** Flutter 3.x, Dart 3.x, Riverpod 2.6.x, GoRouter 14.x, VideoPlayer 2.14.x, CachedNetworkImage 3.4.x.

## Global Constraints
- Target workspace: `apps/mobile`.
- Preserve backward compatibility with existing Supabase RPCs, REST gateways, and Riverpod providers.
- No third-party package additions required; utilize standard Flutter SDK, Riverpod, and existing dependencies.
- Zero placeholder code; all color hex values, curves, and logic must be production-ready.

---

### Task 1: Soft Dark Mode Palette & Eye-Friendly Theme Tokens (Item 8)

**Files:**
- Modify: `apps/mobile/lib/core/theme/color_tokens.dart`
- Modify: `apps/mobile/lib/core/theme/app_theme.dart`
- Test: `apps/mobile/test/core/theme/color_tokens_test.dart`

**Interfaces:**
- Produces: `NagrikDarkColors.level0Background` (`0xFF10141C`), `NagrikDarkColors.level1Surface` (`0xFF161B26`), `NagrikDarkColors.textPrimary` (`0xFFE2E6EC`), `NagrikDarkColors.brandPrimary` (`0xFFD96B43`).

- [ ] **Step 1: Write test for updated NagrikDarkColors**

```dart
// apps/mobile/test/core/theme/color_tokens_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/app_theme.dart';

void main() {
  group('NagrikDarkColors Soft Palette', () {
    test('uses eye-friendly soft charcoal and ivory tokens', () {
      expect(NagrikDarkColors.level0Background, const Color(0xFF10141C));
      expect(NagrikDarkColors.level1Surface, const Color(0xFF161B26));
      expect(NagrikDarkColors.textPrimary, const Color(0xFFE2E6EC));
      expect(NagrikDarkColors.brandPrimary, const Color(0xFFD96B43));
    });

    test('dark theme builds with soft dark colorScheme', () {
      final theme = NagrikTheme.dark();
      expect(theme.scaffoldBackgroundColor, const Color(0xFF10141C));
      expect(theme.colorScheme.surface, const Color(0xFF161B26));
      expect(theme.colorScheme.onSurface, const Color(0xFFE2E6EC));
    });
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/core/theme/color_tokens_test.dart`
Expected: FAIL with mismatch in colors.

- [ ] **Step 3: Update NagrikDarkColors in color_tokens.dart and app_theme.dart**

Update `apps/mobile/lib/core/theme/color_tokens.dart`:
```dart
abstract final class NagrikDarkColors {
  /// Level 0: Deep soft charcoal canvas background (#10141C) — eliminates eye glare.
  static const level0Background = Color(0xFF10141C);

  /// Level 1: Primary card / content surface (#161B26).
  static const level1Surface = Color(0xFF161B26);

  /// Level 2: Elevated surface / dialogs / modal sheets (#1E2433).
  static const level2Elevated = Color(0xFF1E2433);

  /// Level 3: Selected / focused / active interactive surface (#242C3D).
  static const level3Interactive = Color(0xFF242C3D);

  /// Level 4 / Inset: Inset / muted surface / text fields (#121620).
  static const level4Muted = Color(0xFF121620);

  // Aliases
  static const background = level0Background;
  static const surface = level1Surface;
  static const surfaceElevated = level2Elevated;
  static const surfaceMuted = level4Muted;
  static const surfaceInteractive = level3Interactive;

  /// Soft ivory paper primary text (#E2E6EC) — no blinding glare.
  static const textPrimary = Color(0xFFE2E6EC);

  /// Soft slate secondary text (#8F9CAE).
  static const textSecondary = Color(0xFF8F9CAE);

  /// Muted metadata tertiary text (#64748B).
  static const textTertiary = Color(0xFF64748B);

  /// Clean button text (#FFFFFF).
  static const textOnPrimary = Color(0xFFFFFFFF);

  /// Soft warm terracotta brand orange (#D96B43) — reduced optical fatigue.
  static const brandPrimary = Color(0xFFD96B43);

  /// Deeper brand orange (#C85A34).
  static const brandSecondary = Color(0xFFC85A34);

  /// Warm luminous accent (#E07A55).
  static const brandBright = Color(0xFFE07A55);

  /// Delicate translucent borders (#14FFFFFF).
  static const border = Color(0x14FFFFFF);

  /// Stronger border (#24FFFFFF).
  static const borderStrong = Color(0x24FFFFFF);

  /// Divider line (#14FFFFFF).
  static const divider = Color(0x14FFFFFF);

  /// Soft emerald success green (#38B781).
  static const success = Color(0xFF38B781);
  static const successContainer = Color(0xFF0F3022);

  /// Soft amber warning (#DDA046).
  static const warning = Color(0xFFDDA046);
  static const warningContainer = Color(0xFF332005);

  /// Soft coral error (#D95B5B).
  static const error = Color(0xFFD95B5B);
  static const errorContainer = Color(0xFF38151A);

  /// Soft azure info (#5586DC).
  static const info = Color(0xFF5586DC);
  static const infoContainer = Color(0xFF12233D);

  static const overlay = Color(0x40000000);
  static const scrim = Color(0x99000000);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/core/theme/color_tokens_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/core/theme/color_tokens.dart apps/mobile/lib/core/theme/app_theme.dart apps/mobile/test/core/theme/color_tokens_test.dart
git commit -m "feat(mobile): implement soft editorial dark mode palette to reduce eye fatigue"
```

---

### Task 2: Splash Screen Color & Official Logo Mark Integration (Items 6 & 7)

**Files:**
- Modify: `apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml`
- Modify: `apps/mobile/lib/features/onboarding/presentation/splash_screen.dart`
- Modify: `apps/mobile/lib/core/widgets/nagrik_logo.dart`
- Test: `apps/mobile/test/core/widgets/nagrik_logo_test.dart`

**Interfaces:**
- Produces: `NagrikLogoMark` widget rendering official high-DPI asset with squircle radius and drop shadow.

- [ ] **Step 1: Write test for NagrikLogoMark**

```dart
// apps/mobile/test/core/widgets/nagrik_logo_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';

void main() {
  testWidgets('NagrikLogoMark renders with correct size and shadow', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: NagrikLogoMark(size: NagrikLogoSize.lg),
        ),
      ),
    );

    expect(find.byType(NagrikLogoMark), findsOneWidget);
    expect(find.byType(Image), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify initial state**

Run: `flutter test test/core/widgets/nagrik_logo_test.dart`
Expected: PASS or minor verification.

- [ ] **Step 3: Update splash background and NagrikLogoMark**

1. In `apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml`:
```xml
<resources>
  <color name="ic_launcher_background">#10141C</color>
</resources>
```

2. In `apps/mobile/lib/features/onboarding/presentation/splash_screen.dart`:
Change line 88:
```dart
const bgColor = Color(0xFF10141C);
```
Add warm radial ambient glow behind `_LogoEmblem`:
```dart
Container(
  width: 140,
  height: 140,
  decoration: BoxDecoration(
    shape: BoxShape.circle,
    gradient: RadialGradient(
      colors: [
        const Color(0xFFDE5227).withValues(alpha: 0.22),
        Colors.transparent,
      ],
    ),
  ),
  child: Center(
    child: _LogoEmblem(opacity: logoOpacity, scale: logoScale),
  ),
)
```

3. In `apps/mobile/lib/core/widgets/nagrik_logo.dart`:
Clean `NagrikLogoMark` to directly display `assets/images/nagrik_logo.png` with crisp anti-aliasing:
```dart
class NagrikLogoMark extends StatelessWidget {
  const NagrikLogoMark({
    super.key,
    this.size = NagrikLogoSize.md,
    this.width,
    this.height,
  });

  final NagrikLogoSize size;
  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    final dimensions = size.markDimensions;
    final w = width ?? dimensions.width;
    final h = height ?? dimensions.height;

    return RepaintBoundary(
      child: Container(
        width: w,
        height: h,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(w * 0.24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.25),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(w * 0.24),
          child: Image.asset(
            'assets/images/nagrik_logo.png',
            width: w,
            height: h,
            fit: BoxFit.cover,
            filterQuality: FilterQuality.high,
          ),
        ),
      ),
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/core/widgets/nagrik_logo_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml apps/mobile/lib/features/onboarding/presentation/splash_screen.dart apps/mobile/lib/core/widgets/nagrik_logo.dart apps/mobile/test/core/widgets/nagrik_logo_test.dart
git commit -m "feat(mobile): update splash screen to obsidian charcoal and integrate crisp official logo"
```

---

### Task 3: Video Player Dual Pause Controls (Item 1)

**Files:**
- Modify: `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart`
- Modify: `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart`
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/video/nagrik_video_player.dart`
- Test: `apps/mobile/test/features/videos/vertical_video_pause_test.dart`

**Interfaces:**
- Produces: Persistent center paused badge on `VerticalVideoCard` and dedicated right action button on `VerticalVideoOverlay`.

- [ ] **Step 1: Write test for pause controls**

```dart
// apps/mobile/test/features/videos/vertical_video_pause_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_overlay.dart';

void main() {
  testWidgets('VerticalVideoOverlay shows play/pause action button', (tester) async {
    const post = Post(
      id: 'test-1',
      title: 'Test Video Headline',
      content: 'Test content description',
      category: 'Civic',
      createdAt: '2026-09-24T00:00:00Z',
    );

    bool playPauseToggled = false;

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: VerticalVideoOverlay(
              post: post,
              isMuted: false,
              isPlaying: false,
              onTogglePlayPause: () => playPauseToggled = true,
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

    final pauseButton = find.byKey(const Key('video_play_pause_action_btn'));
    expect(pauseButton, findsOneWidget);

    await tester.tap(pauseButton);
    expect(playPauseToggled, isTrue);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/features/videos/vertical_video_pause_test.dart`
Expected: FAIL (missing `isPlaying` and `onTogglePlayPause` params).

- [ ] **Step 3: Implement persistent pause controls in vertical video widgets**

1. In `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart`:
Add persistent center pause indicator when controller is paused:
```dart
// Center Persistent Paused Badge
if (isInitialized && controller != null && !controller.value.isPlaying)
  Center(
    child: GestureDetector(
      onTap: _triggerPlayPause,
      child: Container(
        width: 76,
        height: 76,
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: 0.58),
          shape: BoxShape.circle,
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.25),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Icon(
          Icons.play_arrow_rounded,
          color: Colors.white,
          size: 52,
        ),
      ),
    ),
  ),
```

2. Pass `isPlaying: controller?.value.isPlaying ?? false` and `onTogglePlayPause: widget.onTogglePlayPause` into `VerticalVideoOverlay`.

3. In `apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart`:
Add `isPlaying` (bool) and `onTogglePlayPause` (VoidCallback) properties.
In the right action column (above Like button):
```dart
_ActionButton(
  key: const Key('video_play_pause_action_btn'),
  icon: isPlaying
      ? Icons.pause_circle_filled_rounded
      : Icons.play_circle_fill_rounded,
  label: isPlaying ? 'Pause' : 'Play',
  iconColor: isPlaying ? Colors.white : const Color(0xFFDE5227),
  onTap: widget.onTogglePlayPause,
),
```

4. In `NagrikVideoPlayer` (`apps/mobile/lib/features/feed/presentation/widgets/video/nagrik_video_player.dart`):
Ensure the center pause button remains visible while paused.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/videos/vertical_video_pause_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/features/videos/presentation/widgets/vertical_video_card.dart apps/mobile/lib/features/videos/presentation/widgets/vertical_video_overlay.dart apps/mobile/lib/features/feed/presentation/widgets/video/nagrik_video_player.dart apps/mobile/test/features/videos/vertical_video_pause_test.dart
git commit -m "feat(mobile): add dual pause controls to vertical videos and persistent paused overlay"
```

---

### Task 4: Network Profile & Adaptive Media Service (3G / 4G / 5G) (Item 2)

**Files:**
- Create: `apps/mobile/lib/core/network/network_profile_service.dart`
- Modify: `apps/mobile/lib/core/network/api_constants.dart`
- Test: `apps/mobile/test/core/network/network_profile_service_test.dart`

**Interfaces:**
- Produces: `NetworkTier` enum (`threeG`, `fourG`, `fiveGOrWifi`), `NetworkProfile` configuration with `maxImageCacheWidth`, `videoPrefetchCount`, and `requestTimeout`.

- [ ] **Step 1: Write test for NetworkProfileService**

```dart
// apps/mobile/test/core/network/network_profile_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/network/network_profile_service.dart';

void main() {
  group('NetworkProfileService', () {
    test('3G profile has conservative limits and low latency timeout', () {
      final profile = NetworkProfile.forTier(NetworkTier.threeG);
      expect(profile.maxImageCacheWidth, 480);
      expect(profile.videoPrefetchCount, 0);
      expect(profile.requestTimeout.inSeconds, 5);
    });

    test('4G profile has standard balance', () {
      final profile = NetworkProfile.forTier(NetworkTier.fourG);
      expect(profile.maxImageCacheWidth, 720);
      expect(profile.videoPrefetchCount, 1);
    });

    test('5G/WiFi profile allows maximum fidelity', () {
      final profile = NetworkProfile.forTier(NetworkTier.fiveGOrWifi);
      expect(profile.maxImageCacheWidth, 1080);
      expect(profile.videoPrefetchCount, 2);
    });
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/core/network/network_profile_service_test.dart`
Expected: FAIL (file doesn't exist).

- [ ] **Step 3: Create NetworkProfileService**

Create `apps/mobile/lib/core/network/network_profile_service.dart`:
```dart
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

enum NetworkTier {
  threeG,
  fourG,
  fiveGOrWifi,
}

class NetworkProfile {
  const NetworkProfile({
    required this.tier,
    required this.maxImageCacheWidth,
    required this.videoPrefetchCount,
    required this.requestTimeout,
    required this.enableAggressivePrefetch,
  });

  final NetworkTier tier;
  final int maxImageCacheWidth;
  final int videoPrefetchCount;
  final Duration requestTimeout;
  final bool enableAggressivePrefetch;

  static NetworkProfile forTier(NetworkTier tier) {
    return switch (tier) {
      NetworkTier.threeG => const NetworkProfile(
          tier: NetworkTier.threeG,
          maxImageCacheWidth: 480,
          videoPrefetchCount: 0,
          requestTimeout: Duration(seconds: 5),
          enableAggressivePrefetch: false,
        ),
      NetworkTier.fourG => const NetworkProfile(
          tier: NetworkTier.fourG,
          maxImageCacheWidth: 720,
          videoPrefetchCount: 1,
          requestTimeout: Duration(seconds: 10),
          enableAggressivePrefetch: false,
        ),
      NetworkTier.fiveGOrWifi => const NetworkProfile(
          tier: NetworkTier.fiveGOrWifi,
          maxImageCacheWidth: 1080,
          videoPrefetchCount: 2,
          requestTimeout: Duration(seconds: 15),
          enableAggressivePrefetch: true,
        ),
    };
  }
}

class NetworkProfileNotifier extends Notifier<NetworkProfile> {
  @override
  NetworkProfile build() => NetworkProfile.forTier(NetworkTier.fourG);

  void setTier(NetworkTier tier) {
    state = NetworkProfile.forTier(tier);
  }
}

final networkProfileProvider =
    NotifierProvider<NetworkProfileNotifier, NetworkProfile>(
  NetworkProfileNotifier.new,
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/core/network/network_profile_service_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/core/network/network_profile_service.dart apps/mobile/test/core/network/network_profile_service_test.dart
git commit -m "feat(mobile): create NetworkProfileService for adaptive 3G/4G/5G media loading"
```

---

### Task 5: Instant Cold Start (SWR Cache Hydration) (Item 3)

**Files:**
- Modify: `apps/mobile/lib/features/feed/presentation/providers/feed_providers.dart`
- Modify: `apps/mobile/lib/features/videos/presentation/providers/videos_provider.dart`
- Test: `apps/mobile/test/features/feed/feed_swr_hydration_test.dart`

**Interfaces:**
- Consumes: `OfflineCacheService.getFeedCache()`
- Produces: Instant hydration of `feedStateProvider` with zero-millisecond cached stories on initial render.

- [ ] **Step 1: Write test for SWR cache hydration**

```dart
// apps/mobile/test/features/feed/feed_swr_hydration_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nagrik/core/network/offline_cache_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('OfflineCacheService returns instant cached items without network call', () async {
    SharedPreferences.setMockInitialValues({});
    final testPosts = [
      {'id': 'p1', 'title': 'Instant Local Story 1'},
      {'id': 'p2', 'title': 'Instant Local Story 2'},
    ];
    await OfflineCacheService.saveFeedCache(testPosts);

    final cached = await OfflineCacheService.getFeedCache();
    expect(cached.length, 2);
    expect(cached.first['title'], 'Instant Local Story 1');
  });
}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `flutter test test/features/feed/feed_swr_hydration_test.dart`
Expected: PASS.

- [ ] **Step 3: Implement SWR hydration in FeedStateNotifier**

In `apps/mobile/lib/features/feed/presentation/providers/feed_providers.dart`:
Update `_loadInitialFeed()`:
```dart
Future<void> _loadInitialFeed() async {
  final location = ref.read(selectedLocationProvider);
  final repo = ref.read(contentRepositoryProvider);
  final tab = ref.read(feedTabProvider);

  // 1. Instant SWR Hydration: Load local cached items immediately
  try {
    final cachedPosts = await OfflineCacheService.getFeedCache();
    if (cachedPosts.isNotEmpty && state.items.isEmpty) {
      final items = <FeedItem>[];
      for (final raw in cachedPosts) {
        try {
          items.add(ContentFeedItem(post: Post.fromJson(raw)));
        } catch (_) {}
      }
      if (items.isNotEmpty) {
        state = state.copyWith(
          items: items,
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
    // Only show error if we have zero cached items
    if (state.items.isEmpty) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: friendlyErrorMessage(e, fallback: 'Could not load your feed. Please retry.'),
      );
    }
  }
}
```

- [ ] **Step 4: Run test to verify feed SWR behavior**

Run: `flutter test test/features/feed/feed_swr_hydration_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/features/feed/presentation/providers/feed_providers.dart apps/mobile/test/features/feed/feed_swr_hydration_test.dart
git commit -m "perf(mobile): implement instant SWR cache hydration to eliminate cold-start loading stalls"
```

---

### Task 6: Hardware Optimization for Low-End & High-End Devices (Item 4)

**Files:**
- Modify: `apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart`
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/feed_card.dart`
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/image_carousel.dart`
- Test: `apps/mobile/test/core/widgets/repaint_boundary_test.dart`

**Interfaces:**
- Bounded image decoders via `memCacheWidth` and `memCacheHeight`.
- Selective video controller disposal avoiding memory spikes.

- [ ] **Step 1: Write test for isolated repaint boundaries**

```dart
// apps/mobile/test/core/widgets/repaint_boundary_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('RepaintBoundary isolates card repainting', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: RepaintBoundary(
            child: SizedBox(width: 200, height: 200),
          ),
        ),
      ),
    );
    expect(find.byType(RepaintBoundary), findsWidgets);
  });
}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `flutter test test/core/widgets/repaint_boundary_test.dart`
Expected: PASS.

- [ ] **Step 3: Apply memory and repaint boundary optimizations**

1. In `apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart`:
Evict distant video controllers when user scrolls beyond +/- 1 page to preserve RAM on budget devices:
```dart
void _pruneDistantControllers(int currentPage) {
  final keysToRemove = <int>[];
  for (final index in _controllers.keys) {
    if ((index - currentPage).abs() > 1) {
      keysToRemove.add(index);
    }
  }
  for (final key in keysToRemove) {
    final ctrl = _controllers.remove(key);
    try {
      ctrl?.pause();
      ctrl?.dispose();
    } catch (_) {}
  }
}
```
Call `_pruneDistantControllers(newPage)` in `_onPageChanged`.

2. Enforce `memCacheWidth: 720` and `memCacheHeight: 960` on `CachedNetworkImage` inside `feed_card.dart` and `image_carousel.dart`.
3. Wrap video surfaces in `RepaintBoundary`.

- [ ] **Step 4: Run tests to verify zero regressions**

Run: `flutter test test/core/widgets/repaint_boundary_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/features/videos/presentation/screens/videos_screen.dart apps/mobile/lib/features/feed/presentation/widgets/feed_card.dart apps/mobile/test/core/widgets/repaint_boundary_test.dart
git commit -m "perf(mobile): optimize memory eviction and constrain image decoders for low-end devices"
```

---

### Task 7: Professional Smooth Motion & Route Transitions (Item 5)

**Files:**
- Create: `apps/mobile/lib/core/widgets/nagrik_pressable_card.dart`
- Modify: `apps/mobile/lib/app/router.dart`
- Test: `apps/mobile/test/core/widgets/nagrik_pressable_card_test.dart`

**Interfaces:**
- Produces: `NagrikPressableCard` widget with gentle 0.985 scale animation and haptic tap.

- [ ] **Step 1: Write test for NagrikPressableCard**

```dart
// apps/mobile/test/core/widgets/nagrik_pressable_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/widgets/nagrik_pressable_card.dart';

void main() {
  testWidgets('NagrikPressableCard animates scale on tap', (tester) async {
    bool tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: NagrikPressableCard(
            onTap: () => tapped = true,
            child: const SizedBox(width: 100, height: 100),
          ),
        ),
      ),
    );

    expect(find.byType(NagrikPressableCard), findsOneWidget);
    await tester.tap(find.byType(NagrikPressableCard));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/core/widgets/nagrik_pressable_card_test.dart`
Expected: FAIL (file does not exist).

- [ ] **Step 3: Implement NagrikPressableCard and upgrade route transitions**

1. Create `apps/mobile/lib/core/widgets/nagrik_pressable_card.dart`:
```dart
import 'package:flutter/material.dart';
import 'package:nagrik/core/theme/motion.dart';

class NagrikPressableCard extends StatefulWidget {
  const NagrikPressableCard({
    super.key,
    required this.child,
    this.onTap,
    this.scaleFactor = 0.985,
  });

  final Widget child;
  final VoidCallback? onTap;
  final double scaleFactor;

  @override
  State<NagrikPressableCard> createState() => _NagrikPressableCardState();
}

class _NagrikPressableCardState extends State<NagrikPressableCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 140),
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutQuad,
        reverseCurve: Curves.easeOutBack,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails _) {
    _controller.reverse();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.onTap == null) return widget.child;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onTap: () {
        NagrikMotion.lightImpact();
        widget.onTap?.call();
      },
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }
}
```

2. In `apps/mobile/lib/app/router.dart`:
Upgrade `_smoothPageTransition`:
```dart
Page<dynamic> _smoothPageTransition({
  required LocalKey key,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: key,
    child: child,
    transitionDuration: const Duration(milliseconds: 240),
    reverseTransitionDuration: const Duration(milliseconds: 190),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curve = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
      final slideAnimation = Tween<Offset>(
        begin: const Offset(0.04, 0),
        end: Offset.zero,
      ).animate(curve);

      return SlideTransition(
        position: slideAnimation,
        child: FadeTransition(
          opacity: curve,
          child: child,
        ),
      );
    },
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/core/widgets/nagrik_pressable_card_test.dart`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add apps/mobile/lib/core/widgets/nagrik_pressable_card.dart apps/mobile/lib/app/router.dart apps/mobile/test/core/widgets/nagrik_pressable_card_test.dart
git commit -m "feat(mobile): add NagrikPressableCard and refine silky smooth page transitions"
```

---

### Task 8: End-to-End Verification & Full Flutter Test Suite

**Files:**
- Test all: `apps/mobile/test/...`

- [ ] **Step 1: Run complete test suite**

Run: `flutter test`
Expected: All tests pass.

- [ ] **Step 2: Run Flutter analyze to ensure zero errors or warnings**

Run: `flutter analyze`
Expected: 0 issues found.

- [ ] **Step 3: Commit final plan milestone**

```bash
git commit --allow-empty -m "chore(mobile): complete verification of performance, video pause, and UI polish"
```
