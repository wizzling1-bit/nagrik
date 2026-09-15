import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

/// App notification model for breaking news, important updates, and local alerts.
class AppNotification {
  const AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.timestamp,
    this.isRead = false,
    this.sourceName = 'Nagrik Alerts',
    this.isCritical = false,
    this.actionRoute,
  });

  final String id;
  final NotificationType type;
  final String title;
  final String body;
  final DateTime timestamp;
  final bool isRead;
  final String sourceName;
  final bool isCritical;
  final String? actionRoute;

  String get formattedTimeAgo {
    final now = DateTime.now();
    final diff = now.difference(timestamp);

    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
  }

  AppNotification copyWith({
    String? id,
    NotificationType? type,
    String? title,
    String? body,
    DateTime? timestamp,
    bool? isRead,
    String? sourceName,
    bool? isCritical,
    String? actionRoute,
  }) {
    return AppNotification(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      body: body ?? this.body,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      sourceName: sourceName ?? this.sourceName,
      isCritical: isCritical ?? this.isCritical,
      actionRoute: actionRoute ?? this.actionRoute,
    );
  }
}
