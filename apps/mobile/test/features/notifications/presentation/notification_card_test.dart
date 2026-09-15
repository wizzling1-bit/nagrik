import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import '../../../fixtures/mock_notifications_data.dart';
import 'package:nagrik/features/notifications/presentation/widgets/notification_card.dart';

void main() {
  Widget buildApp(Widget child) {
    return ProviderScope(
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: Scaffold(body: SingleChildScrollView(child: child)),
      ),
    );
  }

  group('NotificationCard', () {
    testWidgets('renders title, body, source, timestamp, and unread indicator', (tester) async {
      final notif = kMockNotifications.first; // Unread alert

      await tester.pumpWidget(buildApp(NotificationCard(notification: notif)));
      await tester.pumpAndSettle();

      expect(find.text(notif.title), findsOneWidget);
      expect(find.text(notif.body), findsOneWidget);
      expect(find.text(notif.sourceName), findsOneWidget);
      expect(find.text(notif.formattedTimeAgo), findsOneWidget);
    });

    testWidgets('calls onTap when clicked', (tester) async {
      var tapped = false;
      final notif = kMockNotifications.first;

      await tester.pumpWidget(
        buildApp(
          NotificationCard(
            notification: notif,
            onTap: () => tapped = true,
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byType(NotificationCard));
      expect(tapped, isTrue);
    });
  });
}
