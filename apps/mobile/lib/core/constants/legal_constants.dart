/// Single Source of Truth for Legal, Corporate, and Compliance Information in Nagrik Mobile.
/// Consumes the exact corporate, contact, disclaimer, and sources configuration
/// aligned with the Nagrik web platform.
class LegalConstants {
  LegalConstants._();

  // Official Corporate Identity
  static const String companyName = 'Wizzling Pvt Ltd';
  static const String legalEntity = 'Wizzling Pvt Ltd';
  static const String brandName = 'Nagrik';
  static const String tagline = 'Hyperlocal journalism for a more informed India.';

  // Registered Office Address
  static const String streetAddress = 'Koilwar, Arrah';
  static const String district = 'Bhojpur';
  static const String city = 'Patna';
  static const String state = 'Bihar';
  static const String pincode = '802163';
  static const String country = 'India';
  static const String fullRegisteredAddress =
      'Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, India';

  // Official Communication Channels
  static const String supportEmail = 'wizzlingsupport@gmail.com';
  static const String editorialEmail = 'wizzlingsupport@gmail.com';
  static const String grievanceEmail = 'wizzlingsupport@gmail.com';
  static const String privacyEmail = 'wizzlingsupport@gmail.com';
  static const String legalEmail = 'wizzlingsupport@gmail.com';

  static const String phoneNumber = '+91 8890043675';
  static const String phoneRaw = '8890043675';
  static const String phoneTelUri = 'tel:+918890043675';
  static const String supportMailtoUri = 'mailto:wizzlingsupport@gmail.com';

  // Resident Grievance Officer Details (IT Rules 2021 & DPDP Act 2023)
  static const String grievanceOfficerName = 'Grievance Officer';
  static const String grievanceOfficerDesignation = 'Resident Grievance Officer';
  static const String grievanceResponseTime = 'Acknowledgment within 24 hours; redressal within 15 days.';

  // Statutory Non-Government-Affiliation Disclaimer Text
  static const String disclaimerShortEn =
      'Nagrik is an independent digital news and civic information platform operated by Wizzling Pvt Ltd. Nagrik is NOT a government application and is not affiliated with, endorsed by, sponsored by, or operated by any government authority.';

  static const String disclaimerShortHi =
      'नागरिक विज़लिंग प्राइवेट लिमिटेड (Wizzling Pvt Ltd) द्वारा संचालित एक स्वतंत्र डिजिटल समाचार एवं नागरिक सूचना मंच है। नागरिक कोई सरकारी एप्लिकेशन नहीं है और यह भारत सरकार या किसी भी राज्य/स्थानीय सरकार से संबद्ध नहीं है।';

  static const String disclaimerFullEn =
      'Nagrik is an independent digital news and civic information platform operated by Wizzling Pvt Ltd.\n\n'
      'Nagrik is NOT a government application and is not affiliated with, endorsed by, sponsored by, or operated by the Government of India, any State Government, District Administration, Municipal Corporation, Panchayat, or other government authority.\n\n'
      'Nagrik does not provide government services or act on behalf of any government authority. Government-related information may be obtained from publicly available official sources. Nagrik presents such information for informational and journalistic purposes. Users should verify important information with the original issuing authority.';

  static const String disclaimerFullHi =
      'नागरिक (Nagrik) विज़लिंग प्राइवेट लिमिटेड (Wizzling Pvt Ltd) द्वारा संचालित एक स्वतंत्र डिजिटल समाचार एवं नागरिक सूचना मंच है।\n\n'
      'नागरिक कोई सरकारी एप्लिकेशन नहीं है और यह भारत सरकार, किसी भी राज्य सरकार, जिला प्रशासन, नगर निगम, पंचायत अथवा किसी भी सरकारी प्राधिकरण से संबद्ध, समर्थित, प्रायोजित या संचालित नहीं है।\n\n'
      'नागरिक कोई सरकारी सेवाएं प्रदान नहीं करता है और न ही किसी सरकारी प्राधिकरण की ओर से कार्य करता है। सरकार से संबंधित जानकारी सार्वजनिक रूप से उपलब्ध आधिकारिक स्रोतों से प्राप्त की जा सकती है। नागरिक ऐसी जानकारी को सूचनात्मक और पत्रकारिता के उद्देश्यों से प्रस्तुत करता है। उपयोगकर्ताओं को महत्वपूर्ण जानकारी का सत्यापन मूल जारीकर्ता प्राधिकरण से स्वयं करना चाहिए।';

  // Official Public Sources Directory
  static const List<Map<String, String>> verifiedOfficialSources = [
    {
      'name': 'Government of India (National Portal)',
      'url': 'https://www.india.gov.in/',
      'description':
          'Official single-entry portal to access information and public services provided by the Indian Government.',
    },
    {
      'name': 'Open Government Data (OGD) Platform India',
      'url': 'https://www.data.gov.in/',
      'description':
          'Open government datasets published by Ministries, Departments, and public agencies.',
    },
    {
      'name': 'India Meteorological Department (IMD)',
      'url': 'https://mausam.imd.gov.in/',
      'description':
          'Official national weather forecasts, cyclone alerts, and meteorological bulletins.',
    },
    {
      'name': 'Ministry of Road Transport & Highways (MoRTH)',
      'url': 'https://morth.nic.in/',
      'description':
          'National highway advisories, road safety standards, and transportation notifications.',
    },
    {
      'name': 'Press Information Bureau (PIB)',
      'url': 'https://pib.gov.in/',
      'description':
          'Official press releases and factual statements on Union Government decisions and policies.',
    },
  ];

  // Canonical Web Policy URLs (Currently live on Vercel; transitions to https://nagrik.news upon custom domain DNS activation)
  static const String webBaseUrl = 'https://nagrik-website-sage.vercel.app';
  static const String urlContact = '$webBaseUrl/contact';
  static const String urlAbout = '$webBaseUrl/about';
  static const String urlGovernmentDisclaimer = '$webBaseUrl/government-disclaimer';
  static const String urlSources = '$webBaseUrl/sources';
  static const String urlEditorialGuidelines = '$webBaseUrl/editorial-guidelines';
  static const String urlContentPolicy = '$webBaseUrl/content-policy';
  static const String urlCorrections = '$webBaseUrl/corrections';
  static const String urlCommunityGuidelines = '$webBaseUrl/community-guidelines';
  static const String urlPublisherGuidelines = '$webBaseUrl/publisher-guidelines';
  static const String urlCopyright = '$webBaseUrl/copyright';
  static const String urlPrivacyPolicy = '$webBaseUrl/privacy';
  static const String urlTermsOfService = '$webBaseUrl/terms';
  static const String urlAdvertising = '$webBaseUrl/advertising';
  static const String urlTransparency = '$webBaseUrl/transparency';
  static const String urlAccessibility = '$webBaseUrl/accessibility';
  static const String urlGrievance = '$webBaseUrl/grievance';
  static const String urlReportContent = '$webBaseUrl/report';
}
