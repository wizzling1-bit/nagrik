# नागरिक (Naagrik) — Hyperlocal Civic Journalism Platform

> **India's Premier Hyperlocal Ground Journalism & Short-Video Civic Ecosystem**  
> Verified local news, 60fps vertical eyewitness byte streams, GPS 5km ward proximity radar, and transparent creator monetization.

---

## 🏛️ Platform Architecture

The repository is organized as a unified production monorepo:

```
naagrik-platform/
├── apps/
│   ├── mobile/             # Consumer Mobile App (Flutter 3.x, Riverpod)
│   │                       # Strictly 100% Zero-Auth Consumer Discovery App
│   ├── web/                # Web Portal (Next.js 14 App Router, Tailwind CSS)
│   │                       # SSR News Pages, Publisher Studio, Admin Console
│   └── api/                # Unified Backend Gateway (Node.js, Express, TypeScript)
│                           # Supabase PostgreSQL, Cloudflare R2, JWT/RBAC
├── packages/
│   └── shared-types/       # Shared TypeScript DTOs, Enums & Zod Schemas
├── supabase/
│   └── schema.sql          # Supabase PostgreSQL Schema & Row Level Security (RLS)
├── docker-compose.yml      # Multi-container local/staging orchestration
└── package.json            # Monorepo orchestration scripts
```

---

## 🚀 Role Boundaries & Security Model

| Platform Component | Target Audience | Authentication | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **`apps/mobile` (Flutter)** | Citizens / News Consumers | **Zero-Auth (None)** | Browse local news, watch 60fps video reels, 5km ward radar, bookmark stories, submit community flags anonymously via `x-device-id`. No login or publisher tools. |
| **`apps/web` (Next.js 14)** | Public Readers / Journalists / Admins | **JWT RBAC** (for Studio & Admin) | SEO-optimized SSR news articles (`/news/[id]`), interactive 3D landing simulator, Publisher Studio (`/creator`) with 2-step presigned Cloudflare R2 uploads, and Admin Moderation Console (`/admin`). |
| **`apps/api` (Express)** | Mobile App & Web Portal | **Hybrid** (Public + JWT RBAC) | Credential-free feed/search APIs, 3-view monetization ceiling rule, video Range/206 partial streaming, Cloudflare R2 presigned upload authorization, and Supabase integration. |

---

## 🛠️ Quickstart & Development

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Flutter**: `v3.19+` (for mobile development)

### 1. Installation
Install all monorepo dependencies in a single step:
```bash
npm install
```

### 2. Environment Configuration
Copy sample environment files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Run Development Servers
Run both Backend API and Web Portal simultaneously:
```bash
npm run dev
# Backend API: http://localhost:5000 (OpenAPI Docs at http://localhost:5000/docs)
# Next.js Web: http://localhost:3000
```

To run individual services:
```bash
npm run dev:backend   # Starts Express API
npm run dev:frontend  # Starts Next.js Web Portal
```

### 4. Run Mobile App
```bash
cd apps/mobile
flutter run
```

---

## 🧪 Testing & Validation

Run all test suites across the monorepo:
```bash
# Run backend API test suites (11/11 passing across 5 suites)
npm run test:api

# Run mobile test suites (214/214 passing)
npm run test:mobile

# Run Flutter static analysis (0 issues)
npm run analyze:mobile

# Run all tests
npm run test:all
```

---

## 📦 Production Build & Deployment

### Build All Monorepo Workspaces
```bash
npm run build
```

### Docker Deployment
```bash
docker-compose up --build -d
```

### Cloud Deployments
- **Web Portal (`apps/web`)**: Ready for **Vercel** (configured with `@naagrik/web` and `nextjs` preset).
- **Backend API (`apps/api`)**: Ready for **Render**, **Railway**, or **AWS ECS** via `apps/api/Dockerfile`.
- **Database**: Managed **Supabase PostgreSQL** (`supabase/schema.sql`).
- **Media Storage**: **Cloudflare R2** with direct S3-compatible presigned upload URLs.
