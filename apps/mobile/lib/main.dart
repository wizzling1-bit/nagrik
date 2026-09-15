import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/app/app.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  await runZonedGuarded<Future<void>>(() async {
    WidgetsFlutterBinding.ensureInitialized();

    FlutterError.onError = (details) {
      FlutterError.presentError(details);
      Zone.current.handleUncaughtError(
        details.exception,
        details.stack ?? StackTrace.empty,
      );
    };

    // Pre-warm disk + anonymous device ID before first frame so the splash
    // gate and the first API call never pay a cold-start stall.
    try {
      await Future.wait([
        SharedPreferences.getInstance(),
        DeviceIdService.instance.getDeviceId(),
      ]).timeout(const Duration(seconds: 5));
    } catch (_) {
      // Cold-start pre-warm is best-effort; providers lazy-load on demand.
    }

    runApp(
      const ProviderScope(
        child: NagrikApp(),
      ),
    );
  }, (error, stack) {
    if (kDebugMode) {
      debugPrint('Nagrik uncaught zone error: $error');
    }
  });
}
