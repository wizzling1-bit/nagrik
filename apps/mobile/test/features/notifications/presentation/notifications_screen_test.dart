import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/notifications/presentation/notifications_screen.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';

void main() {
  Widget buildApp(Widget child, [ProviderContainer? container]) {
    final c = container ?? ProviderContainer();
    return UncontrolledProviderScope(
      container: c,
      child: MaterialApp(
        theme: NagrikTheme.light(),
        home: child,
      ),
    );
  }

  group('NotificationsScreen', () {
    testWidgets('renders title and honest empty state with settings action', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(buildApp(const NotificationsScreen(), container));
      await tester.pumpAndSettle();

      expect(find.text('Notifications'), findsOneWidget);
      // No fake history: empty state + prefs shortcut instead of cards.
      expect(find.text('Notification settings'), findsOneWidget);
      expect(container.read(unreadNotificationsCountProvider), 0);
    });
  });
}
