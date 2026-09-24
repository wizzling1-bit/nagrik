import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/notifications/presentation/providers/notifications_providers.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Home masthead app bar:
/// - Settings / quick menu button
/// - Authentic vector NagrikLogo (`NagrikLogo.horizontal(size: NagrikLogoSize.sm, hideSubtitle: true)`)
/// - Live ward capsule with pulsing emerald dot, brand orange map pin, and locality text
/// - Search action button
/// - Notifications action button with unread count badge counter
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
    final strings = ref.watch(appStringsProvider);
    final locationText = location?.displayName ?? strings.selectLocationAction;
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    final isDark = context.isDarkMode;
    final textColor = context.colorScheme.onSurface;
    final subtextColor = context.nagrikTheme.textSecondary;
    final borderColor = isDark ? NagrikDarkColors.border : NagrikLightColors.border;

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
            // 1. Brand Crest / Settings Quick Access
            Semantics(
              button: true,
              label: strings.openSettingsLabel,
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
                    color: isDark
                        ? context.nagrikTheme.level2Elevated
                        : context.colorScheme.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isDark
                          ? borderColor.withValues(alpha: 0.8)
                          : context.colorScheme.primary.withValues(alpha: 0.18),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isDark
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
                      color: isDark
                          ? context.nagrikTheme.brandBright
                          : context.colorScheme.primary,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: NagrikSpacing.space3),

            // 2. Brand identity & Ward location capsule
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const NagrikLogo.horizontal(
                    size: NagrikLogoSize.sm,
                    hideSubtitle: true,
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
                        constraints: const BoxConstraints(minHeight: 32),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 9,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _isLocationPressed
                                ? (isDark
                                    ? context.nagrikTheme.level3Interactive
                                    : context.nagrikTheme.surfaceInteractive)
                                : (isDark
                                    ? context.nagrikTheme.level4Muted
                                    : context.nagrikTheme.surfaceMuted),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: isDark
                                  ? const Color(0xFF1C2537)
                                  : const Color(0xFFDDD5C8),
                              width: 0.85,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Live emerald indicator (#10B981) with soft glow
                              Container(
                                width: 6.5,
                                height: 6.5,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF10B981)
                                          .withValues(alpha: 0.6),
                                      blurRadius: 4,
                                      spreadRadius: 0.5,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 5),
                              // Brand orange MapPin icon (#DE5227)
                              const Icon(
                                Icons.location_on,
                                size: 13,
                                color: NagrikBrandColors.orangePrimary,
                              ),
                              const SizedBox(width: 4),
                              // Locality text in Plus Jakarta Sans bold
                              Flexible(
                                child: Text(
                                  locationText,
                                  style: GoogleFonts.plusJakartaSans(
                                    color: context.colorScheme.onSurface,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12.0,
                                  ).copyWith(
                                    fontFamilyFallback:
                                        NagrikTypography.fontFallbacks,
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
            const SizedBox(width: NagrikSpacing.space2),

            // 3. Search action
            Semantics(
              button: true,
              label: strings.searchStoriesLabel,
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
                    color: isDark
                        ? context.nagrikTheme.level2Elevated
                        : context.nagrikTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isDark
                          ? const Color(0xFF1C2537)
                          : const Color(0xFFDDD5C8),
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

            // 4. Notifications action with unread count badge counter
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
                    color: isDark
                        ? context.nagrikTheme.level2Elevated
                        : context.nagrikTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: context.nagrikTheme.border,
                      width: 0.85,
                    ),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        Icons.notifications_outlined,
                        size: 21,
                        color: textColor,
                      ),
                      if (unreadCount > 0)
                        Positioned(
                          top: 2,
                          right: 2,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 4.5,
                              vertical: 1.5,
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 18,
                              minHeight: 18,
                            ),
                            decoration: BoxDecoration(
                              color: NagrikBrandColors.crimson,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isDark
                                    ? context.nagrikTheme.level2Elevated
                                    : Colors.white,
                                width: 1.2,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                unreadCount > 99 ? '99+' : '$unreadCount',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  height: 1.0,
                                ),
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
