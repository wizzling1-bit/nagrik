import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:nagrik/core/network/api_constants.dart';
import 'package:nagrik/core/network/device_id_service.dart';

/// Custom exception for API errors.
class ApiException implements Exception {
  const ApiException({
    required this.message,
    this.statusCode,
    this.responseBody,
  });

  final String message;
  final int? statusCode;
  final dynamic responseBody;

  @override
  String toString() => 'ApiException(status: $statusCode, message: $message)';
}

/// Standardized HTTP client for Nagrik backend API.
class ApiClient {
  ApiClient({
    http.Client? client,
    DeviceIdService? deviceIdService,
  })  : _client = client ?? _sharedHttpClient,
        _isCustomClient = client != null,
        _deviceIdService = deviceIdService ?? DeviceIdService.instance;

  static final http.Client _sharedHttpClient = http.Client();
  final http.Client _client;
  final bool _isCustomClient;
  final DeviceIdService _deviceIdService;

  Future<http.Response> _executeWithRetry(
    Future<http.Response> Function() action, {
    int maxRetries = 2,
    int initialDelayMs = 400,
  }) async {
    int attempt = 0;
    while (true) {
      try {
        return await action().timeout(ApiConstants.timeoutDuration);
      } on Object catch (e) {
        final isRetryable = e is SocketException ||
            e is TimeoutException ||
            e is http.ClientException;
        attempt++;
        if (!isRetryable || attempt > maxRetries) {
          if (e is SocketException) {
            throw ApiException(
              message: 'Network unreachable. Please check connection. (${e.message})',
            );
          } else if (e is TimeoutException) {
            throw const ApiException(
              message: 'Request timed out. Server took too long to respond.',
            );
          } else if (e is http.ClientException) {
            throw ApiException(message: 'HTTP Client Error: ${e.message}');
          }
          rethrow;
        }
        final delayMs = initialDelayMs * (1 << (attempt - 1));
        final jitter = (attempt * 50);
        await Future<void>.delayed(Duration(milliseconds: delayMs + jitter));
      }
    }
  }

  Future<Map<String, String>> _buildHeaders({Map<String, String>? extra}) async {
    final deviceId = await _deviceIdService.getDeviceId();
    final isSupabase = ApiConstants.isSupabase;
    return {
      ApiConstants.headerContentType: ApiConstants.jsonContentType,
      ApiConstants.headerDeviceId: deviceId,
      if (isSupabase) ...{
        'apikey': ApiConstants.supabaseAnonKey,
        'Authorization': 'Bearer ${ApiConstants.supabaseAnonKey}',
      },
      ...?extra,
    };
  }

  Uri _buildUri(String path, [Map<String, dynamic>? queryParameters]) {
    final base = ApiConstants.baseUrl;
    final urlString = '$base$path';
    final uri = Uri.parse(urlString);

    if (queryParameters == null || queryParameters.isEmpty) {
      return uri;
    }

    final sanitizedParams = <String, String>{};
    queryParameters.forEach((key, value) {
      if (value != null && value.toString().trim().isNotEmpty) {
        sanitizedParams[key] = value.toString().trim();
      }
    });

    return uri.replace(
      queryParameters: {
        ...uri.queryParameters,
        ...sanitizedParams,
      },
    );
  }

  /// Performs GET request and parses JSON body.
  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    final uri = _buildUri(path, queryParameters);
    final requestHeaders = await _buildHeaders(extra: headers);

    final response = await _executeWithRetry(
      () => _client.get(uri, headers: requestHeaders),
    );
    return _handleResponse(response);
  }

  /// Performs POST request with JSON body and parses JSON response.
  Future<dynamic> post(
    String path, {
    Map<String, dynamic>? body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    final uri = _buildUri(path, queryParameters);
    final requestHeaders = await _buildHeaders(extra: headers);

    final response = await _executeWithRetry(
      () => _client.post(
        uri,
        headers: requestHeaders,
        body: body != null ? jsonEncode(body) : null,
      ),
    );
    return _handleResponse(response);
  }

  dynamic _handleResponse(http.Response response) {
    dynamic decodedBody;
    try {
      if (response.body.isNotEmpty) {
        decodedBody = jsonDecode(response.body);
      }
    } catch (_) {
      decodedBody = response.body;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return decodedBody;
    }

    String errorMessage;
    if (decodedBody is Map) {
      final msg = decodedBody['message'] ?? decodedBody['error'];
      if (msg != null && msg.toString().trim().isNotEmpty) {
        errorMessage = msg.toString().trim();
      } else {
        errorMessage = _defaultMessageForStatus(response.statusCode);
      }
    } else {
      errorMessage = _defaultMessageForStatus(response.statusCode);
    }

    throw ApiException(
      statusCode: response.statusCode,
      message: errorMessage,
      responseBody: decodedBody,
    );
  }

  static String _defaultMessageForStatus(int statusCode) {
    return switch (statusCode) {
      400 => 'Invalid request parameters.',
      401 => 'Authentication required.',
      403 => 'Access denied.',
      404 => 'Requested content not found.',
      409 => 'Resource conflict occurred.',
      429 => 'Too many requests. Please try again later.',
      500 => 'Server encountered an issue. Please try again.',
      502 || 503 || 504 => 'Service temporarily unavailable. Please retry shortly.',
      _ => 'Request failed with HTTP status $statusCode',
    };
  }

  void close() {
    if (_isCustomClient) {
      _client.close();
    }
  }
}

/// Riverpod provider for ApiClient.
final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient();
  ref.onDispose(client.close);
  return client;
});
