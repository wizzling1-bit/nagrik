# 📈 Nagrik — Production Capacity Plan & Sizing Model

**Target Baseline**: 50,000+ Daily Active Users (DAU) | 1,000,000+ Registered Devices/Users

---

## 1. Workload & Traffic Modeling

### 1.1 User Behavior Assumptions

| Metric | Consumer Mobile App | Publisher Web Studio | Admin Operations |
|---|---|---|---|
| **Daily Active Users (DAU)** | 50,000 | 250 verified creators | 5 staff / moderators |
| **Sessions per User / Day** | 3.5 sessions | 1.8 sessions | Continuous shift |
| **Session Duration** | 5.2 minutes | 18 minutes | — |
| **Feed Fetches / Session** | 4 pages (15 items/page) | — | — |
| **Videos Watched / Session** | 6 videos (15-60s each) | — | — |
| **Searches / Day** | 0.8 searches / DAU | — | — |
| **Daily Video Uploads** | — | 120 videos / day | — |
| **Moderation Actions / Day** | — | — | 120 review actions |

### 1.2 Total Daily Volume

* **Total Daily Sessions**: $50,000 \times 3.5 = 175,000$ sessions/day
* **Total Feed API Requests**: $175,000 \times 4 = 700,000$ requests/day
* **Total Video View Events**: $175,000 \times 6 = 1,050,000$ view events/day
* **Total Hyperlocal Searches**: $50,000 \times 0.8 = 40,000$ searches/day
* **Total Administrative LGD Lookups**: ~35,000 lookups/day (heavily cached in-app)
* **Total Read Transactions / Day**: ~1,800,000 requests/day
* **Total Write Transactions / Day**: ~1,100,000 mutations/day (views, likes, saves)

---

## 2. Peak Request-Per-Second (RPS) Analysis

Traffic in regional Indian markets exhibits pronounced diurnal peaks:
* **Morning Peak**: 07:30 AM – 09:30 AM IST (Civic alerts, local news)
* **Evening Peak**: 07:00 PM – 10:30 PM IST (Reels, video consumption)
* **Peak Hour Ratio**: 18% of all daily traffic occurs in the peak 2-hour window.
* **Peak Factor**: 2.5x the average hourly traffic.

$$\text{Peak RPS} = \frac{\text{Daily Volume} \times 0.18}{2 \times 3600} \times \text{Burst Factor (1.4)}$$

| Endpoint / Operation | Daily Calls | Peak Avg RPS | Burst Peak RPS | Latency Target |
|---|---|---|---|---|
| **Personalized Feed (`/rpc/get_personalized_feed`)** | 700,000 | 24.5 req/s | **45.0 req/s** | P95 < 200ms |
| **View Tracking (`/rpc/track_video_view`)** | 1,050,000 | 36.8 req/s | **68.0 req/s** | P95 < 120ms |
| **Trigram Search (`/rpc/search_content`)** | 40,000 | 1.4 req/s | **4.2 req/s** | P95 < 150ms |
| **Engagement (`toggle_content_like/save`)** | 200,000 | 7.0 req/s | **14.0 req/s** | P95 < 100ms |
| **Static LGD Hierarchy (`/rest/v1/lgd_*`)** | 35,000 | 1.2 req/s | **2.5 req/s** | P95 < 50ms |
| **Combined Database RPS** | **2,025,000** | **70.9 req/s** | **133.7 req/s** | **P95 < 180ms** |

---

## 3. Database Sizing & Connection Pooling

### 3.1 Supabase Compute Tier

* **PostgreSQL Version**: 17.6 (`ap-south-1`, Mumbai region for sub-25ms latency to Indian end-users).
* **Baseline Instance**: Supabase Pro Tier (Medium Compute Add-on: 2 vCPU, 4 GB RAM, 1,000 IOPS burstable to 3,000).
* **Connection Pooler**: **Supavisor** in **Transaction Mode** on port 6543.
  * Direct PostgreSQL max connections: 100
  * Supavisor virtual pool limit: 1,500 client connections
  * Client idle timeout: 30 seconds
  * Statement timeout: 8,000 ms (guards against runaway geospatial queries)

### 3.2 Memory & Cache Allocation

* `shared_buffers`: 1,024 MB (25% of RAM)
* `effective_cache_size`: 3,072 MB (75% of RAM)
* `work_mem`: 16 MB
* `maintenance_work_mem`: 256 MB
* All active indexes (`idx_contents_feed`, `idx_contents_title_trgm`, `idx_contents_coordinates`, `idx_video_views_lookup`) total ~180 MB, fitting 100% in RAM.

### 3.3 Storage Growth Projections

| Table / Entity | Row Size | Daily New Rows | Monthly Growth | 1-Year Footprint |
|---|---|---|---|---|
| `contents` (metadata) | ~1.5 KB | 120 rows | 5.4 MB | ~65 MB |
| `video_views` | ~120 bytes | 350,000 rows | 1.26 GB | ~15.1 GB |
| `content_likes` & `saves` | ~80 bytes | 25,000 rows | 60 MB | ~720 MB |
| `audit_logs` | ~250 bytes | 300 rows | 2.25 MB | ~27 MB |
| **Total Relational Growth** | — | — | **~1.33 GB/mo** | **~16.0 GB/yr** |

*Note: Automated partition pruning can be scheduled for `video_views` older than 90 days after aggregated analytics are rolled up into `creator_daily_analytics`.*

---

## 4. Media Storage & Streaming (Cloudflare R2 + CDN)

### 4.1 Storage Ingestion Model

* **Daily Video Uploads**: 120 videos
* **Average Video Bitrate**: 2.5 Mbps (1080x1920 portrait, H.264 / AAC)
* **Average Video Duration**: 42 seconds
* **Average File Size per Video**: 13.1 MB
* **Daily Ingestion**: $120 \times 13.1\text{ MB} = 1.57\text{ GB/day}$ (~47.1 GB/month)
* **Thumbnails & Avatars**: ~150 MB/day (~4.5 GB/month)
* **1-Year R2 Storage Total**: ~620 GB

### 4.2 Streaming Bandwidth Calculations

* **Daily Video Plays**: 1,050,000 plays
* **Average Consumed Play Time**: 18 seconds (approx. 5.6 MB per play)
* **Daily Egress Volume**: $1,050,000 \times 5.6\text{ MB} = 5,880\text{ GB/day} \approx 5.74\text{ TB/day}$
* **Monthly Egress Volume**: $\approx 172.2\text{ TB/month}$
* **Peak Streaming Bandwidth**:
  $$\frac{5.74\text{ TB} \times 0.18}{2 \times 3600} = \frac{1,033,200\text{ MB}}{7,200\text{ s}} \approx 143.5\text{ MB/s} = \mathbf{1.15\text{ Gbps}}$$

### 4.3 Cost Advantage of Cloudflare R2

| Provider | Monthly Egress (172 TB) | Storage (620 GB) | Total Cost / Month |
|---|---|---|---|
| **AWS S3** | $0.09/GB = **$15,480.00** | $0.023/GB = $14.26 | **$15,494.26** |
| **Supabase Storage** | Over quota bandwidth = **$14,800.00** | $0.021/GB = $13.02 | **$14,813.02** |
| **Cloudflare R2** | **$0.00 (Zero Egress)** | $0.015/GB = **$9.30** | **$9.30** |

*Cloudflare R2 provides a 99.9% cost reduction on high-bandwidth video delivery.*

---

## 5. AdMob Monetization & Financial Projection

### 5.1 Ad Inventory Sizing

* **Feed Native Ads**: 1 ad unit every 4 news/video cards (`ad_feed_frequency = 4`).
  * 4 feed pages per session $\times$ 15 cards = 60 items $\rightarrow$ 15 native ad impressions per session.
  * $175,000\text{ sessions} \times 15 = 2,625,000\text{ daily ad requests}$.
  * With 70% fill rate and 95% viewability: **1,745,000 daily native impressions**.
* **Rewarded / Interstitial Reel Ads**: 1 interstitial every 8 video reels.
  * $1,050,000 \div 8 = 131,250$ interstitial impressions / day.

### 5.2 Revenue vs Creator Escrow

* **Estimated Blended Indian eCPM**: $1.20 (Tier 2/3 Indian news & video inventory).
* **Gross Daily Ad Revenue**:
  $$\frac{(1,745,000 + 131,250)}{1,000} \times \$1.20 = \$2,251.50\text{ / day} \approx \mathbf{\$67,545\text{ / month}}$$
* **Creator Payout Liabilities**:
  * 1,050,000 daily views $\times$ 40% authenticated eligible view rate = 420,000 eligible views.
  * Earning rate: $1.00 per 1,000 eligible views.
  * Daily Creator Earnings: $420 \times \$1.00 = \$420.00\text{ / day} \approx \$12,600\text{ / month}$.
* **Net Platform Gross Margin**: **~81.3%** ($\$54,945\text{ / month}$ net after creator payouts).

---

## 6. Failure Recovery & Circuit Breakers

1. **Database Degradation / Spike Handling**:
   * Mobile client implements 2-stage exponential backoff with jitter (400ms base, 2 retries max).
   * In-memory LGD hierarchy cache eliminates 100% of redundant administrative queries.
   * If PostGIS radius search exceeds 2,500ms, query degrades gracefully to district-level B-tree index lookup.
2. **Cloudflare CDN Fallback**:
   * Client video player dynamically falls back from `https://media.nagrik.news` custom domain to direct R2 public bucket URL `https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev`.
3. **Monetization Escrow Safety**:
   * Creator payout requests atomically isolate available balance via row-level `FOR UPDATE` lock.
   * Double-spend is mathematically impossible under concurrent clicks.
