import 'package:flutter_test/flutter_test.dart';
import '../../../fixtures/mock_notifications_data.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

void main() {
  group('Mock Notifications Dataset', () {
    test('kMockNotifications contains realistic alerts for news and weather', () {
      expect(kMockNotifications.length, greaterThanOrEqualTo(5));
      expect(kMockNotifications.any((n) => n.type == NotificationType.urgentAlert), isTrue);
      expect(kMockNotifications.any((n) => n.type == NotificationType.systemUpdate), isTrue);
      expect(kMockNotifications.any((n) => !n.isRead), isTrue);
    });
  });
}
