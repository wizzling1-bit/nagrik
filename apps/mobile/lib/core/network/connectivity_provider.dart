import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Device connectivity as observed from real network outcomes.
///
/// No connectivity plugin is used: the app marks itself offline when an API
/// call fails with a transport error, and back online on the next success.
/// UI reads this to render honest offline copy instead of generic errors.
final connectivityStatusProvider =
    NotifierProvider<ConnectivityStatusNotifier, bool>(
  ConnectivityStatusNotifier.new,
);

class ConnectivityStatusNotifier extends Notifier<bool> {
  @override
  bool build() => true;

  void setOnline() {
    if (!state) state = true;
  }

  void setOffline() {
    if (state) state = false;
  }
}
