import 'package:nagrik/features/onboarding/domain/models/location_item.dart';

const List<LocationItem> kIndianLocations = [
  // Bihar (Live Backend Staging Locations)
  LocationItem(id: 'loc_patna_boring_rd', locality: 'Boring Road', city: 'Patna', district: 'Patna', state: 'Bihar', pincode: '800001'),
  LocationItem(id: 'loc_patna_kankarbagh', locality: 'Kankarbagh', city: 'Patna', district: 'Patna', state: 'Bihar', pincode: '800020'),
  LocationItem(id: 'loc_patna_sahib', locality: 'Patna Sahib', city: 'Patna', district: 'Patna', state: 'Bihar', pincode: '800008'),
  LocationItem(id: 'loc_gaya_bodhgaya', locality: 'Bodhgaya', city: 'Gaya', district: 'Gaya', state: 'Bihar', pincode: '824231'),

  // West Bengal
  LocationItem(id: 'wb_kol_saltlake', locality: 'Salt Lake Sector V', city: 'Kolkata', district: 'North 24 Parganas', state: 'West Bengal', pincode: '700091'),
  LocationItem(id: 'wb_kol_parkstreet', locality: 'Park Street', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', pincode: '700016'),
  LocationItem(id: 'wb_kol_newtown', locality: 'New Town Action Area 1', city: 'Kolkata', district: 'North 24 Parganas', state: 'West Bengal', pincode: '700156'),
  LocationItem(id: 'wb_how_shibpur', locality: 'Shibpur', city: 'Howrah', district: 'Howrah', state: 'West Bengal', pincode: '711102'),
  LocationItem(id: 'wb_siliguri_pradhan', locality: 'Pradhan Nagar', city: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', pincode: '734003'),

  // Maharashtra
  LocationItem(id: 'mh_mum_bandra', locality: 'Bandra West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', pincode: '400050'),
  LocationItem(id: 'mh_mum_andheri', locality: 'Andheri East', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', pincode: '400069'),
  LocationItem(id: 'mh_pun_kothrud', locality: 'Kothrud', city: 'Pune', district: 'Pune', state: 'Maharashtra', pincode: '411038'),
  LocationItem(id: 'mh_nag_dharampeth', locality: 'Dharampeth', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', pincode: '440010'),

  // Karnataka
  LocationItem(id: 'ka_blr_indiranagar', locality: 'Indiranagar', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560038'),
  LocationItem(id: 'ka_blr_koramangala', locality: 'Koramangala 4th Block', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560034'),
  LocationItem(id: 'ka_blr_hsr', locality: 'HSR Layout Sector 1', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560102'),
  LocationItem(id: 'ka_mys_jayalakshmi', locality: 'Jayalakshmipuram', city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', pincode: '570012'),

  // Delhi NCR
  LocationItem(id: 'dl_connaught', locality: 'Connaught Place', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pincode: '110001'),
  LocationItem(id: 'dl_hauzkhas', locality: 'Hauz Khas', city: 'New Delhi', district: 'South Delhi', state: 'Delhi', pincode: '110016'),
  LocationItem(id: 'hr_ggn_cybercity', locality: 'Cyber City, DLF Phase 2', city: 'Gurugram', district: 'Gurugram', state: 'Haryana', pincode: '122002'),
  LocationItem(id: 'up_noida_sec62', locality: 'Sector 62', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', pincode: '201309'),

  // Tamil Nadu
  LocationItem(id: 'tn_che_t_nagar', locality: 'T. Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pincode: '600017'),
  LocationItem(id: 'tn_che_adyar', locality: 'Adyar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pincode: '600020'),
  LocationItem(id: 'tn_cbe_rs_puram', locality: 'R.S. Puram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002'),

  // Telangana
  LocationItem(id: 'tg_hyd_hitech', locality: 'HITEC City', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pincode: '500081'),
  LocationItem(id: 'tg_hyd_banjara', locality: 'Banjara Hills Road No. 12', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pincode: '500034'),

  // Gujarat
  LocationItem(id: 'gj_ahd_bodakdev', locality: 'Bodakdev', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pincode: '380054'),
  LocationItem(id: 'gj_sur_adajan', locality: 'Adajan', city: 'Surat', district: 'Surat', state: 'Gujarat', pincode: '395009'),

  // Kerala
  LocationItem(id: 'kl_ekm_panampilly', locality: 'Panampilly Nagar', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pincode: '682036'),
  LocationItem(id: 'kl_tvm_kowdiar', locality: 'Kowdiar', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', pincode: '695003'),

  // Assam
  LocationItem(id: 'as_ghy_gs_road', locality: 'G.S. Road, Christian Basti', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', pincode: '781005'),

  // Punjab
  LocationItem(id: 'pb_ldh_sarabha', locality: 'Sarabha Nagar', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', pincode: '141001'),
  LocationItem(id: 'pb_asr_mall', locality: 'Mall Road', city: 'Amritsar', district: 'Amritsar', state: 'Punjab', pincode: '143001'),

  // Odisha
  LocationItem(id: 'or_bbsr_saheed', locality: 'Saheed Nagar', city: 'Bhubaneswar', district: 'Khurda', state: 'Odisha', pincode: '751007'),
];
