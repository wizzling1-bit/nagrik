import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/domain/models/notification_category.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

void main() {
  group('Notification Domain Models', () {
    test('NotificationCategory matches types appropriately', () {
      expect(NotificationCategory.all.matches(NotificationType.urgentAlert), isTrue);
      expect(NotificationCategory.emergency.matches(NotificationType.urgentAlert), isTrue);
      expect(NotificationCategory.emergency.matches(NotificationType.civicGrievance), isFalse);
      expect(NotificationCategory.civic.matches(NotificationType.civicGrievance), isTrue);
      expect(NotificationCategory.community.matches(NotificationType.communityEvent), isTrue);
      expect(NotificationCategory.social.matches(NotificationType.engagement), isTrue);
    });

    test('AppNotification instantiates and handles formattedTimeAgo and copyWith', () {
      final now = DateTime.now();
      final notif = AppNotification(
        id: 'notif_1',
        type: NotificationType.urgentAlert,
        title: 'Severe Waterlogging Warning',
        body: 'Heavy rainfall expected across Salt Lake Sector V.',
        timestamp: now.subtract(const Duration(minutes: 15)),
        isRead: false,
        sourceName: 'Disaster Management Cell',
        isCritical: true,
      );

      expect(notif.id, 'notif_1');
      expect(notif.isRead, isFalse);
      expect(notif.isCritical, isTrue);
      expect(notif.formattedTimeAgo, contains('m ago'));

      final readNotif = notif.copyWith(isRead: true);
      expect(readNotif.isRead, isTrue);
      expect(readNotif.id, 'notif_1');
    });
  });
}
