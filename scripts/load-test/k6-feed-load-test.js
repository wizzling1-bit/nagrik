import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const feedDuration = new Trend('feed_rpc_duration');
const searchDuration = new Trend('search_rpc_duration');
const viewTrackingDuration = new Trend('view_rpc_duration');
const errorRate = new Rate('custom_error_rate');

// 50,000 DAU Peak Traffic Profile (1,500 Concurrent Virtual Users)
export const options = {
  stages: [
    { duration: '30s', target: 200 },  // Warm-up ramp
    { duration: '1m', target: 800 },   // Normal peak morning rush
    { duration: '2m', target: 1500 },  // Breaking local event surge
    { duration: '1m', target: 500 },   // Post-event settle
    { duration: '30s', target: 0 },    // Cool-down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<400', 'p(99)<800'], // 95% under 400ms, 99% under 800ms
    'http_req_failed': ['rate<0.01'],               // Less than 1% errors
    'custom_error_rate': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://sbcvvcqsmgihhzuifafq.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3Z2Y3FzbWdpaGh6dWlmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjgyMzksImV4cCI6MjEwNTEwNDIzOX0.0GFOvJmjhel0gpkOSypdwN1rs1o2sPo4LgtpyWhc63I';

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
};

const POPULAR_DISTRICT_CODES = [214, 215, 216, 500, 501, 100, 101];
const SEARCH_KEYWORDS = ['metro', 'bihar', 'police', 'traffic', 'school', 'hospital', 'weather', 'patna'];

export default function () {
  const vuId = __VU;
  const iteration = __ITER;
  const deviceId = `k6-device-${vuId}-${iteration % 100}`;

  // 1. Hyperlocal Personalized Feed (70% probability)
  if (Math.random() < 0.70) {
    const districtCode = POPULAR_DISTRICT_CODES[Math.floor(Math.random() * POPULAR_DISTRICT_CODES.length)];
    const feedPayload = JSON.stringify({
      p_lat: 25.5941 + (Math.random() - 0.5) * 0.05,
      p_lng: 85.1376 + (Math.random() - 0.5) * 0.05,
      p_district_code: districtCode,
      p_limit: 15,
      p_cursor: null
    });

    const feedRes = http.post(`${BASE_URL}/rest/v1/rpc/get_personalized_feed`, feedPayload, { headers: HEADERS });
    feedDuration.add(feedRes.timings.duration);

    const feedOk = check(feedRes, {
      'feed status is 200': (r) => r.status === 200,
      'feed has items': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.items);
        } catch (_) {
          return false;
        }
      },
    });

    if (!feedOk) errorRate.add(1);

    // If feed returned items, simulate consuming first video
    try {
      const parsed = JSON.parse(feedRes.body);
      if (parsed.items && parsed.items.length > 0 && parsed.items[0].data?.id) {
        const videoId = parsed.items[0].data.id;
        
        // Simulate 4 seconds watch time
        sleep(2 + Math.random() * 2);

        // 2. Video View Tracking (Server-authoritative RPC)
        const viewPayload = JSON.stringify({
          p_video_id: videoId,
          p_device_id: deviceId
        });

        const viewRes = http.post(`${BASE_URL}/rest/v1/rpc/track_video_view`, viewPayload, { headers: HEADERS });
        viewTrackingDuration.add(viewRes.timings.duration);

        check(viewRes, {
          'view status is 200': (r) => r.status === 200,
        });
      }
    } catch (_) {}
  }

  // 3. Trigram Content Search (20% probability)
  if (Math.random() < 0.20) {
    const query = SEARCH_KEYWORDS[Math.floor(Math.random() * SEARCH_KEYWORDS.length)];
    const searchPayload = JSON.stringify({
      p_query: query
    });

    const searchRes = http.post(`${BASE_URL}/rest/v1/rpc/search_content`, searchPayload, { headers: HEADERS });
    searchDuration.add(searchRes.timings.duration);

    const searchOk = check(searchRes, {
      'search status is 200': (r) => r.status === 200,
      'search returns success': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true;
        } catch (_) {
          return false;
        }
      }
    });

    if (!searchOk) errorRate.add(1);
  }

  // 4. LGD State/District cached administrative data (10% probability)
  if (Math.random() < 0.10) {
    const lgdRes = http.get(
      `${BASE_URL}/rest/v1/lgd_districts?state_code=eq.10&select=district_code,district_name&order=district_name.asc`,
      { headers: HEADERS }
    );
    check(lgdRes, {
      'lgd status is 200': (r) => r.status === 200,
    });
  }

  // Think time between feed scrolls
  sleep(1 + Math.random() * 2);
}
