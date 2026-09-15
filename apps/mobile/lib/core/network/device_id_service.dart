import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';

/// Manages a persistent anonymous device identifier for the credential-free app.
/// This ID is sent via headers and request bodies (e.g., likes, reports, views).
/// Single async source of truth: [getDeviceId]. [currentDeviceId] only reads
/// the in-memory cache and never generates a competing ID.
class DeviceIdService {
  DeviceIdService({this.prefs});

  static const String _keyDeviceId = 'nagrik_anonymous_device_id';
  SharedPreferences? prefs;
  String? _cachedDeviceId;
  Future<String>? _inflight;

  static final DeviceIdService instance = DeviceIdService();

  /// Synchronously returns the cached device ID if already loaded.
  /// Returns empty string when not yet initialized — callers needing a
  /// guaranteed value must await [getDeviceId] instead. Never generates
  /// a competing ID (fixes the old dual-path race).
  String get currentDeviceId => _cachedDeviceId ?? '';

  /// Whether the ID has been loaded into memory.
  bool get isInitialized => _cachedDeviceId != null;

  /// Initializes or retrieves the persistent anonymous device ID.
  /// Concurrent callers share a single in-flight load/generate.
  Future<String> getDeviceId() async {
    if (_cachedDeviceId != null) return _cachedDeviceId!;
    _inflight ??= _loadOrGenerate();
    try {
      return await _inflight!;
    } finally {
      _inflight = null;
    }
  }

  Future<String> _loadOrGenerate() async {
    if (_cachedDeviceId != null) return _cachedDeviceId!;
    prefs ??= await SharedPreferences.getInstance();
    var existingId = prefs?.getString(_keyDeviceId);

    if (existingId == null || existingId.trim().isEmpty) {
      existingId = _generateDeviceId();
      await prefs?.setString(_keyDeviceId, existingId);
    }

    _cachedDeviceId = existingId;
    return existingId;
  }

  /// Sets a specific device ID (useful for testing or debugging).
  Future<void> setDeviceId(String id) async {
    _cachedDeviceId = id;
    prefs ??= await SharedPreferences.getInstance();
    await prefs?.setString(_keyDeviceId, id);
  }

  /// Generates a standard RFC 4122 UUID v4:
  /// e.g. "a1b2c3d4-e5f6-4890-abcd-ef1234567890"
  String _generateDeviceId() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC 4122

    final hex = bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}';
  }
}
