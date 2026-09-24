# 🇮🇳 Nagrik (नागरिक) — Hyperlocal Newsroom & Creator Studio

> Citizen-powered hyperlocal journalism portal and creator economy platform for India.

---

## ⚡ Overview

Nagrik Web is built with **Next.js 16 (Turbopack)**, **React 18**, and **Tailwind CSS**. It provides:
- **Public News Portal**: Real-time hyperlocal wire, breaking civic news, audio/video playback, and bilingual support (Hindi / English).
- **Creator Studio**: Hyperlocal contributor upload suite with LGD-coded geofencing (State, District, Sub-district, Ward/Village, PIN code), direct Cloudflare R2 media upload with cryptographic signature, and real-time revenue analytics.
- **Admin Command Portal**: Editorial approval workflow, automated rule-based moderation, geofence audit, category management, and automated UPI/IMPS creator payouts.
- **Civic Syndication**: Dynamic RSS Feed (`/feed.xml`), App Router dynamic Sitemap (`/sitemap.xml`), and Search Engine Robots (`/robots.txt`).

---

## 🚀 Performance & Security Optimizations

- **Next.js 16 Turbopack compilation**: Under 7s build time with strict TypeScript verification.
- **Modern Media Delivery**: Automatic modern image format negotiation (`image/avif`, `image/webp`).
- **Gzip & Brotli Compression**: Enabled at server level for zero-latency static asset hydration.
- **Hardened HTTP Headers**: Strict Content-Type sniffing prevention (`nosniff`), Frame denial (`SAMEORIGIN`), Strict referrer policy, and Permissions Policy controls.
- **Direct Cloudflare R2 Upload**: Browser-to-CDN signed upload architecture eliminates backend proxy bottleneck.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Media CDN & Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/)
- **Data Visualization**: [Recharts](https://recharts.org/)

---

## 🌐 Deploy to Vercel

### Step 1: Import Repository
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select the `NAGRIK-WEBSITE` repository from your GitHub account.

### Step 2: Configure Environment Variables
Add the following variables in the **Environment Variables** section:

| Variable Name | Description | Example / Production Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain of the site | `https://nagrik.news` or your Vercel URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://sbcvvcqsmgihhzuifafq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | `eyJhbGciOiJIUzI1NiIsIn...` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Client Publishable Key | `sb_publishable_...` |
| `NEXT_PUBLIC_R2_PUBLIC_BASE_URL` | Cloudflare R2 Public CDN Base URL | `https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev` |

### Step 3: Deploy
Click **Deploy**. Next.js will automatically build and distribute across Vercel's global edge network.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build validation
npm run build

# Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to view the portal.
