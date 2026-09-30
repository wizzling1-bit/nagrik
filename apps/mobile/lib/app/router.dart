import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/typography.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/screens/content_detail_screen.dart';
import 'package:nagrik/features/home/presentation/home_screen.dart';
import 'package:nagrik/features/notifications/presentation/notifications_screen.dart';
import 'package:nagrik/features/onboarding/presentation/onboarding_screen.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:nagrik/features/onboarding/presentation/splash_screen.dart';
import 'package:nagrik/features/saved/presentation/saved_screen.dart';
import 'package:nagrik/features/search/presentation/search_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/about_nagrik_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/contact_us_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/government_disclaimer_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/information_sources_screen.dart';
import 'package:nagrik/features/settings/presentation/screens/legal_viewer_screen.dart';
import 'package:nagrik/features/settings/presentation/settings_screen.dart';
import 'package:nagrik/features/videos/presentation/screens/videos_screen.dart';

/// Route path constants for the simplified hyperlocal news app.
abstract final class AppRoutes {
  static const splash = '/splash';
  static const onboarding = '/onboarding';
  static const home = '/';
  static const videos = '/videos';
  static const search = '/search';
  static const saved = '/saved';
  static const notifications = '/notifications';
  static const settings = '/settings';
  static const contentDetail = '/content/:id';
  static const about = '/settings/about';
  static const contact = '/settings/contact';
  static const governmentDisclaimer = '/settings/disclaimer';
  static const informationSources = '/settings/sources';
  static const legalViewer = '/settings/legal/:slug';
}

/// Provider for the app-level [GoRouter].
final routerProvider = Provider<GoRouter>((ref) {
  final onboardingListenable = _OnboardingListenable(ref);
  ref.onDispose(onboardingListenable.dispose);
  return GoRouter(
    initialLocation: AppRoutes.splash,
    // Re-evaluate guards whenever onboarding completion flips, so finishing
    // onboarding (or a fresh install) routes correctly without imperative gos.
    refreshListenable: onboardingListenable,
    // Guard deep links: completed users can never land back on onboarding,
    // unfinished users can never enter the app shell, and unknown content
    // IDs fall through to the detail screen's own not-found state.
    redirect: (context, state) {
      final completed = ref.read(hasCompletedOnboardingProvider);
      final loc = state.uri.toString();
      if (completed && loc.startsWith(AppRoutes.onboarding)) {
        return AppRoutes.home;
      }
      if (!completed &&
          loc != AppRoutes.splash &&
          !loc.startsWith(AppRoutes.onboarding)) {
        return AppRoutes.onboarding;
      }
      return null;
    },
    errorBuilder: (context, state) => Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.article_outlined, size: 48),
                const SizedBox(height: 12),
                const Text(
                  'Page not found',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 6),
                const Text('The page you opened does not exist.'),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () => context.go(AppRoutes.home),
                  child: const Text('Go Home'),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        pageBuilder: (context, state) => CustomTransitionPage<void>(
          key: state.pageKey,
          transitionDuration: const Duration(milliseconds: 400),
          reverseTransitionDuration: const Duration(milliseconds: 300),
          transitionsBuilder: (_, animation, _, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          child: SplashScreen(
            onInitialized: () {
              if (context.mounted) {
                final hasCompleted = ref.read(hasCompletedOnboardingProvider);
                if (hasCompleted) {
                  context.go(AppRoutes.home);
                } else {
                  context.go(AppRoutes.onboarding);
                }
              }
            },
          ),
        ),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const OnboardingScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.notifications,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const NotificationsScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.contentDetail,
        pageBuilder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          final extraPost = state.extra is Post ? state.extra as Post : null;
          return _smoothPageTransition(
            key: state.pageKey,
            child: ContentDetailScreen(
              contentId: id,
              initialPost: extraPost,
            ),
          );
        },
      ),
      GoRoute(
        path: AppRoutes.about,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const AboutNagrikScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.contact,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const ContactUsScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.governmentDisclaimer,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const GovernmentDisclaimerScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.informationSources,
        pageBuilder: (context, state) => _smoothPageTransition(
          key: state.pageKey,
          child: const InformationSourcesScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.legalViewer,
        pageBuilder: (context, state) {
          final slug = state.pathParameters['slug'] ?? 'editorial-guidelines';
          return _smoothPageTransition(
            key: state.pageKey,
            child: LegalViewerScreen(slug: slug),
          );
        },
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return _ScaffoldWithNavBar(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.home,
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.videos,
                builder: (context, state) => const VideosScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.search,
                builder: (context, state) => const SearchScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.saved,
                builder: (context, state) => const SavedScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.settings,
                builder: (context, state) => const SettingsScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

/// Scaffold wrapper with high-performance persistent bottom navigation:
/// Home, Search, Saved with system back-button handling.
class _ScaffoldWithNavBar extends ConsumerStatefulWidget {
  const _ScaffoldWithNavBar({required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  ConsumerState<_ScaffoldWithNavBar> createState() => _ScaffoldWithNavBarState();
}

class _ScaffoldWithNavBarState extends ConsumerState<_ScaffoldWithNavBar> {
  DateTime? _lastBackPressTime;

  void _handleBackPress(BuildContext context) {
    // 1. If currently on a sub-tab (Search or Saved), go back to Home first!
    if (widget.navigationShell.currentIndex != 0) {
      NagrikMotion.selectionClick();
      widget.navigationShell.goBranch(0);
      return;
    }

    // 2. If on the Home tab, require double back press to prevent accidental app close
    final now = DateTime.now();
    if (_lastBackPressTime == null ||
        now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
      _lastBackPressTime = now;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.info_outline, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Text(
                'Press back again to exit',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          backgroundColor: const Color(0xFF1E293B),
          action: SnackBarAction(
            label: 'EXIT',
            textColor: const Color(0xFFEF4444),
            onPressed: () => SystemNavigator.pop(),
          ),
        ),
      );
      return;
    }

    // 3. User pressed back twice within 2 seconds: close the app
    SystemNavigator.pop();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final navBarBg = isDark
        ? NagrikDarkColors.level1Surface
        : NagrikLightColors.surface;
    const brandOrange = NagrikBrandColors.orangePrimary;
    final inactiveColor = context.nagrikTheme.textSecondary;
    final borderColor = isDark
        ? NagrikDarkColors.border
        : NagrikLightColors.border;

    final strings = ref.watch(appStringsProvider);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        _handleBackPress(context);
      },
      child: AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark
            ? SystemUiOverlayStyle.light.copyWith(
                statusBarColor: Colors.transparent,
                systemNavigationBarColor: Colors.transparent,
                systemNavigationBarIconBrightness: Brightness.light,
              )
            : SystemUiOverlayStyle.dark.copyWith(
                statusBarColor: Colors.transparent,
                systemNavigationBarColor: Colors.transparent,
                systemNavigationBarIconBrightness: Brightness.dark,
              ),
        child: Scaffold(
          body: widget.navigationShell,
          bottomNavigationBar: Container(
            decoration: BoxDecoration(
              color: navBarBg,
              border: Border(
                top: BorderSide(
                  color: borderColor,
                  width: 0.85,
                ),
              ),
              boxShadow: [
                BoxShadow(
                  color: isDark
                      ? Colors.black.withValues(alpha: 0.40)
                      : Colors.black.withValues(alpha: 0.04),
                  blurRadius: 20,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Center(
                heightFactor: 1.0,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 600),
                  child: NavigationBarTheme(
                    data: NavigationBarThemeData(
                      indicatorColor:
                          brandOrange.withValues(alpha: isDark ? 0.22 : 0.12),
                      indicatorShape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      iconTheme: WidgetStateProperty.resolveWith((states) {
                        if (states.contains(WidgetState.selected)) {
                          return const IconThemeData(
                            color: brandOrange,
                            size: 24,
                          );
                        }
                        return IconThemeData(
                          color: inactiveColor,
                          size: 22,
                        );
                      }),
                      labelTextStyle: WidgetStateProperty.resolveWith((states) {
                        if (states.contains(WidgetState.selected)) {
                          return GoogleFonts.plusJakartaSans(
                            color: brandOrange,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            letterSpacing: -0.15,
                          ).copyWith(
                            fontFamilyFallback: NagrikTypography.fontFallbacks,
                          );
                        }
                        return GoogleFonts.plusJakartaSans(
                          color: inactiveColor,
                          fontSize: 11.5,
                          fontWeight: FontWeight.w500,
                          letterSpacing: -0.1,
                        ).copyWith(
                          fontFamilyFallback: NagrikTypography.fontFallbacks,
                        );
                      }),
                    ),
                    child: NavigationBar(
                      selectedIndex: widget.navigationShell.currentIndex,
                      backgroundColor: Colors.transparent,
                      elevation: 0,
                      height: 64,
                      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
                      onDestinationSelected: (index) {
                        if (index != widget.navigationShell.currentIndex) {
                          NagrikMotion.selectionClick();
                          widget.navigationShell.goBranch(
                            index,
                            initialLocation: false,
                          );
                        }
                      },
                      destinations: [
                        NavigationDestination(
                          icon: const Icon(Icons.home_outlined),
                          selectedIcon: const Icon(Icons.home_rounded),
                          label: strings.navHome,
                          tooltip: strings.navHome,
                        ),
                        NavigationDestination(
                          icon: const Icon(Icons.play_circle_outline_rounded),
                          selectedIcon: const Icon(Icons.play_circle_filled_rounded),
                          label: strings.navVideos,
                          tooltip: strings.navVideos,
                        ),
                        NavigationDestination(
                          icon: const Icon(Icons.search_rounded),
                          selectedIcon: const Icon(Icons.search_rounded),
                          label: strings.navSearch,
                          tooltip: strings.navSearch,
                        ),
                        NavigationDestination(
                          icon: const Icon(Icons.bookmark_outline_rounded),
                          selectedIcon: const Icon(Icons.bookmark_rounded),
                          label: strings.navSaved,
                          tooltip: strings.navSaved,
                        ),
                        NavigationDestination(
                          icon: const Icon(Icons.settings_outlined),
                          selectedIcon: const Icon(Icons.settings_rounded),
                          label: strings.settings,
                          tooltip: strings.settings,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Forwards onboarding-completion changes to GoRouter so [GoRouter.redirect]
/// re-evaluates without imperative navigation calls.
class _OnboardingListenable extends ChangeNotifier {
  _OnboardingListenable(Ref ref) {
    ref.listen<bool>(
      hasCompletedOnboardingProvider,
      (_, _) => notifyListeners(),
    );
  }
}

/// Helper for silky smooth slide and fade page transitions.
Page<dynamic> _smoothPageTransition({
  required LocalKey key,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: key,
    child: child,
    transitionDuration: const Duration(milliseconds: 240),
    reverseTransitionDuration: const Duration(milliseconds: 190),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curve = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
      final slideAnimation = Tween<Offset>(
        begin: const Offset(0.04, 0),
        end: Offset.zero,
      ).animate(curve);

      return SlideTransition(
        position: slideAnimation,
        child: FadeTransition(
          opacity: curve,
          child: child,
        ),
      );
    },
  );
}
