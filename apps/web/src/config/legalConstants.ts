/**
 * Single Source of Truth for Legal, Corporate, and Compliance Information.
 * Consumed across the Web application and aligned with the Flutter mobile app.
 *
 * DO NOT hardcode company, contact, or disclaimer information in individual components.
 */

export const LEGAL_CONFIG = {
  // Official Legal Entity
  companyName: 'Wizzling Pvt Ltd',
  legalEntity: 'Wizzling Pvt Ltd',
  brandName: 'Nagrik',
  tagline: 'Hyperlocal journalism for a more informed India.',

  // Registered Physical Address
  registeredAddress: {
    street: 'Koilwar, Arrah',
    district: 'Bhojpur',
    city: 'Patna',
    state: 'Bihar',
    pincode: '802163',
    country: 'India',
    fullFormatted: 'Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, India'
  },

  // Official Communication & Bureau Desks
  contacts: {
    supportEmail: 'wizzlingsupport@gmail.com',
    editorialEmail: 'wizzlingsupport@gmail.com',
    grievanceEmail: 'wizzlingsupport@gmail.com',
    privacyEmail: 'wizzlingsupport@gmail.com',
    legalEmail: 'wizzlingsupport@gmail.com',
    phone: '+91 8890043675',
    phoneRaw: '8890043675',
    phoneTel: 'tel:+918890043675'
  },

  // Officers
  grievanceOfficer: {
    name: 'Grievance Officer',
    designation: 'Resident Grievance Officer',
    email: 'wizzlingsupport@gmail.com',
    address: 'Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, India',
    responseWindow: '24 hours acknowledgment, 15 days statutory resolution'
  },

  // Canonical Web Routes
  urls: {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nagrik-website-sage.vercel.app',
    about: '/about',
    contact: '/contact',
    governmentDisclaimer: '/government-disclaimer',
    sources: '/sources',
    editorialGuidelines: '/editorial-guidelines',
    contentPolicy: '/content-policy',
    corrections: '/corrections',
    communityGuidelines: '/community-guidelines',
    publisherGuidelines: '/publisher-guidelines',
    copyright: '/copyright',
    privacy: '/privacy',
    terms: '/terms',
    advertising: '/advertising',
    transparency: '/transparency',
    accessibility: '/accessibility',
    grievance: '/grievance',
    report: '/report'
  },

  // Verified Official Government Sources legitimately referenced
  officialSources: [
    {
      name: 'Government of India (National Portal)',
      url: 'https://www.india.gov.in/',
      description: 'Official single-entry portal to access information and public services provided by the Indian Government.'
    },
    {
      name: 'Open Government Data (OGD) Platform India',
      url: 'https://www.data.gov.in/',
      description: 'Open government datasets published by Ministries, Departments, and public agencies.'
    },
    {
      name: 'India Meteorological Department (IMD)',
      url: 'https://mausam.imd.gov.in/',
      description: 'Official national weather forecasts, cyclone alerts, and meteorological bulletins.'
    },
    {
      name: 'Ministry of Road Transport & Highways (MoRTH)',
      url: 'https://morth.nic.in/',
      description: 'National highway advisories, road safety standards, and transportation notifications.'
    },
    {
      name: 'Press Information Bureau (PIB)',
      url: 'https://pib.gov.in/',
      description: 'Official press releases and factual statements on Union Government decisions and policies.'
    }
  ],

  // Statutory Non-Government-Affiliation Disclaimer Text
  disclaimer: {
    shortEn:
      'Nagrik is an independent digital news and civic information platform operated by Wizzling Pvt Ltd. Nagrik is NOT a government application and is not affiliated with, endorsed by, sponsored by, or operated by any government authority.',
    shortHi:
      'नागरिक विज़लिंग प्राइवेट लिमिटेड (Wizzling Pvt Ltd) द्वारा संचालित एक स्वतंत्र डिजिटल समाचार एवं नागरिक सूचना मंच है। नागरिक कोई सरकारी एप्लिकेशन नहीं है और यह भारत सरकार या किसी भी राज्य/स्थानीय सरकार से संबद्ध नहीं है।',
    fullEn:
      'Nagrik is an independent digital news and civic information platform operated by Wizzling Pvt Ltd. Nagrik is NOT a government application and is not affiliated with, endorsed by, sponsored by, or operated by the Government of India, any State Government, District Administration, Municipal Corporation, Panchayat, or other government authority. Nagrik does not provide government services or act on behalf of any government authority. Government-related information may be obtained from publicly available official sources. Nagrik presents such information for informational and journalistic purposes. Users should verify important information with the original issuing authority.',
    fullHi:
      'नागरिक (Nagrik) विज़लिंग प्राइवेट लिमिटेड (Wizzling Pvt Ltd) द्वारा संचालित एक स्वतंत्र डिजिटल समाचार एवं नागरिक सूचना मंच है। नागरिक कोई सरकारी एप्लिकेशन नहीं है और यह भारत सरकार, किसी भी राज्य सरकार, जिला प्रशासन, नगर निगम, पंचायत अथवा किसी भी सरकारी प्राधिकरण से संबद्ध, समर्थित, प्रायोजित या संचालित नहीं है। नागरिक कोई सरकारी सेवाएं प्रदान नहीं करता है और न ही किसी सरकारी प्राधिकरण की ओर से कार्य करता है। सरकार से संबंधित जानकारी सार्वजनिक रूप से उपलब्ध आधिकारिक स्रोतों से प्राप्त की जा सकती है। नागरिक ऐसी जानकारी को सूचनात्मक और पत्रकारिता के उद्देश्यों से प्रस्तुत करता है। उपयोगकर्ताओं को महत्वपूर्ण जानकारी का सत्यापन मूल जारीकर्ता प्राधिकरण से स्वयं करना चाहिए।'
  }
} as const;
