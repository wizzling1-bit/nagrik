import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';
import 'package:nagrik/features/onboarding/data/location_service.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Unified single-screen entry journey for Nagrik:
/// - Refined Brand Header & Tagline
/// - Language Selection (English / हिंदी side-by-side with script marks)
/// - Unified Location Control (Active city + Quick GPS detect + 1-tap popular cities)
/// - Integrated "Get Started" entry action
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  bool _isDetectingGps = false;

  void _finishOnboarding() {
    NagrikMotion.mediumImpact();
    ref.read(onboardingStateProvider.notifier).completeOnboarding();
    context.go('/');
  }

  void _openLocationPicker() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const LocationSwitcherSheet(),
    );
  }

  Future<void> _detectGpsLocation() async {
    setState(() => _isDetectingGps = true);
    final locationsAsync = await ref.read(apiLocationsProvider.future);

    final service = ref.read(locationServiceProvider);
    final result = await service.detectAndMatchLocation(
      supportedLocations: locationsAsync,
    );

    if (!mounted) return;
    setState(() => _isDetectingGps = false);
    final success = context.isDarkMode
        ? NagrikDarkColors.success
        : NagrikLightColors.success;

    switch (result) {
      case LocationDetectionSuccess(:final location):
        ref
            .read(onboardingStateProvider.notifier)
            .selectLocation(location.toLocationItem());
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '${ref.watch(appStringsProvider).matchedToPrefix} ${location.displayName}',
            ),
            backgroundColor: success,
          ),
        );
      case LocationPermissionDenied(:final isPermanent):
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isPermanent
                  ? 'Location permission is disabled in app settings.'
                  : 'Location permission was denied.',
            ),
          ),
        );
      case LocationServiceDisabled():
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('GPS / Location service is disabled on your device.'),
          ),
        );
      case LocationDetectionFailure(:final message):
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final selectedLanguage = ref.watch(selectedLanguageProvider);
    final selectedLocation = ref.watch(selectedLocationProvider);

    final bgColor = context.nagrikTheme.level0Background;
    final textColor = context.colorScheme.onSurface;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: 18,
                vertical: 16,
              ),
              child: Container(
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level1Surface
                      : context.colorScheme.surface,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: context.nagrikTheme.border,
                    width: 0.9,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isDark
                          ? Colors.black.withValues(alpha: 0.35)
                          : Colors.black.withValues(alpha: 0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 22,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // 1. Sleek Brand Header
                    _buildHeader(context, textColor, isDark),

                    const SizedBox(height: 16),
                    Divider(
                      color: context.nagrikTheme.divider,
                      height: 1,
                      thickness: 0.8,
                    ),
                    const SizedBox(height: 16),

                    // 2. Language Selection ("Choose Language")
                    _buildLanguageSection(
                      context,
                      selectedLanguage,
                      textColor,
                      isDark,
                    ),

                    const SizedBox(height: 16),
                    Divider(
                      color: context.nagrikTheme.divider,
                      height: 1,
                      thickness: 0.8,
                    ),
                    const SizedBox(height: 16),

                    // 3. Location Setup ("Your Location")
                    _buildLocationSection(
                      context,
                      selectedLocation,
                      textColor,
                      isDark,
                    ),

                    const SizedBox(height: 20),

                    // 4. Primary CTA ("Get Started")
                    NagrikButton(
                      label: 'Get Started',
                      icon: Icons.arrow_forward_rounded,
                      onPressed: _finishOnboarding,
                      size: NagrikButtonSize.large,
                      fullWidth: true,
                    ),

                    const SizedBox(height: 12),

                    // 5. Trust / Privacy Micro-Line
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.verified_user_outlined,
                          size: 13,
                          color: context.nagrikTheme.textTertiary,
                        ),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            'Verified Local News • Ad-Transparent • Zero Tracking',
                            style: context.textTheme.labelSmall?.copyWith(
                              color: context.nagrikTheme.textTertiary,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, Color textColor, bool isDark) {
    return Row(
      children: [
        // App Crest Emblem
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: context.colorScheme.primary.withValues(alpha: 0.25),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.18),
              width: 1.0,
            ),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(13),
            child: Image.asset(
              'assets/images/nagrik_logo.png',
              fit: BoxFit.cover,
              filterQuality: FilterQuality.high,
            ),
          ),
        ),
        const SizedBox(width: 14),

        // Title and tagline
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Text(
                    'Nagrik',
                    style: context.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.4,
                      color: textColor,
                      fontSize: 21,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: context.colorScheme.primary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(
                        color: context.colorScheme.primary.withValues(
                          alpha: 0.28,
                        ),
                        width: 0.6,
                      ),
                    ),
                    child: Text(
                      'HYPERLOCAL',
                      style: TextStyle(
                        color: context.colorScheme.primary,
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 3),
              Text(
                'Hyperlocal news, civic alerts, and community updates.',
                style: context.textTheme.bodySmall?.copyWith(
                  color: context.nagrikTheme.textSecondary,
                  height: 1.25,
                  fontSize: 12.5,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLanguageSection(
    BuildContext context,
    dynamic selectedLanguage,
    Color textColor,
    bool isDark,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.translate_rounded,
              size: 16,
              color: context.colorScheme.primary,
            ),
            const SizedBox(width: 7),
            Text(
              'Choose Language',
              style: context.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.15,
                color: textColor,
                fontSize: 14,
              ),
            ),
            const Spacer(),
            Text(
              'भाषा चुनें',
              style: context.textTheme.labelSmall?.copyWith(
                color: context.nagrikTheme.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Side-by-side Language Cards
        Row(
          children: [
            for (final lang in kSupportedLanguages) ...[
              Expanded(
                child: _buildLanguageCard(
                  context,
                  lang: lang,
                  isSelected: lang.code == selectedLanguage.code,
                  textColor: textColor,
                  isDark: isDark,
                ),
              ),
              if (lang != kSupportedLanguages.last) const SizedBox(width: 10),
            ],
          ],
        ),
      ],
    );
  }

  Widget _buildLanguageCard(
    BuildContext context, {
    required dynamic lang,
    required bool isSelected,
    required Color textColor,
    required bool isDark,
  }) {
    final isHindi = lang.code == 'hi';
    final displayName = isHindi ? 'हिंदी' : 'English';
    final greeting = isHindi ? 'नमस्ते • स्थानीय समाचार' : 'Hello • Local News';
    final scriptMark = isHindi ? 'अ' : 'EN';

    return Semantics(
      button: true,
      selected: isSelected,
      label: '$displayName, $greeting',
      child: NagrikSpringPressable(
        onTap: () {
          NagrikMotion.selectionClick();
          ref.read(onboardingStateProvider.notifier).selectLanguage(lang);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 10,
          ),
          decoration: BoxDecoration(
            color: isSelected
                ? context.colorScheme.primary.withValues(
                    alpha: isDark ? 0.16 : 0.08,
                  )
                : (isDark
                    ? context.nagrikTheme.level2Elevated.withValues(alpha: 0.5)
                    : context.nagrikTheme.surfaceMuted.withValues(alpha: 0.6)),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected
                  ? context.colorScheme.primary
                  : context.nagrikTheme.border.withValues(
                      alpha: isDark ? 0.6 : 0.8,
                    ),
              width: isSelected ? 1.5 : 0.85,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: context.colorScheme.primary.withValues(alpha: 0.12),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            children: [
              // Script badge
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: isSelected
                      ? context.colorScheme.primary
                      : context.nagrikTheme.border.withValues(alpha: 0.4),
                  borderRadius: BorderRadius.circular(7),
                ),
                child: Center(
                  child: Text(
                    scriptMark,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: isSelected ? Colors.white : textColor,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      displayName,
                      style: context.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                        color: isSelected
                            ? context.colorScheme.primary
                            : textColor,
                      ),
                    ),
                    const SizedBox(height: 1),
                    Text(
                      greeting,
                      style: context.textTheme.bodySmall?.copyWith(
                        color: context.nagrikTheme.textSecondary,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (isSelected)
                Icon(
                  Icons.check_circle_rounded,
                  color: context.colorScheme.primary,
                  size: 17,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLocationSection(
    BuildContext context,
    LocationItem? selectedLocation,
    Color textColor,
    bool isDark,
  ) {
    // Top quick-pick cities for 1-tap instant onboarding
    final quickCities = [
      kIndianLocations[0], // Patna Boring Road
      kIndianLocations[3], // Gaya Bodhgaya
      const LocationItem(
        id: 'loc_muzaffarpur',
        locality: 'Maripur',
        city: 'Muzaffarpur',
        district: 'Muzaffarpur',
        state: 'Bihar',
        pincode: '842001',
      ),
      const LocationItem(
        id: 'loc_bhagalpur',
        locality: 'Adampur',
        city: 'Bhagalpur',
        district: 'Bhagalpur',
        state: 'Bihar',
        pincode: '812001',
      ),
      const LocationItem(
        id: 'loc_darbhanga',
        locality: 'Laheriasarai',
        city: 'Darbhanga',
        district: 'Darbhanga',
        state: 'Bihar',
        pincode: '846001',
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.location_on_rounded,
              size: 16,
              color: context.colorScheme.primary,
            ),
            const SizedBox(width: 7),
            Text(
              'Your Location',
              style: context.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.15,
                color: textColor,
                fontSize: 14,
              ),
            ),
            const Spacer(),
            Text(
              'स्थान चुनें',
              style: context.textTheme.labelSmall?.copyWith(
                color: context.nagrikTheme.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Unified Active Location Vessel
        Container(
          decoration: BoxDecoration(
            color: isDark
                ? context.nagrikTheme.level2Elevated.withValues(alpha: 0.5)
                : context.nagrikTheme.surfaceMuted.withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: context.nagrikTheme.border.withValues(
                alpha: isDark ? 0.6 : 0.8,
              ),
              width: 0.85,
            ),
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Current Selected City Row + Change Button
              Row(
                children: [
                  // Live green beacon
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: selectedLocation != null
                          ? const Color(0xFF10B981)
                          : context.colorScheme.primary,
                      shape: BoxShape.circle,
                      boxShadow: selectedLocation != null
                          ? [
                              BoxShadow(
                                color: const Color(0xFF10B981).withValues(
                                  alpha: 0.4,
                                ),
                                blurRadius: 6,
                              ),
                            ]
                          : null,
                    ),
                  ),
                  const SizedBox(width: 10),

                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          selectedLocation?.displayName ?? 'Select city / town',
                          style: context.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: textColor,
                            fontSize: 13.5,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 1),
                        Text(
                          selectedLocation != null
                              ? 'Active Hyperlocal Coverage'
                              : 'Tap to choose your district',
                          style: context.textTheme.bodySmall?.copyWith(
                            color: context.nagrikTheme.textSecondary,
                            fontSize: 10.5,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // GPS Detect button
                  Semantics(
                    button: true,
                    label: 'Detect GPS location',
                    child: NagrikSpringPressable(
                      onTap: _isDetectingGps ? null : _detectGpsLocation,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 9,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: context.colorScheme.primary.withValues(
                            alpha: 0.12,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (_isDetectingGps)
                              SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(
                                  strokeWidth: 1.8,
                                  valueColor: AlwaysStoppedAnimation(
                                    context.colorScheme.primary,
                                  ),
                                ),
                              )
                            else
                              Icon(
                                Icons.my_location_rounded,
                                size: 13,
                                color: context.colorScheme.primary,
                              ),
                            const SizedBox(width: 5),
                            Text(
                              'GPS',
                              style: TextStyle(
                                color: context.colorScheme.primary,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),

                  // Modal sheet opener button
                  Semantics(
                    button: true,
                    label: 'Browse all cities',
                    child: NagrikSpringPressable(
                      onTap: _openLocationPicker,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 9,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: context.nagrikTheme.border.withValues(
                            alpha: 0.4,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'All',
                              style: TextStyle(
                                color: textColor,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 2),
                            Icon(
                              Icons.keyboard_arrow_down_rounded,
                              size: 15,
                              color: textColor,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),
              Divider(
                color: context.nagrikTheme.divider.withValues(alpha: 0.6),
                height: 1,
                thickness: 0.6,
              ),
              const SizedBox(height: 8),

              // Quick-pick popular city chips
              Row(
                children: [
                  Text(
                    'Quick:',
                    style: context.textTheme.labelSmall?.copyWith(
                      color: context.nagrikTheme.textTertiary,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          for (final city in quickCities) ...[
                            _buildQuickCityChip(
                              context,
                              city: city,
                              isSelected: selectedLocation?.city == city.city,
                              textColor: textColor,
                              isDark: isDark,
                            ),
                            const SizedBox(width: 6),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuickCityChip(
    BuildContext context, {
    required LocationItem city,
    required bool isSelected,
    required Color textColor,
    required bool isDark,
  }) {
    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Select ${city.city}',
      child: NagrikSpringPressable(
        onTap: () {
          NagrikMotion.selectionClick();
          ref.read(onboardingStateProvider.notifier).selectLocation(city);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(
            horizontal: 8,
            vertical: 4,
          ),
          decoration: BoxDecoration(
            color: isSelected
                ? context.colorScheme.primary
                : (isDark
                    ? context.nagrikTheme.level3Interactive.withValues(alpha: 0.4)
                    : context.colorScheme.surface),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: isSelected
                  ? context.colorScheme.primary
                  : context.nagrikTheme.border.withValues(alpha: 0.6),
              width: 0.75,
            ),
          ),
          child: Text(
            city.city,
            style: TextStyle(
              color: isSelected ? Colors.white : textColor,
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
