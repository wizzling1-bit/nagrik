# Nagrik Platform: 2026 Statutory Legal, Compliance, & Editorial Pages Suite

**Date:** September 24, 2026  
**Status:** Approved by User  
**Target Applications:** Web App (`apps/web`), GitHub Production Deployment (`wizzling1-bit/NAGRIK-WEBSITE`), Mobile In-App WebViews (`apps/mobile`)

---

## 1. Executive Summary & Regulatory Frameworks (2026 Acts)

This document establishes the architecture, content specifications, and statutory compliance framework for the complete trust and legal suite of the **Nagrik** Hyperlocal Civic Journalism Platform.

The suite is drafted in full accordance with the latest Indian and international digital statutory frameworks effective in **2026**:

1. **Digital Personal Data Protection (DPDP) Act, 2023 & DPDP Rules**:
   - Explicit classification of Nagrik Media Trust / Naagrik Technologies as **Data Fiduciary**.
   - Clear, itemized, and granular consent notices available in both English and Hindi.
   - Comprehensive articulation of **Data Principal Rights**: Right to Access Information, Right to Correction & Erasure, Right of Grievance Redressal, and Right to Nominate.
   - Strict adherence to Section 9: Prohibition of tracking, behavioral monitoring, or targeted advertising directed at children (minors under 18), with verified parental consent mechanisms.
   - Formal statutory Data Protection Officer (DPO) and direct escalation pathway to the **Data Protection Board of India (DPBI)**.

2. **Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (as amended through 2026)**:
   - Part III digital news publisher governance: Self-regulation under the Code of Ethics, adherence to Norms of Journalistic Conduct of the Press Council of India, and the Programme Code under the Cable Television Networks (Regulation) Act, 1995.
   - **Three-Tier Grievance Redressal Mechanism**:
     - *Level I*: Resident Grievance Officer (RGO) located in India with published contact details, 24-hour mandatory complaint acknowledgment, and 15-calendar-day final resolution.
     - *Level II*: Independent Self-Regulatory Body headed by a retired Supreme Court or High Court judge.
     - *Level III*: Oversight mechanism by the Ministry of Information & Broadcasting (MIB), Government of India.
   - Statutory escalation notice to the **Grievance Appellate Committee (GAC)** under Rule 3A.
   - Synthetic Media & AI Provenance Disclosure: Strict tagging, labeling, and watermarking of AI-assisted imagery, transcripts, and syntheses to prevent misinformation.

3. **Information Technology Act, 2000 (Sections 43A, 66, 69A, 79 Safe Harbor)**:
   - Intermediary immunity and notice-and-takedown protocol under Section 79.
   - Statutory compliance for government orders under Section 69A.

4. **Reserve Bank of India (RBI) Master Directions & Digital Settlement Guidelines**:
   - Tokenized settlement and direct UPI auto-payout rails for verified publisher revenue.
   - AES-256 cryptographic encryption for creator banking metadata and PAN/TDS compliance under Section 194C/194R of the Income Tax Act, 1961.

5. **Copyright Act, 1957 (India) & Digital Millennium Copyright Act (DMCA)**:
   - Fair dealing exemptions for reporting current affairs (Section 52(1)(a)(iii)).
   - Formal DMCA & Copyright takedown notice and counter-notice procedure with designated agent.

6. **Google Play Store & Apple App Store 2025–2026 Policies**:
   - Public canonical privacy policy URL with explicit justification for foreground & background GPS permissions, camera, microphone, and storage.
   - Prominent, direct **Account Deletion & Data Wipe** self-service mechanism.

---

## 2. Information Architecture & Canonical Routes

All pages are implemented as dedicated first-class routes inside Next.js App Router (`apps/web/app/`):

```text
apps/web/app/
├── privacy/
│   └── page.tsx           -> Canonical: /privacy (DPDP 2023, Play Store, AdMob)
├── terms/
│   └── page.tsx           -> Canonical: /terms (Terms of Service & Platform Charter)
├── about/
│   └── page.tsx           -> Canonical: /about (Manifesto, Civic Network, 3-Tier Truth Verification)
├── guidelines/
│   └── page.tsx           -> Canonical: /guidelines (Editorial Standards, Fact-Checking, Deepfake Rules)
├── grievance/
│   └── page.tsx           -> Canonical: /grievance (IT Rules 2021 Grievance Officer, 24h/15d Timelines)
├── cookies/
│   └── page.tsx           -> Canonical: /cookies (Local Storage, Analytics, Preference Tokens)
└── contact/
    └── page.tsx           -> Canonical: /contact (Bureaus, Newsroom Inquiries, Press)
```

### Shared Legal Hub Header & Sticky Navigation
Each document shares the cohesive Nagrik editorial design language:
- **Terracotta & Midnight Obsidian palette** (`#DE5227`, `#0C1018`, `#F5F0E8`, `#131A2A`).
- **Interactive Quick-Switcher Dock**: A sticky/horizontal pill navigation bar allowing readers to switch between `Privacy Policy`, `Terms of Service`, `About & Mission`, `Editorial Guidelines`, `Grievance Officer`, `Cookie Policy`, and `Contact Desk` without returning to the footer.
- **Section Table of Contents (TOC)**: Fast internal anchor navigation for long legal sections.
- **Bilingual Language Toggle**: Seamless switching between Hindi (हिन्दी) and English.
- **Print / PDF Export Affordance**: Quick print stylesheet support for enterprise, institutional, and compliance auditing.

---

## 3. Detailed Specifications per Page

### 3.1 `/privacy` — Privacy Policy & Data Protection Charter
1. **Preamble & Identity of Data Fiduciary**: Full legal name, registered jurisdiction, scope of mobile applications (iOS/Android) and web portals.
2. **Categories of Personal Data Processed**:
   - Profile & Identity (Name, email, phone number, profile photo).
   - Location Data (Precise GPS coordinates, ward, district, sub-district geofence).
   - Financial Metadata (UPI VPA, Bank account number, IFSC code, PAN for TDS).
   - Device Telemetry (IP address, OS version, device identifiers, crash logs).
   - Citizen News Content (Uploaded video, audio, imagery, location timestamps).
3. **Legal Basis for Processing (Section 4 & 6 of DPDP Act 2023)**:
   - User Consent (freely given, specific, informed, unconditional, and unambiguous).
   - Legitimate Uses (processing reporter payouts, fulfilling statutory orders, preventing fraud).
4. **Mobile Permissions & Hardware Access Disclosures**:
   - *Location (ACCESS_FINE_LOCATION & ACCESS_COARSE_LOCATION)*: Mandatory for 5km hyperlocal geofencing and proving physical presence during ground reporting.
   - *Camera (CAMERA)*: Capturing eyewitness photos and ground videos.
   - *Microphone (RECORD_AUDIO)*: Capturing eyewitness audio and interviews.
   - *Storage / Media (READ_MEDIA_IMAGES, READ_MEDIA_VIDEO)*: Uploading raw camera files.
   - *Notifications (POST_NOTIFICATIONS)*: Dispatches on breaking civic updates and payment receipts.
5. **Data Storage, Security & International Transfers**:
   - Encrypted data at rest (AES-256) and in transit (TLS 1.3).
   - Cloudflare R2 object storage and Supabase infrastructure.
   - Data stored in compliance with Indian cross-border transfer notifications.
6. **Data Principal Rights & Self-Service Controls**:
   - Right to withdraw consent.
   - Right to access summary of personal data.
   - Right to correction, updating, and completion of inaccurate data.
   - Right to erasure (Account Deletion with 30-day purge cycle).
   - Right to nominate a surrogate in the event of death or incapacity.
7. **Children's Privacy Protection**:
   - Platform not targeted to children under 18 years.
   - Zero behavioral tracking or targeted ads for minors.
8. **Contact Information of the Data Protection Officer (DPO)**.

---

### 3.2 `/about` — About Us, Mission & Citizen Journalism Manifesto
1. **The Nagrik Manifesto**: Re-democratizing grassroots Indian journalism; dismantling the urban metropolitan bias by equipping ordinary citizens with sovereign reporting tools.
2. **The Hyperlocal Civic Network**:
   - Coverage scale: 28 States, 8 Union Territories, 700+ Districts, thousands of wards and panchayats.
   - The 5km Wire: Real-time community notification architecture.
3. **The 3-Tier Truth Verification Protocol**:
   - *Tier 1: Cryptographic Provenance*: Automated EXIF, GPS telemetry, and tamper checks.
   - *Tier 2: Community Corroboration*: Multi-eyewitness cross-referencing within the same geofence.
   - *Tier 3: Sovereign Newsroom Desk*: AI-assisted duplicate detection and human moderation review.
4. **The Creator Economic Promise**:
   - $1.50 CPM flat transparent baseline rate.
   - ₹850 ($10) threshold with zero platform platform fee deduction on earnings.
   - 100% intellectual property retained by citizen reporters.
5. **Editorial Independence & Non-Partisanship Pledge**.

---

### 3.3 `/grievance` — IT Rules 2021 Grievance Redressal Mechanism
1. **Statutory Designation**: Appointed in compliance with Rule 11 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
2. **Resident Grievance Officer Particulars**:
   - **Name**: Sh. Arvind Verma
   - **Designation**: Resident Grievance Officer (RGO) & Compliance Director
   - **Email**: `grievance@nagrik.news`
   - **Desk Phone**: +91 (612) 220-4912
   - **Postal Address**: Nagrik Media Trust, Bureau House, Fraser Road, Patna, Bihar – 800001, India.
3. **Filing Procedure**:
   - Clear online complaint intake form requirements (Content ID, reporter byline, specific legal infringement, supporting documentation).
4. **Mandatory Statutory Timelines**:
   - **Acknowledgment**: Within 24 hours of ticket receipt with unique tracking ID.
   - **Interim Action (where applicable)**: Removal of non-consensual sexually explicit imagery within 24 hours under Rule 3(2)(b).
   - **Final Resolution**: Within 15 calendar days from the date of receipt.
5. **Appellate Mechanism**: Information regarding appeal to the Central Government Grievance Appellate Committee (GAC) under Rule 3A via `gac.gov.in`.

---

### 3.4 `/guidelines` — Editorial Standards & Community Code of Conduct
1. **Journalistic Core Principles**: Truthfulness, accuracy, civic integrity, privacy respect, conflict of interest disclosure.
2. **Zero-Tolerance Red Lines**:
   - Defamation, libel, and slander.
   - Communal disharmony, religious incitement, and hate speech under Bharatiya Nyaya Sanhita (BNS) / IPC.
   - Deepfakes, synthetic AI alterations without prominent disclosures.
   - Harassment, stalking, or doxxing of private individuals.
   - Child sexual exploitation and violence.
3. **Fact-Checking & Provenance Standards**:
   - Minimum two-source corroboration for controversial municipal claims.
   - Clear visual differentiation between opinion/editorial and verified news reporting.
4. **Corrections & Retractions Policy**:
   - Public correction log for verified errors.
   - Clear banner placed at the head of corrected stories.
5. **Whistleblower & Source Confidentiality Protection Protocol**.

---

### 3.5 `/cookies` — Cookie & Storage Governance Policy
1. **Cookie Architecture**:
   - Essential Cookies: Supabase session auth tokens, CSRF protection, secure cookie flags (`HttpOnly`, `SameSite=Lax`, `Secure`).
   - Preference Storage: Selected locality, language choice (`hi`/`en`), theme (`light`/`dark`).
   - Performance & Analytics: Aggregated client-side dwell time telemetry (for verified monetization accounting).
2. **Third-Party Vendors**: Cloudflare (CDN caching and DDoS mitigation), Google Fonts, Google AdMob SDK.
3. **Browser Management Guide**: Clear step-by-step instructions for disabling cookies in Chrome, Firefox, Safari, and Android Chrome.

---

### 3.6 `/terms` — Terms of Service Update
1. Update existing Terms of Service to explicitly reference the newly created dedicated policies:
   - Cross-link to `/privacy`, `/guidelines`, `/grievance`, and `/cookies`.
   - Incorporate 2026 platform terms for publisher earnings, tax compliance (TDS), anti-fraud dwell verification, and dispute resolution through arbitration in Patna/Delhi.

---

## 4. Navigation & SEO Integration

1. **Footer Enhancement (`apps/web/src/components/Footer.tsx`)**:
   - Replace old `#why` and `/terms?tab=...` links with direct canonical links:
     - Explore: Latest News (`/#story`), Civic Issues (`/#why`), Local Reports (`/creator`), Investigations (`/#ecosystem`), People's Stories (`/publishers`).
     - Company: About Us (`/about`), Our Mission (`/about#mission`), For Publishers (`/creator`), Careers (`/contact`), Contact Us (`/contact`).
     - Support: Help Center (`/#faq`), Community Guidelines (`/guidelines`), Editorial Standards (`/guidelines#standards`), Grievance Officer (`/grievance`), FAQ (`/#faq`).
     - Legal & Trust: Privacy Policy (`/privacy`), Terms of Service (`/terms`), Contributor Policy (`/terms#creator`), DMCA Notice (`/terms#dmca`), Grievance Redressal (`/grievance`), Cookie Policy (`/cookies`).
2. **Sitemap Generation (`apps/web/app/sitemap.ts`)**:
   - Add entries for `/about`, `/privacy`, `/terms`, `/guidelines`, `/grievance`, `/cookies`, and `/contact` with `changeFrequency: 'monthly'` and `priority: 0.8`.
3. **JSON-LD Structured Data**:
   - Add schema.org `BreadcrumbList`, `AboutPage`, `WebPage`, and `NewsMediaOrganization` on the respective pages.

---

## 5. Verification & Deployment Plan

1. **Local Build & Type Checking**: Run `npm run build` in `apps/web` to confirm all routes compile with 0 errors.
2. **Automated Unit & Widget Tests**: Ensure mobile tests continue to pass.
3. **Live Sync to GitHub**: Sync and push all new pages to `https://github.com/wizzling1-bit/NAGRIK-WEBSITE.git` on branch `main` using author `wizzling1-bit` for automatic Vercel deployment.
