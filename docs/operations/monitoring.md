# Nagrik Observability, Logging & Alerting Specification

## 1. Overview

Production monitoring for Nagrik is structured across four layers:
1. **Edge & API Gateway**: Cloudflare Web Analytics, WAF metrics, Edge Function execution logs.
2. **Database Engine**: Supabase Supavisor connection pool, PostgreSQL slow query logs (`pg_stat_statements`), disk I/O.
3. **Application Health**: Flutter crash analytics, Next.js error boundary captures.
4. **Business Metrics**: Publisher upload throughput, daily active engagement, AdMob impression safety.

---

## 2. Structured Log Schema

All services and Edge Functions emit JSON structured logs matching the following standard:

```json
{
  "timestamp": "2026-09-24T18:30:00.123Z",
  "level": "INFO",
  "service": "edge-function-feed",
  "requestId": "req_8f12a0e49",
  "client": {
    "deviceId": "dev_392fa0",
    "ipHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "country": "IN",
    "appVersion": "1.0.0"
  },
  "action": "get_personalized_feed",
  "parameters": {
    "districtCode": 142,
    "limit": 20
  },
  "durationMs": 42.6,
  "statusCode": 200,
  "resultCount": 20
}
```

> [!CAUTION]
> Never log passwords, API service keys, user phone numbers, email addresses, or unhashed IP addresses.

---

## 3. Key Performance Indicators (KPIs) & Target SLAs

| Indicator | Target SLA (p50) | Target SLA (p95) | Target SLA (p99) | Critical Alert Threshold |
| :--- | :--- | :--- | :--- | :--- |
| **Home Feed RPC** | $< 120\text{ ms}$ | $< 350\text{ ms}$ | $< 700\text{ ms}$ | $> 1,200\text{ ms}$ for 5 min |
| **Search Query (Trigram)** | $< 80\text{ ms}$ | $< 250\text{ ms}$ | $< 500\text{ ms}$ | $> 900\text{ ms}$ for 5 min |
| **Presigned URL Generation** | $< 50\text{ ms}$ | $< 180\text{ ms}$ | $< 350\text{ ms}$ | $> 600\text{ ms}$ for 5 min |
| **Video First-Frame TTFB** | $< 150\text{ ms}$ | $< 400\text{ ms}$ | $< 800\text{ ms}$ | $> 1,500\text{ ms}$ |
| **PostgreSQL Active Connections**| $< 40$ | $< 85$ | $< 120$ | $> 160$ (Saturation alert) |
| **PostgreSQL CPU Utilization** | $< 30\%$ | $< 65\%$ | $< 80\%$ | $> 85\%$ sustained 3 min |
| **HTTP 5xx Error Rate** | $< 0.01\%$ | $< 0.05\%$ | $< 0.1\%$ | $> 1.0\%$ across all routes |

---

## 4. Production Alerting Rules

### 4.1 PostgreSQL Connection Exhaustion
- **Condition**: Supavisor pool utilization $> 80\%$ or PostgreSQL active connections $> 150$.
- **Severity**: P1 - High.
- **Action**: Auto-scale pool or terminate idle transactions (`idle_in_transaction_session_timeout = '30s'`).

### 4.2 Elevated Feed Query Latency
- **Condition**: `get_personalized_feed` p95 latency $> 1,000\text{ ms}$ for $> 3$ consecutive evaluation periods.
- **Severity**: P2 - Medium.
- **Action**: Check `pg_stat_statements` for missing indexes or table bloat; trigger `VACUUM ANALYZE contents;`.

### 4.3 View Abuse / Fraud Spike
- **Condition**: Single `device_id` attempts $> 100$ view events within 60 seconds.
- **Severity**: P2 - Medium.
- **Action**: Trigger automated IP rate limiting at Cloudflare WAF; reject requests with HTTP 429.

### 4.4 Cloudflare R2 Upload Failures
- **Condition**: `get-upload-url` error rate $> 3\%$.
- **Severity**: P1 - High.
- **Action**: Inspect Cloudflare API token status and R2 bucket status.
