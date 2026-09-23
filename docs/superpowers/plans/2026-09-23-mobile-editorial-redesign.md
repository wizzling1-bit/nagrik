# Mobile Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Nagrik Flutter mobile app (`apps/mobile`) to achieve complete visual, typographic, and experiential harmony with the website UI/UX style (`apps/web`), delivering a warm editorial newspaper aesthetic (Light Mode) and midnight obsidian aesthetic (Dark Mode) with signature brand orange (`#DE5227`), authentic vector logo, serif headlines (`Newsreader`), 4-tier tactile buttons, 5KM ward geofence badges, and buttery-smooth 60/120fps animations.

**Architecture:** We use a lightweight, high-performance native Flutter approach matching the website's Tailwind design tokens and layout principles. Central theme tokens (`color_tokens.dart`, `typography.dart`, `theme_extensions.dart`, `app_theme.dart`) supply color and typographic hierarchy to all feature screens (`HomeScreen`, `ContentDetailScreen`, `SearchScreen`, `SavedScreen`, `NotificationsScreen`, `SettingsScreen`, `OnboardingScreen`) through Riverpod and standard `Theme.of(context)`.

**Tech Stack:** Flutter 3.44+ (Dart 3.12+), `flutter_riverpod`, `go_router`, `google_fonts` (`Newsreader`, `Plus Jakarta Sans`, `JetBrains Mono`), `cached_network_image`, `flutter_test`.

## Global Constraints
- Brand primary orange: `Color(0xFFDE5227)`, accessible button orange: `Color(0xFFC84318)`.
- Light canvas: `Color(0xFFF5F0E8)` (warm linen), card: `Color(0xFFF9F6F1)`, border: `Color(0xFFDDD5C8)`, text: `Color(0xFF0F172A)`.
- Dark canvas: `Color(0xFF0C1018)` (midnight obsidian), card: `Color(0xFF131A2A)`, border: `Color(0xFF1C2537)`, text: `Color(0xFFF0F2F5)`.
- Typography: Headlines use `GoogleFonts.newsreader`, body uses `GoogleFonts.plusJakartaSans`, metadata/geofence uses `GoogleFonts.jetBrainsMono`.
- All 214 existing unit and widget tests must pass with 0 regressions.
- `flutter analyze` must return 0 issues.

---

### Task 1: Update Color Tokens & Theme Extensions to Match Website Palette

**Files:**
- Modify: `apps/mobile/lib/core/theme/color_tokens.dart`
- Modify: `apps/mobile/lib/core/theme/theme_extensions.dart`
- Test: `apps/mobile/test/core/theme/theme_test.dart`

**Interfaces:**
- Consumes: Flutter `Color`
- Produces: `NagrikBrandColors`, `NagrikLightColors`, `NagrikDarkColors`, `NagrikThemeExtension` with website tokens (`#DE5227`, `#F5F0E8`, `#0C1018`, etc.)

- [ ] **Step 1: Write/Update failing test for new color tokens**

```dart
// In apps/mobile/test/core/theme/color_tokens_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/color_tokens.dart';

void main() {
  test('NagrikLightColors has correct website warm linen tokens', () {
    expect(NagrikLightColors.background, const Color(0xFFF5F0E8));
    expect(NagrikLightColors.surface, const Color(0xFFF9F6F1));
    expect(NagrikLightColors.brandPrimary, const Color(0xFFDE5227));
    expect(NagrikLightColors.textPrimary, const Color(0xFF0F172A));
  });

  test('NagrikDarkColors has correct website midnight obsidian tokens', () {
    expect(NagrikDarkColors.level0Background, const Color(0xFF0C1018));
    expect(NagrikDarkColors.level1Surface, const Color(0xFF131A2A));
    expect(NagrikDarkColors.brandPrimary, const Color(0xFFDE5227));
    expect(NagrikDarkColors.textPrimary, const Color(0xFFF0F2F5));
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/core/theme/color_tokens_test.dart` in `apps/mobile`
Expected: FAIL due to mismatched color constants.

- [ ] **Step 3: Update `color_tokens.dart` and `theme_extensions.dart`**

Update `NagrikLightColors` and `NagrikDarkColors` with the website's exact hex values:
`brandPrimary: 0xFFDE5227`, `brandAccessible: 0xFFC84318`, `background: 0xFFF5F0E8`, `surface: 0xFFF9F6F1`, `surfaceElevated: 0xFFFFFFFF`, `surfaceMuted: 0xFFEDE7DB`, `textPrimary: 0xFF0F172A`, `textSecondary: 0xFF5A6577`, `border: 0xFFDDD5C8`.
In dark mode: `background: 0xFF0C1018`, `surface: 0xFF131A2A`, `surfaceElevated: 0xFF1A2236`, `surfaceMuted: 0xFF0F1520`, `textPrimary: 0xFFF0F2F5`, `textSecondary: 0xFF8E9DB5`, `border: 0xFF1C2537`.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/core/theme/color_tokens_test.dart`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add lib/core/theme/color_tokens.dart lib/core/theme/theme_extensions.dart test/core/theme/color_tokens_test.dart
git commit -m "feat(theme): update color tokens to match website warm linen and obsidian palette"
```

---

### Task 2: Implement Typography Triad & Master ThemeData

**Files:**
- Modify: `apps/mobile/lib/core/theme/typography.dart`
- Modify: `apps/mobile/lib/core/theme/app_theme.dart`
- Test: `apps/mobile/test/core/theme/typography_test.dart`

**Interfaces:**
- Consumes: `GoogleFonts`, `NagrikLightColors`, `NagrikDarkColors`
- Produces: `NagrikTypography.textTheme(Color textColor)` using `Newsreader` (Serif headlines), `Plus Jakarta Sans` (Body/UI), and `JetBrains Mono` (Labels/Badges). Configures `NagrikTheme.light()` and `NagrikTheme.dark()`.

- [ ] **Step 1: Write test for Newsreader serif and Plus Jakarta Sans styles**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/typography.dart';

void main() {
  test('NagrikTypography builds textTheme with correct headline and body styles', () {
    final textTheme = NagrikTypography.textTheme(Colors.black);
    expect(textTheme.headlineLarge?.fontSize, 28.0);
    expect(textTheme.headlineMedium?.fontSize, 22.0);
    expect(textTheme.bodyLarge?.fontSize, 16.0);
    expect(textTheme.labelMedium?.fontSize, 12.0);
  });
}
```

- [ ] **Step 2: Run test to verify existing behavior or failure**

Run: `flutter test test/core/theme/typography_test.dart`

- [ ] **Step 3: Update `typography.dart` and `app_theme.dart`**

Configure `NagrikTypography` to use:
- Headlines & titles: `GoogleFonts.newsreader` (with Indian language font fallbacks)
- Body text & display: `GoogleFonts.plusJakartaSans`
- Labels & captions: `GoogleFonts.jetBrainsMono`
In `app_theme.dart`: Ensure `cardTheme`, `appBarTheme`, `inputDecorationTheme`, `bottomNavigationBarTheme`, and `navigationBarTheme` use the new surface, border, and brand colors.

- [ ] **Step 4: Run theme tests**

Run: `flutter test test/core/theme/`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add lib/core/theme/typography.dart lib/core/theme/app_theme.dart test/core/theme/typography_test.dart
git commit -m "feat(theme): configure editorial serif typography and master app theme"
```

---

### Task 3: Build Authentic Vector `NagrikLogo` & Refine `NagrikButton`

**Files:**
- Create: `apps/mobile/lib/core/widgets/nagrik_logo.dart`
- Modify: `apps/mobile/lib/core/widgets/nagrik_button.dart`
- Modify: `apps/mobile/lib/core/widgets/widgets.dart`
- Test: `apps/mobile/test/core/widgets/nagrik_logo_test.dart`

**Interfaces:**
- Consumes: Flutter vector painting / CustomPainter / SVG-like path drawing
- Produces: `NagrikLogo(size, variant, theme, hideSubtitle)` and `NagrikButton` 4-tier system (primary, secondary, ghost, icon)

- [ ] **Step 1: Write unit test for `NagrikLogo`**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';

void main() {
  testWidgets('NagrikLogo renders mark and wordmark text', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: NagrikLogo(variant: NagrikLogoVariant.full),
        ),
      ),
    );

    expect(find.text('nagrik'), findsOneWidget);
    expect(find.text('.news'), findsOneWidget);
    expect(find.text('Citizen Journalism Platform'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `flutter test test/core/widgets/nagrik_logo_test.dart`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement `nagrik_logo.dart` and enhance `nagrik_button.dart`**

- `nagrik_logo.dart`: CustomPainter or Canvas drawing the squircle gradient (`#EA580C` to `#C2410C`), pointing apex, signal arcs, bold N glyph, and tricolor dots (`#F58220`, `#CBD5E1`, `#22C55E`), followed by RichText for `nagrik.news` and optional subtitle.
- `nagrik_button.dart`: Verify primary button uses `#C84318` brand accessible orange with 12dp radius, tactile spring press (`active:scale(0.97)`), and secondary/ghost/icon tiers.

- [ ] **Step 4: Run widget tests**

Run: `flutter test test/core/widgets/nagrik_logo_test.dart test/core/widgets/nagrik_button_test.dart`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add lib/core/widgets/nagrik_logo.dart lib/core/widgets/nagrik_button.dart lib/core/widgets/widgets.dart test/core/widgets/nagrik_logo_test.dart
git commit -m "feat(widgets): add authentic vector NagrikLogo and refine 4-tier button system"
```

---

### Task 4: Redesign Home Masthead & Breaking News Alert Card

**Files:**
- Modify: `apps/mobile/lib/features/home/presentation/widgets/home_app_bar.dart`
- Modify: `apps/mobile/lib/features/home/presentation/widgets/breaking_hero_card.dart`
- Test: `apps/mobile/test/features/home/presentation/home_app_bar_test.dart`
- Test: `apps/mobile/test/features/home/presentation/breaking_hero_card_test.dart`

**Interfaces:**
- Consumes: `NagrikLogo`, `urgentAlertsProvider`, `selectedLocationProvider`, `unreadNotificationsCountProvider`
- Produces: Redesigned masthead with live green pulsing beacon, ward pill (`WARD 14 · PATNA`), search and notification actions, and urgent breaking news card with amber-crimson gradient.

- [ ] **Step 1: Write/Update test for HomeAppBar showing NagrikLogo and location capsule**

```dart
// Test verifying HomeAppBar renders NagrikLogo and Location capsule with live beacon
```

- [ ] **Step 2: Run test to verify failure/status**

Run: `flutter test test/features/home/presentation/home_app_bar_test.dart`

- [ ] **Step 3: Update `home_app_bar.dart` and `breaking_hero_card.dart`**

- `home_app_bar.dart`: Replace the plain title with `NagrikLogo(variant: NagrikLogoVariant.horizontal, size: NagrikLogoSize.sm)`, location capsule with live pulsing emerald beacon (`#10B981`) + MapPin icon + `WARD 14 · PATNA` in JetBrains Mono / Plus Jakarta Sans, and icon actions for search and notification.
- `breaking_hero_card.dart`: Add amber-crimson gradient background (`#DE5227` to `#DC2626` with opacity), bolt icon with breathing pulse aura, and headline in `Newsreader` bold serif.

- [ ] **Step 4: Run test to verify it passes**

Run: `flutter test test/features/home/presentation/home_app_bar_test.dart test/features/home/presentation/breaking_hero_card_test.dart`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add lib/features/home/presentation/widgets/home_app_bar.dart lib/features/home/presentation/widgets/breaking_hero_card.dart test/features/home/presentation/
git commit -m "feat(home): redesign HomeAppBar with authentic logo and live ward capsule"
```

---

### Task 5: Redesign Streamlined Luxury Cards (`NewsCard`, `VideoCard`, `PostCard`)

**Files:**
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/cards/news_card.dart`
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/cards/video_card.dart`
- Modify: `apps/mobile/lib/features/feed/presentation/widgets/cards/post_card.dart`
- Test: `apps/mobile/test/features/feed/presentation/cards/news_card_test.dart`
- Test: `apps/mobile/test/features/feed/presentation/cards/video_card_test.dart`

**Interfaces:**
- Consumes: `Post`, `NagrikThemeExtension`
- Produces: 16:9 media cards with dark glassmorphic `5KM RADIUS` geofence badge, JetBrains Mono category tags, dominant Newsreader serif headlines, verified author avatars, and spring-action rows.

- [ ] **Step 1: Write/Update test for NewsCard 5KM badge and serif headline**

```dart
// Test verifying NewsCard renders 5KM RADIUS geofence badge, category tag, and serif headline
```

- [ ] **Step 2: Run card widget tests to check current assertions**

Run: `flutter test test/features/feed/presentation/`

- [ ] **Step 3: Update `news_card.dart` and `video_card.dart`**

- `news_card.dart`:
  - 16:9 media aspect ratio with 14dp rounded corners.
  - Floating dark glassmorphic geofence pill (`MapPin` + `5KM RADIUS` in `JetBrains Mono`).
  - Metadata row: `CATEGORY · WARD · TIME` in letterspaced uppercase monospace.
  - Headline in `Newsreader` bold serif (`fontSize: 18-20`, `height: 1.28`).
  - Author row with verified checkmark badge (`#047857` / `#34D399`) and engagement buttons (bookmark, share, flag).
- `video_card.dart`:
  - 16:9 thumbnail with dark cinematic vignette.
  - Centered or floating brand orange Play button with white triangle.
  - Video byte duration pill (`0:45`).
- `post_card.dart`:
  - Ensure double-tap elastic heart animation and tactile haptic feedback are preserved and polished.

- [ ] **Step 4: Run card tests to verify they pass**

Run: `flutter test test/features/feed/presentation/`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add lib/features/feed/presentation/widgets/cards/
git commit -m "feat(feed): implement streamlined luxury NewsCard and VideoCard with 5KM geofence badge"
```

---

### Task 6: Polish Trending Topics Bar & HomeScreen Feed Experience

**Files:**
- Modify: `apps/mobile/lib/features/home/presentation/widgets/trending_topics_bar.dart`
- Modify: `apps/mobile/lib/features/home/presentation/home_screen.dart`
- Test: `apps/mobile/test/features/home/presentation/home_screen_test.dart`

**Interfaces:**
- Consumes: `categoriesProvider`, `feedStateProvider`, `connectivityStatusProvider`
- Produces: Smooth horizontal filter pill bar with active brand orange indicator, spring pull-to-refresh with shimmer skeletons, and floating "Back to Top" button.

- [ ] **Step 1: Run home_screen tests before edit**

Run: `flutter test test/features/home/presentation/home_screen_test.dart`

- [ ] **Step 2: Update `trending_topics_bar.dart` and `home_screen.dart`**

- `trending_topics_bar.dart`: Style chips with `JetBrains Mono` / `Plus Jakarta Sans`, active brand orange indicator (`#DE5227`), and subtle border on inactive chips (`#DDD5C8` / `#1C2537`).
- `home_screen.dart`: Refine edition date header, section header ("Latest Near You"), floating back-to-top pill with brand orange icon, and skeleton placeholders.

- [ ] **Step 3: Run home screen tests**

Run: `flutter test test/features/home/presentation/home_screen_test.dart`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add lib/features/home/presentation/widgets/trending_topics_bar.dart lib/features/home/presentation/home_screen.dart
git commit -m "feat(home): polish trending topics filter pills and home feed interaction"
```

---

### Task 7: Redesign Content Detail Screen & Persistent Bottom Navigation

**Files:**
- Modify: `apps/mobile/lib/features/feed/presentation/screens/content_detail_screen.dart`
- Modify: `apps/mobile/lib/app/router.dart`
- Test: `apps/mobile/test/features/feed/presentation/screens/content_detail_screen_test.dart`
- Test: `apps/mobile/test/app/router_test.dart`

**Interfaces:**
- Consumes: `Post`, `routerProvider`, `GoRouter`
- Produces: Editorial reading experience with full-width media, 28dp Newsreader serif headline, verified author byline card, comfortable 1.6× line-height body text, and docked bottom navigation bar with 5 destinations.

- [ ] **Step 1: Run detail screen and router tests**

Run: `flutter test test/features/feed/presentation/screens/content_detail_screen_test.dart test/app/router_test.dart`

- [ ] **Step 2: Update `content_detail_screen.dart` and `_ScaffoldWithNavBar` in `router.dart`**

- `content_detail_screen.dart`:
  - Full-width 16:9 media header with rounded bottom edges.
  - Metadata row with category pill and ward location in `JetBrains Mono`.
  - Dominant `Newsreader` serif headline (`fontSize: 26-28`).
  - Author card with avatar, name, and verified badge.
  - Body text in `Plus Jakarta Sans` (`fontSize: 16`, `height: 1.6`, generous paragraph spacing).
  - Floating bottom engagement action bar.
- `router.dart`:
  - Update `_ScaffoldWithNavBar` bottom bar styling: clean docked container with subtle top border (`#DDD5C8` / `#1C2537`), active brand orange pill highlight, and 5 destinations: Nearby (Home), Search, Saved, Alerts, and Settings.

- [ ] **Step 3: Run detail and router tests**

Run: `flutter test test/features/feed/presentation/screens/content_detail_screen_test.dart test/app/router_test.dart`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add lib/features/feed/presentation/screens/content_detail_screen.dart lib/app/router.dart
git commit -m "feat(detail, navigation): redesign ContentDetailScreen and persistent bottom navigation bar"
```

---

### Task 8: Polish Secondary Screens (Search, Saved, Notifications, Onboarding, Settings) & Full Verification

**Files:**
- Modify: `apps/mobile/lib/features/search/presentation/search_screen.dart`
- Modify: `apps/mobile/lib/features/saved/presentation/saved_screen.dart`
- Modify: `apps/mobile/lib/features/notifications/presentation/notifications_screen.dart`
- Modify: `apps/mobile/lib/features/onboarding/presentation/onboarding_screen.dart`
- Modify: `apps/mobile/lib/features/settings/presentation/settings_screen.dart`
- Test: All 214 test files across `apps/mobile/test/`

**Interfaces:**
- Consumes: Complete design system tokens and typography
- Produces: Cohesive editorial styling across all auxiliary screens; passes full automated test suite with 0 regressions.

- [ ] **Step 1: Polish Search, Saved, Notifications, Onboarding, and Settings**

Apply warm linen canvas / obsidian surfaces, Newsreader section headers, Plus Jakarta Sans inputs, and refined empty states with primary brand CTAs across all secondary screens.

- [ ] **Step 2: Run all mobile tests**

Run: `flutter test` in `apps/mobile`
Expected: 214+ passed, 0 failures.

- [ ] **Step 3: Run static analysis**

Run: `flutter analyze` in `apps/mobile`
Expected: 0 issues.

- [ ] **Step 4: Commit changes**

```bash
git add lib/features/search/ lib/features/saved/ lib/features/notifications/ lib/features/onboarding/ lib/features/settings/
git commit -m "feat(screens): polish search, saved, notifications, onboarding, and settings"
```
