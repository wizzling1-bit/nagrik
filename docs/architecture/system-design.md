# 🏗️ Nagrik — System Design & Master Architecture

## 1. Executive Architecture Summary

Nagrik is a **Supabase-first**, **Cloudflare R2-powered** hyperlocal civic journalism and vertical eyewitness byte streaming platform. 

The architecture completely eliminates reliance on traditional stateful app servers and Supabase Storage in favor of:
1. **Supabase PostgreSQL** as the single source of truth for relational metadata, atomic business logic, and PostGIS geospatial indexing.
2. **Supabase Auth & RLS** for robust publisher/admin role-based access control directly in the database engine.
3. **Cloudflare R2** as the **100% exclusive persistent storage** for all videos, thumbnails, avatars, and press images, delivered via Cloudflare's global edge CDN.
4. **Supabase Edge Functions** (Deno) for privileged serverless workflows (presigned R2 upload URL generation, system administration, and external gateway integrations).
5. **Zero-Login Consumer Architecture** on mobile, identifying citizen viewers through an anonymous persistent UUID (`x-device-id`).

---

## 2. High-Level Architecture Diagram

```text
                         ┌────────────────────────────────────────┐
                         │              NAGRIK CLIENTS            │
                         └───────────────────┬────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
             📱 Mobile (Flutter 3.x)                     🌐 Web Portal (Next.js 16)
             • Zero-login discovery                      • Public News SSR (/news/[id])
             • 60fps vertical reels                      • Publisher Studio (/creator)
             • 5km GPS ward proximity                    • Unified Admin Operations (/admin)
             • Anonymous x-device-id                     • Supabase Auth (JWT RBAC)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                      ┌────────────────────────────────────────────┐
                      │          SUPABASE MANAGED CLOUD            │
                      ├────────────────────────────────────────────┤
                      │                                            │
                      │  🔐 Supabase Auth                          │
                      │     └── Publisher & Admin Sessions (JWT)   │
                      │                                            │
                      │  🛡️ Row Level Security (RLS)               │
                      │     └── Granular database authorization    │
                      │                                            │
                      │  🗄️ PostgreSQL Database                    │
                      │     ├── 14 Relational Tables               │
                      │     ├── PostGIS 5km Geospatial Radar       │
                      │     └── Atomic Stored Procedures (RPCs)    │
                      │         ├── track_video_view (3-view cap)  │
                      │         ├── request_payout                 │
                      │         ├── admin_moderate_content         │
                      │         ├── admin_process_payout           │
                      │         └── get_feed (with dynamic ads)    │
                      │                                            │
                      │  ⚡ Edge Functions (Deno Runtime)          │
                      │     ├── 'get-upload-url' (R2 Presigner)    │
                      │     ├── 'feed' (Mobile API adapter)        │
                      │     └── 'track-view' (View logger)         │
                      │                                            │
                      └──────────────────────┬─────────────────────┘
                                             │
                                             │ (Presigned PUT URLs & CDN Reads)
                                             ▼
                      ┌────────────────────────────────────────────┐
                      │            CLOUDFLARE R2 + CDN             │
                      ├────────────────────────────────────────────┤
                      │  100% of all persistent media & files:     │
                      │  • Video Streams (MP4 / WebM / HLS)        │
                      │  • Video Thumbnails                        │
                      │  • Publisher Avatars & Press Photos        │
                      │  • CMS Editorial Documents                 │
                      │                                            │
                      │  Zero Supabase Storage Footprint           │
                      └────────────────────────────────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1 📱 Consumer Mobile App (`apps/mobile`)
- **Framework**: Flutter 3.x with Dart.
- **State & Routing**: Riverpod for reactive state; GoRouter for deep linking.
- **Authentication**: **Strictly Zero-Auth (None)**.
- **Identity**: Anonymous persistent device UUID (`x-device-id`) stored in `SharedPreferences`.
- **Media Playback**: `video_player` streaming high-bitrate vertical video bytes directly from Cloudflare R2 edge URLs.
- **Monetization**: Centralized `AdManager` with Google AdMob (Native inline cards, interstitial, app-open).

### 3.2 🌐 Web Portal (`apps/web`)
- **Framework**: Next.js 16 App Router + React 18 + TypeScript + Tailwind CSS.
- **Surface Breakdown**:
  - `/` & `/news/[id]`: Server-Side Rendered (SSR) public news discovery with open-graph metadata and responsive editorial layout.
  - `/creator`: Publisher & Journalist Studio (Report upload, file manager, analytics, payout requests, creator agreement).
  - `/admin`: Unified Admin Operations Console (Content moderation queue, publisher verification, payout processing, CMS editor, audit logs).
- **Authentication**: Native Supabase Auth (`supabase.auth`) with session persistence, automatic token refreshes, and role verification.

### 3.3 🗄️ PostgreSQL Database & PostGIS (`supabase/`)
- **PostGIS Integration**: Spatial `coordinates_geo geography(Point, 4326)` column on `contents` and `locations` with GIST spatial indexing.
- **Proximity Radar**: `ST_DWithin` calculates real-time 5km radius feeds from citizen GPS coordinates with zero server CPU overhead.
- **Row Level Security (RLS)**:
  - Public can only read approved/published articles and active ads.
  - Creators can only mutate their own content, payout methods, and payout requests.
  - Platform Admins have full access enforced via `public.is_admin()` helper.

### 3.4 🎥 Media Storage Flow (Cloudflare R2)

```text
Publisher (Browser)                Supabase Edge Function             Cloudflare R2
        │                                    │                              │
        │─── 1. POST /get-upload-url ───────▶│                              │
        │       { folder, mimeType, ext }    │── 2. S3 Signer (R2 Keys) ───▶│
        │                                    │◀── 3. Presigned PUT URL ─────│
        │◀── 4. Return uploadUrl & publicUrl─│                              │
        │                                                                   │
        │─── 5. Direct XHR PUT (streaming binary up to 2 GB) ──────────────▶│
        │◀── 6. 200 OK ─────────────────────────────────────────────────────│
        │                                                                   │
        │─── 7. Insert content record with publicUrl into PostgreSQL ──────▶│
```

**Key Security Principles**:
- Cloudflare R2 Secret Access Keys NEVER touch client applications.
- Uploads stream directly from the browser to Cloudflare R2, bypassing all intermediary application servers.
- Supabase Storage is explicitly avoided.

---

## 4. Business Rules & Financial Integrity

1. **3-View Monetization Ceiling Rule**:
   - Each citizen device (`x-device-id`) or user account can count towards creator earnings a maximum of **3 times per unique video**.
   - Enforced atomically in PostgreSQL via `track_video_view` stored procedure with row locking on `video_views`.
2. **Dynamic Earning Rate**:
   - Creator earnings are calculated as `(earning_rate_per_1000_views / 1000)` per eligible view (default: $1.00 per 1,000 views).
3. **Minimum Payout Threshold**:
   - Creators cannot request disbursals below $10.00.
   - Payout requests atomically deduct available balance and hold funds in escrow until processed or refunded by an admin.
4. **Ad Interleaving**:
   - Content feeds automatically interleave active advertisements every 4 content cards (`ad_feed_frequency`), dynamically pulled from `advertisements`.

---

## 5. Local Government Directory (LGD) Administrative Hierarchy

Nagrik implements an **8-tier administrative proximity model** mapping directly to the Ministry of Panchayati Raj Local Government Directory (LGD):

```text
Level 1: Gram Panchayat / Village (ग्राम पंचायत / वार्ड) — Highest Hyperlocal Relevance (100 pts)
Level 2: Subdistrict / Tehsil / Block (तहसील / प्रखंड)   (80 pts)
Level 3: District (ज़िला)                                (60 pts)
Level 4: Division / Region                               (40 pts)
Level 5: State (राज्य)                                    (20 pts)
Level 6: National Wire / Breaking                        (10 pts)
Level 7: 5km GPS Dynamic Proximity (PostGIS ST_DWithin)   (Computed distance decay)
Level 8: Global Fallback / Trending                       (Decayed recency ranking)
```

### Static Data Caching Strategy
- The 28 States and 780+ Districts of India are administratively static.
- The mobile client caches `lgd_states` and `lgd_districts` in-memory (`LgdCascadingSheet._statesCache`, `_districtsCache`), eliminating 100% of redundant administrative queries after initial fetch.
- All LGD tables carry B-tree indexes on `(state_code)`, `(district_code)`, and `(subdistrict_code)`.

---

## 6. Feed Ranking, Keyset Pagination & Search Engine

### 6.1 Personalized Feed (`get_personalized_feed`)
- **Ranking Algorithm**: Composite score combining:
  1. Administrative match tier (Village $\rightarrow$ Block $\rightarrow$ District $\rightarrow$ State)
  2. PostGIS spatial distance score: $e^{-\frac{\text{distance in km}}{5.0}}$
  3. Engagement multiplier: $\log(1 + \text{views} + 2 \times \text{likes})$
  4. Time decay: $\frac{1}{(1 + \text{hours since publication})^{1.2}}$
- **Cursor Keyset Pagination**:
  - The client provides `p_cursor` (opaque ISO timestamp of the last seen item).
  - SQL uses `published_at < p_cursor` with index `idx_contents_feed` rather than high-offset `OFFSET N` scans.
  - Guarantees $O(1)$ query execution time regardless of whether the user is on page 1 or page 50.

### 6.2 PostgreSQL Trigram Search (`search_content`)
- Enabled PostgreSQL extension `pg_trgm`.
- Created GIN trigram indexes on `contents`:
  - `idx_contents_title_trgm` ON `contents USING gin (title gin_trgm_ops)`
  - `idx_contents_desc_trgm` ON `contents USING gin (description gin_trgm_ops)`
- Handles typo tolerance, partial word matching, and prefix searches across regional language transliterations in under 15ms.

---

## 7. Network Resilience & Client Performance

### 7.1 Persistent HTTP Connection Reuse
- Standard mobile apps frequently create and teardown TCP/TLS handshakes, adding 150-300ms overhead per call on Indian 4G/5G networks.
- Nagrik's `ApiClient` utilizes a persistent static connection pool (`_sharedHttpClient`) with HTTP/1.1 keep-alive.

### 7.2 Exponential Backoff with Jitter
- Transient socket timeouts and network handover errors are retried automatically:
  - Attempt 1: 400ms + random jitter
  - Attempt 2: 800ms + random jitter
  - Hard limit: 2 retries
- Non-retryable HTTP client errors (400, 401, 403, 404, 409) fail immediately without wasteful retries.

---

## 8. High Availability & Disaster Recovery

1. **Database Failover**:
   - Supabase Managed High-Availability in `ap-south-1` with automatic cross-AZ standby replica promotion under 30 seconds.
   - Point-in-Time Recovery (PITR) enabled with 7-day retention for transaction rollback.
2. **Media Resilience**:
   - Cloudflare R2 distributes uploaded assets across 300+ edge locations globally.
   - Dual-domain failover: mobile clients fall back from custom domain `https://media.nagrik.news` to direct R2 public bucket URL `https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev` in the event of DNS degradation.
3. **Data Protection Invariant**:
   - All financial balance modifications occur inside PostgreSQL atomic transactions (`FOR UPDATE` row locking), ensuring ledger consistency even during network interruptions.

