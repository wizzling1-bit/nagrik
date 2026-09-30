# Legal, Compliance, & Editorial Pages Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive, modern, production-grade legal and trust pages suite compliant with India's **DPDP Act 2023**, **IT Rules 2021 (as amended through 2026)**, and **Google Play Store 2026 Policies** across Next.js web application and deploy to GitHub/Vercel.

**Architecture:** Build a shared high-fidelity legal hub shell component (`LegalLayout.tsx`) featuring bilingual language switching (Hindi/English), table of contents, and sticky legal navigation dock. Create dedicated canonical routes for `/privacy`, `/about`, `/grievance`, `/guidelines`, and `/cookies`, and update `/terms`, the site footer, and sitemap.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons, schema.org JSON-LD structured data.

## Global Constraints
- Target applications: `apps/web` and standalone GitHub sync to `https://github.com/wizzling1-bit/NAGRIK-WEBSITE.git`.
- Strict adherence to 2026 Acts: DPDP Act 2023, IT Rules 2021 as amended through 2026, Copyright Act 1957, RBI digital payout directives.
- Zero placeholder copy (no "TODO", "Lorem Ipsum", or vague text).
- Dark/Light theme support matching Nagrik's terracotta (`#DE5227`) and obsidian midnight design tokens.
- All routes must compile cleanly in `next build` with zero TypeScript or ESLint errors.

---

### Task 1: Create Shared Legal Shell Component (`LegalLayout.tsx`)

**Files:**
- Create: `apps/web/src/components/legal/LegalLayout.tsx`
- Test: Verification via Next.js build compilation

**Interfaces:**
- Produces: `export const LegalLayout: React.FC<LegalLayoutProps>` with props `{ title: string; subtitle: string; category: string; lastUpdated: string; version: string; activeSlug: string; tocItems?: { id: string; label: string }[]; children: React.ReactNode }`

- [ ] **Step 1: Write `LegalLayout.tsx`**
  Implement the responsive container, breadcrumb navigation, quick-switcher dock between the 6 trust documents (`/privacy`, `/terms`, `/about`, `/guidelines`, `/grievance`, `/cookies`), bilingual indicator, and table of contents sidebar.
- [ ] **Step 2: Commit**
  ```bash
  git add apps/web/src/components/legal/LegalLayout.tsx
  git commit -m "feat(legal): add shared LegalLayout shell with quick-switcher dock and TOC"
  ```

---

### Task 2: Implement Comprehensive Privacy Policy (`/privacy`)

**Files:**
- Create: `apps/web/src/views/PrivacyView.tsx`
- Create: `apps/web/app/privacy/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from `@/components/legal/LegalLayout`
- Produces: Canonical route `/privacy` complying with DPDP Act 2023 & Google Play Store 2026 data safety requirements

- [ ] **Step 1: Write `PrivacyView.tsx`**
  Cover:
  - Section 1: Introduction & Data Fiduciary Particulars (Wizzling Pvt Ltd).
  - Section 2: Categories of Personal Data Processed (Identity, Financial/UPI, Precise GPS, Device Telemetry).
  - Section 3: Mobile Device Permissions (Foreground/Background Location for 5km Wire, Camera, Microphone, Storage, Push Notifications).
  - Section 4: Lawful Basis under DPDP Act 2023 (Granular Consent, Legitimate Uses for Contributor Payouts).
  - Section 5: Data Storage, AES-256 Encryption & Third-Party Processors (Cloudflare R2, Supabase, Google Play Services).
  - Section 6: Data Principal Rights (Access, Correction, Erasure / Account Deletion with 30-day purge, Right to Nominate).
  - Section 7: Minors and Children's Data (Zero tracking, 18+ policy).
  - Section 8: Data Protection Officer (DPO) Contact Details & DPBI Escalation.
- [ ] **Step 2: Write `app/privacy/page.tsx`**
  Add Next.js `metadata` (title, description, canonical link, openGraph) and render `<PrivacyView />`.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/views/PrivacyView.tsx apps/web/app/privacy/page.tsx
  git commit -m "feat(privacy): add DPDP Act 2023 and Play Store compliant Privacy Policy page"
  ```

---

### Task 3: Implement About Us & Citizen Journalism Manifesto (`/about`)

**Files:**
- Create: `apps/web/src/views/AboutView.tsx`
- Create: `apps/web/app/about/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from `@/components/legal/LegalLayout`
- Produces: Canonical route `/about` detailing the civic network, 3-tier truth verification protocol, and manifesto

- [ ] **Step 1: Write `AboutView.tsx`**
  Cover:
  - Section 1: The Nagrik Manifesto (Democratizing Grassroots Indian News).
  - Section 2: The Hyperlocal Network Architecture (Ward, Panchayat, Sub-District, 5km Real-Time Wire).
  - Section 3: The 3-Tier Truth Verification Protocol (Cryptographic GPS timestamping, Community Eyewitness Corroboration, Sovereign Editorial Moderation).
  - Section 4: Economic Model for Contributors ($1.50 CPM, ₹850 minimum threshold, UPI daily settlements, 100% IP rights).
  - Section 5: Non-Partisan Editorial Independence Pledge.
- [ ] **Step 2: Write `app/about/page.tsx`**
  Add Next.js `metadata` and schema.org `NewsMediaOrganization` JSON-LD.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/views/AboutView.tsx apps/web/app/about/page.tsx
  git commit -m "feat(about): add About Us and Citizen Journalism Manifesto page"
  ```

---

### Task 4: Implement Statutory Grievance Redressal Page (`/grievance`)

**Files:**
- Create: `apps/web/src/views/GrievanceView.tsx`
- Create: `apps/web/app/grievance/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from `@/components/legal/LegalLayout`
- Produces: Canonical route `/grievance` complying with Rule 11 of IT Rules 2021

- [ ] **Step 1: Write `GrievanceView.tsx`**
  Cover:
  - Designated Resident Grievance Officer: Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, `wizzlingsupport@gmail.com`, +91 8890043675.
  - Formal complaint submission checklist (Content URL, exact grievance under IT Rules, proof of identity/rights).
  - Mandatory Timelines: 24-hour statutory acknowledgment, 24-hour interim removal for non-consensual sexual content, 15-day final resolution.
  - Level II Self-Regulatory Body and Level III Central Govt MIB Oversight.
  - Escalation mechanism to Grievance Appellate Committee (`gac.gov.in`).
- [ ] **Step 2: Write `app/grievance/page.tsx`**
  Add Next.js `metadata` and render `<GrievanceView />`.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/views/GrievanceView.tsx apps/web/app/grievance/page.tsx
  git commit -m "feat(grievance): add IT Rules 2021 statutory Grievance Redressal Officer page"
  ```

---

### Task 5: Implement Editorial Standards & Community Guidelines (`/guidelines`)

**Files:**
- Create: `apps/web/src/views/GuidelinesView.tsx`
- Create: `apps/web/app/guidelines/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from `@/components/legal/LegalLayout`
- Produces: Canonical route `/guidelines` establishing reporting rules, deepfake bans, and fact-checking standards

- [ ] **Step 1: Write `GuidelinesView.tsx`**
  Cover:
  - Section 1: Code of Conduct for Citizen Reporters.
  - Section 2: Prohibited Content & Red Lines (Defamation, Communal Hate Speech under BNS, Harassment, Doxxing).
  - Section 3: Synthetic Media, AI & Deepfake Regulations (Mandatory labeling, watermarking, anti-misinformation rules).
  - Section 4: Two-Source Verification & Ground Fact-Checking Standards.
  - Section 5: Corrections & Public Retraction Protocol.
  - Section 6: Whistleblower & Eyewitness Protection.
- [ ] **Step 2: Write `app/guidelines/page.tsx`**
  Add Next.js `metadata` and render `<GuidelinesView />`.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/views/GuidelinesView.tsx apps/web/app/guidelines/page.tsx
  git commit -m "feat(guidelines): add Editorial Standards and Community Code of Conduct page"
  ```

---

### Task 6: Implement Cookie & Local Storage Policy (`/cookies`) and Update Terms of Service (`/terms`)

**Files:**
- Create: `apps/web/src/views/CookiesView.tsx`
- Create: `apps/web/app/cookies/page.tsx`
- Modify: `apps/web/src/views/TermsView.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from `@/components/legal/LegalLayout`
- Produces: Canonical routes `/cookies` and updated `/terms`

- [ ] **Step 1: Write `CookiesView.tsx` & `app/cookies/page.tsx`**
  Cover:
  - Essential session cookies (Supabase auth tokens, CSRF protection, secure cookie flags).
  - Preference local storage (locality selection, language `hi`/`en`, theme mode).
  - Performance & monetization dwell telemetry.
  - Browser-level cookie management instructions.
- [ ] **Step 2: Update `TermsView.tsx`**
  Wrap with `LegalLayout`, cross-reference all 2026 policies, update financial terms, and maintain backward compatibility for query parameter `?tab=...`.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/views/CookiesView.tsx apps/web/app/cookies/page.tsx apps/web/src/views/TermsView.tsx
  git commit -m "feat(legal): add Cookies policy and update Terms of Service with 2026 provisions"
  ```

---

### Task 7: Integrate Navigation Links in Footer & Update Sitemap

**Files:**
- Modify: `apps/web/src/components/Footer.tsx`
- Modify: `apps/web/app/sitemap.ts`

- [ ] **Step 1: Update `Footer.tsx`**
  Replace dead anchor `#why` and query parameter links with canonical links:
  - `/about`
  - `/privacy`
  - `/terms`
  - `/guidelines`
  - `/grievance`
  - `/cookies`
  - `/contact`
- [ ] **Step 2: Update `sitemap.ts`**
  Add all new trust routes with appropriate `changeFrequency` and `priority`.
- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/components/Footer.tsx apps/web/app/sitemap.ts
  git commit -m "feat(seo): update Footer and sitemap with canonical legal routes"
  ```

---

### Task 8: Verification, Build & GitHub Live Deployment

**Files:**
- Verify: Next.js production build (`npm run build` in `apps/web`)
- Deploy: Sync and push to `https://github.com/wizzling1-bit/NAGRIK-WEBSITE.git` (branch `main`)

- [ ] **Step 1: Execute `npm run build` in `apps/web`**
  Confirm 0 errors and all new static routes are generated.
- [ ] **Step 2: Sync and push changes to GitHub repository**
  Run sync script to push clean commit using author `wizzling1-bit`.
- [ ] **Step 3: Verify commit on remote repository**
