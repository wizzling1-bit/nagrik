/// Centralized string catalog for the Nagrik application.
///
/// Organized by feature module for clean localization readiness.
abstract final class NagrikStrings {
  // Brand
  static const appName = 'Nagrik';
  static const appTagline = 'Know what matters around you. Act when it matters.';

  // General & Common
  static const ok = 'OK';
  static const cancel = 'Cancel';
  static const save = 'Save';
  static const submit = 'Submit';
  static const continue_ = 'Continue';
  static const back = 'Back';
  static const reset = 'Reset';
  static const retry = 'Retry';
  static const skip = 'Skip';
  static const search = 'Search';
  static const all = 'All';
  static const done = 'Done';

  // Navigation
  static const navHome = 'Home';
  static const navDiscover = 'Discover';
  static const navReport = 'Report';
  static const navAlerts = 'Alerts';
  static const navProfile = 'Profile';

  // Home & Feed
  static const defaultLocation = 'Select Location';
  static const switchLocation = 'Switch Location';
  static const searchCityOrNeighborhood = 'Search city or neighborhood...';
  static const noLocationFound = 'No locations found';
  static const urgentAlert = 'URGENT ALERT';
  static const resetFilters = 'Reset Filters';
  static const noLocalUpdates = 'No local updates found';
  static const noLocalUpdatesDescription =
      'No posts match the selected category for your location. Try choosing "All" or switching areas.';

  // Feed Tabs
  static const tabForYou = 'For You';
  static const tabVideos = 'Videos';
  static const tabCivic = 'Civic';
  static const tabUpdates = 'Updates';

  // Discover
  static const discoverTitle = 'Discover';
  static const discoverSubtitle = 'Explore topics, events & opportunities';
  static const searchTopicsEventsJobs = 'Search topics, civic issues, events...';
  static const exploreTab = 'Explore';
  static const trendingTab = 'Trending';
  static const eventsTab = 'Events';
  static const jobsTab = 'Jobs';
  static const noSearchResults = 'No results found';

  // Content Reporting (APIs.md)
  static const reportContentTitle = 'Report Content';
  static const reportContentSubtitle = 'Help us maintain journalistic integrity';
  static const reportSubmitted = 'Report submitted for review.';


  // Notifications
  static const notificationsTitle = 'Notifications';
  static const markAllRead = 'Mark all read';
  static const todaySection = 'TODAY';
  static const earlierSection = 'EARLIER';
  static const noNotificationsTitle = 'No Notifications';
  static const noNotificationsDescription =
      'You are all caught up! Important civic notices and alerts will appear here.';

  // Profile & Settings
  static const profileTitle = 'Citizen Profile';
  static const profileAndSettingsTab = 'Profile & Settings';
  static const savedBookmarksTab = 'Saved Bookmarks';
  static const appearance = 'Appearance';
  static const language = 'Language';
  static const notificationPreferences = 'Notification Preferences';
  static const helpAndSupport = 'Help & Support';
  static const editProfile = 'Edit Profile';
  static const verifiedCitizen = 'Verified Citizen';
  static const appVersion = 'Nagrik v1.0.0 (Build 2026)';
  static const madeForCitizens = 'Made with ❤️ for Indian Citizens';
}
