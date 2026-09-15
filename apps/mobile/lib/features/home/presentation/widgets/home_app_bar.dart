import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Home header: menu, brand + location picker, search, notifications.
class HomeAppBar extends ConsumerStatefulWidget {
  const HomeAppBar({
    super.key,
    this.onMenuTap,
    this.onLocationTap,
    this.onSearchTap,
    this.onNotificationsTap,
  });

  final VoidCallback? onMenuTap;
  final VoidCallback? onLocationTap;
  final VoidCallback? onSearchTap;
  final VoidCallback? onNotificationsTap;

  @override
  ConsumerState<HomeAppBar> createState() => _HomeAppBarState();
}

class _HomeAppBarState extends ConsumerState<HomeAppBar> {
  bool _isLocationPressed = false;

  @override
  Widget build(BuildContext context) {
    final location = ref.watch(selectedLocationProvider);
    final locationText =
        location?.displayName ??
        ref.watch(appStringsProvider).selectLocationAction;
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    final textColor = context.colorScheme.onSurface;
    final subtextColor = context.nagrikTheme.textSecondary;

    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          NagrikSpacing.space4,
          NagrikSpacing.space2,
          NagrikSpacing.space3,
          NagrikSpacing.space2,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // 1. Brand Crest / Quick Access
            Semantics(
              button: true,
              label: ref.watch(appStringsProvider).openSettingsLabel,
              child: NagrikSpringPressable(
                onTap: () {
                  NagrikMotion.lightImpact();
                  if (widget.onMenuTap != null) {
                    widget.onMenuTap!();
                  } else {
                    context.go('/settings');
                  }
                },
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: context.isDarkMode
                        ? context.nagrikTheme.level2Elevated
                        : context.colorScheme.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: context.isDarkMode
                          ? context.nagrikTheme.border.withValues(alpha: 0.8)
                          : context.colorScheme.primary.withValues(alpha: 0.18),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: context.isDarkMode
                            ? Colors.black.withValues(alpha: 0.25)
                            : context.colorScheme.primary.withValues(alpha: 0.06),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      Icons.tune_rounded,
                      size: 20,
                      color: context.isDarkMode
                          ? context.nagrikTheme.brandBright
                          : context.colorScheme.primary,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: NagrikSpacing.space3),

            // 2. Brand title + location picker capsule
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Nagrik',
                    style: context.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                      height: 1.12,
                      fontSize: 19,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Semantics(
                    button: true,
                    label: 'Change location. Current: $locationText',
                    child: GestureDetector(
                      onTapDown: (_) =>
                          setState(() => _isLocationPressed = true),
                      onTapUp: (_) {
                        setState(() => _isLocationPressed = false);
                        if (widget.onLocationTap != null) {
                          widget.onLocationTap!();
                        } else {
                          showLocationSwitcher(context);
                        }
                      },
                      onTapCancel: () =>
                          setState(() => _isLocationPressed = false),
                      behavior: HitTestBehavior.opaque,
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(minHeight: 38),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 9,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _isLocationPressed
                                ? (context.isDarkMode
                                    ? context.nagrikTheme.level3Interactive
                                    : context.nagrikTheme.surfaceInteractive)
                                : (context.isDarkMode
                                    ? context.nagrikTheme.level4Muted
                                    : context.nagrikTheme.surfaceMuted),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: context.isDarkMode
                                  ? context.nagrikTheme.border.withValues(alpha: 0.6)
                                  : context.nagrikTheme.border.withValues(alpha: 0.75),
                              width: 0.85,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: location != null
                                      ? const Color(0xFF10B981) // emerald live
                                      : context.colorScheme.primary,
                                  shape: BoxShape.circle,
                                  boxShadow: location != null
                                      ? [
                                          BoxShadow(
                                            color: const Color(0xFF10B981)
                                                .withValues(alpha: 0.5),
                                            blurRadius: 4,
                                          ),
                                        ]
                                      : null,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Icon(
                                Icons.location_on,
                                size: 13,
                                color: context.colorScheme.primary,
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  locationText,
                                  style: context.textTheme.labelMedium?.copyWith(
                                    color: context.colorScheme.onSurface,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12.5,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 3),
                              AnimatedRotation(
                                turns: _isLocationPressed ? 0.5 : 0.0,
                                duration: const Duration(milliseconds: 200),
                                curve: Curves.easeOutCubic,
                                child: Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  size: 15,
                                  color: subtextColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // 3. Search action
            Semantics(
              button: true,
              label: ref.watch(appStringsProvider).searchStoriesLabel,
              child: NagrikSpringPressable(
                onTap: () {
                  NagrikMotion.lightImpact();
                  if (widget.onSearchTap != null) {
                    widget.onSearchTap!();
                  } else {
                    context.push('/search');
                  }
                },
                child: Container(
                  width: 40,
                  height: 40,
                  margin: const EdgeInsets.only(right: 6),
                  decoration: BoxDecoration(
                    color: context.isDarkMode
                        ? context.nagrikTheme.level2Elevated
                        : context.nagrikTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: context.isDarkMode
                          ? context.nagrikTheme.border.withValues(alpha: 0.6)
                          : context.nagrikTheme.border.withValues(alpha: 0.7),
                      width: 0.85,
                    ),
                  ),
                  child: Center(
                    child: Icon(
                      Icons.search_rounded,
                      size: 21,
                      color: textColor,
                    ),
                  ),
                ),
              ),
            ),

            // 4. Notifications action with unread dot
            Semantics(
              button: true,
              label: unreadCount > 0
                  ? 'Notifications, $unreadCount unread'
                  : 'Notifications',
              child: NagrikSpringPressable(
                onTap: () {
                  NagrikMotion.lightImpact();
                  if (widget.onNotificationsTap != null) {
                    widget.onNotificationsTap!();
                  } else {
                    context.push('/notifications');
                  }
                },
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: context.isDarkMode
                        ? context.nagrikTheme.level2Elevated
                        : context.nagrikTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: context.isDarkMode
                          ? context.nagrikTheme.border.withValues(alpha: 0.6)
                          : context.nagrikTheme.border.withValues(alpha: 0.7),
                      width: 0.85,
                    ),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none_rounded,
                        size: 21,
                        color: textColor,
                      ),
                      if (unreadCount > 0)
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            width: 7,
                            height: 7,
                            decoration: BoxDecoration(
                              color: context.colorScheme.error,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: context.isDarkMode
                                    ? context.nagrikTheme.level2Elevated
                                    : Colors.white,
                                width: 1.2,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
