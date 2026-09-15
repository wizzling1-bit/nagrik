import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';
import 'package:shared_preferences/shared_preferences.dart';

Post _urgentPost(String uuid, {String city = 'Patna'}) => Post(
      id: uuid,
      type: PostType.news,
      category: PostCategory.civic,
      author: const PostAuthor(id: 'desk', name: 'Nagrik Desk'),
      title: 'Breaking $uuid',
      body: 'Body $uuid',
      locality: 'Area',
      city: city,
      createdAt: DateTime(2026, 1, 1),
      isUrgent: true,
    );

String _uuid(int n) =>
    '123e4567-e89b-12d3-a456-426614174${n.toString().padLeft(3, '0')}';

AppNotification testNotification(String id) => AppNotification(
      id: id,
      title: 'Test alert $id',
      body: 'Test body $id',
      type: NotificationType.urgentAlert,
      timestamp: DateTime.now(),
    );

void main() {
  group('NotificationsProviders', () {
    test('production starts with an honest empty list (no mock seeding)', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(notificationsProvider), isEmpty);
      expect(container.read(unreadNotificationsCountProvider), 0);
    });

    test('markAsRead updates isRead and unreadNotificationsCountProvider', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(notificationsProvider.notifier).addNotification(testNotification('n1'));
      container.read(notificationsProvider.notifier).addNotification(testNotification('n2'));

      expect(container.read(unreadNotificationsCountProvider), 2);

      container.read(notificationsProvider.notifier).markAsRead('n1');

      expect(container.read(unreadNotificationsCountProvider), 1);
      final updated = container.read(notificationsProvider).firstWhere((n) => n.id == 'n1');
      expect(updated.isRead, isTrue);
    });

    test('markAllAsRead sets all items to read and resets unread count to 0', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(notificationsProvider.notifier).addNotification(testNotification('n1'));

      container.read(notificationsProvider.notifier).markAllAsRead();

      expect(container.read(unreadNotificationsCountProvider), 0);
      expect(container.read(notificationsProvider).every((n) => n.isRead), isTrue);
    });

    test('deleteNotification removes notification from list', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(notificationsProvider.notifier).addNotification(testNotification('n1'));
      container.read(notificationsProvider.notifier).addNotification(testNotification('n2'));

      container.read(notificationsProvider.notifier).deleteNotification('n1');

      expect(container.read(notificationsProvider).length, 1);
      expect(container.read(notificationsProvider).any((n) => n.id == 'n1'), isFalse);
    });

    test('syncUrgentPosts creates alerts for real urgent posts only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      notifier.syncUrgentPosts([
        _urgentPost(_uuid(1)),
        _urgentPost('post_breaking_mock', city: 'Kolkata'),
      ]);

      final alerts = container.read(notificationsProvider);
      expect(alerts.length, 1);
      expect(alerts.first.id, 'urgent_${_uuid(1)}');
      expect(alerts.first.actionRoute, '/content/${_uuid(1)}');
      expect(container.read(unreadNotificationsCountProvider), 1);
    });

    test('syncUrgentPosts never repeats an alert', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      final posts = [_urgentPost(_uuid(2))];
      notifier.syncUrgentPosts(posts);
      notifier.syncUrgentPosts(posts);

      expect(container.read(notificationsProvider).length, 1);
    });

    test('syncUrgentPosts caps stored alerts at 20', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      notifier.syncUrgentPosts(
        [for (var i = 0; i < 25; i++) _urgentPost(_uuid(100 + i))],
      );

      expect(container.read(notificationsProvider).length, 20);
    });

    test('notified ids persist across restarts', () async {
      SharedPreferences.setMockInitialValues({});
      final first = ProviderContainer();
      addTearDown(first.dispose);
      first.read(notificationsProvider.notifier).syncUrgentPosts([_urgentPost(_uuid(3))]);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final second = ProviderContainer();
      addTearDown(second.dispose);
      // Let the known-ids microtask load before syncing.
      second.read(notificationsProvider);
      await Future<void>.delayed(Duration.zero);
      // Known id from previous session must not alert again.
      second.read(notificationsProvider.notifier).syncUrgentPosts([_urgentPost(_uuid(3))]);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(second.read(notificationsProvider).length, 0);
    });
  });
}
