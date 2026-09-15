import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Notifications list state notifier.
///
/// No notification-history API exists on the backend, so alerts are generated
/// on-device from urgent/breaking feed items ([syncUrgentPosts]). Anything
/// already notified is remembered in [SharedPreferences] so alerts never
/// repeat across restarts. Real push notifications (FCM) will append via
/// [addNotification] when that integration lands.
final notificationsProvider =
    NotifierProvider<NotificationsNotifier, List<AppNotification>>(
  NotificationsNotifier.new,
);

class NotificationsNotifier extends Notifier<List<AppNotification>> {
  static const _kNotifiedKey = 'nagrik_notified_urgent_ids_v1';
  static const _kMaxStored = 20;
  static const _kMaxKnownIds = 50;

  final Set<String> _knownUrgentIds = {};

  @override
  List<AppNotification> build() {
    Future.microtask(_loadKnownIds);
    ref.listen<List<Post>>(
      feedPostsProvider,
      (_, next) => _syncUrgentPosts(next),
      fireImmediately: true,
    );
    return const [];
  }

  Future<void> _loadKnownIds() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final ids = prefs.getStringList(_kNotifiedKey);
      if (ids != null) _knownUrgentIds.addAll(ids);
    } catch (_) {}
  }

  Future<void> _persistKnownIds() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(
        _kNotifiedKey,
        _knownUrgentIds.take(_kMaxKnownIds).toList(),
      );
    } catch (_) {}
  }

  /// Ingests urgent feed items as on-device alerts. Idempotent: already
  /// notified posts are skipped, state is capped at [_kMaxStored].
  void syncUrgentPosts(List<Post> posts) => _syncUrgentPosts(posts);

  void _syncUrgentPosts(List<Post> posts) {
    try {
      var changed = false;
      for (final post in posts) {
        if (!post.isUrgent || _knownUrgentIds.contains(post.id)) continue;
        // Never alert from local seed/preview content — only real backend rows.
        if (!ContentRepository.isUuid(post.id)) continue;
        _knownUrgentIds.add(post.id);
        final alert = AppNotification(
          id: 'urgent_${post.id}',
          type: NotificationType.urgentAlert,
          title: post.title,
          body: post.body,
          timestamp: post.createdAt,
          isCritical: true,
          actionRoute: '/content/${post.id}',
        );
        state = [alert, ...state].take(_kMaxStored).toList();
        changed = true;
      }
      if (changed) unawaited(_persistKnownIds());
    } on StateError {
      // Disposed mid-sync — safe to drop.
    }
  }

  void markAsRead(String id) {
    state = state.map((n) => n.id == id ? n.copyWith(isRead: true) : n).toList();
  }

  void markAllAsRead() {
    state = state.map((n) => n.copyWith(isRead: true)).toList();
  }

  void deleteNotification(String id) {
    state = state.where((n) => n.id != id).toList();
  }

  void addNotification(AppNotification notification) {
    state = [notification, ...state];
  }
}

/// Selector for total unread notifications count.
final unreadNotificationsCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationsProvider);
  return notifications.where((n) => !n.isRead).length;
});

/// Queue for in-app push alerts.
///
/// Production: only real FCM-driven alerts enter this queue. The debug
/// simulator banner that used to feed it is removed from the widget tree.
final pushSimulatorQueueProvider =
    NotifierProvider<PushSimulatorQueueNotifier, AppNotification?>(
  PushSimulatorQueueNotifier.new,
);

class PushSimulatorQueueNotifier extends Notifier<AppNotification?> {
  @override
  AppNotification? build() => null;

  void showNotification(AppNotification notification) {
    state = notification;
    ref.read(notificationsProvider.notifier).addNotification(notification);
  }

  void dismiss() {
    state = null;
  }
}
