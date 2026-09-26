/**
 * seed_lgd_hierarchy.js
 * Ingests the 4 official LGD JSON files into Supabase with full relationship resolution.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://sbcvvcqsmgihhzuifafq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3Z2Y3FzbWdpaGh6dWlmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjgyMzksImV4cCI6MjEwNTEwNDIzOX0.0GFOvJmjhel0gpkOSypdwN1rs1o2sPo4LgtpyWhc63I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

const LOCATION_DIR = path.resolve(__dirname, '../LOCATION');

async function seedBatch(table, items, batchSize = 500, onConflict = null) {
  console.log(`Inserting ${items.length} records into ${table} in batches of ${batchSize}...`);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const query = supabase.from(table).upsert(batch, onConflict ? { onConflict } : undefined);
    const { error } = await query;
    if (error) {
      console.error(`Error inserting batch ${i} - ${i + batch.length} into ${table}:`, error);
      throw error;
    }
    process.stdout.write(`  Inserted ${Math.min(i + batch.length, items.length)}/${items.length}\r`);
  }
  console.log(`\nSuccessfully inserted ${items.length} records into ${table}.`);
}

async function main() {
  console.log('--- Starting LGD Geographic Hierarchy Seeding ---');

  // 1. STATES
  console.log('\n1. Processing STATE.MD...');
  const stateRaw = JSON.parse(fs.readFileSync(path.join(LOCATION_DIR, 'STATE.MD'), 'utf8'));
  const statesMap = new Map();
  stateRaw.records.forEach(r => {
    const code = Number(r.state_code);
    if (!statesMap.has(code)) {
      statesMap.set(code, {
        state_code: code,
        state_name: r.state_name_english.trim(),
        state_name_local: r.state_name_local ? r.state_name_local.trim() : null,
        census_2011_code: r.state_census2011_code ? String(r.state_census2011_code).trim() : null,
        state_or_ut: r.state_or_ut ? String(r.state_or_ut).trim() : 'S'
      });
    }
  });
  const states = Array.from(statesMap.values());
  await seedBatch('lgd_states', states, 50, 'state_code');

  // 2. DISTRICTS
  console.log('\n2. Processing DISTRICT.MD...');
  const distRaw = JSON.parse(fs.readFileSync(path.join(LOCATION_DIR, 'DISTRICT.MD'), 'utf8'));
  const distsMap = new Map();
  distRaw.records.forEach(r => {
    const code = Number(r.district_code);
    if (!distsMap.has(code)) {
      distsMap.set(code, {
        district_code: code,
        state_code: Number(r.state_code),
        district_name: r.district_name_english.trim(),
        district_name_local: r.district_name_local ? r.district_name_local.trim() : null,
        census_2011_code: r.district_census2011_code ? String(r.district_census2011_code).trim() : null
      });
    }
  });
  const districts = Array.from(distsMap.values());
  await seedBatch('lgd_districts', districts, 500, 'district_code');

  // 3. SUB-DISTRICTS
  console.log('\n3. Processing SUB-DISTRICT.MD...');
  const subdistRaw = JSON.parse(fs.readFileSync(path.join(LOCATION_DIR, 'SUB-DISTRICT.MD'), 'utf8'));
  const subdistMap = new Map();
  subdistRaw.records.forEach(r => {
    const code = Number(r.subdistrict_code);
    if (!subdistMap.has(code)) {
      subdistMap.set(code, {
        subdistrict_code: code,
        district_code: Number(r.district_code),
        state_code: Number(r.state_code),
        subdistrict_name: r.subdistrict_name_english.trim(),
        subdistrict_name_local: r.subdistrict_name_local ? r.subdistrict_name_local.trim() : null,
        census_2011_code: r.subdistrict_census2011_code ? String(r.subdistrict_census2011_code).trim() : null
      });
    }
  });
  const subdistricts = Array.from(subdistMap.values());
  await seedBatch('lgd_subdistricts', subdistricts, 500, 'subdistrict_code');

  // 4. Build fast lookup index for local bodies to resolve district & subdistrict
  console.log('\n4. Preparing name-to-district and name-to-subdistrict maps for Local Bodies resolution...');
  const stateDistMap = new Map(); // stateCode -> [{ district_code, name }]
  districts.forEach(d => {
    if (!stateDistMap.has(d.state_code)) stateDistMap.set(d.state_code, []);
    stateDistMap.get(d.state_code).push({
      district_code: d.district_code,
      name: d.district_name.toLowerCase().trim()
    });
  });

  const stateSubdistMap = new Map(); // stateCode -> [{ subdistrict_code, district_code, name }]
  subdistricts.forEach(s => {
    if (!stateSubdistMap.has(s.state_code)) stateSubdistMap.set(s.state_code, []);
    stateSubdistMap.get(s.state_code).push({
      subdistrict_code: s.subdistrict_code,
      district_code: s.district_code,
      name: s.subdistrict_name.toLowerCase().trim()
    });
  });

  // 5. LOCAL BODIES & PIN CODES
  console.log('\n5. Processing LOCAL-BODIES-PIN-CODES.MD...');
  const lbRaw = JSON.parse(fs.readFileSync(path.join(LOCATION_DIR, 'LOCAL-BODIES-PIN-CODES.MD'), 'utf8'));
  const lbMap = new Map();
  let matchedDists = 0;
  let matchedSubs = 0;

  lbRaw.records.forEach(r => {
    const lbCode = Number(r.localBodyCode);
    const pin = String(r.pincode).trim();
    const key = `${lbCode}_${pin}`;

    if (!lbMap.has(key)) {
      const stateCode = Number(r.stateCode);
      const lbName = r.localBodyNameEnglish.trim();
      const normName = lbName.toLowerCase();

      // Attempt matching subdistrict
      let subCode = null;
      let distCode = null;

      const subList = stateSubdistMap.get(stateCode) || [];
      const foundSub = subList.find(s => s.name === normName || normName.includes(s.name) || s.name.includes(normName));
      if (foundSub) {
        subCode = foundSub.subdistrict_code;
        distCode = foundSub.district_code;
        matchedSubs++;
        matchedDists++;
      } else {
        // Fallback to district matching
        const distList = stateDistMap.get(stateCode) || [];
        const foundDist = distList.find(d => d.name === normName || normName.includes(d.name) || d.name.includes(normName));
        if (foundDist) {
          distCode = foundDist.district_code;
          matchedDists++;
        }
      }

      lbMap.set(key, {
        local_body_code: lbCode,
        local_body_name: lbName,
        local_body_type: r.localBodyTypeName ? r.localBodyTypeName.trim() : null,
        pincode: pin,
        state_code: stateCode,
        district_code: distCode,
        subdistrict_code: subCode
      });
    }
  });

  const localBodies = Array.from(lbMap.values());
  console.log(`Resolved local bodies: ${localBodies.length} (linked subdistricts: ${matchedSubs}, linked districts: ${matchedDists})`);
  await seedBatch('lgd_local_bodies', localBodies, 500, 'local_body_code,pincode');

  console.log('\n--- Seeding Complete! Verifying row counts in Supabase... ---');
  const [
    { count: stateCount },
    { count: distCount },
    { count: subCount },
    { count: lbCount }
  ] = await Promise.all([
    supabase.from('lgd_states').select('*', { count: 'exact', head: true }),
    supabase.from('lgd_districts').select('*', { count: 'exact', head: true }),
    supabase.from('lgd_subdistricts').select('*', { count: 'exact', head: true }),
    supabase.from('lgd_local_bodies').select('*', { count: 'exact', head: true })
  ]);

  console.log(`Supabase LGD States:        ${stateCount} (Expected: 36)`);
  console.log(`Supabase LGD Districts:     ${distCount} (Expected: 785)`);
  console.log(`Supabase LGD Subdistricts:  ${subCount} (Expected: 7151)`);
  console.log(`Supabase LGD Local Bodies:  ${lbCount} (Expected: 7411)`);
}

main().catch(err => {
  console.error('Seeding failed with error:', err);
  process.exit(1);
});
