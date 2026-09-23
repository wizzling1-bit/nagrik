# Nagrik Mobile App — Website-Faithful Editorial Redesign Spec

**Date**: 2026-09-23  
**Status**: Approved by User  
**Target Platform**: `apps/mobile` (Flutter 3.x, Riverpod)  
**Reference Alignment**: `apps/web` (Next.js 14, Tailwind CSS, Editorial Civic Journalism Design System)

---

## 1. Executive Summary & Vision

The Nagrik Mobile App is being redesigned to achieve complete visual and interactive parity with the **Nagrik Web Portal** (`apps/web`). The new design embraces an authentic, out-of-distribution **Warm Editorial Newspaper & Modern Civic Journalism** aesthetic:
- **Palette**: Nagrik Signature Brand Orange (`#DE5227`) as a purposeful 10% accent, Warm Linen Newspaper (`#F5F0E8`) for Light Mode, and Midnight Obsidian Navy (`#0C1018` / `#131A2A`) for Dark Mode.
- **Typography Triad**: Editorial Serif (`Newsreader`) for headlines and mastheads, Modern Geometric Sans (`Plus Jakarta Sans`) for interface copy and body text, and Technical Monospace (`JetBrains Mono`) for ward geofence badges (`5KM RADIUS`), categories, and timestamps.
- **Craft & Motion**: Zero generic AI templates. Tactile 4-tier button system with spring recoil physics, authentic vector `NagrikLogo` with tricolor base dots, dynamic emerald live radar beacon, and streamlined luxury 16:9 news/video cards.

---

## 2. Design System Tokens & Theming

### 2.1 Color Tokens (`apps/mobile/lib/core/theme/color_tokens.dart`)

#### Brand Accent
- `brandPrimary`: `Color(0xFFDE5227)` — Nagrik Signature Brand Orange.
- `brandAccessible`: `Color(0xFFC84318)` — High-contrast CTA button color (WCAG AAA).
- `brandBright`: `Color(0xFFF4835E)` — Luminous orange highlight for dark mode accents.
- `brandLight`: `Color(0xFFFEECE6)` — Warm subtle badge & chip background tint.

#### Light Mode (Warm Editorial Newspaper Linen)
- `level0Background`: `Color(0xFFF5F0E8)` — Warm linen canvas, non-glare reading surface.
- `level1Surface`: `Color(0xFFF9F6F1)` — Primary content card background.
- `level2Elevated`: `Color(0xFFFFFFFF)` — Elevated modals, dialogs, and popovers.
- `level4Muted`: `Color(0xFFEDE7DB)` — Inset inputs, search field background, chip containers.
- `border`: `Color(0xFFDDD5C8)` — Subtle warm separator & card outline.
- `borderStrong`: `Color(0xFFC8BFAF)` — Active input border and focused states.
- `textPrimary`: `Color(0xFF0F172A)` — Deep slate ink for high-contrast, effortless legibility.
- `textSecondary`: `Color(0xFF5A6577)` — Editorial secondary description & author text.
- `textTertiary`: `Color(0xFF8B8174)` — Faint metadata, timestamps, and captions.
- `divider`: `Color(0xFFDDD5C8)` — Card and list dividers.
- `success`: `Color(0xFF047857)` — Emerald status for verified checkmarks.

#### Dark Mode (Midnight Obsidian & Luminescent Navy)
- `level0Background`: `Color(0xFF0C1018)` — Deep midnight obsidian canvas.
- `level1Surface`: `Color(0xFF131A2A)` — Dark card surface with subtle cool undertone.
- `level2Elevated`: `Color(0xFF1A2236)` — Elevated bottom sheets, dialogs, and navigation bar.
- `level4Muted`: `Color(0xFF0F1520)` — Inset inputs and chip backdrops.
- `border`: `Color(0xFF1C2537)` — Dark hairline border.
- `borderStrong`: `Color(0xFF2A3650)` — Active dark border.
- `textPrimary`: `Color(0xFFF0F2F5)` — Crisp white headlines.
- `textSecondary`: `Color(0xFF8E9DB5)` — Muted blue-slate secondary text.
- `textTertiary`: `Color(0xFF5E6D84)` — Subdued metadata and timestamps.
- `divider`: `Color(0xFF1C2537)` — Dark card and list dividers.
- `success`: `Color(0xFF34D399)` — Luminous emerald indicator.

### 2.2 Typography Hierarchy (`apps/mobile/lib/core/theme/typography.dart`)

| Style | Font Family | Size | Weight | Line Height | Purpose |
|---|---|---|---|---|---|
| `displayLarge` | `Newsreader` | 36.0 | 800 (Bold) | 1.15 | Splash & Onboarding Primary Hero |
| `displayMedium` | `Newsreader` | 30.0 | 700 (Bold) | 1.20 | Section Headlines |
| `headlineLarge` | `Newsreader` | 26.0 | 700 (Bold) | 1.25 | Article Detail Title |
| `headlineMedium`| `Newsreader` | 22.0 | 700 (Bold) | 1.28 | Card Titles (Featured / Lead) |
| `titleLarge` | `Newsreader` | 18.0 | 600 (SemiBold)| 1.32 | Standard News Card Headline |
| `titleMedium` | `Plus Jakarta Sans` | 16.0 | 600 (SemiBold)| 1.35 | Subsections, Sheet Headers |
| `titleSmall` | `Plus Jakarta Sans` | 14.0 | 600 (SemiBold)| 1.40 | Compact Item Titles |
| `bodyLarge` | `Plus Jakarta Sans` | 16.0 | 400 (Regular) | 1.60 | Article Detail Reading Body |
| `bodyMedium` | `Plus Jakarta Sans` | 14.0 | 400 (Regular) | 1.50 | Card Summaries, List Descriptions |
| `bodySmall` | `Plus Jakarta Sans` | 12.5 | 400 (Regular) | 1.40 | Secondary Captions |
| `labelLarge` | `Plus Jakarta Sans` | 14.0 | 600 (SemiBold)| 1.30 | Primary & Secondary Button Labels |
| `labelMedium` | `JetBrains Mono` | 11.5 | 600 (SemiBold)| 1.30 | Category Tags, Filter Pills |
| `labelSmall` | `JetBrains Mono` | 10.5 | 600 (SemiBold)| 1.25 | Geofence (`5KM RADIUS`), Timestamps |

*Indian language font fallbacks (`Noto Sans`, `Noto Sans Devanagari`, `Noto Sans Tamil`, etc.) are preserved for multi-lingual script rendering.*

---

## 3. Component Architecture & Craft Elements

### 3.1 `NagrikLogo` Widget (`apps/mobile/lib/core/widgets/nagrik_logo.dart`)
- **Brand Icon**:
  - Gradient squircle container with linear gradient from `#EA580C` to `#C2410C`.
  - Geometric pointer triangle at the bottom apex.
  - Dual curved radio transmission arcs in `#FEE7DE`.
  - Sharp, geometric white `N` glyph with miter joints.
  - Tricolor accent base dots: Saffron (`#F58220`), Slate (`#CBD5E1`), and Emerald (`#22C55E`).
- **Wordmark**:
  - `nagrik` in display bold (`#0F172A` in light, `#FFFFFF` in dark) + `.news` in brand accent (`#E36138`).
  - Optional subtitle: *"Citizen Journalism Platform"*.

### 3.2 Tactile 4-Tier Button System (`NagrikButton`)
1. **Primary (`btn-primary`)**: Solid brand accent (`#C84318`), 12dp border radius, crisp white text, spring recoil tap animation (`active:scale(0.97)`), and light haptic feedback.
2. **Secondary (`btn-secondary`)**: Neutral card surface (`#FAF8F5` in light, `#1A2236` in dark) with subtle 1px border.
3. **Ghost (`btn-ghost`)**: Borderless text action with soft press highlight.
4. **Icon Action (`btn-icon`)**: 40×40dp and 44×44dp rounded touch target for search, bookmark, share, and notification bell.

### 3.3 Geofence Pill & Live Radar Beacon
- **5KM Ward Pill**: Dark glassmorphic container (`rgba(0,0,0,0.72)` background with subtle border), brand orange `MapPin` icon, and `5KM RADIUS` in `JetBrains Mono`.
- **Live Beacon**: Double-ring animated ping with pulsing emerald center dot (`#10B981`) and expanding breathing halo for real-time eyewitness news.

### 3.4 Micro-Interactions & Spring Physics (`NagrikMotion`)
- Standardized animation curve: `Curves.easeOutCubic` (cubic-bezier `0.16, 1, 0.3, 1`), 250–320ms duration.
- Double-tap to like on story cards with elastic scaling heart feedback.
- Spring press feedback on all interactive elements.

---

## 4. Screen Redesigns

### 4.1 Home Masthead & Feed (`HomeScreen` & `HomeAppBar`)
- **Header**:
  - `NagrikLogo` brand crest and wordmark.
  - Location capsule showing current ward (`WARD 14 · PATNA`) with active emerald dot and pin icon, opening the ward selector sheet.
  - Search trigger and notification bell with unread badge counter.
- **Breaking News Alert**:
  - Rendered when urgent alerts exist, styled with amber-crimson gradient, pulsing bolt icon, and Newsreader serif headline.
- **Trending Categories Bar**:
  - Horizontal scrolling filter chips (`All`, `Civic`, `Infrastructure`, `Transit`, `Water`, `Environment`) with active brand orange indicator.
- **Streamlined Card Feed**:
  - `NewsCard`: 16:9 media, 14dp rounded corners, floating `5KM RADIUS` geofence badge, category in `JetBrains Mono`, `Newsreader` serif headline, author avatar with verified checkmark, reading time, and bottom action bar.
  - `VideoCard`: 16:9 video thumbnail, floating brand orange Play button, duration pill, and video byte title.
  - Interleaved Native Ads matching the card styling without jarring layout shifts.
  - Smooth pull-to-refresh with skeleton shimmer loader and floating "Back to Top" pill on deep scroll.

### 4.2 Content Detail View (`ContentDetailScreen`)
- Full-width 16:9 media header (or inline video player).
- Category tag, ward distance badge, and timestamp in `JetBrains Mono`.
- Large 26–30dp `Newsreader` serif headline with generous leading.
- Verified reporter byline card.
- Readable article body in `Plus Jakarta Sans` with 1.6× line-height.
- Floating bottom engagement bar (like, bookmark, native share, flag/report).

### 4.3 Persistent Bottom Navigation (`router.dart`)
- Clean docked bar with 5 destinations:
  - **Nearby / Home** (`Icons.explore_outlined` / `Icons.explore_rounded`)
  - **Search** (`Icons.search_rounded`)
  - **Saved** (`Icons.bookmark_outline_rounded` / `Icons.bookmark_rounded`)
  - **Alerts** (`Icons.notifications_outlined` / `Icons.notifications_rounded`)
  - **Settings** (`Icons.tune_rounded`)
- Active orange pill indicator with bold label; muted slate for inactive tabs.
- Double-back press protection on Home tab.

### 4.4 Search, Saved, Notifications, Onboarding, and Settings
- **Search**: Clean search bar with recent search pills and category chips.
- **Saved**: Editorial bookmark list with swipe-to-unsave and bespoke empty state.
- **Notifications**: Urgent alert cards with category and time breakdown.
- **Onboarding**: Warm linen canvas with editorial masthead and single-step location/language selection.
- **Settings**: Clean list tiles with theme switch (System / Warm Light / Midnight Dark).

---

## 5. Testing & Verification Plan

1. **Automated Unit & Widget Tests**:
   - Run `flutter test` across all 214 test files in `apps/mobile/test` to ensure 100% pass rate.
   - Run `flutter analyze` to ensure 0 lint errors or warnings.
2. **Visual & Responsive Verification**:
   - Verify Warm Editorial Light Mode and Midnight Obsidian Dark Mode.
   - Verify WCAG AAA contrast for all text elements against background tokens.
   - Verify smooth 60fps animations, pull-to-refresh physics, and safe-area insets.
