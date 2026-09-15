import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/app/router.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/theme_provider.dart';
import 'package:nagrik/core/ads/admob_service.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// The root application widget.
class NagrikApp extends ConsumerStatefulWidget {
  const NagrikApp({super.key});

  @override
  ConsumerState<NagrikApp> createState() => _NagrikAppState();
}

class _NagrikAppState extends ConsumerState<NagrikApp> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(adMobServiceProvider).initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final router = ref.watch(routerProvider);
    final language = ref.watch(selectedLanguageProvider);

    return MaterialApp.router(
      title: 'Nagrik',
      debugShowCheckedModeBanner: false,
      theme: NagrikTheme.light(),
      darkTheme: NagrikTheme.dark(),
      themeMode: themeMode,
      themeAnimationDuration: const Duration(milliseconds: 280),
      themeAnimationCurve: Curves.easeInOutCubic,
      locale: Locale(language.code),
      supportedLocales: kSupportedLanguages.map((l) => Locale(l.code)).toList(),
      localizationsDelegates: const [
        NagrikLocalizationsDelegate(),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      builder: (context, child) {
        final mediaQuery = MediaQuery.of(context);
        final insets = mediaQuery.viewInsets;
        if (!insets.isNonNegative) {
          final clampedInsets = EdgeInsets.fromLTRB(
            math.max(0.0, insets.left),
            math.max(0.0, insets.top),
            math.max(0.0, insets.right),
            math.max(0.0, insets.bottom),
          );
          return MediaQuery(
            data: mediaQuery.copyWith(viewInsets: clampedInsets),
            child: child ?? const SizedBox.shrink(),
          );
        }
        return child ?? const SizedBox.shrink();
      },
      routerConfig: router,
    );
  }
}
