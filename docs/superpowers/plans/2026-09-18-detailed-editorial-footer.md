# Detailed Editorial Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-craft, deeply detailed editorial footer and Indian skyline panorama for Nagrik web application, matching the user's reference design with exact visual fidelity.

**Architecture:** Update `apps/web/src/components/Footer.tsx` with a meticulously crafted multi-layer vector SVG silhouette of Indian architecture and nature, glowing sun disc, authentic 5-story photo collection, handwritten script elements, and polished dark footer layout.

**Tech Stack:** Next.js 14, React, Tailwind CSS, SVG vectors, Google Fonts (`Newsreader`, `Caveat`, `Plus_Jakarta_Sans`).

## Global Constraints
- Must maintain dark/light mode elegance and seamless contrast.
- Must preserve all active routes, link targets, and functional behavior.
- Must be fully responsive across mobile, tablet, and desktop viewports.

---

### Task 1: Craft the High-Density Indian Heritage Skyline & Sun Vector

**Files:**
- Modify: `apps/web/src/components/Footer.tsx`

- [ ] **Step 1: Construct the authentic multi-element SVG skyline vector**
  - Multi-tier central dome with cupolas and finials
  - Temple *shikharas* with *amalaka* and *kalasha*
  - Rajput *chhatris* with pillars, eaves, and domes
  - Detailed coconut palm trees with individual curved fronds
  - Billowy banyan and sacred tree canopies
  - Atmospheric distant layer (`opacity="0.2"`)
  - Radial gradient sun disc rising behind the central dome
- [ ] **Step 2: Add the "India lives here." script callout**
  - Use `font-script` (`Caveat`) in subtle slate-600 / dark:slate-300 with gentle tilt and flourish

---

### Task 2: Implement the Curated 5-Story Visual Photo Strip & Script Annotation

**Files:**
- Modify: `apps/web/src/components/Footer.tsx`

- [ ] **Step 1: Configure the 5 curated golden-hour Indian cultural images**
  - Heritage sandstone street alley
  - Golden morning foliage
  - Boy on rooftop at twilight
  - Train through tropical palm groves
  - Varanasi ghats on the holy river
- [ ] **Step 2: Apply card container styles & hover effects**
  - Aspect ratio 4/5, `rounded-2xl`, subtle warm border, hover zoom & warm glow
- [ ] **Step 3: Position the "For a better tomorrow." script**
  - `font-script` in terracotta orange `#DE5227` with 3-line stacked layout and natural tilt

---

### Task 3: Refine Typography, Dark Footer Grid & Form Affordances

**Files:**
- Modify: `apps/web/src/components/Footer.tsx`

- [ ] **Step 1: Set up top editorial headline & mission copy**
  - Uppercase terracotta category badge `REAL PEOPLE. REAL STORIES. REAL CHANGE.`
  - Serif headline `Stories that build stronger communities.` with line break
  - Clean descriptive subtext
- [ ] **Step 2: Format the dark footer columns**
  - Brand column with orange squircle logo and `#RealStoriesRealChange`
  - 3 clean navigation columns (`Explore`, `Company`, `Support`)
  - City newsletter input capsule with terracotta circular submit button
  - Bottom bar with copyright and `Made in India ❤️ For a more informed tomorrow.`

---

### Task 4: Visual Verification & Polish

**Files:**
- Test: Browser verification at `http://localhost:3000/`

- [ ] **Step 1: Validate build compilation**
- [ ] **Step 2: Browser subagent inspection**
  - Capture desktop screenshot (1600px width)
  - Capture mobile screenshot (390px width)
  - Check alignment, color harmony, SVG fidelity, and responsive scaling
