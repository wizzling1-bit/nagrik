import 'dart:io';

/// Centralized API constants, endpoints, and environment configurations.
class ApiConstants {
  ApiConstants._();

  static String? _customBaseUrl;

  /// Override base URL at runtime (e.g., for staging or production backend).
  static void setBaseUrl(String url) {
    _customBaseUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  }

  /// Reset base URL to default.
  static void resetBaseUrl() {
    _customBaseUrl = null;
  }

  /// Live Staging Base API URL deployed on Render.
  static const String liveStagingBaseUrl =
      'https://nagrik-1x9o.onrender.com/api/v1';

  /// Local Development Base API URL helper (Android emulator uses 10.0.2.2).
  static String get localBaseUrl {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api/v1';
    }
    return 'http://localhost:5000/api/v1';
  }

  /// Default API base URL:
  /// Defaults to live staging on Render (https://nagrik-1x9o.onrender.com/api/v1),
  /// or overridden at runtime via [setBaseUrl].
  static String get baseUrl {
    if (_customBaseUrl != null && _customBaseUrl!.isNotEmpty) {
      return _customBaseUrl!;
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
