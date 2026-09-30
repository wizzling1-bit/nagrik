'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'hi' | 'en';

export interface Translations {
  // Navigation
  topTickerLive: string;
  topTickerNetwork: string;
  creatorCta: string;
  adminLink: string;
  navHome: string;
  navNews: string;
  navWhyNagrik: string;
  navHowItWorks: string;
  navCoverage: string;
  navPublishers: string;
  navRadar: string;
  navCalculator: string;
  navTerms: string;
  navContact: string;
  navDownloadApp: string;
  navPublisherPortal: string;
  selectCity: string;

  // Hero Section
  heroEyebrow: string;
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroDownloadPlayStore: string;
  heroDownloadAppStore: string;
  heroScanQr: string;
  heroMetricRadius: string;
  heroMetricRadiusSub: string;
  heroMetricPrivacy: string;
  heroMetricPrivacySub: string;
  heroMetricUpdates: string;
  heroMetricUpdatesSub: string;
  heroMetricCpm: string;
  heroMetricCpmSub: string;
  heroMetricPayout: string;
  heroMetricPayoutSub: string;
  heroSimulatorLiveStatus: string;
  heroSimulatorHeadline1: string;
  heroSimulatorHeadline2: string;

  // News / Videos Section (Primary Proof)
  newsSectionBadge: string;
  newsSectionTitle: string;
  newsSectionSubtitle: string;
  newsFilterAll: string;
  newsFilterVideos: string;
  newsFilterArticles: string;
  newsFeaturedTag: string;
  newsReadStory: string;
  newsWatchVideo: string;
  newsReadMore: string;
  newsVerifiedBadge: string;
  newsReportIncidentBannerTitle: string;
  newsReportIncidentBannerSub: string;
  newsReportIncidentBtn: string;

  // Why Nagrik Section
  whyBadge: string;
  whyTitle1: string;
  whyTitle2: string;
  whySubtitle: string;
  whyCard1Title: string;
  whyCard1Desc: string;
  whyCard2Title: string;
  whyCard2Desc: string;
  whyCard3Title: string;
  whyCard3Desc: string;
  whyCard4Title: string;
  whyCard4Desc: string;

  // How Nagrik Works
  howBadge: string;
  howTitle: string;
  howSubtitle: string;
  howStep1Num: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Num: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Num: string;
  howStep3Title: string;
  howStep3Desc: string;

  // City Coverage Section
  coverageBadge: string;
  coverageTitle: string;
  coverageSubtitle: string;
  coverageActiveStatus: string;
  coverageWards: string;
  coverageViewAll: string;

  // Publisher Gateway Section (Homepage)
  publisherGatewayBadge: string;
  publisherGatewayTitle: string;
  publisherGatewaySubtitle: string;
  publisherPillar1: string;
  publisherPillar2: string;
  publisherPillar3: string;
  publisherPillar4: string;
  publisherGatewayCta: string;

  // Dedicated Publisher / Earnings Page
  pubHeroTitle: string;
  pubHeroSubtitle: string;
  pubCalcTitle: string;
  pubCalcSubtitle: string;
  pubMonthlyViewsLabel: string;
  pubVerifiedViews: string;
  pubTimeframeMonthly: string;
  pubTimeframeAnnual: string;
  pubTimeframeDaily: string;
  pubCpmRateLabel: string;
  pubGrossPayoutLabel: string;
  pubPayoutMethodLabel: string;
  pubZeroFees: string;
  pubLaunchStudioBtn: string;
  pubRule1Title: string;
  pubRule1Desc: string;
  pubRule2Title: string;
  pubRule2Desc: string;
  pubRule3Title: string;
  pubRule3Desc: string;

  // App Download Banner
  downloadBadge: string;
  downloadTitle: string;
  downloadSubtitle: string;
  downloadFeature1: string;
  downloadFeature2: string;
  downloadFeature3: string;
  downloadFeature4: string;
  downloadScanCamera: string;
  downloadScanHelp: string;
  downloadCopyLink: string;
  downloadLinkCopied: string;

  // Consumer FAQ Section
  faqBadge: string;
  faqTitle: string;
  faqSubtitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;
  faq5Q: string;
  faq5A: string;
  faq6Q: string;
  faq6A: string;
  faq7Q: string;
  faq7A: string;

  // Footer
  footerMission: string;
  footerPlatformCol: string;
  footerPublishersCol: string;
  footerCompanyCol: string;
  footerLegalCol: string;
  footerLiveUpdates: string;
  footerRightsReserved: string;
  footerCraftedInIndia: string;
}

const translations: Record<Language, Translations> = {
  hi: {
    topTickerLive: 'लाइव नेटवर्क',
    topTickerNetwork: '100+ शहरों में ग्राउंड रिपोर्टिंग • 5km वार्ड प्राथमिकता',
    creatorCta: 'प्रकाशक पोर्टल',
    adminLink: 'एडमिन',
    navHome: 'मुख्य पृष्ठ',
    navNews: 'समाचार व वीडियो',
    navWhyNagrik: 'नागरिक क्यों',
    navHowItWorks: 'कार्यप्रणाली',
    navCoverage: 'शहर कवरेज',
    navPublishers: 'प्रकाशकों के लिए',
    navRadar: 'वार्ड रडार',
    navCalculator: 'कमाई कैलकुलेटर',
    navTerms: 'नीति व नियम',
    navContact: 'संपर्क',
    navDownloadApp: 'ऐप डाउनलोड',
    navPublisherPortal: 'प्रकाशक स्टूडियो',
    selectCity: 'शहर चुनें',

    heroEyebrow: 'स्थानीय समाचार · आपका शहर · आपका समुदाय',
    heroBadge: 'नागरिक मोबाइल ऐप • 100+ शहरों में सक्रिय',
    heroHeadline1: 'आपके मोहल्ले की खबर।',
    heroHeadline2: 'ठीक उस वक्त, जब मायने रखती है।',
    heroSubtitle: 'अपने आसपास के मोहल्ले की सच्ची घटनाएं, नागरिक समस्याएं और 4K वीडियो रील्स देखें — सीधे आपके शहर और वार्ड से, बिना किसी कॉर्पोरेट सेंसर के।',
    heroCtaPrimary: 'नागरिक ऐप डाउनलोड करें',
    heroCtaSecondary: 'विशेषताएं देखें ↓',
    heroDownloadPlayStore: 'Google Play',
    heroDownloadAppStore: 'App Store',
    heroScanQr: 'QR कोड स्कैन करें',
    heroMetricRadius: '5 किमी दायरा',
    heroMetricRadiusSub: 'सख्त वार्ड जीपीएस प्राथमिकता',
    heroMetricPrivacy: '100% निःशुल्क',
    heroMetricPrivacySub: 'कोई लॉगिन या पासवर्ड नहीं',
    heroMetricUpdates: '60 FPS रील्स',
    heroMetricUpdatesSub: 'प्रत्यक्षदर्शी वीडियो बाइट्स',
    heroMetricCpm: '$1.50 CPM',
    heroMetricCpmSub: 'सत्यापित 1,000 रीड्स पर',
    heroMetricPayout: 'तत्काल UPI',
    heroMetricPayoutSub: 'सीधे बैंक खाते में',
    heroSimulatorLiveStatus: 'लाइव वार्ड मॉनिटरिंग',
    heroSimulatorHeadline1: 'वाराणसी गोदौलिया स्मार्ट ट्रैफिक सिग्नल पूर्ण',
    heroSimulatorHeadline2: 'पटना कंकड़बाग ड्रेनेज पंपिंग ट्रायल सफल',

    newsSectionBadge: 'ग्राउंड रिपोर्टिंग व वीडियो',
    newsSectionTitle: 'आज की स्थानीय खबरें व वीडियो बाइट्स',
    newsSectionSubtitle: 'कवर किए गए म्युनिसिपल वार्ड्स से सीधे दर्ज की गई ग्राउंड रिपोर्टें और वीडियो। स्वतंत्र, निष्पक्ष और जीपीएस सत्यापित।',
    newsFilterAll: 'सभी रिपोर्टें',
    newsFilterVideos: '4K वीडियो बाइट्स',
    newsFilterArticles: 'विस्तृत आलेख',
    newsFeaturedTag: 'मुख्य स्टोरी',
    newsReadStory: 'पूरी खबर पढ़ें →',
    newsWatchVideo: 'वीडियो देखें →',
    newsReadMore: 'पूरा पढ़ें →',
    newsVerifiedBadge: 'सत्यापित ग्राउंड',
    newsReportIncidentBannerTitle: 'क्या आपके मोहल्ले में कोई जरूरी खबर या समस्या है?',
    newsReportIncidentBannerSub: 'नागरिक ऐप के माध्यम से सीधे अपने फोन से ग्राउंड रिपोर्ट, फोटो या वीडियो साझा करें।',
    newsReportIncidentBtn: 'घटना रिपोर्ट करें',

    whyBadge: 'नागरिक क्यों?',
    whyTitle1: 'आपका मोहल्ला और वार्ड,',
    whyTitle2: 'सबसे पहले।',
    whySubtitle: 'नागरिक एक सरल उद्देश्य के लिए निर्मित है: आपके 5 किमी दायरे में क्या घट रहा है, उसे बिना किसी कॉर्पोरेट फिल्टर के आप तक पहुंचाना।',
    whyCard1Title: '5 किमी स्थानीय परिधि',
    whyCard1Desc: 'केवल आपके मोहल्ले और नगर निगम वार्ड से जुड़ी महत्वपूर्ण बुनियादी खबरें और नागरिक अलर्ट्स प्राथमिकता पर मिलते हैं।',
    whyCard2Title: '4K वीडियो रील्स',
    whyCard2Desc: 'घटनास्थल से स्थानीय नागरिकों द्वारा रिकॉर्ड किए गए 60fps वीडियो बाइट्स। कोई स्टूडियो प्रोपेगैंडा नहीं, सिर्फ सच्ची फुटेज।',
    whyCard3Title: '1-टैप में रिपोर्ट करें',
    whyCard3Desc: 'फोटो और वॉयस नोट के साथ अपने वार्ड की नागरिक समस्या तुरंत रिपोर्ट करें। स्वचालित जीपीएस स्थान दर्ज होता है।',
    whyCard4Title: 'कोई लॉगिन बाध्यता नहीं',
    whyCard4Desc: 'बिना किसी ईमेल, फोन नंबर या पासवर्ड के तुरंत स्थानीय समाचार व वीडियो देखना शुरू करें। पूर्ण गोपनीयता।',

    howBadge: 'कार्यप्रणाली',
    howTitle: 'सच्चाई आप तक कैसे पहुंचती है?',
    howSubtitle: 'पारंपरिक मीडिया के कॉर्पोरेट फिल्टर को हटाकर निष्पक्ष और स्वतंत्र खबरों का 3-चरणीय मॉडल।',
    howStep1Num: '01',
    howStep1Title: 'जमीन से सीधी रिपोर्टिंग',
    howStep1Desc: 'नागरिक और स्वतंत्र स्ट्रिंगर्स मौके से तस्वीरें, वीडियो और ग्राउंड तथ्य जीपीएस टाइमस्टैम्प के साथ दर्ज करते हैं।',
    howStep2Num: '02',
    howStep2Title: 'तथ्यों की सतर्क जांच',
    howStep2Desc: 'स्वचालित सुरक्षा विश्लेषण और क्षेत्रीय संपादकीय डेस्क प्रकाशन से पहले स्थानीय संदर्भ और तथ्यों की पुष्टि करते हैं।',
    howStep3Num: '03',
    howStep3Title: 'सीधे आपके वार्ड में प्रसारण',
    howStep3Desc: 'सत्यापित खबर संबंधित 5 किमी वार्ड के नागरिकों तक वास्तविक समय में पहुंचती है।',

    coverageBadge: 'शहर कवरेज',
    coverageTitle: 'भारतीय शहरों में नागरिक का विस्तार',
    coverageSubtitle: 'प्रमुख नगर निगमों में सक्रिय वार्ड कवरेज और स्थानीय रिपोर्टिंग नेटवर्क।',
    coverageActiveStatus: 'सक्रिय कवरेज',
    coverageWards: 'वार्ड स्तर पर सक्रिय',
    coverageViewAll: 'सभी शहर देखें →',

    publisherGatewayBadge: 'स्वतंत्र पत्रकारिता',
    publisherGatewayTitle: 'स्थानीय पत्रकारिता को सशक्त बनाने का मंच',
    publisherGatewaySubtitle: 'क्या आप स्वतंत्र पत्रकार, स्ट्रिंगर या जागरूक नागरिक हैं? अपने वार्ड से रिपोर्ट करें, स्थानीय पाठकों तक पहुंचें और पारदर्शी रूप से सम्मानित कमाई पाएं।',
    publisherPillar1: 'अपने वार्ड से स्वतंत्र रूप से रिपोर्ट करें',
    publisherPillar2: '5 किमी दायरे के स्थानीय पाठकों तक सीधी पहुंच',
    publisherPillar3: '100% बौद्धिक संपदा और कॉपीराइट आपका',
    publisherPillar4: 'गारंटीड $1.50 CPM पारदर्शी UPI भुगतान',
    publisherGatewayCta: 'प्रकाशक कार्यक्रम व कमाई कैलकुलेटर देखें →',

    pubHeroTitle: 'स्थानीय ग्राउंड स्ट्रिंगर बनें',
    pubHeroSubtitle: 'नागरिक पर स्वतंत्र रिपोर्टर के रूप में अपने मोहल्ले की आवाज उठाएं और पारदर्शी रूप से $1.50 CPM की दर से कमाई करें।',
    pubCalcTitle: 'पारदर्शी कमाई कैलकुलेटर',
    pubCalcSubtitle: 'अपनी अनुमानित मासिक रीड्स और वीडियो व्यूज के आधार पर संभावित आय की गणना करें।',
    pubMonthlyViewsLabel: 'अनुमानित सत्यापित रीड्स व व्यूज',
    pubVerifiedViews: 'सत्यापित व्यूज',
    pubTimeframeMonthly: 'मासिक',
    pubTimeframeAnnual: 'वार्षिक',
    pubTimeframeDaily: 'दैनिक',
    pubCpmRateLabel: 'गारंटीड CPM दर',
    pubGrossPayoutLabel: 'अनुमानित कुल आय',
    pubPayoutMethodLabel: 'भुगतान माध्यम',
    pubZeroFees: 'शून्य प्लेटफॉर्म शुल्क • सीधे UPI में',
    pubLaunchStudioBtn: 'प्रकाशक स्टूडियो में जाएं',
    pubRule1Title: 'सत्यापित रीड्स पर गणना',
    pubRule1Desc: 'प्रति डिवाइस अधिकतम 3 व्यूज की गणना की जाती है ताकि बोट्स और स्पैम से बचाव हो सके।',
    pubRule2Title: 'न्यूनतम ₹850 ($10) निकासी',
    pubRule2Desc: 'वॉलेट बैलेंस $10 होते ही GPay, PhonePe या बैंक खाते में 1-टैप निकासी।',
    pubRule3Title: 'कॉपीराइट सुरक्षा',
    pubRule3Desc: 'आपकी तस्वीरों और वीडियो का 100% बौद्धिक स्वामित्व सदैव आपके पास रहता है।',

    downloadBadge: '100% निःशुल्क उपभोक्ता मोबाइल ऐप',
    downloadTitle: 'अपने वार्ड और मोहल्ले की सच्ची खबर, सीधे आपकी जेब में।',
    downloadSubtitle: 'नागरिक ऐप में किसी लॉगिन, ईमेल या पासवर्ड की आवश्यकता नहीं है। बस ऐप इंस्टॉल करें और अपने 5 किमी दायरे के वीडियो और स्थानीय घोषणाएं तुरंत देखें।',
    downloadFeature1: 'कोई खाता या पासवर्ड नहीं (Zero Login)',
    downloadFeature2: '5 किमी सख्त जीपीएस वार्ड प्राथमिकता (Neighborhood First)',
    downloadFeature3: '60 FPS 4K वीडियो रील्स (Unfiltered Bytes)',
    downloadFeature4: 'सत्यापित ग्राउंड रिपोर्टिंग (Reliable Reporting)',
    downloadScanCamera: 'फोन कैमरे से स्कैन करें',
    downloadScanHelp: 'Android और iOS के लिए अनुकूलित',
    downloadCopyLink: 'वेबसाइट लिंक कॉपी करें',
    downloadLinkCopied: 'लिंक कॉपी हो गया!',

    faqBadge: 'उपभोक्ता सहायता व अक्सर पूछे जाने वाले प्रश्न',
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    faqSubtitle: 'नागरिक ऐप का उपयोग करने, स्थानीय समाचार खोजने और वीडियो देखने से संबंधित आवश्यक जानकारियां।',
    faq1Q: 'नागरिक क्या है?',
    faq1A: 'नागरिक एक हाइपरलोकल समाचार और शॉर्ट-वीडियो प्लेटफॉर्म है जो आपको आपके घर और कार्यस्थल के 5 किमी के भीतर होने वाली घटनाओं, नागरिक समस्याओं और स्थानीय विकास की निष्पक्ष जानकारी देता है।',
    faq2Q: 'नागरिक पर मुझे किस प्रकार के समाचार और वीडियो मिलेंगे?',
    faq2A: 'नागरिक पर आपको स्थानीय अवसंरचना (सड़क, जलजमाव, बिजली), नगर निगम के फैसले, स्थानीय यातायात अलर्ट, सांस्कृतिक कार्यक्रम और मोहल्ले के जागरूक नागरिकों द्वारा रिकॉर्ड किए गए 4K वीडियो रील्स मिलते हैं।',
    faq3Q: 'नागरिक को कैसे पता चलता है कि मेरे पास की खबर कौन सी है?',
    faq3A: 'ऐप आपके डिवाइस की अनुमति मिलने पर जीपीएस आधारित 5 किमी परिधि निर्धारित करता है, जिससे आपको केवल आपके वार्ड और आसपास की प्रासंगिक खबरें दिखाई देती हैं।',
    faq4Q: 'क्या समाचार पढ़ने और वीडियो देखने के लिए मुझे खाता बनाना होगा?',
    faq4A: 'बिल्कुल नहीं! नागरिक उपभोक्ता ऐप पूरी तरह से खाता-मुक्त (Zero-Auth) है। आप बिना किसी लॉगिन, ईमेल या पासवर्ड के तुरंत खबरें और वीडियो देख सकते हैं।',
    faq5Q: 'वर्तमान में नागरिक किन शहरों में उपलब्ध है?',
    faq5A: 'नागरिक पटना, वाराणसी, लखनऊ, बेंगलुरु, दिल्ली एनसीआर, मुंबई, पुणे और कोलकाता सहित 100 से अधिक भारतीय शहरों में सक्रिय है।',
    faq6Q: 'खबरों की प्रामाणिकता की जांच कैसे की जाती है?',
    faq6A: 'नागरिक पर अपलोड की जाने वाली प्रत्येक रिपोर्ट के जीपीएस निर्देशांक स्वचालित रूप से दर्ज होते हैं और क्षेत्रीय संपादकीय डेस्क प्रकाशन से पहले तथ्यों की पुष्टि करता है।',
    faq7Q: 'मैं नागरिक मोबाइल ऐप कहां से डाउनलोड कर सकता हूं?',
    faq7A: 'नागरिक मोबाइल ऐप Google Play Store और Apple App Store पर निःशुल्क उपलब्ध है। आप इस वेबसाइट पर दिए गए QR कोड को स्कैन करके भी इसे तुरंत इंस्टॉल कर सकते हैं।',

    footerMission: 'नागरिक भारत का पहला हाइपरलोकल ग्राउंड-जर्नलिज्म मंच है जो आपके 5 किमी दायरे की सच्ची घटनाओं को सीधे आप तक पहुंचाता है।',
    footerPlatformCol: 'मंच',
    footerPublishersCol: 'प्रकाशकों के लिए',
    footerCompanyCol: 'संस्था',
    footerLegalCol: 'नीति एवं कानूनी',
    footerLiveUpdates: '100+ शहरों में लाइव कवरेज',
    footerRightsReserved: 'सर्वाधिकार सुरक्षित। नागरिक न्यूज़ नेटवर्क।',
    footerCraftedInIndia: 'भारत में निर्मित • स्वदेशी नागरिक पत्रकारिता'
  },
  en: {
    topTickerLive: 'LIVE NETWORK',
    topTickerNetwork: 'Active Ground Reporting in 100+ Indian Cities • 5km Ward Priority',
    creatorCta: 'Publisher Portal',
    adminLink: 'Admin',
    navHome: 'Home',
    navNews: 'News & Videos',
    navWhyNagrik: 'Why Nagrik',
    navHowItWorks: 'How It Works',
    navCoverage: 'Coverage',
    navPublishers: 'For Publishers',
    navRadar: 'Ward Radar',
    navCalculator: 'Earnings Calculator',
    navTerms: 'Terms & Policies',
    navContact: 'Contact Us',
    navDownloadApp: 'Download App',
    navPublisherPortal: 'Publisher Studio',
    selectCity: 'Select City',

    heroEyebrow: 'Local News · Your City · Your Community',
    heroBadge: 'Nagrik Mobile App • Live across 100+ Indian cities',
    heroHeadline1: 'News from your neighborhood.',
    heroHeadline2: 'Right when it matters.',
    heroSubtitle: 'See local news, fast updates, and short videos from your neighborhood and city.',
    heroCtaPrimary: 'Download Nagrik',
    heroCtaSecondary: 'Explore Features ↓',
    heroDownloadPlayStore: 'Google Play',
    heroDownloadAppStore: 'App Store',
    heroScanQr: 'Scan QR Code',
    heroMetricRadius: '5 KM Radius',
    heroMetricRadiusSub: 'Strict neighborhood geofence',
    heroMetricPrivacy: '100% Free',
    heroMetricPrivacySub: 'No login or account needed',
    heroMetricUpdates: '60 FPS Reels',
    heroMetricUpdatesSub: 'Unfiltered eyewitness bytes',
    heroMetricCpm: '$1.50 CPM',
    heroMetricCpmSub: 'Per 1,000 Verified Reads',
    heroMetricPayout: 'Instant UPI',
    heroMetricPayoutSub: 'Direct to Bank / Wallet',
    heroSimulatorLiveStatus: 'Live Ward Monitoring',
    heroSimulatorHeadline1: 'Varanasi Godowlia Smart Traffic Signals Upgraded',
    heroSimulatorHeadline2: 'Patna Kankarbagh Drainage Pumping Trial Successful',

    newsSectionBadge: 'Local Journalism & Videos',
    newsSectionTitle: "Today's Local Stories & Short Videos",
    newsSectionSubtitle: 'Live updates straight from your local wards. Free from bias and verified on the ground.',
    newsFilterAll: 'All Reports',
    newsFilterVideos: '4K Video Bytes',
    newsFilterArticles: 'In-Depth Articles',
    newsFeaturedTag: 'Lead Story',
    newsReadStory: 'Read Story →',
    newsWatchVideo: 'Watch Video →',
    newsReadMore: 'Read Full Story →',
    newsVerifiedBadge: 'Verified Ground',
    newsReportIncidentBannerTitle: 'Witnessed something in your neighborhood?',
    newsReportIncidentBannerSub: 'Share breaking ground reports, photos, or video bytes directly through the Nagrik app.',
    newsReportIncidentBtn: 'Report Incident',

    whyBadge: 'Why Nagrik',
    whyTitle1: 'Your neighborhood',
    whyTitle2: 'comes first.',
    whySubtitle: 'Nagrik is built around one simple promise: discovering what is actually happening in the 5 km radius around where you live and work.',
    whyCard1Title: '5km Local Radius',
    whyCard1Desc: 'Stories, road disruptions, and municipal alerts prioritized strictly around your neighborhood.',
    whyCard2Title: '4K Video Bytes',
    whyCard2Desc: 'Watch quick, real videos filmed by locals on the street. No TV studio drama or fake hype.',
    whyCard3Title: 'Report in 1 Tap',
    whyCard3Desc: 'Snap a photo, record a quick voice note, and share it with your area using your location.',
    whyCard4Title: 'Zero-Account Friction',
    whyCard4Desc: 'Open the app and read news right away. No sign-up, no login, and no delay.',

    howBadge: 'How It Works',
    howTitle: 'How Ground Truth Reaches You',
    howSubtitle: 'A transparent 3-step process connecting ground reality directly to your smartphone.',
    howStep1Num: '01',
    howStep1Title: 'Captured Locally',
    howStep1Desc: 'Local residents and reporters share street news, road fixes, and community events as they happen.',
    howStep2Num: '02',
    howStep2Title: 'Reviewed Carefully',
    howStep2Desc: 'Local editors check each report to make sure facts are accurate before sharing.',
    howStep3Num: '03',
    howStep3Title: 'Delivered to Your Ward',
    howStep3Desc: 'Verified stories and videos go out directly to people living in that area.',

    coverageBadge: 'City Coverage',
    coverageTitle: 'Nagrik is growing across Indian cities',
    coverageSubtitle: 'Active coverage across municipal corporations with neighborhood-level reporting desks.',
    coverageActiveStatus: 'Active Coverage',
    coverageWards: 'Ward geofencing active',
    coverageViewAll: 'View all cities →',

    publisherGatewayBadge: 'Independent Journalism',
    publisherGatewayTitle: 'Built to empower local journalism',
    publisherGatewaySubtitle: 'Are you an independent stringer, citizen journalist, or community reporter? Publish verified stories, reach nearby audiences, and track eligible performance earnings.',
    publisherPillar1: 'Publish reports from your ward independently',
    publisherPillar2: 'Direct reach to citizens living within 5 km',
    publisherPillar3: '100% intellectual property & copyright retained',
    publisherPillar4: 'Standard $1.00 CPM rate card with direct UPI payouts',
    publisherGatewayCta: 'Explore Publisher Program & Earnings Calculator →',

    pubHeroTitle: 'Report for Your Neighborhood',
    pubHeroSubtitle: 'Join Nagrik as an independent ground reporter. Publish verified local stories and earn up to $1.00 CPM disbursed directly via UPI.',
    pubCalcTitle: 'Transparent Earnings Calculator',
    pubCalcSubtitle: 'Calculate your projected earnings based on verified monthly reads and video impressions.',
    pubMonthlyViewsLabel: 'Estimated Verified Reads & Views',
    pubVerifiedViews: 'verified views',
    pubTimeframeMonthly: 'Monthly',
    pubTimeframeAnnual: 'Annual',
    pubTimeframeDaily: 'Daily',
    pubCpmRateLabel: 'Standard CPM Rate',
    pubGrossPayoutLabel: 'Projected Gross Payout',
    pubPayoutMethodLabel: 'Payout Method',
    pubZeroFees: 'Zero Platform Fees • Direct UPI Disbursal',
    pubLaunchStudioBtn: 'Launch Creator Studio',
    pubRule1Title: 'Verified Reads Only',
    pubRule1Desc: 'Anti-fraud limit of maximum 3 monetized views per user/device protects creator pools.',
    pubRule2Title: '₹850 ($10) Minimum Disbursal',
    pubRule2Desc: 'Withdraw directly to your UPI ID (GPay, PhonePe, Paytm) once your balance reaches $10.',
    pubRule3Title: 'Full Copyright Ownership',
    pubRule3Desc: 'You retain 100% intellectual property ownership of all your photos, footage, and text.',

    downloadBadge: '100% FREE CONSUMER MOBILE APP',
    downloadTitle: 'Hyperlocal news and short videos, right in your pocket.',
    downloadSubtitle: 'No login, no email, and no passwords required on the Nagrik app. Simply install the app to watch verified 5km neighborhood videos and civic alerts instantly.',
    downloadFeature1: 'Zero Login or Registration Required (Zero-Auth)',
    downloadFeature2: 'Strict 5km GPS Geofencing (Neighborhood First)',
    downloadFeature3: '60 FPS 4K Video Reels (Unfiltered Eyewitness Bytes)',
    downloadFeature4: 'Fact-Checked Ground Reporting (Reliable Reporting)',
    downloadScanCamera: 'Scan with Phone Camera',
    downloadScanHelp: 'Compatible with Android 8.0+ & iOS 14.0+',
    downloadCopyLink: 'Copy Web Share Link',
    downloadLinkCopied: 'Link Copied to Clipboard!',

    faqBadge: 'CONSUMER HELP & FAQ',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Essential answers about discovering and watching local news and short videos on Nagrik.',
    faq1Q: 'What is Nagrik?',
    faq1A: 'Nagrik is a hyperlocal news and short-video product that helps people discover relevant local news and video bytes from their city and immediate 5km neighborhood.',
    faq2Q: 'What kind of local news and videos can I find on Nagrik?',
    faq2A: 'You can discover civic infrastructure updates (roads, drainage, water supply), municipal notices, local transit alerts, community breakthroughs, and 4K vertical video bytes filmed directly by residents on the ground.',
    faq3Q: 'How does Nagrik show news near me?',
    faq3A: 'With your device permission, the app uses an opt-in 5km GPS geofence radius so that you only see stories and alerts that are strictly relevant to your neighborhood and city ward.',
    faq4Q: 'Do I need an account to browse news and watch videos?',
    faq4A: 'No! The Nagrik consumer app is completely account-free (Zero-Auth). You can browse local stories and watch videos freely with zero login, email, or password required.',
    faq5Q: 'Which cities are currently supported?',
    faq5A: 'Nagrik is active across 100+ Indian cities, with primary active coverage in Patna, Varanasi, Lucknow, Bengaluru, Delhi NCR, Mumbai, Pune, and Kolkata.',
    faq6Q: 'How do you ensure stories are authentic?',
    faq6A: 'Every incident reported on Nagrik includes cryptographic GPS and timestamp metadata, followed by automated verification checks and review by regional editorial desks before wide algorithmic distribution.',
    faq7Q: 'Where can I download the Nagrik mobile app?',
    faq7A: 'The Nagrik mobile app is available for Android and iOS. You can download it directly from Google Play, Apple App Store, or by scanning the QR code on this website.',

    footerMission: 'Nagrik is an independent hyperlocal news and civic information platform operated by Wizzling Pvt Ltd, delivering relevant ground truth within your neighborhood without corporate studio filters.',
    footerPlatformCol: 'Platform',
    footerPublishersCol: 'For Publishers',
    footerCompanyCol: 'Company',
    footerLegalCol: 'Legal',
    footerLiveUpdates: 'Live in 100+ Indian Cities',
    footerRightsReserved: 'All rights reserved. Wizzling Pvt Ltd.',
    footerCraftedInIndia: 'Made in India • Independent Civic Journalism'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('nagrik_lang') as Language | null;
    if (savedLang === 'hi' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nagrik_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
