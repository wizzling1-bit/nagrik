import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';

/// Centralized API constants, endpoints, and environment configurations.
class ApiConstants {
  ApiConstants._();

  static const String prefsKeyBaseUrl = 'nagrik_api_base_url';
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String? _customBaseUrl;

  /// Active Wi-Fi host IP for physical device testing on local network.
  static const String localWifiBaseUrl = 'http://10.201.28.237:5000/api/v1';

  /// Android emulator loopback base URL.
  static const String localEmulatorBaseUrl = 'http://10.0.2.2:5000/api/v1';

  /// Live Staging Base API URL deployed on Render.
  static const String liveStagingBaseUrl =
      'https://nagrik-1x9o.onrender.com/api/v1';

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

  /// Override base URL at runtime (e.g., for staging or production backend).
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

  /// Local Development Base API URL helper (Android emulator uses 10.0.2.2).
  static String get localBaseUrl {
    if (Platform.isAndroid) {
      return localEmulatorBaseUrl;
    }
    return 'http://localhost:5000/api/v1';
  }

  /// Default API base URL:
  /// 1. Saved custom URL from SharedPreferences
  /// 2. Compile-time --dart-define=API_BASE_URL=...
  /// 3. Default live staging URL
  static String get baseUrl {
    if (_customBaseUrl != null && _customBaseUrl!.isNotEmpty) {
      return _customBaseUrl!;
    }
    if (_envBaseUrl.isNotEmpty) {
      return _envBaseUrl;
    }
    return liveStagingBaseUrl;
  }

  // Endpoints
  static const String seed = '/seed';
  static const String feed = '/content/feed';
  static const String search = '/content/search';
  static const String categories = '/content/categories';
  static const String locations = '/content/locations';
  static String contentDetail(String id) => '/content/$id';
  static String likeContent(String id) => '/content/$id/like';
  static String saveContent(String id) => '/content/$id/save';
  static String reportContent(String id) => '/content/$id/report';
  static const String views = '/views';

  // Timeouts & Headers (Render free tier cold starts can take 25-30s)
  static const Duration timeoutDuration = Duration(seconds: 35);
  static const String headerDeviceId = 'x-device-id';
  static const String headerContentType = 'Content-Type';
  static const String jsonContentType = 'application/json';
}
