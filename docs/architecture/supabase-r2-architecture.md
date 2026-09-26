# 🗄️ Nagrik — Supabase & Cloudflare R2 Technical Architecture

## 1. Overview & Core Tenets

The **Nagrik** architecture pairs **Supabase** (as a managed backend-as-a-service providing PostgreSQL, Auth, PostGIS, and Edge Functions) with **Cloudflare R2** (as a high-throughput, zero-egress-fee object store).

```text
┌─────────────────────────────────────────────────────────────┐
│                       CORE PRINCIPLES                       │
├─────────────────────────────────────────────────────────────┤
│ 1. 100% of persistent files live in Cloudflare R2.          │
│ 2. Supabase Storage is explicitly NOT used.                 │
│ 3. Database stores only metadata and Cloudflare R2 URLs.     │
│ 4. Clients never receive Cloudflare R2 secret credentials.   │
│ 5. Clients access data via PostgREST guarded by RLS.        │
│ 6. Privileged operations execute via Supabase RPCs/Edge.    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Supabase Subsystems & Usage

| Supabase Feature | Role in Nagrik | Implementation Details |
| :--- | :--- | :--- |
| **PostgreSQL Database** | Primary relational store for all entities | 14 relational tables (`users`, `creators`, `categories`, `locations`, `contents`, `video_views`, `advertisements`, `payout_methods`, `payout_requests`, `system_settings`, `reports`, `audit_logs`, `notifications`, `cms_pages`). |
| **Supabase Auth** | Publisher & Admin authentication | GoTrue JWT authentication with session persistence. `auth.users` automatically syncs to `public.users` and `public.creators` via trigger `trg_on_auth_user_created`. |
| **Row Level Security (RLS)** | Data access control and isolation | 25+ SQL policies enforcing public read restrictions on draft content, creator record isolation, and admin privilege escalation. |
| **PostGIS Extension** | Hyperlocal 5km radar and ward boundary queries | `coordinates_geo geography(Point, 4326)` column with spatial GIST index. Querying via `ST_DWithin(coordinates_geo, ST_SetSRID(ST_MakePoint(lng, lat), 4326), 5000)`. |
| **Stored Procedures (RPCs)** | Atomic transactions and business logic | `track_video_view` (3-view cap + balance computation), `request_payout` (escrow hold), `admin_moderate_content`, `admin_process_payout`, `get_creator_dashboard_stats`, `get_feed`. |
| **Edge Functions (Deno)** | Privileged serverless execution | `get-upload-url` (generates presigned Cloudflare R2 PUT URLs), `feed` (mobile API contract adapter), `track-view` (view logger). |

---

## 3. Cloudflare R2 Storage Architecture

### 3.1 R2 Configuration
- **S3 Endpoint**: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
- **Bucket Name**: `nagrik-media`
- **Region**: `auto`
- **Public Domain / CDN**: `https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev` (or custom subdomain `https://pub-r2.nagrik.news`)

### 3.2 Directory Hierarchy
```text
nagrik-media/
├── media/
│   ├── videos/          # Raw & processed 60fps vertical reels (.mp4, .webm)
│   ├── thumbnails/      # Video cover stills & preview images (.jpg, .webp)
│   ├── images/          # Article banner photos & eyewitness photos (.jpg, .png)
│   ├── avatars/         # Journalist channel logos & user profile pictures
│   └── documents/       # Creator agreements & verification IDs (.pdf)
```

### 3.3 Presigned PUT Flow Specification
1. **Edge Function Signature**:
   ```typescript
   POST /functions/v1/get-upload-url
   Headers: {
     "Authorization": "Bearer <supabase_jwt>",
     "apikey": "<supabase_anon_key>"
   }
   Body: {
     "folder": "videos" | "thumbnails" | "images" | "avatars",
     "mimeType": "video/mp4" | "image/jpeg",
     "fileExtension": "mp4" | "jpg"
   }
   ```
2. **Response**:
   ```json
   {
     "success": true,
     "uploadUrl": "https://<account-id>.r2.cloudflarestorage.com/nagrik-media/media/videos/<hash>.mp4?X-Amz-Signature=...",
     "mediaUrl": "https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev/media/videos/<hash>.mp4",
     "publicUrl": "https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev/media/videos/<hash>.mp4",
     "key": "media/videos/<hash>.mp4"
   }
   ```
3. **Browser Execution**:
   - The browser initiates an HTTP `PUT` request with binary file stream directly to `uploadUrl`.
   - Supports files up to **2 GB** with native `xhr.upload.onprogress` feedback.
   - Upon HTTP 200 confirmation, the client inserts the content metadata into PostgreSQL referencing `publicUrl`.

---

## 4. PostGIS Proximity Radar Querying

For consumer feed queries near a user's physical GPS location:

```sql
SELECT c.id, c.title, c.media_url, c.thumbnail_url, c.type,
       ST_Distance(c.coordinates_geo, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) AS distance_meters
FROM contents c
WHERE c.moderation_status = 'APPROVED'
  AND c.publication_status = 'PUBLISHED'
  AND c.coordinates_geo IS NOT NULL
  AND ST_DWithin(c.coordinates_geo, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, 5000) -- 5km radius
ORDER BY c.published_at DESC
LIMIT 20;
```

---

## 5. Security & Vault Configuration

### 5.1 Environment Variables Matrix

| Variable | Target Service | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Web & Mobile | Public | Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web & Mobile | Public | Supabase anonymous API key for RLS queries |
| `R2_ACCOUNT_ID` | Supabase Edge Functions | Secret | Cloudflare account identifier |
| `R2_ACCESS_KEY_ID` | Supabase Edge Functions | Secret | S3-compatible R2 token ID |
| `R2_SECRET_ACCESS_KEY` | Supabase Edge Functions | Secret | S3-compatible R2 secret key |
| `R2_BUCKET_NAME` | Supabase Edge Functions | Secret | Target R2 storage bucket (`nagrik-media`) |
| `R2_PUBLIC_BASE_URL` | Web & Edge Functions | Public | CDN delivery URL for R2 assets |
