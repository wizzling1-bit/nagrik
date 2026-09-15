import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/empty_state.dart';
import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';
import 'package:nagrik/features/notifications/presentation/widgets/notification_card.dart';

/// Notifications screen. The backend exposes no notification-history API, so
/// production shows an honest empty state plus a shortcut to notification
/// preferences. Real push alerts will appear here once FCM lands.
class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationsProvider);
    final unreadCount = ref.watch(unreadNotificationsCountProvider);
    final strings = ref.watch(appStringsProvider);
    final notifier = ref.read(notificationsProvider.notifier);
    final isDark = context.isDarkMode;

    final bgColor = context.nagrikTheme.level0Background;
    final barBg = isDark
        ? context.nagrikTheme.level1Surface
        : context.colorScheme.surface;

    final now = DateTime.now();
    final todayList = notifications.where((n) {
      return now.difference(n.timestamp).inHours < 24;
    }).toList();

    final earlierList = notifications.where((n) {
      return now.difference(n.timestamp).inHours >= 24;
    }).toList();

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: barBg,
        elevation: 0,
        title: Text(
          strings.notifications,
          style: context.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w800,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              context.go('/');
            }
          },
        ),
        actions: [
          if (unreadCount > 0)
            TextButton(
              onPressed: () {
                NagrikMotion.lightImpact();
                notifier.markAllAsRead();
              },
              child: Text(
                strings.markAllRead,
                style: context.textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          const SizedBox(width: NagrikSpacing.space2),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 680),
          child: notifications.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(NagrikSpacing.space6),
                    child: NagrikEmptyState(
                      icon: Icons.notifications_none_outlined,
                      title: strings.noNotificationsTitle,
                      description: strings.noNotificationsDesc,
                      actionLabel: strings.notificationSettingsAction,
                      onAction: () => context.go('/settings'),
                    ),
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.symmetric(
                    vertical: NagrikSpacing.space2,
                  ),
                  children: [
                    if (todayList.isNotEmpty) ...[
                      _buildSectionHeader(
                        context,
                        strings.todaySection,
                        hasUnread: todayList.any((n) => !n.isRead),
                      ),
                      ...todayList.asMap().entries.map(
                        (entry) => NagrikStaggeredEntrance(
                          index: entry.key < 5 ? entry.key : 0,
                          child: _buildItem(context, entry.value, notifier),
                        ),
                      ),
                    ],
                    if (earlierList.isNotEmpty) ...[
                      _buildSectionHeader(
                        context,
                        strings.earlierSection,
                        hasUnread: false,
                      ),
                      ...earlierList.asMap().entries.map(
                        (entry) => NagrikStaggeredEntrance(
                          index: entry.key < 5 ? entry.key : 0,
                          child: _buildItem(context, entry.value, notifier),
                        ),
                      ),
                    ],
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(
    BuildContext context,
    String title, {
    required bool hasUnread,
  }) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        NagrikSpacing.space4,
        NagrikSpacing.space3,
        NagrikSpacing.space4,
        NagrikSpacing.space1,
      ),
      child: Row(
        children: [
          Text(
            title,
            style: context.textTheme.labelSmall?.copyWith(
              color: context.nagrikTheme.textSecondary,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.0,
            ),
          ),
          if (hasUnread) ...[
            const SizedBox(width: 6),
            Semantics(
              label: 'Has unread notifications',
              child: Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: context.colorScheme.primary,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildItem(
    BuildContext context,
    AppNotification item,
    NotificationsNotifier notifier,
  ) {
    return Semantics(
      label: item.title,
      onDismiss: () {
        NagrikMotion.mediumImpact();
        notifier.deleteNotification(item.id);
      },
      child: Dismissible(
        key: Key(item.id),
        direction: DismissDirection.endToStart,
        background: Container(
          margin: const EdgeInsets.symmetric(
            horizontal: NagrikSpacing.space4,
            vertical: NagrikSpacing.space1,
          ),
          decoration: BoxDecoration(
            color: context.colorScheme.error,
            borderRadius: NagrikRadii.borderRadiusMd,
          ),
          alignment: Alignment.centerRight,
          padding: const EdgeInsets.only(right: NagrikSpacing.space4),
          child: const Icon(Icons.delete_outline, color: Colors.white),
        ),
        onDismissed: (_) {
          NagrikMotion.mediumImpact();
          notifier.deleteNotification(item.id);
        },
        child: NotificationCard(
          notification: item,
          onTap: () {
            notifier.markAsRead(item.id);
            if (item.actionRoute != null) {
              context.push(item.actionRoute!);
            }
          },
        ),
      ),
    );
  }
}
