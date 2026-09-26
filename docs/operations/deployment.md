# Nagrik Production Deployment & Reproducibility Guide

## 1. Overview

This document specifies the exact steps required to deploy and maintain the Nagrik production stack across Supabase, Cloudflare, Next.js Web, and Flutter Android/iOS.

---

## 2. Infrastructure Configuration Matrix

| Component | Provider | Configuration / Tier | Region / Zone |
| :--- | :--- | :--- | :--- |
| Database | Supabase PostgreSQL 17.6 | Pro Plan (8 GB RAM, 2 vCPU, 50 GB NVMe) | `ap-south-1` (Mumbai) |
| Edge Functions | Supabase Deno Runtime | Distributed Serverless Edge | Global Edge |
| Media Storage | Cloudflare R2 | S3-Compatible Object Store | Automatic Tier |
| Media Delivery | Cloudflare CDN | Tiered Cache, WAF, SSL | 300+ Edge Locations |
| Web Portal | Vercel / Next.js 16 | Node.js Serverless Edge | `bom1` (Mumbai) |
| Mobile Consumer | Google Play Store / App Store | Native Release Bundle (AAB / IPA) | India (Geo-restricted) |

---

## 3. Database Deployment & Migration Workflow

Migrations are numbered sequentially in `supabase/migrations/`:
- `001_initial_schema.sql`: Core tables, PostGIS extensions, LGD hierarchy.
- `002_add_payout_history.sql`: Payout transaction ledger.
- `003_add_app_branding.sql`: Platform settings and legal URLs.
- `004_create_missing_tables.sql`: Advertisements and audit logs.
- `005_fix_rls_and_payouts.sql`: Base security policies.
- `006_system_hardening.sql`: Foreign keys and view limits.
- `007_admin_analytics_rpc.sql`: Performance RPCs.
- `008_security_hardening_and_indexes.sql`: Security barrier views, FK indexes, RLS locks.
- `009_optimized_feed_and_search.sql`: Trigram GIN indexes, cursor pagination, admin aggregate RPC.
- `010_hardening_fixes.sql`: Search path isolation, mobile monetization dual identity.

### Running Migrations via Supabase CLI
```bash
# Link local project
supabase link --project-ref sbcvvcqsmgihhzuifafq

# Push pending migrations to production
supabase db push

# Verify migration integrity
node scripts/security-audit-verify.mjs
```

---

## 4. Supabase Edge Functions Deployment

Deploy edge functions with secret binding:
```bash
# Set production secrets
supabase secrets set \
  CLOUDFLARE_ACCOUNT_ID="2377a16d493ea0b8e3ae344fcb089d4f" \
  R2_ACCESS_KEY_ID="<R2_ACCESS_KEY>" \
  R2_SECRET_ACCESS_KEY="<R2_SECRET_KEY>" \
  R2_BUCKET_NAME="nagrik-media" \
  R2_PUBLIC_DOMAIN="https://media.nagrik.app"

# Deploy functions
supabase functions deploy get-upload-url --no-verify-jwt=false
supabase functions deploy feed --no-verify-jwt=true
supabase functions deploy track-view --no-verify-jwt=true
```

---

## 5. Web Application Deployment (Next.js 16)

The Next.js 16 web application hosts both the Public Reader, Publisher Studio, and Admin Portal.
```bash
cd apps/web

# Verify TypeScript typecheck
npx tsc --noEmit

# Run production build
npm run build
```

### Required Production Environment Variables (Vercel)
```ini
NEXT_PUBLIC_SUPABASE_URL=https://sbcvvcqsmgihhzuifafq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
NEXT_PUBLIC_R2_PUBLIC_URL=https://media.nagrik.app
NEXT_PUBLIC_APP_ENV=production
```

---

## 6. Flutter Mobile App Release Build

### Android Production Build (AAB)
```bash
cd apps/mobile

# Run test suite
flutter test

# Build production App Bundle with obfuscation and tree-shaking
flutter build appbundle --release \
  --obfuscate \
  --split-debug-info=build/app/outputs/symbols \
  --dart-define=APP_ENV=production \
  --dart-define=SUPABASE_URL=https://sbcvvcqsmgihhzuifafq.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=<ANON_KEY> \
  --dart-define=R2_CDN_URL=https://media.nagrik.app
```
