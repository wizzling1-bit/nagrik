# Nagrik Incident Response & Runbook Guide

## 1. Overview

This document establishes the Standard Operating Procedures (SOPs) for responding to production outages, performance degradation, security breaches, and media pipeline failures on the Nagrik platform.

---

## 2. Incident Classification & Severity Matrix

| Severity | Definition | Target MTTA | Target MTTR | Escalation Lead |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Entire app down, database connection exhaustion, data breach, zero feeds loading. | $< 10\text{ min}$ | $< 60\text{ min}$ | Principal Engineer / CTO |
| **SEV-2 (High)** | Video playback failing globally, upload pipeline failing, payouts blocked. | $< 20\text{ min}$ | $< 2\text{ hours}$ | Lead Platform Engineer |
| **SEV-3 (Medium)** | Specific regional feeds slow, search degradation, background metrics delay. | $< 1\text{ hour}$ | $< 6\text{ hours}$ | On-call Engineer |
| **SEV-4 (Low)** | Minor UI cosmetic glitch, typo in error message, non-impacting log anomaly. | $< 24\text{ hours}$ | Next Sprint | Frontend Team |

---

## 3. High-Priority Runbooks

### 3.1 Runbook: PostgreSQL Connection Pool Saturation
- **Symptom**: Cloudflare/Edge Functions returning 500/504 errors; Supabase dashboard shows connections $> 95\%$.
- **Action Steps**:
  1. Inspect running queries in Supabase SQL editor:
     ```sql
     SELECT pid, now() - query_start AS duration, query, state 
     FROM pg_stat_activity 
     WHERE state != 'idle' 
     ORDER BY duration DESC LIMIT 10;
     ```
  2. Terminate rogue blocking queries:
     ```sql
     SELECT pg_terminate_backend(pid);
     ```
  3. Ensure connection pooling mode is set to **Transaction** mode in Supavisor (Port 6543).

### 3.2 Runbook: R2 Presigned Upload Failures
- **Symptom**: Publishers encounter "Upload failed" in Publisher Studio.
- **Action Steps**:
  1. Check Supabase Edge Function logs for `get-upload-url`:
     ```bash
     supabase functions logs get-upload-url
     ```
  2. Verify Cloudflare R2 API Token validity.
  3. Verify R2 bucket CORS configuration allows PUT from `https://nagrik.app` and `https://*.vercel.app`.

### 3.3 Runbook: Viral Breaking Story / Feed Stampede
- **Symptom**: Single breaking news item receives $> 10,000$ RPS; database read load spikes.
- **Action Steps**:
  1. Verify Cloudflare Cache Rule for `/functions/v1/feed` is active with `s-maxage=60`.
  2. Edge Functions return cached payload from Cloudflare Edge without invoking PostgreSQL.
  3. Temporarily increase `s-maxage` to 120 seconds in `supabase/functions/feed/index.ts` if database CPU remains $> 70\%$.

### 3.4 Runbook: AdMob Policy Warning / Invalid Traffic Spike
- **Symptom**: Google AdMob console raises an invalid traffic alert.
- **Action Steps**:
  1. Check AdMob placement frequencies in `apps/mobile/lib/core/ads/ad_placement_policy.dart`.
  2. Enforce minimum interval between interstitial ads (minimum 180 seconds).
  3. Verify that native ads in news list maintain explicit "Ad" / "Sponsored" badges and are never overlaid on navigation buttons or video controls.
