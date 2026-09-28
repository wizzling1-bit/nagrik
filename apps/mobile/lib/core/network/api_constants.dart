import 'package:shared_preferences/shared_preferences.dart';

/// Centralized API constants, endpoints, and environment configurations for Nagrik.
/// Directly integrates with Supabase PostgreSQL / PostGIS / Edge Functions and Cloudflare R2 CDN.
class ApiConstants {
  ApiConstants._();

  static const String prefsKeyBaseUrl = 'nagrik_api_base_url';

  // Compile-time environment variables
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');
  static const String _envSupabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String _envSupabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
  static const String _envR2BaseUrl = String.fromEnvironment('R2_PUBLIC_BASE_URL');

  static String? _customBaseUrl;

  /// Production Supabase Project URL (ap-south-1)
  static const String prodSupabaseUrl = 'https://sbcvvcqsmgihhzuifafq.supabase.co';

  /// Production Supabase Anon Key (Safe public JWT for mobile with Row-Level Security)
  static const String prodSupabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3Z2Y3FzbWdpaGh6dWlmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjgyMzksImV4cCI6MjEwNTEwNDIzOX0.0GFOvJmjhel0gpkOSypdwN1rs1o2sPo4LgtpyWhc63I';

  /// Production Cloudflare R2 Public Media CDN (Zero egress fees, byte-range streaming)
  static const String prodR2PublicBaseUrl =
      'https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev';

  /// Returns the active Supabase project URL
  static String get supabaseUrl {
    if (_envSupabaseUrl.isNotEmpty) return _envSupabaseUrl;
    return prodSupabaseUrl;
  }

  /// Returns the active Supabase Anon Key
  static String get supabaseAnonKey {
    if (_envSupabaseAnonKey.isNotEmpty) return _envSupabaseAnonKey;
    return prodSupabaseAnonKey;
  }

  /// Returns the active Cloudflare R2 Public Media Base URL
  static String get r2PublicBaseUrl {
    if (_envR2BaseUrl.isNotEmpty) return _envR2BaseUrl;
    return prodR2PublicBaseUrl;
  }

  /// Default production API base URL pointing directly to Supabase PostgREST
  static String get prodBaseUrl => '$supabaseUrl/rest/v1';

  /// Initializes base URL from persistent storage or environment.
  static Future<void> initBaseUrl([SharedPreferences? prefs]) async {
    try {
      final p = prefs ?? await SharedPreferences.getInstance();
      final savedUrl = p.getString(prefsKeyBaseUrl);
      if (savedUrl != null && savedUrl.trim().isNotEmpty) {
        setBaseUrl(savedUrl.trim());
      }
    } catch (_) {}
  }

  /// Override base URL at runtime.
  static void setBaseUrl(String url) {
    _customBaseUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  }

  /// Persists base URL to SharedPreferences and updates active runtime URL.
  static Future<void> saveBaseUrl(String url) async {
    setBaseUrl(url);
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(prefsKeyBaseUrl, _customBaseUrl ?? url);
    } catch (_) {}
  }

  /// Reset base URL to default and clear persistent override.
  static Future<void> resetBaseUrl() async {
    _customBaseUrl = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(prefsKeyBaseUrl);
    } catch (_) {}
  }

  /// Active API base URL:
  /// 1. Saved custom URL from SharedPreferences
  /// 2. Compile-time --dart-define=API_BASE_URL=...
  /// 3. Production Supabase PostgREST URL
  static String get baseUrl {
    if (_customBaseUrl != null && _customBaseUrl!.isNotEmpty) {
      return _customBaseUrl!;
    }
    if (_envBaseUrl.isNotEmpty) {
      return _envBaseUrl;
    }
    return prodBaseUrl;
  }

  /// True if the current baseUrl targets Supabase (direct PostgREST / RPC)
  static bool get isSupabase =>
      baseUrl.contains('supabase.co') ||
      baseUrl.endsWith('/rest/v1') ||
      baseUrl == prodBaseUrl;

  // Supabase RPC & REST Endpoints
  static const String feedRpc = '/rpc/get_personalized_feed';
  static const String searchRpc = '/rpc/search_content';
  static const String detailRpc = '/rpc/get_content_detail';
  static const String likeRpc = '/rpc/toggle_content_like';
  static const String saveRpc = '/rpc/toggle_content_save';
  static const String reportRpc = '/rpc/report_content';
  static const String viewsRpc = '/rpc/track_video_view';
  static const String commentsRpc = '/rpc/get_content_comments';
  static const String addCommentRpc = '/rpc/add_content_comment';
  static const String shareRpc = '/rpc/increment_content_share';

  static const String categoriesRest = '/categories?select=id,name,slug,display_order,status&status=eq.ACTIVE&order=display_order.asc';
  static const String locationsRest = '/locations?select=country,state,city,area,coordinates&order=state.asc,city.asc,area.asc&limit=1000';

  // Standard API Gateway Endpoints (Backward compatible fallback)
  static const String feed = '/content/feed';
  static const String search = '/content/search';
  static const String categories = '/content/categories';
  static const String locations = '/content/locations';
  static String contentDetail(String id) => '/content/$id';
  static String likeContent(String id) => '/content/$id/like';
  static String saveContent(String id) => '/content/$id/save';
  static String shareContent(String id) => '/content/$id/share';
  static String contentComments(String id) => '/content/$id/comments';
  static String reportContent(String id) => '/content/$id/report';
  static const String views = '/views';
  static const String seed = '/seed';

  // Timeouts & Headers
  static const Duration timeoutDuration = Duration(seconds: 20);
  static const String headerDeviceId = 'x-device-id';
  static const String headerContentType = 'Content-Type';
  static const String jsonContentType = 'application/json';

  // Canonical Web Policy & Transparency URLs
  static const String webBaseUrl = 'https://nagrik.news';
  static String get urlAbout => '$webBaseUrl/about';
  static String get urlEditorialGuidelines => '$webBaseUrl/editorial-guidelines';
  static String get urlContentPolicy => '$webBaseUrl/content-policy';
  static String get urlCorrections => '$webBaseUrl/corrections';
  static String get urlSources => '$webBaseUrl/sources';
  static String get urlPublisherGuidelines => '$webBaseUrl/publisher-guidelines';
  static String get urlCommunityGuidelines => '$webBaseUrl/community-guidelines';
  static String get urlCopyright => '$webBaseUrl/copyright';
  static String get urlPrivacyPolicy => '$webBaseUrl/privacy';
  static String get urlTermsOfService => '$webBaseUrl/terms';
  static String get urlAdvertising => '$webBaseUrl/advertising';
  static String get urlTransparency => '$webBaseUrl/transparency';
  static String get urlAccessibility => '$webBaseUrl/accessibility';
  static String get urlContact => '$webBaseUrl/contact';
  static String get urlReportContent => '$webBaseUrl/report';
  static String get urlGrievance => '$webBaseUrl/grievance';
}
