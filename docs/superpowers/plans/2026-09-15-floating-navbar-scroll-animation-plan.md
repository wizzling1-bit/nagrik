# Floating Island / Pill Dock Navbar Scroll Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Nagrik website Navbar to a top-class Floating Island / Pill Dock on Scroll with active section spy, reading progress bar, and smooth morphing transitions.

**Architecture:** Implement scroll listener and intersection observers in `Navbar.tsx` that detect scroll position (`scrollY > 24`), calculate document reading percentage (0-100%), and track visible sections (`#story`, `#earnings`, `#why`, `#faq`). On scroll, the container smoothly transitions from a full-width editorial banner to a centered floating frosted-glass pill dock (`rounded-full`, backdrop-blur-xl, hairline border, micro progress bar).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.

## Global Constraints
- No third-party heavy dependencies; use native React hooks, requestAnimationFrame, and Tailwind transitions.
- Maintain full dark mode and multilingual (EN / Hindi) support.
- Zero layout shift (CLS) or jank on scroll.
- Responsive across all viewports (1440px, 1280px, 1024px, 768px, 390px).

---

### Task 1: Refactor Navbar.tsx with Floating Island Morphing & Scroll State

**Files:**
- Modify: `apps/web/src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `useTheme()`, `usePathname()`
- Produces: Enhanced `Navbar` component with dynamic pill dock morphing, active section spy, micro progress line, and responsive drawer.

- [ ] **Step 1: Implement Scroll State, Reading Progress & Active Section Observer**
  - Add `scrollProgress` (0 to 100) calculation.
  - Add `activeSection` detection based on element bounding rects for `#story`, `#earnings`, `#why`, `#faq`.
  - Use `requestAnimationFrame` for smooth 60fps updates.

- [ ] **Step 2: Build the Morphing Dual-State Layout**
  - Outer fixed shell with `pointer-events-none`.
  - Inner dock with `pointer-events-auto`, transition-all duration-300.
  - Top state: full-width `max-w-[1380px]` at `h-20`, subtitle visible.
  - Scrolled state: centered floating island `max-w-[1040px] rounded-full top-3 sm:top-4`, frosted acrylic background, subtitle collapsed, subtle drop shadow.

- [ ] **Step 3: Integrate Micro Reading Progress Bar & Active Section Highlight**
  - 2px terracotta (`#DE5227`) progress line embedded along the bottom edge of the floating dock.
  - Dynamic active pill badge on active navigation link (`bg-orange-500/10 text-[#DE5227] font-bold`).

- [ ] **Step 4: Update Mobile Pill Dock & Spring Drawer**
  - Mobile compact floating pill with Logo, Language pill, and Hamburger.
  - Mobile drawer with city selection chips, navigation links, and primary CTA.

- [ ] **Step 5: Verify Build and Responsiveness**
  - Run `npm run build` in `apps/web`.
  - Test desktop at 1440px, 1280px, 768px, 390px in browser.
