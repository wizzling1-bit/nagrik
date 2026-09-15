import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

/// Top filter categories for notifications feed.
enum NotificationCategory {
  all('All'),
  emergency('🚨 Emergency'),
  civic('🏛️ Civic'),
  community('🎉 Community'),
  social('💬 Social');

  const NotificationCategory(this.label);
  final String label;

  bool matches(NotificationType type) {
    return switch (this) {
      NotificationCategory.all => true,
      NotificationCategory.emergency => type == NotificationType.urgentAlert,
      NotificationCategory.civic => type == NotificationType.civicGrievance,
      NotificationCategory.community => type == NotificationType.communityEvent,
      NotificationCategory.social =>
        type == NotificationType.engagement || type == NotificationType.systemUpdate,
    };
  }
}
