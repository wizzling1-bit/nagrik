# Nagrik Website Editorial Redesign Spec (Premium Refinement)

## 1. Executive Summary & Design Vision
Nagrik is an established hyperlocal civic news and short-video platform serving 100+ Indian cities with a 5km neighborhood focus. This iteration executes a **Premium Refinement** following the core principle: **"Less, but better."**

The platform transitions away from generic landing page tropes, excessive badges, dashboard cards, and artificial visual clutter into a **calm, confident editorial publication paired with crisp consumer mobile product polish**.

---

## 2. Core Visual & Architectural Principles

### 2.1 Editorial Simplicity + Product Polish
- **Editorial Dominance**: Strong contrast between elegant editorial serif typography (`Newsreader`/serif) for major headlines and ultra-clean sans-serif (`Plus Jakarta Sans`) for body, navigation, and UI.
- **Noise Reduction**: Aggressive elimination of redundant pills, nested badges, repetitive status dots, and decorative chrome.
- **Visual Rhythm**: Alternating section structures (split hero -> hierarchical news grid -> 4 compact pillars -> 3-step horizontal workflow -> clean city discovery -> high-contrast download CTA -> minimal FAQ).

### 2.2 Color System & Theme Refinement
- **Dark Theme (Deep Navy Luxury)**:
  - Background: `#06101C`
  - Surface Cards: `#0B1728`
  - Elevated / Interactive: `#101F33`
  - Subtle Borders: `rgba(255, 255, 255, 0.08)` / `#1E293B`
  - Text: Primary `#F8FAFC`, Muted `#94A3B8`
  - Accent: Saffron/Orange `#C2410C` / `#EA580C` reserved strictly for primary actions & key editorial focal points.
- **Light Theme (Warm Editorial Newspaper)**:
  - Background: `#FAF9F6` (warm off-white)
  - Surface Cards: `#FFFFFF`
  - Elevated / Subtle Hover: `#F1F5F9`
  - Subtle Borders: `rgba(15, 23, 42, 0.08)` / `#E2E8F0`
  - Text: Primary `#0F172A`, Muted `#64748B`
  - Accent: `#C2410C`

### 2.3 Typography & Sizing Standard
- **Hero Headline**: `clamp(2.75rem, 5vw, 4.25rem)` / 64–72px, line-height ~1.05
- **Major Section Headings**: 36–48px
- **Featured News Headline**: 28–34px
- **Secondary News Headline**: 18–20px
- **Body Text**: 16px (1rem), line-height 1.6
- **Secondary / Supporting**: 14px (0.875rem)
- **Metadata**: 12–13px (No unreadable 9–10px text)
- **Container Max-Width**: `max-w-6xl` / ~1200px for optimal reading line length and proportion.

---

## 3. Component Breakdown & Refinements

### 3.1 Header (`Navbar.tsx`)
- **Noise Removed**: Removed heavy background borders, redundant badges around the logo, and over-decorated pills.
- **Layout**:
  - Left: Clean Nagrik logo + brand title.
  - Center: Quiet text navigation (`News`, `Why Nagrik`, `How It Works`, `Coverage`, `For Publishers`).
  - Right: Minimal City Selector + Language Toggle + Dark/Light Toggle + Single Primary `Download App` CTA.
- **Behavior**: Subtle backdrop blur, sticky with clean bottom border, no jarring shadows.

### 3.2 Hero Section (`HeroSection.tsx`)
- **Copy & Narrative**: Immediate clarity in 3 seconds: "News from your neighborhood. Right when it matters."
- **Noise Removed**: Removed dominating metric boxes and artificial glare / aggressive 3D tilt.
- **CTAs**: Primary `Download Nagrik` + Secondary `Explore Local News ↓` + QR quick-trigger.
- **Phone Visual**: High-resolution, authentic simulation of the Nagrik mobile experience (live ward feed & short video byte), clean device framing with subtle entrance animation (opacity 0->1, translateY 20px->0).

### 3.3 Today's Local Stories & Short Videos (`NewsSection.tsx`)
- **The Star Section**: 1 Featured Dominant Lead Story (7 cols) + 2 Secondary Stories (5 cols) + 3 Supporting Stories Grid.
- **Editorial Media**: 16:9 consistent aspect ratios, cover fit, subtle 1.02x hover zoom.
- **Clean Metadata**: `PATNA · 12 MIN AGO`, category label, clear `Read Story →` / `Watch Video →` action. No redundant badge clutter.
- **Filter Switcher**: Quiet, minimal segmented control (`All Reports`, `Short Videos`, `Articles`).

### 3.4 Why Nagrik (`WhyNagrikSection.tsx`)
- **Concept**: 4 compact, lightweight benefit cards without dashboard complexity:
  1. *5km Local Radius* (Ward-level relevance)
  2. *4K Video Bytes* (Unfiltered real footage)
  3. *Report in 1 Tap* (Direct civic voice)
  4. *Zero-Account Friction* (Instant open-and-read access)
- **Card Design**: Subtle borders, generous padding, clean iconography, readable text.

### 3.5 How Ground Truth Reaches You (`HowItWorksSection.tsx`)
- **3-Step Horizontal Storyline**:
  - `01` Captured Locally
  - `02` Reviewed Carefully
  - `03` Delivered to Your Ward
- **Clarity**: Instant 5-second scan, no redundant technical jargon.

### 3.6 City Coverage (`CoverageSection.tsx`)
- **Focus**: "Where Nagrik is available" — clear, scannable cards for Patna, Varanasi, Lucknow, Bengaluru, Delhi NCR, Mumbai, Pune, Kolkata.
- **Card Content**: City name, State, key neighborhoods/areas, status indicator.

### 3.7 Publisher Gateway (`PublisherGatewaySection.tsx`)
- **Role**: Secondary section encouraging local stringers & journalists without overshadowing the consumer news experience.
- **Action**: Clean horizontal banner linking to `/publishers` for the full earnings calculator.

### 3.8 App Download Section (`AppDownloadSection.tsx`)
- **Dominant CTA**: High-contrast dark container, bold headline, Google Play & App Store buttons, high-res QR code card with "No Login Required • Direct Access".

### 3.9 Consumer FAQ (`FaqSection.tsx`)
- **Concise**: 7 core consumer questions addressing app purpose, 5km radius, zero-login privacy, city availability, fact-checking, and download.
- **Accessibility**: Semantic `<h3>` headings, full `aria-expanded` and `aria-controls` bindings.

### 3.10 Footer (`Footer.tsx`)
- **Compact & Organized**: 4 clean columns (Platform, For Publishers, Company & Legal, Brand Mission + Made in India indicator).

---

## 4. Accessibility, Performance & SEO
- **Semantic HTML5**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Keyboard Navigation**: Focus rings (`focus:ring-2 focus:ring-brand-500`) on all interactive buttons, links, and accordions.
- **Reduced Motion**: Graceful degradation respecting `prefers-reduced-motion`.
- **Localization**: 100% full parity between Hindi (`hi`) and English (`en`) via `LanguageContext`.
- **Performance**: Zero heavy external runtime libraries; lightweight CSS transitions and native responsive images.
