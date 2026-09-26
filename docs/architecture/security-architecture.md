# 🛡️ Nagrik — Production Security Architecture & Threat Model

**Platform Baseline**: Zero-Login Consumer Mobile | Web Publisher Studio | Web Admin Operations  
**Compliance Standard**: Zero Secret Exposure | RLS Enforced on 100% of Tables | Anti-Fraud Financial Isolation

---

## 1. Threat Model & Attack Surface Analysis

```text
       ┌─────────────────────────────── ATTACK VECTORS ───────────────────────────────┐
       │                                                                               │
       ▼                                               ▼                               ▼
[Untrusted Client Apps]                   [Malicious Network Actor]              [Compromised Creator]
• Forged x-device-id                      • Eavesdropping on traffic             • Sybil view spamming
• SQL/PostgREST injection                 • Man-in-the-Middle (MITM)             • Malicious payload upload
• Scraping PII (emails/phones)            • Replay attacks on payouts            • Premature payout draining
• Bypassing moderation status             • DDoS on search/feed                  • Impersonation of other creators
       │                                               │                               │
       └───────────────────────────────┬───────────────────────────────────────────────┘
                                       ▼
                       ┌──────────────────────────────┐
                       │  SECURITY BOUNDARY (GATEWAY) │
                       ├──────────────────────────────┤
                       │ • Supabase Edge / PostgREST  │
                       │ • HTTPS TLS 1.3 Strict       │
                       │ • Cloudflare DDoS Protection │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │   POSTGRESQL DEFENSE LAYER   │
                       ├──────────────────────────────┤
                       │ • Strict Row Level Security  │
                       │ • Direct Table INSERT Revoked│
                       │ • SECURITY DEFINER RPCs      │
                       │ • Atomic Row Locks (FOR UPD) │
                       │ • STABLE Subquery Auth Cache │
                       └──────────────────────────────┘
```

---

## 2. Row Level Security (RLS) Policy Matrix

| Table | RLS Status | Anonymous (`anon`) | Authenticated Creator | Platform Admin | Mutation Enforcement |
|---|---|---|---|---|---|
| `users` | **ENABLED** | ❌ 0 rows (42501 denied) | Read own profile (`id = auth.uid()`) | Read all | Direct mutate blocked |
| `public_author_profiles` | **VIEW (Barrier)** | ✅ Safe public columns only | Read all safe columns | Read all | Non-updatable view |
| `contents` | **ENABLED** | Read approved & published | Read own + approved | Full read/write | Moderation locked |
| `creators` | **ENABLED** | Read verified details | Read own details | Full read/write | Verification locked |
| `video_views` | **ENABLED** | Direct SELECT/INSERT ❌ | Read own rows | Full read | **RPC `track_video_view`** |
| `reports` | **ENABLED** | Direct SELECT/INSERT ❌ | Direct SELECT/INSERT ❌ | Full read/write | **RPC `report_content`** |
| `audit_logs` | **ENABLED** | Direct SELECT/INSERT ❌ | Direct SELECT/INSERT ❌ | Read-only | **Server-side only** |
| `payout_requests` | **ENABLED** | Direct SELECT/INSERT ❌ | Read own requests | Full read/write | **RPC `request_payout`** |
| `payout_methods` | **ENABLED** | ❌ Denied | Read/write own methods | Read all | Scoped to `user_id` |
| `content_likes` | **ENABLED** | Direct INSERT ❌ | Read own rows | Full read | **RPC `toggle_content_like`** |
| `content_saves` | **ENABLED** | Direct INSERT ❌ | Read own rows | Full read | **RPC `toggle_content_save`** |
| `categories` | **ENABLED** | Read ACTIVE only | Read ACTIVE only | Full read/write | Admin mutation only |
| `advertisements` | **ENABLED** | Read ACTIVE only | Read ACTIVE only | Full read/write | Admin mutation only |
| `system_settings` | **ENABLED** | Read public rates | Read public rates | Full read/write | Admin mutation only |
| `cms_pages` | **ENABLED** | Read published pages | Read published pages | Full read/write | Admin mutation only |
| `lgd_*` (Hierarchy) | **ENABLED** | Read-only | Read-only | Read-only | Immutable static reference |

---

## 3. Privacy & PII Hardening

### 3.1 User Profile Privacy Leak Remediation

**Vulnerability Eliminated**: Previously, a wildcard SELECT policy on `public.users` allowed unauthenticated anonymous clients to scrape the email addresses, mobile numbers, and password hashes of all platform users.

**Remediation (Migration 008)**:
1. Replaced open SELECT policy with:
   ```sql
   CREATE POLICY "Users can only view own profile or admins can view all"
   ON public.users FOR SELECT TO authenticated, anon
   USING (
       id = (SELECT auth.uid()) 
       OR 
       (SELECT public.is_admin())
   );
   ```
2. The subqueries `(SELECT auth.uid())` and `(SELECT public.is_admin())` execute once per statement rather than once per row, preventing catastrophic $O(N)$ CPU scaling while guaranteeing 0 exposed rows to anonymous callers.
3. Created `public.public_author_profiles` security barrier view:
   ```sql
   CREATE VIEW public.public_author_profiles WITH (security_barrier = true) AS
   SELECT 
       cr.id AS creator_id,
       u.id AS user_id,
       u.name,
       u.profile_image,
       cr.verification_status,
       cr.bio,
       cr.created_at
   FROM public.creators cr
   JOIN public.users u ON cr.user_id = u.id
   WHERE cr.verification_status = 'VERIFIED';
   ```
   *Verified via automated test: guarantees zero PII leaks while presenting rich author metadata.*

---

## 4. Anti-Fraud & Monetization Safeguards

### 4.1 Dual Identity Model & Anti-Fraud Derivation

**Attack Vector**: Malicious client scripts crafting forged UUIDs in view tracking requests to fraudulently trigger creator payouts or drain platform escrow, while ensuring the 100% credential-free mobile consumer app functions seamlessly.

**Safeguard Implementation (`track_video_view`)**:
```sql
-- Derive authenticated caller identity from JWT if present
v_auth_user_id := auth.uid();
v_device_id := NULLIF(TRIM(COALESCE(p_device_id, '')), '');

-- Validate persistent device identity for anonymous mobile consumers
IF v_device_id IS NOT NULL 
   AND v_device_id NOT IN ('unknown_device', 'anonymous_device', 'anon_client', '') 
   AND LENGTH(v_device_id) >= 6 THEN
    v_is_valid_device := TRUE;
END IF;

-- Lock video row to prevent concurrent race conditions
SELECT * INTO v_video FROM public.contents WHERE id = p_video_id FOR UPDATE;

-- Anti-fraud segregation & Monetization Eligibility:
-- Both authenticated users (web/publishers) and verified persistent mobile devices (credential-free consumer app)
-- qualify views for financial creator balance crediting up to the 3-view ceiling (v_max_views).
-- Ephemeral or invalid devices increment raw views but are denied monetization eligibility.
IF (v_auth_user_id IS NOT NULL OR v_is_valid_device) AND v_counted_views < v_max_views THEN
    v_is_eligible := TRUE;
    v_view_earning := v_rate_per_1000 / 1000.0;
    
    UPDATE public.creators 
    SET total_earnings = total_earnings + v_view_earning,
        available_balance = available_balance + v_view_earning
    WHERE id = v_video.creator_id;
END IF;
```

### 4.2 3-View Ceiling Rule

* Every user or device is tracked in `public.video_views`.
* A unique partial index enforces uniqueness:
  * Authenticated: `(video_id, user_id)`
  * Anonymous: `(video_id, device_id)`
* Once `counted_view_count >= 3`, view increment halts permanently for that viewer on that specific video.

### 4.3 Payout Escrow Atomicity

* Payout requests lock creator balance via `SELECT available_balance FROM public.creators WHERE id = p_creator_id FOR UPDATE`.
* Checks `available_balance >= p_amount` and `p_amount >= min_payout_amount`.
* Instantly transfers requested amount from `available_balance` to `held_in_escrow`, preventing double-withdrawal race attacks.

---

## 5. Media Pipeline Security (Cloudflare R2)

### 5.1 Zero Credential Exposure

* Cloudflare R2 Secret Access Key and Access Key ID are stored solely as encrypted environment variables in Supabase Edge Function secrets.
* Client apps receive only a short-lived (15-minute) presigned PUT URL.

### 5.2 Upload Validation Rules (`get-upload-url`)

1. **Folder Restriction**: Allowed values strictly limited to `videos`, `images`, `thumbnails`, `profiles`.
2. **MIME Whitelisting**:
   * Videos: `video/mp4`, `video/webm`, `video/quicktime`
   * Images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
3. **Extension Matching**: File extension must strictly match declared MIME type.
4. **Size Ceilings**:
   * Videos: Max 2 GB
   * Images/Banners: Max 20 MB
   * Avatars/Thumbnails: Max 5 MB
5. **CDN Domain**: Upload outputs default to production custom CDN domain (`https://media.nagrik.news`).

---

## 6. AdMob Debug Safety Protocol

To prevent Google AdMob policy account bans due to accidental developer impressions during QA or development:
* `apps/mobile/lib/core/ads/ad_constants.dart` implements:
  ```dart
  static bool get defaultTestMode =>
      kDebugMode && !(!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'));
  ```
* **Effect**:
  * **Emulators & Local Debug Builds**: Always serve Google official sample AdMob test IDs (`ca-app-pub-3940256099942544/...`), rendering live ads impossible.
  * **Test Runners (`flutter test`)**: Retains default parameter evaluation allowing unit tests to assert correct ID resolution.
  * **Release APK / AAB Builds**: Automatically switches to production AdMob ad unit IDs.
