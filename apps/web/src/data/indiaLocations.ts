/**
 * Comprehensive Indian States, Union Territories, Cities & Local Ward Beats
 * Used for Hyperlocal Geofencing and 5km Ward push notifications in Nagrik.
 */

export interface CityData {
  name: string;
  localAreas: string[];
}

export interface StateData {
  name: string;
  code: string;
  type: 'STATE' | 'UT';
  cities: CityData[];
}

export const INDIA_LOCATIONS: StateData[] = [
  // 1. Bihar
  {
    name: 'Bihar',
    code: 'BR',
    type: 'STATE',
    cities: [
      {
        name: 'Patna',
        localAreas: ['Kankarbagh Ward 14', 'Boring Road', 'Patna Sahib Ward 8', 'Bailey Road', 'Rajendra Nagar', 'Danapur Ward 3', 'Fraser Road', 'Anisabad', 'Ashok Rajpath', 'Patliputra Colony', 'Digha Ward 1', 'Phulwari Sharif']
      },
      {
        name: 'Gaya',
        localAreas: ['Bodhgaya Ward 4', 'Civil Lines', 'Rampur', 'Chandauti', 'Vishnupad Ward 2', 'Manpur']
      },
      {
        name: 'Muzaffarpur',
        localAreas: ['Mithanpura', 'Aghoria Bazar', 'Brahmpura', 'Juran Chapra', 'Kalyani Chowk', 'Motijheel']
      },
      {
        name: 'Bhagalpur',
        localAreas: ['Tilka Manjhi', 'Adampur', 'Aliganj', 'Nathnagar', 'Zero Mile', 'Barari']
      },
      {
        name: 'Darbhanga',
        localAreas: ['Laheriasarai', 'Benta Chowk', 'Mirzapur', 'Donar', 'Darbhanga Tower']
      },
      {
        name: 'Purnia',
        localAreas: ['Line Bazar', 'Bhatta Bazar', 'Gulabbagh', 'Madhubani Ward', 'Khuskibagh']
      },
      {
        name: 'Begusarai',
        localAreas: ['Harhar Mahadev Chowk', 'Town Hall Ward', 'Teghra', 'Barauni', 'Bakhri']
      },
      {
        name: 'Arrah (Bhojpur)',
        localAreas: ['Nawada', 'Chandwa', 'Gopali Chowk', 'Anaith', 'Dharhara']
      },
      {
        name: 'Nalanda / Bihar Sharif',
        localAreas: ['Ranchi Road', 'Khandak Par', 'Ramchandrapur', 'Sohsarai', 'Gagan Diwan']
      },
      {
        name: 'Chhapra (Saran)',
        localAreas: ['Dahiyawan', 'Garkha', 'Prabhunath Nagar', 'Ratanpura', 'Town Thana Ward']
      },
      {
        name: 'Katihar',
        localAreas: ['Mirchaibari', 'Bara Bazar', 'Railway Colony Ward', 'Ambedkar Chowk']
      },
      {
        name: 'Saharsa',
        localAreas: ['Naya Bazar', 'D.B. Road', 'Purab Bazar', 'Tiwari Tola', 'Bangaon']
      }
    ]
  },

  // 2. Uttar Pradesh
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    type: 'STATE',
    cities: [
      {
        name: 'Lucknow',
        localAreas: ['Hazratganj', 'Gomti Nagar Phase 2', 'Alambagh Ward 5', 'Indira Nagar', 'Aliganj', 'Chowk Ward 12', 'Mahanagar', 'Jankipuram', 'Ashiyana', 'Vikas Nagar']
      },
      {
        name: 'Varanasi',
        localAreas: ['Godowlia Ward 7', 'Assi Ghat Beat', 'Lanka', 'Sigra', 'Cantonment', 'Shivpur', 'Bhelupur', 'Sarnath Ward', 'Pandeypur']
      },
      {
        name: 'Kanpur',
        localAreas: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Govind Nagar Ward 18', 'Kidwai Nagar', 'Kalyanpur', 'Barra Ward 4']
      },
      {
        name: 'Noida (Gautam Buddha Nagar)',
        localAreas: ['Sector 62', 'Sector 18 Market', 'Sector 137 Expressway', 'Sector 76 Metro', 'Sector 15', 'Sector 50', 'Sector 128']
      },
      {
        name: 'Greater Noida',
        localAreas: ['Alpha 1', 'Beta 2', 'Knowledge Park 3', 'Pari Chowk', 'Delta 1', 'Ecotech 3']
      },
      {
        name: 'Ghaziabad',
        localAreas: ['Indirapuram', 'Vaishali Sector 4', 'Raj Nagar Extension', 'Vasundhara', 'Crossings Republik', 'Kaushambi']
      },
      {
        name: 'Prayagraj (Allahabad)',
        localAreas: ['Civil Lines', 'Katra', 'Georgetown', 'Allahpur Ward 9', 'Tagore Town', 'Naini', 'Teliyarganj']
      },
      {
        name: 'Agra',
        localAreas: ['Sanjay Place', 'Tajganj Ward', 'Dayalbagh', 'Kamla Nagar', 'Fatehabad Road', 'Shahganj']
      },
      {
        name: 'Meerut',
        localAreas: ['Shastri Nagar', 'Modipuram', 'Civil Lines', 'Mangal Pandey Nagar', 'Begum Bridge']
      },
      {
        name: 'Gorakhpur',
        localAreas: ['Golghar', 'Civil Lines', 'Mohaddipur', 'Medical College Road', 'Taramandal']
      },
      {
        name: 'Ayodhya',
        localAreas: ['Ram Janmabhoomi Marg', 'Naya Ghat', 'Civil Lines Faizabad', 'Rikabganj', 'Devkali']
      },
      {
        name: 'Bareilly',
        localAreas: ['Civil Lines', 'Rajendra Nagar', 'Model Town', 'Subhash Nagar', 'C.B. Ganj']
      },
      {
        name: 'Aligarh',
        localAreas: ['Civil Lines', 'Dodhpur', 'Marris Road', 'Center Point', 'Ramghat Road']
      },
      {
        name: 'Jhansi',
        localAreas: ['Sadar Bazar', 'Civil Lines', 'Sipri Bazar', 'Nandanpura', 'Elite Crossing']
      },
      {
        name: 'Mathura',
        localAreas: ['Krishna Nagar', 'Dampier Nagar', 'Vrindavan Ward 3', 'Kosi Kalan', 'Chowk Bazar']
      }
    ]
  },

  // 3. Maharashtra
  {
    name: 'Maharashtra',
    code: 'MH',
    type: 'STATE',
    cities: [
      {
        name: 'Mumbai',
        localAreas: ['Bandra West Ward H/W', 'Andheri East Ward K/E', 'Dadar West Ward G/N', 'Colaba Ward A', 'Borivali West Ward R/C', 'Juhu Vile Parle', 'Goregaon East', 'Ghatkopar East', 'Kurla West', 'Chembur']
      },
      {
        name: 'Pune',
        localAreas: ['Kothrud Ward 12', 'Hinjewadi Phase 1', 'Shivaji Nagar', 'Viman Nagar', 'Kalyani Nagar', 'Baner Ward 9', 'Wakad', 'Hadapsar Magarpatta', 'Aundh']
      },
      {
        name: 'Navi Mumbai',
        localAreas: ['Vashi Sector 17', 'Nerul West', 'Kharghar Sector 20', 'Belapur CBD', 'Seawoods', 'Airoli Knowledge Park']
      },
      {
        name: 'Thane',
        localAreas: ['Ghodbunder Road', 'Panchpakhadi Ward', 'Naupada', 'Vartak Nagar', 'Majiwada', 'Hiranandani Estate']
      },
      {
        name: 'Nagpur',
        localAreas: ['Dharampeth', 'Civil Lines Ward 2', 'Sitabuldi', 'Ramdaspeth', 'Manish Nagar', 'Pratap Nagar']
      },
      {
        name: 'Nashik',
        localAreas: ['College Road', 'Gangapur Road', 'Indira Nagar', 'Panchavati', 'Satpur MIDC', 'CIDCO Ward']
      },
      {
        name: 'Chhatrapati Sambhaji Nagar (Aurangabad)',
        localAreas: ['CIDCO Town Center', 'Samarth Nagar', 'Garkheda', 'Kranti Chowk', 'Waluj MIDC']
      },
      {
        name: 'Kolhapur',
        localAreas: ['Rajarampuri', 'Tarabai Park', 'Shahupuri', 'Laxmipuri', 'Nagala Park']
      },
      {
        name: 'Solapur',
        localAreas: ['Civil Lines', 'Saat Rasta', 'Jule Solapur', 'Bhavani Peth', 'Ashok Chowk']
      }
    ]
  },

  // 4. Delhi (National Capital Territory)
  {
    name: 'Delhi NCR',
    code: 'DL',
    type: 'UT',
    cities: [
      {
        name: 'New Delhi / Central Delhi',
        localAreas: ['Connaught Place Ward', 'Karol Bagh', 'Pahar Ganj', 'Chanakyapuri', 'Rajendra Nagar', 'Pragati Maidan']
      },
      {
        name: 'South Delhi',
        localAreas: ['Hauz Khas Ward 16', 'Saket District Centre', 'Greater Kailash 1', 'Lajpat Nagar 2', 'Malviya Nagar', 'Vasant Kunj Sector C', 'Green Park', 'Nehru Place']
      },
      {
        name: 'North Delhi',
        localAreas: ['Civil Lines Ward', 'Model Town', 'Kamla Nagar DU Beat', 'Pitampura Ward 11', 'Rohini Sector 9', 'Shalimar Bagh', 'Kashmere Gate']
      },
      {
        name: 'West Delhi',
        localAreas: ['Dwarka Sector 12', 'Janakpuri District Centre', 'Rajouri Garden', 'Punjabi Bagh', 'Tilak Nagar', 'Paschim Vihar']
      },
      {
        name: 'East Delhi',
        localAreas: ['Laxmi Nagar Ward', 'Mayur Vihar Phase 1', 'Preet Vihar', 'Patparganj IP Extension', 'Anand Vihar', 'Shahdara']
      }
    ]
  },

  // 5. Karnataka
  {
    name: 'Karnataka',
    code: 'KA',
    type: 'STATE',
    cities: [
      {
        name: 'Bengaluru',
        localAreas: ['Indiranagar 100ft Road', 'Koramangala 4th Block', 'HSR Layout Sector 1', 'Whitefield ITPL', 'Electronic City Phase 1', 'Jayanagar 4th Block', 'JP Nagar Phase 2', 'Malleshwaram 8th Cross', 'Hebbal Bellary Road', 'Marathahalli']
      },
      {
        name: 'Mysuru',
        localAreas: ['Jayalakshmipuram', 'Gokulam 3rd Stage', 'Kuvempunagar', 'Saraswathipuram', 'Vijayanagar', 'Hebbal Industrial Area']
      },
      {
        name: 'Hubballi-Dharwad',
        localAreas: ['Vidyanagar', 'Gokul Road', 'Navanagar', 'Keshwapur', 'Dharwad Market']
      },
      {
        name: 'Mangaluru',
        localAreas: ['Kadri', 'Bejai', 'Lalbagh', 'Hampankatta', 'Surathkal', 'Kankanady']
      },
      {
        name: 'Belagavi',
        localAreas: ['Tilakwadi', 'Camp Area', 'Shahapur', 'Udyambag', 'Khasbag']
      },
      {
        name: 'Kalaburagi (Gulbarga)',
        localAreas: ['Sedam Road', 'MSK Mill Area', 'Brahmpur', 'Super Market', 'Khuba Plot']
      }
    ]
  },

  // 6. Tamil Nadu
  {
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'STATE',
    cities: [
      {
        name: 'Chennai',
        localAreas: ['T. Nagar Panagal Park', 'Adyar Ward 172', 'Anna Nagar Roundtana', 'Mylapore Kutchery Road', 'Velachery 100ft Road', 'OMR Thoraipakkam', 'Alwarpet', 'Nungambakkam', 'Kilpauk']
      },
      {
        name: 'Coimbatore',
        localAreas: ['R.S. Puram Ward 22', 'Gandhipuram', 'Peelamedu Avinashi Road', 'Saibaba Colony', 'Race Course', 'Saravanampatti']
      },
      {
        name: 'Madurai',
        localAreas: ['KK Nagar', 'Anna Nagar', 'Tallakulam', 'Simmakkal', 'SS Colony', 'Goripalayam']
      },
      {
        name: 'Tiruchirappalli (Trichy)',
        localAreas: ['Thillai Nagar', 'Cantonment', 'Srirangam Ward', 'K.K. Nagar', 'Ponmalai']
      },
      {
        name: 'Salem',
        localAreas: ['Fairlands', 'Alagapuram', 'Hasthampatti', 'Four Roads', 'Shevapet']
      }
    ]
  },

  // 7. Telangana
  {
    name: 'Telangana',
    code: 'TG',
    type: 'STATE',
    cities: [
      {
        name: 'Hyderabad',
        localAreas: ['HITEC City Cyber Towers', 'Banjara Hills Road No 12', 'Jubilee Hills Check Post', 'Gachibowli Financial District', 'Madhapur', 'Kukatpally KPHB Phase 3', 'Secunderabad Paradise', 'Begumpet', 'Ameerpet', 'Dilsukhnagar']
      },
      {
        name: 'Warangal',
        localAreas: ['Hanamkonda Subedari', 'Kazipet Station Road', 'Nayeem Nagar', 'Kakatiya Colony', 'Mandi Bazar']
      },
      {
        name: 'Nizamabad',
        localAreas: ['Khaleelwadi', 'Bodhan Road', 'Armoor Road', 'Subhash Nagar', 'Barkatpura']
      },
      {
        name: 'Karimnagar',
        localAreas: ['Collectorate Road', 'Mankammathota', 'Mukarrampura', 'Kashmirgadda']
      }
    ]
  },

  // 8. Gujarat
  {
    name: 'Gujarat',
    code: 'GJ',
    type: 'STATE',
    cities: [
      {
        name: 'Ahmedabad',
        localAreas: ['Bodakdev SG Highway', 'Satellite Ward', 'Navrangpura CG Road', 'Vastrapur Lake Beat', 'Prahlad Nagar', 'Maninagar', 'Paldi', 'Bopal', 'Chandkheda', 'Ashram Road']
      },
      {
        name: 'Surat',
        localAreas: ['Adajan Pal', 'Vesu VIP Road', 'Athwa Lines', 'Piplod', 'Varachha Diamond Market', 'Ring Road Textile Beat']
      },
      {
        name: 'Vadodara',
        localAreas: ['Alkapuri', 'Gotri Road', 'Manjalpur', 'Fatehgunj', 'Karelibaug', 'Akota']
      },
      {
        name: 'Rajkot',
        localAreas: ['Yagnik Road', 'Kalawad Road', 'University Road', 'Kotecha Chowk', '150 Feet Ring Road']
      },
      {
        name: 'Gandhinagar',
        localAreas: ['Sector 21', 'Sector 11 Infocity', 'Sector 7 Sachivalaya', 'Kudasan', 'Bhaijipura']
      }
    ]
  },

  // 9. West Bengal
  {
    name: 'West Bengal',
    code: 'WB',
    type: 'STATE',
    cities: [
      {
        name: 'Kolkata',
        localAreas: ['Salt Lake Sector V', 'Park Street Camac St', 'New Town Action Area 1', 'Ballygunge Circular Road', 'Gariahat Market Beat', 'Shyambazar Five Point', 'Alipore Ward', 'Behala Chowrasta', 'Tollygunge']
      },
      {
        name: 'Howrah',
        localAreas: ['Shibpur Mandirtala', 'Salkia', 'Kadamtala', 'Bally Ward', 'Liluah', 'Howrah Maidan']
      },
      {
        name: 'Siliguri',
        localAreas: ['Pradhan Nagar', 'Sevoke Road', 'Hakim Para', 'College Para', 'Matigara']
      },
      {
        name: 'Asansol - Durgapur',
        localAreas: ['City Centre Durgapur', 'Benachity', 'Asansol Court Area', 'Burnpur Road', 'Ushagram']
      }
    ]
  },

  // 10. Rajasthan
  {
    name: 'Rajasthan',
    code: 'RJ',
    type: 'STATE',
    cities: [
      {
        name: 'Jaipur',
        localAreas: ['Malviya Nagar Sector 4', 'Vaishali Nagar Amrapali', 'C-Scheme Ashok Nagar', 'Mansarovar Metro Beat', 'Raja Park', 'Jagatpura', 'Bani Park', 'Tonk Road']
      },
      {
        name: 'Jodhpur',
        localAreas: ['Shastri Nagar', 'Ratanada', 'Sardarpura 9th C Road', 'Paota', 'Pal Road']
      },
      {
        name: 'Udaipur',
        localAreas: ['Fatehpura', 'Hiran Magri Sector 4', 'Panchwati', 'Saheli Nagar', 'Sukher']
      },
      {
        name: 'Kota',
        localAreas: ['Vigyan Nagar', 'Talwandi Circle', 'Landmark City Kunhari', 'Rajeev Gandhi Nagar', 'Dadabari']
      },
      {
        name: 'Ajmer',
        localAreas: ['Civil Lines', 'Vaishali Nagar', 'Ana Sagar Circular', 'Adarsh Nagar', 'Panchsheel Nagar']
      }
    ]
  },

  // 11. Madhya Pradesh
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    type: 'STATE',
    cities: [
      {
        name: 'Indore',
        localAreas: ['Vijay Nagar Scheme 54', 'Palasia Old/New', 'Chappan Dukan Beat', 'Bhawarkua BRTS', 'Rajwada Ward', 'Bicholi Mardana', 'Rau Bypass']
      },
      {
        name: 'Bhopal',
        localAreas: ['Arera Colony E-3', 'MP Nagar Zone 1', 'Kolar Road Ward', 'TT Nagar New Market', 'Shahpura Lake Beat', 'Hoshangabad Road']
      },
      {
        name: 'Jabalpur',
        localAreas: ['Civil Lines', 'Wright Town', 'Napier Town', 'Gorakhpur Market', 'Vijay Nagar']
      },
      {
        name: 'Gwalior',
        localAreas: ['City Center', 'Lashkar Phoolbagh', 'Morar', 'Thatipur', 'Jayendraganj']
      },
      {
        name: 'Ujjain',
        localAreas: ['Freeganj', 'Mahakal Corridor Ward', 'Tower Chowk', 'Nanakeda', 'Sethi Nagar']
      }
    ]
  },

  // 12. Kerala
  {
    name: 'Kerala',
    code: 'KL',
    type: 'STATE',
    cities: [
      {
        name: 'Kochi',
        localAreas: ['Panampilly Nagar', 'Kakkanad Infopark', 'Marine Drive MG Road', 'Edappally Toll', 'Fort Kochi Heritage Beat', 'Palarivattom']
      },
      {
        name: 'Thiruvananthapuram',
        localAreas: ['Kowdiar Ward', 'Kazhakoottam Technopark', 'Pattom Junction', 'Vellayambalam', 'Statue MG Road', 'Sasthamangalam']
      },
      {
        name: 'Kozhikode (Calicut)',
        localAreas: ['Mavoor Road', 'SM Street Heritage', 'Nadakkavu', 'Palayam Market', 'Chevayur']
      },
      {
        name: 'Thrissur',
        localAreas: ['Swaraj Round North', 'Ayyanthole Civil Station', 'East Fort', 'Puzhakkal', 'Ollur']
      }
    ]
  },

  // 13. Punjab
  {
    name: 'Punjab',
    code: 'PB',
    type: 'STATE',
    cities: [
      {
        name: 'Ludhiana',
        localAreas: ['Sarabha Nagar Market', 'Model Town Extension', 'BRS Nagar', 'Civil Lines', 'Ferozepur Road', 'Pakhowal Road']
      },
      {
        name: 'Amritsar',
        localAreas: ['Mall Road', 'Ranjit Avenue B Block', 'Lawrence Road', 'Golden Temple Corridor', 'Majitha Road']
      },
      {
        name: 'Jalandhar',
        localAreas: ['Model Town', 'Urban Estate Phase 2', 'Cantt Road', 'Civil Lines', 'BMC Chowk']
      },
      {
        name: 'SAS Nagar (Mohali)',
        localAreas: ['Phase 3B2 Market', 'Phase 7', 'Phase 5 Industrial', 'Sector 70', 'Sector 82 IT City']
      },
      {
        name: 'Patiala',
        localAreas: ['Leela Bhawan', 'Model Town', 'Urban Estate Phase 1', 'Baradari Gardens', 'Chhoti Baradari']
      }
    ]
  },

  // 14. Haryana
  {
    name: 'Haryana',
    code: 'HR',
    type: 'STATE',
    cities: [
      {
        name: 'Gurugram (Gurgaon)',
        localAreas: ['Cyber City DLF Phase 2', 'Golf Course Road Sector 54', 'Sohna Road Sector 48', 'MG Road IFFCO Chowk', 'Sector 29 Leisure Valley', 'Sector 56 Huda Market', 'New Gurgaon Sector 82']
      },
      {
        name: 'Faridabad',
        localAreas: ['Sector 15 Main Market', 'NIT 1', 'NIT 5', 'Sector 16', 'Greenfield Colony', 'Neharpar Sector 85']
      },
      {
        name: 'Panchkula',
        localAreas: ['Sector 7 Market', 'Sector 20 High Street', 'Sector 14', 'MDC Sector 5', 'Sector 8']
      },
      {
        name: 'Panipat',
        localAreas: ['Model Town', 'Sanjay Chowk', 'Sector 11-12 Huda', 'GT Road Beat', 'Ansal City']
      },
      {
        name: 'Ambala',
        localAreas: ['Ambala Cantt Nicholson Road', 'Model Town', 'Prem Nagar', 'Sector 8 City', 'Cloth Market']
      }
    ]
  },

  // 15. Andhra Pradesh
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'STATE',
    cities: [
      {
        name: 'Visakhapatnam (Vizag)',
        localAreas: ['Siripuram Junction', 'Beach Road RK Beach', 'Dwaraka Nagar', 'MVP Colony Sector 3', 'Gajuwaka', 'Madhurawada IT SEZ', 'Seethammadhara']
      },
      {
        name: 'Vijayawada',
        localAreas: ['MG Road Bandar Road', 'Benz Circle', 'Suryaraopet', 'Governorpet', 'Bhavanipuram', 'Gollapudi']
      },
      {
        name: 'Guntur',
        localAreas: ['Brodipet 4th Line', 'Arundelpet', 'Kothapet', 'Pattabhipuram', 'Vidyanagar']
      },
      {
        name: 'Tirupati',
        localAreas: ['Alipiri Bypass', 'Bairagipatteda', 'Chandragiri Road', 'KT Road', 'Tirumala Bypass']
      }
    ]
  },

  // 16. Odisha
  {
    name: 'Odisha',
    code: 'OD',
    type: 'STATE',
    cities: [
      {
        name: 'Bhubaneswar',
        localAreas: ['Saheed Nagar Janpath', 'Jayadev Vihar', 'Patia Infocity', 'Chandrasekharpur', 'Khandagiri', 'Nayapalli']
      },
      {
        name: 'Cuttack',
        localAreas: ['Badambadi Bus Terminal', 'College Square', 'Madhupatna', 'Cantonment Road', 'Bidanasi CDA Sector 6']
      },
      {
        name: 'Rourkela',
        localAreas: ['Civil Township', 'Koel Nagar', 'Panposh Road', 'Sector 5 Rourkela', 'Udit Nagar']
      },
      {
        name: 'Puri',
        localAreas: ['Grand Road Bada Danda', 'VIP Road', 'Chakratirtha Road', 'Sea Beach Police Station Beat', 'Baliapanda']
      }
    ]
  },

  // 17. Jharkhand
  {
    name: 'Jharkhand',
    code: 'JH',
    type: 'STATE',
    cities: [
      {
        name: 'Ranchi',
        localAreas: ['Main Road Overbridge', 'Lalpur Circular Road', 'Doranda Ward 32', 'Harmu Housing Colony', 'Kanke Road', 'Hinoo', 'Morabadi Ground Beat']
      },
      {
        name: 'Jamshedpur',
        localAreas: ['Bistupur Main Road', 'Sakchi Market', 'Kadma', 'Sonari', 'Telco Colony', 'Golmuri']
      },
      {
        name: 'Dhanbad',
        localAreas: ['Bank More', 'Saraidhela', 'Hirapur', 'Steel Gate', 'Bartand Bus Stand']
      },
      {
        name: 'Bokaro Steel City',
        localAreas: ['Sector 4 City Centre', 'Sector 1', 'Sector 9', 'Chas Main Road', 'Cooperative Colony']
      }
    ]
  },

  // 18. Assam
  {
    name: 'Assam',
    code: 'AS',
    type: 'STATE',
    cities: [
      {
        name: 'Guwahati',
        localAreas: ['GS Road Christian Basti', 'RG Baruah Road Zoo Tiniali', 'Pan Bazaar', 'Paltan Bazaar', 'Dispur Capital Complex', 'Ganeshguri', 'Uzan Bazaar', 'Jalukbari']
      },
      {
        name: 'Silchar',
        localAreas: ['Tarapur', 'Rangirkhari', 'Srikona', 'Hospital Road', 'Ambikapatty']
      },
      {
        name: 'Dibrugarh',
        localAreas: ['Graham Bazaar', 'Chowkidinghee', 'Amolapatty', 'Jalan Nagar', 'Mancotta Road']
      },
      {
        name: 'Jorhat',
        localAreas: ['Gar-Ali', 'AT Road', 'Barbheta', 'Tarajan', 'Na-Ali']
      }
    ]
  },

  // 19. Chhattisgarh
  {
    name: 'Chhattisgarh',
    code: 'CG',
    type: 'STATE',
    cities: [
      {
        name: 'Raipur',
        localAreas: ['Pandri Cloth Market', 'Shankar Nagar', 'Telibandha Marine Drive', 'Civil Lines', 'Samta Colony', 'Tatibandh AIIMS Beat']
      },
      {
        name: 'Bhilai - Durg',
        localAreas: ['Sector 6 Civic Centre', 'Nehru Nagar', 'Supela', 'Padmanabhpur Durg', 'Smriti Nagar']
      },
      {
        name: 'Bilaspur',
        localAreas: ['Vyapar Vihar', 'Civil Lines', 'Link Road', 'Mungeli Naka', 'Koni High Court Beat']
      }
    ]
  },

  // 20. Uttarakhand
  {
    name: 'Uttarakhand',
    code: 'UK',
    type: 'STATE',
    cities: [
      {
        name: 'Dehradun',
        localAreas: ['Rajpur Road Jakhan', 'Paltan Bazaar', 'Clock Tower Chowk', 'Clement Town', 'Vasant Vihar', 'Ballupur', 'Dalanwala']
      },
      {
        name: 'Haridwar',
        localAreas: ['Har Ki Pauri Ghat Beat', 'Ranipur More', 'Jwalapur', 'BHEL Township Sector 1', 'Shivalik Nagar']
      },
      {
        name: 'Rishikesh',
        localAreas: ['Triveni Ghat', 'Tapovan', 'Laxman Jhula Road', 'Muni Ki Reti', 'AIIMS Virbhadra']
      },
      {
        name: 'Haldwani',
        localAreas: ['Nainital Road', 'Kaladhungi Road', 'Mukhani', 'Tikonia', 'Kathgodam Station Beat']
      }
    ]
  },

  // 21. Himachal Pradesh
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    type: 'STATE',
    cities: [
      {
        name: 'Shimla',
        localAreas: ['Mall Road Ridge', 'Chotta Shimla', 'Sanjauli', 'Kasumpti', 'Boileauganj', 'Lakkar Bazaar']
      },
      {
        name: 'Dharamshala - McLeod Ganj',
        localAreas: ['Kotwali Bazaar', 'McLeod Ganj Temple Road', 'Bhagsunag', 'Dharamsala Cantt', 'Forsyth Ganj']
      },
      {
        name: 'Mandi - Kullu - Manali',
        localAreas: ['Mall Road Manali', 'Old Manali', 'Dhalpur Kullu', 'Mandi Town Hall', 'Bhangrotu']
      },
      {
        name: 'Solan - Baddi',
        localAreas: ['Mall Road Solan', 'Chambaghat', 'Baddi Industrial Area Phase 1', 'Barotiwala']
      }
    ]
  },

  // 22. Jammu and Kashmir
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    type: 'UT',
    cities: [
      {
        name: 'Srinagar',
        localAreas: ['Lal Chowk Clock Tower', 'Dal Lake Boulevard', 'Rajbagh', 'Karan Nagar', 'Dalgate', 'Batamaloo', 'Hazratbal']
      },
      {
        name: 'Jammu',
        localAreas: ['Gandhi Nagar Gole Market', 'Trikuta Nagar', 'Bahu Plaza Rail Head', 'Old City Raghunath Bazaar', 'Channi Himmat']
      },
      {
        name: 'Anantnag',
        localAreas: ['KP Road', 'Lal Chowk Anantnag', 'Nai Basti', 'Achabal Adda', 'Ashajipora']
      }
    ]
  },

  // 23. Goa
  {
    name: 'Goa',
    code: 'GA',
    type: 'STATE',
    cities: [
      {
        name: 'North Goa (Panaji / Mapusa)',
        localAreas: ['Fontainhas Latin Quarter', 'Miramar Beach Road', 'Campal', 'Mapusa Municipal Market', 'Porvorim Alto', 'Calangute Beat']
      },
      {
        name: 'South Goa (Margao / Vasco)',
        localAreas: ['Margao Municipal Garden', 'Fatorda Stadium Beat', 'Borda', 'Vasco Da Gama Swatantra Path', 'Colva Beach Road']
      }
    ]
  },

  // 24. Chandigarh
  {
    name: 'Chandigarh',
    code: 'CH',
    type: 'UT',
    cities: [
      {
        name: 'Chandigarh Capital City',
        localAreas: ['Sector 17 Plaza', 'Sector 35 Inner Market', 'Sector 22 Shastri Market', 'Sector 8 Inner Market', 'Sector 43 Bus Terminal', 'Manimajra Housing Complex', 'IT Park Kishangarh']
      }
    ]
  },

  // 25. Tripura
  {
    name: 'Tripura',
    code: 'TR',
    type: 'STATE',
    cities: [
      {
        name: 'Agartala',
        localAreas: ['Ujjayanta Palace Beat', 'Banamalipur', 'Dhaleswar', 'Kunjaban', 'Radhanagar', 'Battala']
      },
      {
        name: 'Dharmanagar - Udaipur',
        localAreas: ['Central Road', 'Rajbari Ward', 'Hospital Road', 'Subhash Pally']
      }
    ]
  },

  // 26. Meghalaya
  {
    name: 'Meghalaya',
    code: 'ML',
    type: 'STATE',
    cities: [
      {
        name: 'Shillong',
        localAreas: ['Police Bazar Khyndailad', 'Laitumkhrah Main Road', 'Mawlai', 'Labam Ward', 'Nongthymmai', 'Malki Point']
      },
      {
        name: 'Tura',
        localAreas: ['Hawakhana', 'Chandmary', 'Arapetta', 'Rongkhon', 'New Tura']
      }
    ]
  },

  // 27. Manipur
  {
    name: 'Manipur',
    code: 'MN',
    type: 'STATE',
    cities: [
      {
        name: 'Imphal',
        localAreas: ['Thangal Bazar', 'Paona Bazar', 'Kangla Fort Beat', 'Singjamei', 'Kwakeithel', 'Lamphelpat']
      },
      {
        name: 'Churachandpur',
        localAreas: ['Tuibong', 'IB Road', 'Tedim Road', 'Rengkai', 'Hiangtam Lamka']
      }
    ]
  },

  // 28. Nagaland
  {
    name: 'Nagaland',
    code: 'NL',
    type: 'STATE',
    cities: [
      {
        name: 'Kohima',
        localAreas: ['Razhu Point', 'PR Hill', 'High School Colony', 'Midland', 'Kezieke', 'Kitsubozou']
      },
      {
        name: 'Dimapur',
        localAreas: ['Nyamo Lotha Road', 'City Tower Point', 'Duncan Bosti', 'Purana Bazaar', 'Walford']
      }
    ]
  },

  // 29. Mizoram
  {
    name: 'Mizoram',
    code: 'MZ',
    type: 'STATE',
    cities: [
      {
        name: 'Aizawl',
        localAreas: ['Zarkawt Main Street', 'Dawrpui Commercial', 'Khatla', 'Chanmari', 'Bawngkawn', 'Ramhlun']
      },
      {
        name: 'Lunglei',
        localAreas: ['Venglai', 'Bazar Veng', 'Farm Veng', 'Rahsi Veng', 'Electric Veng']
      }
    ]
  },

  // 30. Arunachal Pradesh
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    type: 'STATE',
    cities: [
      {
        name: 'Itanagar - Naharlagun',
        localAreas: ['Ganga Market', 'Bank Tinali', 'Civil Secretariat Beat', 'E-Sector Naharlagun', 'Model Village']
      },
      {
        name: 'Pasighat - Tawang',
        localAreas: ['Main Market Pasighat', 'Old Market Tawang', 'DC Office Road', 'Mirku']
      }
    ]
  },

  // 31. Sikkim
  {
    name: 'Sikkim',
    code: 'SK',
    type: 'STATE',
    cities: [
      {
        name: 'Gangtok',
        localAreas: ['MG Marg Promenade', 'Deorali', 'Tadong Mile 5', 'Burtuk', 'Development Area', 'Arithang']
      },
      {
        name: 'Namchi - Geyzing',
        localAreas: ['Central Park Namchi', 'Assangthang', 'Geyzing Bazaar', 'Pelling Beat']
      }
    ]
  },

  // 32. Puducherry
  {
    name: 'Puducherry',
    code: 'PY',
    type: 'UT',
    cities: [
      {
        name: 'Puducherry Town',
        localAreas: ['White Town Promenade', 'Mission Street', 'Heritage French Quarter', 'Lawspet', 'Muthialpet', 'Villianur']
      }
    ]
  },

  // 33. Ladakh
  {
    name: 'Ladakh',
    code: 'LA',
    type: 'UT',
    cities: [
      {
        name: 'Leh',
        localAreas: ['Main Bazaar Leh', 'Changspa Road', 'Choglamsar', 'Fort Road', 'Skara']
      },
      {
        name: 'Kargil',
        localAreas: ['Main Market Kargil', 'Baroo Colony', 'Biamathang', 'Tithong']
      }
    ]
  },

  // 34. Andaman and Nicobar Islands
  {
    name: 'Andaman & Nicobar',
    code: 'AN',
    type: 'UT',
    cities: [
      {
        name: 'Port Blair',
        localAreas: ['Aberdeen Bazaar', 'Phoenix Bay', 'Haddo', 'Junglighat', 'Garacharma', 'Dollygunj']
      }
    ]
  },

  // 35. Dadra and Nagar Haveli and Daman and Diu
  {
    name: 'Daman & Diu',
    code: 'DD',
    type: 'UT',
    cities: [
      {
        name: 'Daman & Silvassa',
        localAreas: ['Nani Daman Seaface', 'Moti Daman Fort Beat', 'Silvassa Naroli Road', 'Diu Fort Road']
      }
    ]
  },

  // 36. Lakshadweep
  {
    name: 'Lakshadweep',
    code: 'LD',
    type: 'UT',
    cities: [
      {
        name: 'Kavaratti & Agatti',
        localAreas: ['Kavaratti Secretariat Beat', 'Agatti Island Jetty', 'Andrott Beach Ward']
      }
    ]
  }
];

export const getAllStates = (): string[] => {
  return INDIA_LOCATIONS.map(s => s.name);
};

export const getCitiesForState = (stateName: string): string[] => {
  const state = INDIA_LOCATIONS.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  if (!state || !state.cities) return ['Patna', 'Gaya', 'Muzaffarpur'];
  return state.cities.map(c => c.name);
};

export const getLocalAreasForCity = (stateName: string, cityName: string): string[] => {
  const state = INDIA_LOCATIONS.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  if (!state) return [];
  const city = state.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  if (!city) return [];
  return city.localAreas;
};
