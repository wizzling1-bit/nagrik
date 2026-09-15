import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Central data class for all user-facing UI strings in Nagrik (English & Hindi).
class NagrikStringsData {
  const NagrikStringsData({
    required this.localeCode,
    // Brand & Common
    required this.appName,
    required this.ok,
    required this.cancel,
    required this.save,
    required this.saved,
    required this.close,
    required this.back,
    required this.continueBtn,
    required this.getStarted,
    required this.finishAndExplore,
    required this.clearAll,
    // Navigation
    required this.navHome,
    required this.navSearch,
    required this.navSaved,
    // Home & Feed
    required this.latestNearYou,
    required this.noUpdatesTitle,
    required this.noUpdatesDesc,
    required this.breakingTag,
    required this.like,
    required this.liked,
    required this.share,
    required this.savedToBookmarks,
    required this.removedFromSaved,
    required this.videoBadge,
    required this.searchTooltip,
    required this.notificationsTooltip,
    required this.settingsTooltip,
    // Search
    required this.searchPlaceholder,
    required this.recentSearches,
    required this.searchNagrik,
    required this.searchNagrikDesc,
    required this.noNewsFound,
    required this.noNewsFoundDesc,
    required this.newsSection,
    required this.videosSection,
    // Saved
    required this.noSavedStoriesTitle,
    required this.noSavedStoriesDesc,
    required this.browseLatestNews,
    // Notifications
    required this.notifications,
    required this.markAllRead,
    required this.todaySection,
    required this.earlierSection,
    required this.noNotificationsTitle,
    required this.noNotificationsDesc,
    // Settings
    required this.settings,
    required this.sectionLocation,
    required this.currentLocation,
    required this.sectionPreferences,
    required this.appearance,
    required this.themeSystem,
    required this.themeLight,
    required this.themeDark,
    required this.appLanguage,
    required this.selectLanguage,
    required this.breakingNews,
    required this.breakingNewsDesc,
    required this.localNews,
    required this.localNewsDesc,
    required this.newVideos,
    required this.newVideosDesc,
    required this.sectionAbout,
    required this.version,
    required this.privacyPolicy,
    required this.termsOfService,
    required this.privacySubtitle,
    required this.termsSubtitle,
    required this.privacyNotice,
    required this.termsNotice,
    required this.adPrivacyChoices,
    required this.adPrivacySubtitle,
    // Onboarding & Location
    required this.welcomeHeadline,
    required this.welcomeSubtitle,
    required this.welcomeProp1Title,
    required this.welcomeProp1Desc,
    required this.welcomeProp2Title,
    required this.welcomeProp2Desc,
    required this.welcomeProp3Title,
    required this.welcomeProp3Desc,
    required this.chooseLocationTitle,
    required this.chooseLocationSubtitle,
    required this.useCurrentLocation,
    required this.searchLocationPlaceholder,
    required this.customizeNotificationsTitle,
    required this.customizeNotificationsSubtitle,
    required this.searchLanguagePlaceholder,
    required this.switchLocationTitle,
    required this.switchLocationSubtitle,
    required this.searchCityOrNeighborhood,
    // Extended Feature & UI Strings
    required this.videoReportTitle,
    required this.localStoryTitle,
    required this.contentNotFoundTitle,
    required this.contentNotFoundDesc,
    required this.coverageArea,
    required this.relatedStoriesTitle,
    required this.viewAllStories,
    required this.feedLoadError,
    required this.backToTop,
    required this.notificationSettingsAction,
    required this.matchedToPrefix,
    required this.skipAction,
    required this.removeAction,
    required this.searchLoadError,
    required this.suggestedSection,
    required this.explorePrefix,
    required this.exploreStoriesNearYou,
    required this.backendStatusTitle,
    required this.backendStatusSubtitle,
    required this.checkAction,
    required this.shareFailedMsg,
    required this.shareSheetTitle,
    required this.shareSheetSubtitle,
    required this.shareSystemAction,
    required this.copyLinkAction,
    required this.linkCopiedMsg,
    required this.pauseVideoLabel,
    required this.playVideoLabel,
    required this.selectLocationAction,
    required this.openSettingsLabel,
    required this.searchStoriesLabel,
    required this.seeAllTopics,
    required this.detectedLocationTitle,
    required this.gpsDisabledTitle,
    required this.gpsDisabledMessage,
    required this.locationUnavailableTitle,
    required this.selectManuallyHint,
    required this.locationPrivacyNote,
    required this.chooseAnother,
    required this.useThisLocation,
    required this.permissionTitle,
    required this.permissionDeniedBody,
    required this.permissionBody,
    required this.selectManually,
    required this.detectingLocation,
    required this.locationsLoadError,
    required this.noMatchingLocationsTitle,
    required this.noMatchingLocationsDesc,
    required this.offlineTitle,
    required this.offlineDesc,
  });

  final String localeCode;
  final String appName;
  final String ok;
  final String cancel;
  final String save;
  final String saved;
  final String close;
  final String back;
  final String continueBtn;
  final String getStarted;
  final String finishAndExplore;
  final String clearAll;
  final String navHome;
  final String navSearch;
  final String navSaved;
  final String latestNearYou;
  final String noUpdatesTitle;
  final String noUpdatesDesc;
  final String breakingTag;
  final String like;
  final String liked;
  final String share;
  final String savedToBookmarks;
  final String removedFromSaved;
  final String videoBadge;
  final String searchTooltip;
  final String notificationsTooltip;
  final String settingsTooltip;
  final String searchPlaceholder;
  final String recentSearches;
  final String searchNagrik;
  final String searchNagrikDesc;
  final String noNewsFound;
  final String noNewsFoundDesc;
  final String newsSection;
  final String videosSection;
  final String noSavedStoriesTitle;
  final String noSavedStoriesDesc;
  final String browseLatestNews;
  final String notifications;
  final String markAllRead;
  final String todaySection;
  final String earlierSection;
  final String noNotificationsTitle;
  final String noNotificationsDesc;
  final String settings;
  final String sectionLocation;
  final String currentLocation;
  final String sectionPreferences;
  final String appearance;
  final String themeSystem;
  final String themeLight;
  final String themeDark;
  final String appLanguage;
  final String selectLanguage;
  final String breakingNews;
  final String breakingNewsDesc;
  final String localNews;
  final String localNewsDesc;
  final String newVideos;
  final String newVideosDesc;
  final String sectionAbout;
  final String version;
  final String privacyPolicy;
  final String termsOfService;
  final String privacySubtitle;
  final String termsSubtitle;
  final String privacyNotice;
  final String termsNotice;
  final String adPrivacyChoices;
  final String adPrivacySubtitle;
  final String welcomeHeadline;
  final String welcomeSubtitle;
  final String welcomeProp1Title;
  final String welcomeProp1Desc;
  final String welcomeProp2Title;
  final String welcomeProp2Desc;
  final String welcomeProp3Title;
  final String welcomeProp3Desc;
  final String chooseLocationTitle;
  final String chooseLocationSubtitle;
  final String useCurrentLocation;
  final String searchLocationPlaceholder;
  final String customizeNotificationsTitle;
  final String customizeNotificationsSubtitle;
  final String searchLanguagePlaceholder;
  final String switchLocationTitle;
  final String switchLocationSubtitle;
  final String searchCityOrNeighborhood;
  final String videoReportTitle;
  final String localStoryTitle;
  final String contentNotFoundTitle;
  final String contentNotFoundDesc;
  final String coverageArea;
  final String relatedStoriesTitle;
  final String viewAllStories;
  final String feedLoadError;
  final String backToTop;
  final String notificationSettingsAction;
  final String matchedToPrefix;
  final String skipAction;
  final String removeAction;
  final String searchLoadError;
  final String suggestedSection;
  final String explorePrefix;
  final String exploreStoriesNearYou;
  final String backendStatusTitle;
  final String backendStatusSubtitle;
  final String checkAction;
  final String shareFailedMsg;
  final String shareSheetTitle;
  final String shareSheetSubtitle;
  final String shareSystemAction;
  final String copyLinkAction;
  final String linkCopiedMsg;
  final String pauseVideoLabel;
  final String playVideoLabel;
  final String selectLocationAction;
  final String openSettingsLabel;
  final String searchStoriesLabel;
  final String seeAllTopics;
  final String detectedLocationTitle;
  final String gpsDisabledTitle;
  final String gpsDisabledMessage;
  final String locationUnavailableTitle;
  final String selectManuallyHint;
  final String locationPrivacyNote;
  final String chooseAnother;
  final String useThisLocation;
  final String permissionTitle;
  final String permissionDeniedBody;
  final String permissionBody;
  final String selectManually;
  final String detectingLocation;
  final String locationsLoadError;
  final String noMatchingLocationsTitle;
  final String noMatchingLocationsDesc;
  final String offlineTitle;
  final String offlineDesc;
}

/// English translations
const kEnglishStrings = NagrikStringsData(
  localeCode: 'en',
  appName: 'Nagrik',
  ok: 'OK',
  cancel: 'Cancel',
  save: 'Save',
  saved: 'Saved',
  close: 'Close',
  back: 'Back',
  continueBtn: 'Continue',
  getStarted: 'Get Started',
  finishAndExplore: 'Finish & Explore',
  clearAll: 'Clear all',
  navHome: 'Home',
  navSearch: 'Search',
  navSaved: 'Saved',
  latestNearYou: 'LATEST NEAR YOU',
  noUpdatesTitle: 'No updates yet',
  noUpdatesDesc: 'Check back later for the latest local news in your area.',
  breakingTag: 'BREAKING',
  like: 'Like',
  liked: 'Liked',
  share: 'Share',
  savedToBookmarks: 'Saved to your bookmarks',
  removedFromSaved: 'Removed from saved',
  videoBadge: 'VIDEO',
  searchTooltip: 'Search local news',
  notificationsTooltip: 'Notifications',
  settingsTooltip: 'Settings',
  searchPlaceholder: 'Search news, videos, places...',
  recentSearches: 'RECENT SEARCHES',
  searchNagrik: 'Search Nagrik',
  searchNagrikDesc: 'Search for local news and video reports.',
  noNewsFound: 'No news found',
  noNewsFoundDesc: 'Try another location or search term.',
  newsSection: 'NEWS',
  videosSection: 'VIDEOS',
  noSavedStoriesTitle: 'No saved stories yet',
  noSavedStoriesDesc: 'Save a story and it will appear here.',
  browseLatestNews: 'Browse latest news',
  notifications: 'Notifications',
  markAllRead: 'Mark all read',
  todaySection: 'TODAY',
  earlierSection: 'EARLIER',
  noNotificationsTitle: 'No Notifications',
  noNotificationsDesc: 'You are all caught up! Important civic notices and alerts will appear here.',
  settings: 'Settings',
  sectionLocation: 'LOCATION',
  currentLocation: 'Current Location',
  sectionPreferences: 'PREFERENCES',
  appearance: 'Appearance',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',
  appLanguage: 'App Language',
  selectLanguage: 'Select Language',
  breakingNews: 'Breaking News',
  breakingNewsDesc: 'Important news & alerts nearby',
  localNews: 'Local News',
  localNewsDesc: 'New stories in your region',
  newVideos: 'New Videos',
  newVideosDesc: 'Featured local video updates',
  sectionAbout: 'ABOUT',
  version: 'Version',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  privacySubtitle: 'Learn how your data is protected',
  termsSubtitle: 'Usage guidelines and policies',
  privacyNotice: 'Nagrik does not track or sell personal user data.',
  termsNotice: 'Standard consumer news terms apply.',
  adPrivacyChoices: 'Privacy & Ads Consent',
  adPrivacySubtitle: 'Manage your advertising privacy choices',
  welcomeHeadline: 'Your City. Your News.',
  welcomeSubtitle: 'Local news and videos that matter to you.',
  welcomeProp1Title: 'Local News',
  welcomeProp1Desc: 'News from your neighborhood.',
  welcomeProp2Title: 'Short Videos',
  welcomeProp2Desc: 'Watch what is happening around you.',
  welcomeProp3Title: 'Breaking Alerts',
  welcomeProp3Desc: 'Urgent updates when they matter.',
  chooseLocationTitle: 'Choose your city or area',
  chooseLocationSubtitle: 'We show you news and updates based on where you live.',
  useCurrentLocation: 'Use current location',
  searchLocationPlaceholder: 'Search locality or city...',
  customizeNotificationsTitle: 'Customize notifications',
  customizeNotificationsSubtitle: 'Choose what you want to hear about.',
  searchLanguagePlaceholder: 'Search language',
  switchLocationTitle: 'Switch Location',
  switchLocationSubtitle: 'Select your neighborhood or city',
  searchCityOrNeighborhood: 'Search city or neighborhood...',
  videoReportTitle: 'Video Report',
  localStoryTitle: 'Local Story',
  contentNotFoundTitle: 'Story Not Found',
  contentNotFoundDesc: 'This story is no longer available.',
  coverageArea: 'Coverage Area',
  relatedStoriesTitle: 'Related Stories',
  viewAllStories: 'View All Stories',
  feedLoadError: 'Failed to load feed',
  backToTop: 'Back to Top',
  notificationSettingsAction: 'Notification settings',
  matchedToPrefix: 'Matched to',
  skipAction: 'Skip',
  removeAction: 'Remove',
  searchLoadError: 'Search failed. Please try again.',
  suggestedSection: 'SUGGESTED',
  explorePrefix: 'Explore',
  exploreStoriesNearYou: 'Explore Stories Near You',
  backendStatusTitle: 'Backend API Status',
  backendStatusSubtitle: 'Diagnostics and connectivity check',
  checkAction: 'Check',
  shareFailedMsg: 'Failed to share content',
  shareSheetTitle: 'Share Update',
  shareSheetSubtitle: 'Share this update with others',
  shareSystemAction: 'Share',
  copyLinkAction: 'Copy Link',
  linkCopiedMsg: 'Link copied to clipboard',
  pauseVideoLabel: 'Pause Video',
  playVideoLabel: 'Play Video',
  selectLocationAction: 'Select Location',
  openSettingsLabel: 'Open Settings',
  searchStoriesLabel: 'Search Stories',
  seeAllTopics: 'See all topics',
  detectedLocationTitle: 'Location Detected',
  gpsDisabledTitle: 'GPS Disabled',
  gpsDisabledMessage: 'Please enable location services',
  locationUnavailableTitle: 'Location Unavailable',
  selectManuallyHint: 'Select your city manually',
  locationPrivacyNote: 'Location is used only to prioritize local news.',
  chooseAnother: 'Choose Another',
  useThisLocation: 'Use This Location',
  permissionTitle: 'Location Permission',
  permissionDeniedBody: 'Location permission is denied.',
  permissionBody: 'Enable location to receive updates for your city.',
  selectManually: 'Select Manually',
  detectingLocation: 'Detecting location...',
  locationsLoadError: 'Failed to load locations',
  noMatchingLocationsTitle: 'No Locations Found',
  noMatchingLocationsDesc: 'Try searching with a different name',
  offlineTitle: 'You are offline',
  offlineDesc: 'Check your connection and try again.',
);

/// Hindi translations (हिन्दी)
const kHindiStrings = NagrikStringsData(
  localeCode: 'hi',
  appName: 'नागरिक',
  ok: 'ठीक है',
  cancel: 'रद्द करें',
  save: 'सहेजें',
  saved: 'सहेजा गया',
  close: 'बंद करें',
  back: 'वापस',
  continueBtn: 'आगे बढ़ें',
  getStarted: 'शुरू करें',
  finishAndExplore: 'पूरा करें और देखें',
  clearAll: 'सभी हटाएं',
  navHome: 'होम',
  navSearch: 'खोजें',
  navSaved: 'सहेजे गए',
  latestNearYou: 'आपके आस-पास की ताज़ा ख़बरें',
  noUpdatesTitle: 'अभी कोई अपडेट नहीं',
  noUpdatesDesc: 'अपने क्षेत्र की नवीनतम स्थानीय खबरों के लिए बाद में दोबारा देखें।',
  breakingTag: 'ब्रेकिंग',
  like: 'पसंद',
  liked: 'पसंद किया',
  share: 'शेयर',
  savedToBookmarks: 'आपके बुकमार्क में सहेजा गया',
  removedFromSaved: 'सहेजे गए से हटाया गया',
  videoBadge: 'वीडियो',
  searchTooltip: 'स्थानीय समाचार खोजें',
  notificationsTooltip: 'सूचनाएं',
  settingsTooltip: 'सेटिंग्स',
  searchPlaceholder: 'समाचार, वीडियो और स्थान खोजें...',
  recentSearches: 'हाल की खोजें',
  searchNagrik: 'नागरिक में खोजें',
  searchNagrikDesc: 'स्थानीय समाचार और वीडियो रिपोर्ट खोजें।',
  noNewsFound: 'कोई समाचार नहीं मिला',
  noNewsFoundDesc: 'कोई अन्य स्थान या खोज शब्द आज़माएं।',
  newsSection: 'समाचार',
  videosSection: 'वीडियो',
  noSavedStoriesTitle: 'अभी तक कोई कहानी सहेजी नहीं गई',
  noSavedStoriesDesc: 'किसी भी कहानी को सहेजें और वह यहां दिखाई देगी।',
  browseLatestNews: 'ताज़ा समाचार ब्राउज़ करें',
  notifications: 'सूचनाएं',
  markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
  todaySection: 'आज',
  earlierSection: 'पहले',
  noNotificationsTitle: 'कोई सूचना नहीं',
  noNotificationsDesc: 'आप पूरी तरह से अपडेट हैं! महत्वपूर्ण नागरिक सूचनाएं और अलर्ट यहां दिखाई देंगे।',
  settings: 'सेटिंग्स',
  sectionLocation: 'स्थान',
  currentLocation: 'वर्तमान स्थान',
  sectionPreferences: 'प्राथमिकताएं',
  appearance: 'दिखावट',
  themeSystem: 'सिस्टम',
  themeLight: 'लाइट',
  themeDark: 'डार्क',
  appLanguage: 'ऐप की भाषा',
  selectLanguage: 'भाषा चुनें',
  breakingNews: 'ब्रेकिंग न्यूज़',
  breakingNewsDesc: 'आस-पास के महत्वपूर्ण समाचार और अलर्ट',
  localNews: 'स्थानीय समाचार',
  localNewsDesc: 'आपके क्षेत्र की नई कहानियां',
  newVideos: 'नए वीडियो',
  newVideosDesc: 'महत्वपूर्ण स्थानीय वीडियो अपडेट',
  sectionAbout: 'के बारे में',
  version: 'संस्करण',
  privacyPolicy: 'गोपनीयता नीति',
  termsOfService: 'सेवा की शर्तें',
  privacySubtitle: 'जानें कि आपका डेटा कैसे सुरक्षित है',
  termsSubtitle: 'उपयोग दिशानिर्देश और नीतियां',
  privacyNotice: 'नागरिक व्यक्तिगत उपयोगकर्ता डेटा को ट्रैक या साझा नहीं करता है।',
  termsNotice: 'मानक उपभोक्ता समाचार शर्तें लागू होती हैं।',
  adPrivacyChoices: 'गोपनीयता और विज्ञापन सहमति',
  adPrivacySubtitle: 'अपनी विज्ञापन गोपनीयता प्राथमिकताएं प्रबंधित करें',
  welcomeHeadline: 'आपका शहर। आपकी ख़बरें।',
  welcomeSubtitle: 'स्थानीय समाचार और वीडियो जो आपके लिए मायने रखते हैं।',
  welcomeProp1Title: 'स्थानीय समाचार',
  welcomeProp1Desc: 'आपके क्षेत्र की ताज़ा ख़बरें।',
  welcomeProp2Title: 'लघु वीडियो',
  welcomeProp2Desc: 'देखें आपके आस-पास क्या हो रहा है।',
  welcomeProp3Title: 'ब्रेकिंग अलर्ट',
  welcomeProp3Desc: 'ज़रूरी अपडेट जब वे महत्वपूर्ण हों।',
  chooseLocationTitle: 'अपना शहर या क्षेत्र चुनें',
  chooseLocationSubtitle: 'हम आपको आपके रहने के स्थान के आधार पर समाचार और अपडेट दिखाते हैं।',
  useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
  searchLocationPlaceholder: 'इलाका या शहर खोजें...',
  customizeNotificationsTitle: 'सूचनाएं अनुकूलित करें',
  customizeNotificationsSubtitle: 'चुनें कि आप किसके बारे में सुनना चाहते हैं।',
  searchLanguagePlaceholder: 'भाषा खोजें',
  switchLocationTitle: 'स्थान बदलें',
  switchLocationSubtitle: 'अपना मोहल्ला या शहर चुनें',
  searchCityOrNeighborhood: 'शहर या मोहल्ला खोजें...',
  videoReportTitle: 'वीडियो रिपोर्ट',
  localStoryTitle: 'स्थानीय समाचार',
  contentNotFoundTitle: 'खबर नहीं मिली',
  contentNotFoundDesc: 'यह खबर अब उपलब्ध नहीं है।',
  coverageArea: 'कवरेज क्षेत्र',
  relatedStoriesTitle: 'संबंधित खबरें',
  viewAllStories: 'सभी खबरें देखें',
  feedLoadError: 'फ़ीड लोड करने में विफल',
  backToTop: 'शीर्ष पर जाएं',
  notificationSettingsAction: 'सूचना सेटिंग्स',
  matchedToPrefix: 'से मेल खाता है',
  skipAction: 'छोड़ें',
  removeAction: 'हटाएं',
  searchLoadError: 'खोज विफल रही। कृपया पुनः प्रयास करें।',
  suggestedSection: 'सुझाए गए',
  explorePrefix: 'एक्सप्लोर करें',
  exploreStoriesNearYou: 'अपने आस-पास की खबरें देखें',
  backendStatusTitle: 'बैकएंड एपीआई स्थिति',
  backendStatusSubtitle: 'डायग्नोस्टिक्स और कनेक्टिविटी जांच',
  checkAction: 'जांचें',
  shareFailedMsg: 'सामग्री साझा करने में विफल',
  shareSheetTitle: 'अपडेट साझा करें',
  shareSheetSubtitle: 'इस अपडेट को दूसरों के साथ साझा करें',
  shareSystemAction: 'शेयर',
  copyLinkAction: 'लिंक कॉपी करें',
  linkCopiedMsg: 'लिंक क्लिपबोर्ड पर कॉपी हो गया',
  pauseVideoLabel: 'वीडियो रोकें',
  playVideoLabel: 'वीडियो चलाएं',
  selectLocationAction: 'स्थान चुनें',
  openSettingsLabel: 'सेटिंग्स खोलें',
  searchStoriesLabel: 'खबरें खोजें',
  seeAllTopics: 'सभी विषय देखें',
  detectedLocationTitle: 'स्थान का पता चला',
  gpsDisabledTitle: 'जीपीएस अक्षम',
  gpsDisabledMessage: 'कृपया स्थान सेवाएं सक्षम करें',
  locationUnavailableTitle: 'स्थान अनुपलब्ध',
  selectManuallyHint: 'अपना शहर मैन्युअल रूप से चुनें',
  locationPrivacyNote: 'स्थान का उपयोग केवल स्थानीय समाचार प्राथमिकता के लिए किया जाता है।',
  chooseAnother: 'दूसरा चुनें',
  useThisLocation: 'इस स्थान का उपयोग करें',
  permissionTitle: 'स्थान अनुमति',
  permissionDeniedBody: 'स्थान अनुमति अस्वीकृत है।',
  permissionBody: 'अपने शहर के अपडेट प्राप्त करने के लिए स्थान सक्षम करें।',
  selectManually: 'मैन्युअल रूप से चुनें',
  detectingLocation: 'स्थान का पता लगाया जा रहा है...',
  locationsLoadError: 'स्थान लोड करने में विफल',
  noMatchingLocationsTitle: 'कोई स्थान नहीं मिला',
  noMatchingLocationsDesc: 'किसी अन्य नाम से खोजें',
  offlineTitle: 'आप ऑफ़लाइन हैं',
  offlineDesc: 'अपना कनेक्शन जांचें और पुनः प्रयास करें।',
);

/// Map of all supported language codes to their translations (English & Hindi only)
final Map<String, NagrikStringsData> _translations = {
  'en': kEnglishStrings,
  'hi': kHindiStrings,
};

/// Flutter Localizations wrapper for Nagrik
class NagrikLocalizations {
  const NagrikLocalizations(this.data);

  final NagrikStringsData data;

  static NagrikStringsData of(BuildContext context) {
    final localizations = Localizations.of<NagrikLocalizations>(
      context,
      NagrikLocalizations,
    );
    return localizations?.data ?? fromCode('en');
  }

  static NagrikStringsData fromCode(String code) {
    return _translations[code] ?? kEnglishStrings;
  }
}

/// Localizations delegate for MaterialApp
class NagrikLocalizationsDelegate
    extends LocalizationsDelegate<NagrikLocalizations> {
  const NagrikLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => true;

  @override
  Future<NagrikLocalizations> load(Locale locale) {
    return SynchronousFuture<NagrikLocalizations>(
      NagrikLocalizations(NagrikLocalizations.fromCode(locale.languageCode)),
    );
  }

  @override
  bool shouldReload(NagrikLocalizationsDelegate old) => false;
}

/// Riverpod provider for active localized strings.
/// Re-evaluates instantly whenever [selectedLanguageProvider] updates!
final appStringsProvider = Provider<NagrikStringsData>((ref) {
  final lang = ref.watch(selectedLanguageProvider);
  return NagrikLocalizations.fromCode(lang.code);
});

/// Context extension for quick access to strings in build methods
extension NagrikLocalizationX on BuildContext {
  NagrikStringsData get strings => NagrikLocalizations.of(this);
}
