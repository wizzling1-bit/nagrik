import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/core/widgets/glass_card.dart';
import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

/// Notification list item. Flat tonal card; urgency is carried by the
/// BREAKING label plus error color, never color alone.
class NotificationCard extends ConsumerWidget {
  const NotificationCard({
    super.key,
    required this.notification,
    this.onTap,
  });

  final AppNotification notification;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(appStringsProvider);
    final type = notification.type;
    final isUnread = !notification.isRead;

    final isUrgent =
        notification.isCritical || type == NotificationType.urgentAlert;
    final error = context.colorScheme.error;

    final categoryColor = isUrgent ? error : type.defaultColor;
    final iconBgColor = categoryColor.withValues(
      alpha: context.isDarkMode ? 0.20 : 0.10,
    );
    final iconColor = categoryColor;

    return GlassCard(
      margin: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: 5,
      ),
      padding: const EdgeInsets.all(14),
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon badge with categorized tint & outline
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: categoryColor.withValues(
                  alpha: context.isDarkMode ? 0.35 : 0.20,
                ),
                width: 0.8,
              ),
            ),
            child: Icon(
              isUrgent ? Icons.campaign_rounded : type.icon,
              color: iconColor,
              size: 20,
            ),
          ),
          const SizedBox(width: NagrikSpacing.space3),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    if (isUrgent) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: error,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          strings.breakingTag,
                          style: GoogleFonts.jetBrainsMono(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 10.5,
                            letterSpacing: 0.5,
                          ).copyWith(
                            fontFamilyFallback: NagrikTypography.fontFallbacks,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                    ],
                    Expanded(
                      child: Text(
                        notification.sourceName,
                        style: context.textTheme.labelMedium?.copyWith(
                          color: isUrgent
                              ? error
                              : context.nagrikTheme.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      notification.formattedTimeAgo,
                      style: context.textTheme.labelSmall?.copyWith(
                        color: context.nagrikTheme.textSecondary,
                      ),
                    ),
                    if (isUnread) ...[
                      const SizedBox(width: 6),
                      Semantics(
                        label: 'Unread',
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: error,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),

                // Title
                Text(
                  notification.title,
                  style: context.textTheme.titleSmall?.copyWith(
                    fontWeight:
                        isUnread ? FontWeight.w700 : FontWeight.w500,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 3),

                // Body
                Text(
                  notification.body,
                  style: context.textTheme.bodySmall?.copyWith(
                    color: context.nagrikTheme.textSecondary,
                    height: 1.35,
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
