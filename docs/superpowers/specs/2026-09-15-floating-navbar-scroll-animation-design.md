# Floating Island / Pill Dock Navbar Scroll Animation Specification

## 1. Goal & Aesthetic Direction
Upgrade the Nagrik public navbar to a world-class technology and editorial standard with a dynamic **Floating Island / Pill Dock on Scroll** animation.
At the top of the page, the navbar is an expansive, elegant editorial header. As the user scrolls down, it smoothly morphs into a floating, frosted-glass pill dock with active section tracking, an integrated micro reading progress line, and compact quick actions.

---

## 2. Component Architecture & State Management

### 2.1 State Variables
- `scrolled`: boolean (`scrollY > 24`), triggers transition between full-width header and floating dock.
- `scrollProgress`: number (0 to 100), calculated as `(window.scrollY / (documentHeight - windowHeight)) * 100`.
- `activeSection`: string (`'hero'`, `'story'`, `'earnings'`, `'why'`, `'faq'`), determined by scroll position / element bounding rects.
- `mobileMenuOpen`: boolean, controls mobile slide-down drawer.
- `language`: from `LanguageContext` ('en' | 'hi').
- `theme`: from `ThemeContext` ('light' | 'dark').

### 2.2 Layout Transitions
- **Initial State (`scrollY <= 24`)**:
  - Full-width banner: `max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 h-20`
  - Flush with top edge
  - Soft parchment blur: `bg-[#F4EFE6]/80 dark:bg-[#0B0F17]/80 backdrop-blur-md`
  - Subtitle visible: *"News by your neighborhood"*
- **Scrolled State (`scrollY > 24`)**:
  - Floating island dock centered with `fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-4`
  - Width: `max-w-[1080px] w-full px-5 py-2.5 sm:py-3`
  - Border radius: `rounded-full`
  - High-end frosted glassmorphism: `bg-[#FAF7F2]/90 dark:bg-[#0F1420]/90 backdrop-blur-xl border border-stone-300/80 dark:border-slate-700/80`
  - Depth shadow: `shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]`
  - Subtitle collapses smoothly to keep the pill compact and focused.
  - Micro reading progress indicator: 2px terracotta `#DE5227` bar along the bottom curve of the pill.

---

## 3. Navigation Links & Active Section Tracking
- Nav items:
  1. `Platform` / `कार्यप्रणाली` (`#story`)
  2. `How It Works` / `प्रक्रिया` (`#story`)
  3. `Earnings` / `कमाई` (`#earnings`)
  4. `Features` / `सुविधाएं` (`#why`)
  5. `FAQ` / `सामान्य प्रश्न` (`#faq`)
- Dynamic highlight: When `#earnings` is in viewport, the `Earnings` link displays an active pill indicator (`bg-orange-500/10 text-[#DE5227] font-bold`).

---

## 4. Mobile Responsiveness
- On mobile screens (<768px):
  - In scrolled state, morphs into a compact pill with Logo, Language Toggle, and Hamburger.
  - Tapping hamburger opens a frosted spring sheet with active links, city filter chips, and primary CTAs.

---

## 5. Performance & Accessibility
- Passive scroll event listener with `requestAnimationFrame`.
- `aria-label`, accessible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-[#DE5227]`).
- `prefers-reduced-motion` compliance.
