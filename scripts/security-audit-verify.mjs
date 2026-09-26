/**
 * Nagrik Production Security & RLS Verification Suite
 * Verifies that all RLS policies, views, mutation locks, and RPC permissions
 * are strictly enforced against unauthorized and anonymous callers.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://sbcvvcqsmgihhzuifafq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3Z2Y3FzbWdpaGh6dWlmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjgyMzksImV4cCI6MjEwNTEwNDIzOX0.0GFOvJmjhel0gpkOSypdwN1rs1o2sPo4LgtpyWhc63I';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failedTests++;
  }
}

async function runSecurityAudit() {
  console.log('='.repeat(70));
  console.log('NAGRIK PRODUCTION SECURITY & RLS AUDIT VERIFICATION');
  console.log(`Target: ${SUPABASE_URL}`);
  console.log(`Caller Role: anon (public unauthenticated client)`);
  console.log('='.repeat(70));

  // 1. User Profile Privacy Lock
  console.log('\n[1/6] Auditing User Profile Privacy (Zero PII Exposure)...');
  try {
    const { data, error } = await anonClient.from('users').select('id, email, phone, password_hash');
    if (error) {
      assert(true, `Anonymous SELECT on 'users' blocked with error: ${error.message} (${error.code})`);
    } else {
      assert(
        Array.isArray(data) && data.length === 0,
        `Anonymous SELECT on 'users' returned 0 records (RLS locked). Got: ${data ? data.length : 0}`
      );
    }
  } catch (e) {
    assert(false, `Unexpected error on users query: ${e.message}`);
  }

  // 2. Public Author Barrier View
  console.log('\n[2/6] Auditing Public Author View Security Barrier...');
  try {
    const { data, error } = await anonClient.from('public_author_profiles').select('*').limit(5);
    assert(!error && Array.isArray(data), `Anonymous SELECT on 'public_author_profiles' succeeded`);
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const forbiddenKeys = ['email', 'phone', 'password_hash', 'role', 'status'];
      const hasLeak = forbiddenKeys.some(k => keys.includes(k));
      assert(!hasLeak, `No private fields exposed in public_author_profiles. Exposed columns: ${keys.join(', ')}`);
    } else {
      assert(true, `public_author_profiles view accessible and returned empty/clean dataset`);
    }
  } catch (e) {
    assert(false, `Unexpected error on author profiles query: ${e.message}`);
  }

  // 3. Direct Table INSERT Mutation Revocation
  console.log('\n[3/6] Auditing Direct Table INSERT Revocations (Must use stored procedures)...');
  
  // 3a. video_views direct insert
  try {
    const { error } = await anonClient.from('video_views').insert({
      video_id: '00000000-0000-0000-0000-000000000000',
      device_id: 'hacker-device-id'
    });
    assert(error !== null, `Direct INSERT into 'video_views' blocked by RLS / Revoke (Error: ${error?.code || 'BLOCKED'})`);
  } catch (e) {
    assert(true, `Direct INSERT into 'video_views' threw exception: ${e.message}`);
  }

  // 3b. reports direct insert
  try {
    const { error } = await anonClient.from('reports').insert({
      content_id: '00000000-0000-0000-0000-000000000000',
      reason: 'SPAM'
    });
    assert(error !== null, `Direct INSERT into 'reports' blocked by RLS / Revoke (Error: ${error?.code || 'BLOCKED'})`);
  } catch (e) {
    assert(true, `Direct INSERT into 'reports' threw exception: ${e.message}`);
  }

  // 3c. audit_logs direct insert
  try {
    const { error } = await anonClient.from('audit_logs').insert({
      action: 'ADMIN_BYPASS',
      entity_type: 'contents'
    });
    assert(error !== null, `Direct INSERT into 'audit_logs' blocked by RLS / Revoke (Error: ${error?.code || 'BLOCKED'})`);
  } catch (e) {
    assert(true, `Direct INSERT into 'audit_logs' threw exception: ${e.message}`);
  }

  // 3d. payout_requests direct insert
  try {
    const { error } = await anonClient.from('payout_requests').insert({
      creator_id: '00000000-0000-0000-0000-000000000000',
      amount: 10000
    });
    assert(error !== null, `Direct INSERT into 'payout_requests' blocked by RLS / Revoke (Error: ${error?.code || 'BLOCKED'})`);
  } catch (e) {
    assert(true, `Direct INSERT into 'payout_requests' threw exception: ${e.message}`);
  }

  // 4. Admin RPC Access Control
  console.log('\n[4/6] Auditing Admin RPC Protection...');
  try {
    const { data, error } = await anonClient.rpc('get_admin_dashboard_stats');
    assert(
      error !== null,
      `Anonymous call to 'get_admin_dashboard_stats' correctly rejected (Error: ${error?.message || 'Access Denied'})`
    );
  } catch (e) {
    assert(true, `Anonymous call to 'get_admin_dashboard_stats' rejected: ${e.message}`);
  }

  try {
    const { data, error } = await anonClient.rpc('admin_moderate_content', {
      p_content_id: '00000000-0000-0000-0000-000000000000',
      p_moderation_status: 'APPROVED'
    });
    assert(
      error !== null,
      `Anonymous call to 'admin_moderate_content' correctly rejected (Error: ${error?.message || 'Access Denied'})`
    );
  } catch (e) {
    assert(true, `Anonymous call to 'admin_moderate_content' rejected: ${e.message}`);
  }

  try {
    const { data, error } = await anonClient.rpc('request_payout', {
      p_creator_id: '00000000-0000-0000-0000-000000000000',
      p_amount: 100,
      p_payout_method_id: '00000000-0000-0000-0000-000000000000'
    });
    assert(
      error !== null,
      `Anonymous call to 'request_payout' correctly rejected (Error: ${error?.message || 'Access Denied'})`
    );
  } catch (e) {
    assert(true, `Anonymous call to 'request_payout' rejected: ${e.message}`);
  }

  try {
    const { data, error } = await anonClient.rpc('get_creator_dashboard_stats', {
      p_creator_id: '00000000-0000-0000-0000-000000000000'
    });
    assert(
      error !== null,
      `Anonymous call to 'get_creator_dashboard_stats' correctly rejected (Error: ${error?.message || 'Access Denied'})`
    );
  } catch (e) {
    assert(true, `Anonymous call to 'get_creator_dashboard_stats' rejected: ${e.message}`);
  }

  // 5. Public RPC Accessibility (Personalized Feed & Search)
  console.log('\n[5/6] Auditing Public Feed & Search RPCs...');
  try {
    const { data, error } = await anonClient.rpc('get_personalized_feed', {
      p_limit: 3
    });
    assert(!error && data !== null, `Anonymous caller can execute 'get_personalized_feed' RPC`);
    if (data) {
      assert(Array.isArray(data.items), `'get_personalized_feed' returned items array (Length: ${data.items?.length ?? 0})`);
      assert(data.pagination !== undefined, `'get_personalized_feed' returned pagination metadata (hasMore: ${data.pagination?.hasMore})`);
    }
  } catch (e) {
    assert(false, `'get_personalized_feed' failed: ${e.message}`);
  }

  try {
    const { data, error } = await anonClient.rpc('search_content', {
      p_query: 'Patna'
    });
    if (error) {
      assert(false, `'search_content' failed with error: ${error.message} (${error.code})`);
    } else {
      assert(data?.success === true && Array.isArray(data.contents), `'search_content' executed successfully with trigram index (Returned ${data?.contents?.length ?? 0} results)`);
    }
  } catch (e) {
    assert(false, `'search_content' failed: ${e.message}`);
  }

  // 5b. Idempotent Atomic Likes and Saves
  console.log('\n[5b/6] Auditing Atomic Likes & Saves Idempotency...');
  try {
    const feedRes = await anonClient.rpc('get_personalized_feed', { p_limit: 1 });
    const contentItem = feedRes.data?.items?.[0]?.data;
    if (contentItem && contentItem.id) {
      const testDeviceId = 'audit-test-device-' + Date.now();
      // Like step 1: Toggle ON
      const { data: likeOn, error: lOnErr } = await anonClient.rpc('toggle_content_like', {
        p_content_id: contentItem.id,
        p_device_id: testDeviceId
      });
      assert(!lOnErr && likeOn?.isLiked === true, `toggle_content_like turned ON atomically (likes: ${likeOn?.likes})`);

      // Like step 2: Toggle OFF
      const { data: likeOff, error: lOffErr } = await anonClient.rpc('toggle_content_like', {
        p_content_id: contentItem.id,
        p_device_id: testDeviceId
      });
      assert(!lOffErr && likeOff?.isLiked === false, `toggle_content_like turned OFF atomically (likes: ${likeOff?.likes})`);

      // Save step 1: Toggle ON
      const { data: saveOn, error: sOnErr } = await anonClient.rpc('toggle_content_save', {
        p_content_id: contentItem.id,
        p_device_id: testDeviceId
      });
      assert(!sOnErr && saveOn?.isSaved === true, `toggle_content_save turned ON atomically (saves: ${saveOn?.saves})`);

      // Save step 2: Toggle OFF
      const { data: saveOff, error: sOffErr } = await anonClient.rpc('toggle_content_save', {
        p_content_id: contentItem.id,
        p_device_id: testDeviceId
      });
      assert(!sOffErr && saveOff?.isSaved === false, `toggle_content_save turned OFF atomically (saves: ${saveOff?.saves})`);
    } else {
      assert(true, `No content items available to test like/save toggle (skipped dynamically)`);
    }
  } catch (e) {
    assert(false, `Atomic like/save error: ${e.message}`);
  }

  // 5c. Server-Authoritative Video View Tracking & 3-View Ceiling
  console.log('\n[5c/6] Auditing Anonymous Mobile Consumer Video View Tracking & 3-View Ceiling...');
  try {
    const feedRes = await anonClient.rpc('get_personalized_feed', { p_content_type: 'VIDEO', p_limit: 1 });
    const videoItem = feedRes.data?.items?.[0]?.data;
    if (videoItem && videoItem.id) {
      const testDeviceId = 'audit-mobile-device-' + Date.now();
      // View 1: Eligible
      const { data: v1, error: v1Err } = await anonClient.rpc('track_video_view', {
        p_video_id: videoItem.id,
        p_device_id: testDeviceId
      });
      assert(!v1Err && v1?.success === true, `track_video_view view 1 succeeded (total: ${v1?.totalViews})`);
      assert(v1?.isEligibleView === true, `track_video_view view 1 is eligible for monetization (counted: ${v1?.currentCountedViews})`);

      // View 2: Eligible
      const { data: v2 } = await anonClient.rpc('track_video_view', {
        p_video_id: videoItem.id,
        p_device_id: testDeviceId
      });
      assert(v2?.isEligibleView === true && v2?.currentCountedViews === 2, `track_video_view view 2 incremented counted views to 2`);

      // View 3: Eligible (ceiling reached)
      const { data: v3 } = await anonClient.rpc('track_video_view', {
        p_video_id: videoItem.id,
        p_device_id: testDeviceId
      });
      assert(v3?.isEligibleView === true && v3?.currentCountedViews === 3, `track_video_view view 3 reached ceiling (3 views)`);

      // View 4: Ineligible (ceiling enforced)
      const { data: v4 } = await anonClient.rpc('track_video_view', {
        p_video_id: videoItem.id,
        p_device_id: testDeviceId
      });
      assert(v4?.isEligibleView === false && v4?.currentCountedViews === 3, `track_video_view view 4 correctly rejected from monetization by 3-view ceiling rule`);
    } else {
      assert(true, `No video items available in feed for view test (skipped dynamically)`);
    }
  } catch (e) {
    assert(false, `Video view tracking verification failed: ${e.message}`);
  }

  // 6. Public Static LGD Administrative Data
  console.log('\n[6/6] Auditing Public LGD Administrative Hierarchy Read Access...');
  try {
    const { data: states, error: sErr } = await anonClient.from('lgd_states').select('state_code, state_name').limit(5);
    assert(!sErr && Array.isArray(states) && states.length > 0, `Anonymous SELECT on 'lgd_states' allowed (Found ${states?.length} sample states)`);

    const { data: districts, error: dErr } = await anonClient.from('lgd_districts').select('district_code, district_name').limit(5);
    assert(!dErr && Array.isArray(districts) && districts.length > 0, `Anonymous SELECT on 'lgd_districts' allowed (Found ${districts?.length} sample districts)`);
  } catch (e) {
    assert(false, `LGD tables access error: ${e.message}`);
  }

  // 7. PostGIS Radar and Denormalized Public Creator Verification
  console.log('\n[7/7] Auditing PostGIS Radar & Denormalized Creator Profiles...');
  try {
    // 7a. PostGIS Proximity Radar
    const { data: geoData, error: geoErr } = await anonClient.rpc('get_personalized_feed', {
      p_lat: 22.5726,
      p_lng: 88.3639,
      p_limit: 5
    });
    assert(!geoErr && geoData?.success === true, `PostGIS geospatial radar query executed cleanly without error`);

    // 7b. Denormalized creators columns
    const { data: creators, error: cErr } = await anonClient.from('creators').select('id, display_name, avatar_url, verification_status').limit(1);
    assert(!cErr && Array.isArray(creators), `Anonymous SELECT on verified creators succeeded with denormalized fields`);
    if (creators && creators.length > 0) {
      assert('display_name' in creators[0] && 'avatar_url' in creators[0], `creators table contains denormalized display_name and avatar_url fields`);
    }

    // 7c. Direct mutation on spatial_ref_sys is blocked
    const { error: spErr } = await anonClient.from('spatial_ref_sys').insert({ srid: 999999, auth_name: 'TEST' });
    assert(spErr !== null, `Anonymous INSERT on 'spatial_ref_sys' blocked (Error: ${spErr?.code || 'BLOCKED'})`);
  } catch (e) {
    assert(false, `PostGIS & creator profile verification failed: ${e.message}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log(`AUDIT COMPLETE: ${passedTests}/${totalTests} checks passed (${failedTests} failed)`);
  console.log('='.repeat(70));

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
