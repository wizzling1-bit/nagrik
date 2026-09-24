import { supabase } from './supabase';

export interface LgdState {
  state_code: number;
  state_name: string;
  state_name_local?: string | null;
  census_2011_code?: string | null;
  state_or_ut: 'S' | 'UT';
}

export interface LgdDistrict {
  district_code: number;
  state_code: number;
  district_name: string;
  district_name_local?: string | null;
  census_2011_code?: string | null;
}

export interface LgdSubdistrict {
  subdistrict_code: number;
  district_code: number;
  state_code: number;
  subdistrict_name: string;
  subdistrict_name_local?: string | null;
  census_2011_code?: string | null;
}

export interface LgdLocalBody {
  id: number;
  local_body_code: number;
  local_body_name: string;
  local_body_type?: string | null;
  pincode: string;
  state_code: number;
  district_code?: number | null;
  subdistrict_code?: number | null;
}

export interface PincodeLookupResult {
  pincode: string;
  stateCode: number;
  stateName: string;
  districtCode?: number | null;
  districtName?: string | null;
  subdistrictCode?: number | null;
  subdistrictName?: string | null;
  localBodyCode?: number | null;
  localBodyName?: string | null;
  localBodyType?: string | null;
}

// In-memory cache for high performance & instantaneous UI transitions
const cache = {
  states: null as LgdState[] | null,
  districtsByState: new Map<number, LgdDistrict[]>(),
  subdistrictsByDistrict: new Map<number, LgdSubdistrict[]>(),
  localBodiesByState: new Map<number, LgdLocalBody[]>(),
  pincodeLookups: new Map<string, PincodeLookupResult[]>()
};

/**
 * Fetch all 36 official Indian States & Union Territories
 */
export async function getLgdStates(): Promise<LgdState[]> {
  if (cache.states && cache.states.length > 0) {
    return cache.states;
  }

  try {
    const { data, error } = await supabase
      .from('lgd_states')
      .select('state_code, state_name, state_name_local, census_2011_code, state_or_ut')
      .order('state_name', { ascending: true });

    if (error) {
      console.error('Error fetching LGD states:', error);
      return [];
    }

    cache.states = data || [];
    return cache.states;
  } catch (err) {
    console.error('Exception fetching LGD states:', err);
    return [];
  }
}

/**
 * Fetch all official Districts for a given State
 */
export async function getLgdDistrictsByState(stateCode: number): Promise<LgdDistrict[]> {
  if (cache.districtsByState.has(stateCode)) {
    return cache.districtsByState.get(stateCode)!;
  }

  try {
    const { data, error } = await supabase
      .from('lgd_districts')
      .select('district_code, state_code, district_name, district_name_local, census_2011_code')
      .eq('state_code', stateCode)
      .order('district_name', { ascending: true });

    if (error) {
      console.error(`Error fetching districts for state ${stateCode}:`, error);
      return [];
    }

    const list = data || [];
    cache.districtsByState.set(stateCode, list);
    return list;
  } catch (err) {
    console.error(`Exception fetching districts for state ${stateCode}:`, err);
    return [];
  }
}

/**
 * Fetch all official Sub-Districts (Tehsils/Taluks/Mandals) for a given District
 */
export async function getLgdSubdistrictsByDistrict(districtCode: number): Promise<LgdSubdistrict[]> {
  if (cache.subdistrictsByDistrict.has(districtCode)) {
    return cache.subdistrictsByDistrict.get(districtCode)!;
  }

  try {
    const { data, error } = await supabase
      .from('lgd_subdistricts')
      .select('subdistrict_code, district_code, state_code, subdistrict_name, subdistrict_name_local, census_2011_code')
      .eq('district_code', districtCode)
      .order('subdistrict_name', { ascending: true });

    if (error) {
      console.error(`Error fetching subdistricts for district ${districtCode}:`, error);
      return [];
    }

    const list = data || [];
    cache.subdistrictsByDistrict.set(districtCode, list);
    return list;
  } catch (err) {
    console.error(`Exception fetching subdistricts for district ${districtCode}:`, err);
    return [];
  }
}

/**
 * Fetch Local Bodies / Villages / Municipalities with PIN codes
 */
export async function getLgdLocalBodies(
  stateCode: number,
  districtCode?: number,
  subdistrictCode?: number
): Promise<LgdLocalBody[]> {
  try {
    let query = supabase
      .from('lgd_local_bodies')
      .select('id, local_body_code, local_body_name, local_body_type, pincode, state_code, district_code, subdistrict_code')
      .eq('state_code', stateCode);

    if (subdistrictCode) {
      query = query.eq('subdistrict_code', subdistrictCode);
    } else if (districtCode) {
      query = query.eq('district_code', districtCode);
    }

    const { data, error } = await query.order('local_body_name', { ascending: true }).limit(200);

    if (error) {
      console.error('Error fetching local bodies:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching local bodies:', err);
    return [];
  }
}

/**
 * Instant PIN Code Lookup
 * Resolves 6-digit Indian Postal PIN Code to State, District, Sub-District, and Local Body hierarchy
 */
export async function lookupLgdByPincode(pincode: string): Promise<PincodeLookupResult[]> {
  const cleanPin = pincode.trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) return [];

  if (cache.pincodeLookups.has(cleanPin)) {
    return cache.pincodeLookups.get(cleanPin)!;
  }

  try {
    const { data, error } = await supabase
      .from('lgd_local_bodies')
      .select(`
        local_body_code,
        local_body_name,
        local_body_type,
        pincode,
        state_code,
        district_code,
        subdistrict_code,
        lgd_states (state_code, state_name),
        lgd_districts (district_code, district_name),
        lgd_subdistricts (subdistrict_code, subdistrict_name)
      `)
      .eq('pincode', cleanPin);

    if (error || !data || data.length === 0) {
      return [];
    }

    const results: PincodeLookupResult[] = data.map((item: any) => {
      const stateObj = item.lgd_states || {};
      const distObj = item.lgd_districts || {};
      const subObj = item.lgd_subdistricts || {};

      return {
        pincode: cleanPin,
        stateCode: item.state_code,
        stateName: stateObj.state_name || '',
        districtCode: item.district_code || null,
        districtName: distObj.district_name || null,
        subdistrictCode: item.subdistrict_code || null,
        subdistrictName: subObj.subdistrict_name || null,
        localBodyCode: item.local_body_code,
        localBodyName: item.local_body_name,
        localBodyType: item.local_body_type
      };
    });

    cache.pincodeLookups.set(cleanPin, results);
    return results;
  } catch (err) {
    console.error(`Exception resolving PIN code ${cleanPin}:`, err);
    return [];
  }
}
