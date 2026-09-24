import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/widgets/nagrik_logo.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/home/presentation/widgets/location_switcher_sheet.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/data/locations_data.dart';
import 'package:nagrik/features/onboarding/data/location_service.dart';
import 'package:nagrik/features/onboarding/domain/models/app_language.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:nagrik/features/onboarding/presentation/widgets/civic_backdrop_data.dart';

/// Premium Dark Editorial Entry & Welcome Screen for Nagrik.
///
/// Implements the authentic dark civic editorial design language:
/// - Subtle cinematic backdrop with Indian civic architectural vignette
/// - Top header with vector [NagrikLogo] and translucent Skip pill
/// - Editorial hero headline: "Your City. Your People. Your News."
/// - Lightweight 3-pillar benefit chips
/// - Side-by-side language selector cards with script badges (EN / अ)
/// - Unified location card with functional GPS detection and "All ▾" catalog sheet
/// - Horizontal quick-pick chips for prominent Indian hubs
/// - Full-width signature brand orange CTA: "→ Get Started (It's free. No sign up needed.)"
/// - Bottom trust indicators: Verified Local News • Ad-Transparent • Zero Hate.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen>
    with SingleTickerProviderStateMixin {
  bool _isDetectingGps = false;
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;

  static final List<LocationItem> _kQuickCities = [
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'patna',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'gaya',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'muzaffarpur',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'bhagalpur',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'new delhi',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'mumbai',
      orElse: () => kIndianLocations[0],
    ),
    kIndianLocations.firstWhere(
      (l) => l.city.toLowerCase() == 'bengaluru',
      orElse: () => kIndianLocations[0],
    ),
  ];

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    );
    _fadeAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutCubic,
    );
    _slideAnim = Tween<Offset>(
      begin: const Offset(0.0, 0.04),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _animController,
        curve: Curves.easeOutCubic,
      ),
    );

    // Start entrance animation
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _finishOnboarding() {
    NagrikMotion.mediumImpact();
    ref.read(onboardingStateProvider.notifier).completeOnboarding();
    if (mounted) {
      try {
        context.go('/');
      } catch (_) {
        // Fallback for isolated widget test environments without GoRouter
      }
    }
  }

  void _openLocationPicker() {
    NagrikMotion.selectionClick();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const LocationSwitcherSheet(),
    );
  }

  Future<void> _detectGpsLocation() async {
    if (_isDetectingGps) return;
    setState(() => _isDetectingGps = true);
    NagrikMotion.mediumImpact();

    try {
      final locationsAsync = await ref.read(apiLocationsProvider.future);
      final service = ref.read(locationServiceProvider);
      final result = await service.detectAndMatchLocation(
        supportedLocations: locationsAsync,
      );

      if (!mounted) return;
      setState(() => _isDetectingGps = false);

      switch (result) {
        case LocationDetectionSuccess(:final location):
          ref
              .read(onboardingStateProvider.notifier)
              .selectLocation(location.toLocationItem(isCurrentLocation: true));
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                '${ref.watch(appStringsProvider).matchedToPrefix} ${location.displayName}',
              ),
              backgroundColor: const Color(0xFF10B981),
              behavior: SnackBarBehavior.floating,
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
              behavior: SnackBarBehavior.floating,
            ),
          );
        case LocationServiceDisabled():
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('GPS / Location service is disabled on your device.'),
              behavior: SnackBarBehavior.floating,
            ),
          );
        case LocationDetectionFailure(:final message):
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(message),
              behavior: SnackBarBehavior.floating,
            ),
          );
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isDetectingGps = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedLanguage = ref.watch(selectedLanguageProvider);
    final selectedLocation = ref.watch(selectedLocationProvider);
    final mediaQuery = MediaQuery.of(context);
    final isReducedMotion = mediaQuery.disableAnimations;

    // Instant completion if reduced motion requested
    if (isReducedMotion && _animController.status != AnimationStatus.completed) {
      _animController.value = 1.0;
    }

    const brandOrange = Color(0xFFDE5227);
    const bgDark = Color(0xFF0C1018);
    const cardBg = Color(0xFF131A2A);
    const borderColor = Color(0xFF1C2537);
    const textSecondary = Color(0xFF8E9DB5);
    const textTertiary = Color(0xFF5E6D84);

    return Scaffold(
      backgroundColor: bgDark,
      body: Stack(
        children: [
          // 1. Subtle Cinematic Civic Backdrop (Indian Heritage Architecture & Water Reflections)
          Positioned(
            top: 0,
            right: 0,
            left: 0,
            height: 480,
            child: IgnorePointer(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.memory(
                    kCivicBackdropBytes,
                    fit: BoxFit.cover,
                    alignment: Alignment.topRight,
                    errorBuilder: (context, error, stackTrace) =>
                        Image.asset(
                      'assets/images/civic_backdrop.jpg',
                      fit: BoxFit.cover,
                      alignment: Alignment.topRight,
                      errorBuilder: (_, _, _) => const SizedBox.shrink(),
                    ),
                  ),
                  // Subtle dark duotone overlay to unify with obsidian canvas
                  Container(
                    color: bgDark.withValues(alpha: 0.25),
                  ),
                  // Vertical fade to solid obsidian base
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Color(0x880C1018),
                          bgDark,
                        ],
                        stops: [0.0, 0.55, 1.0],
                      ),
                    ),
                  ),
                  // Left-to-right vignette so headline has 100% crystal contrast
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          bgDark,
                          Color(0xDD0C1018),
                          Color(0x220C1018),
                        ],
                        stops: [0.0, 0.40, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 2. Foreground Responsive Scrollable Content
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight - 24,
                    ),
                    child: IntrinsicHeight(
                      child: FadeTransition(
                        opacity: _fadeAnim,
                        child: SlideTransition(
                          position: _slideAnim,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // Top & Middle Editorial Content
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  // Top Row: Brand Header + Skip Action
                                  _buildTopBar(context),

                                  const SizedBox(height: 20),

                                  // Hero Editorial Statement
                                  _buildHeroStatement(
                                      brandOrange, textSecondary),

                                  const SizedBox(height: 18),

                                  // 3 Key Benefit Chips
                                  _buildBenefitsRow(
                                      cardBg, borderColor, textSecondary),

                                  const SizedBox(height: 20),

                                  // Language Selection Section
                                  _buildLanguageSection(
                                    selectedLanguage,
                                    brandOrange,
                                    cardBg,
                                    borderColor,
                                    textSecondary,
                                    textTertiary,
                                  ),

                                  const SizedBox(height: 16),

                                  // Location Selection Section
                                  _buildLocationSection(
                                    context,
                                    selectedLocation,
                                    brandOrange,
                                    cardBg,
                                    borderColor,
                                    textSecondary,
                                    textTertiary,
                                  ),
                                ],
                              ),

                              // Bottom Anchored Actions
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const SizedBox(height: 20),

                                  // Prominent "Get Started" CTA
                                  _buildGetStartedButton(brandOrange),

                                  const SizedBox(height: 14),

                                  // Bottom Trust Indicators
                                  _buildTrustIndicators(
                                      borderColor, textTertiary),

                                  const SizedBox(height: 4),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // 1. TOP BAR: LOGO LOCKUP + SKIP PILL
  // ---------------------------------------------------------------------------
  Widget _buildTopBar(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Real Nagrik Vector Brand Crest + Wordmark
        Expanded(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const NagrikLogoMark(
                size: NagrikLogoSize.md,
                width: 36,
                height: 40,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text.rich(
                      TextSpan(
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.3,
                          color: Colors.white,
                        ),
                        children: const [
                          TextSpan(text: 'nagrik'),
                          TextSpan(
                            text: '.news',
                            style: TextStyle(
                              color: Color(0xFFDE5227),
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 1.5),
                    Text(
                      'CITIZEN JOURNALISM PLATFORM',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                        color: const Color(0xFF8E9DB5),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),

        // Translucent Skip Pill
        Semantics(
          button: true,
          label: 'Skip onboarding',
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _finishOnboarding,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.14),
                  width: 1,
                ),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Skip',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(
                    Icons.chevron_right_rounded,
                    size: 15,
                    color: Colors.white70,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // 2. HERO STATEMENT: "Your City. Your People. Your News."
  // ---------------------------------------------------------------------------
  Widget _buildHeroStatement(Color brandOrange, Color textSecondary) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text.rich(
          TextSpan(
            style: GoogleFonts.plusJakartaSans(
              fontSize: 34,
              fontWeight: FontWeight.w800,
              height: 1.15,
              letterSpacing: -0.6,
              color: Colors.white,
            ),
            children: [
              const TextSpan(text: 'Your City.\nYour People.\n'),
              TextSpan(
                text: 'Your News.',
                style: TextStyle(
                  color: brandOrange,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Hyperlocal news, civic alerts, and community updates — from people like you, for people like you.',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            height: 1.45,
            color: textSecondary,
            fontWeight: FontWeight.w400,
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // 3. THREE KEY BENEFIT CHIPS
  // ---------------------------------------------------------------------------
  Widget _buildBenefitsRow(
    Color cardBg,
    Color borderColor,
    Color textSecondary,
  ) {
    return Row(
      children: [
        Expanded(
          child: _buildBenefitChip(
            icon: Icons.location_on_outlined,
            title: 'Local News',
            subtitle: 'From your area',
            cardBg: cardBg,
            borderColor: borderColor,
            textSecondary: textSecondary,
          ),
        ),
        const SizedBox(width: 6),
        Expanded(
          child: _buildBenefitChip(
            icon: Icons.groups_outlined,
            title: 'Real People',
            subtitle: 'Real Stories',
            cardBg: cardBg,
            borderColor: borderColor,
            textSecondary: textSecondary,
          ),
        ),
        const SizedBox(width: 6),
        Expanded(
          child: _buildBenefitChip(
            icon: Icons.verified_user_outlined,
            title: 'A Safer &',
            subtitle: 'Stronger Community',
            cardBg: cardBg,
            borderColor: borderColor,
            textSecondary: textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildBenefitChip({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color cardBg,
    required Color borderColor,
    required Color textSecondary,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 8),
      decoration: BoxDecoration(
        color: cardBg.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: borderColor,
          width: 0.85,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Circular icon container matching reference image
          Container(
            width: 26,
            height: 26,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.08),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.12),
                width: 0.8,
              ),
            ),
            child: Icon(
              icon,
              size: 13,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 5),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.2,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w400,
                    color: textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // 4. LANGUAGE SELECTION SECTION
  // ---------------------------------------------------------------------------
  Widget _buildLanguageSection(
    AppLanguage selectedLanguage,
    Color brandOrange,
    Color cardBg,
    Color borderColor,
    Color textSecondary,
    Color textTertiary,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: borderColor,
          width: 0.85,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.language_rounded,
                    size: 16,
                    color: brandOrange,
                  ),
                  const SizedBox(width: 7),
                  const Text(
                    'Choose Language',
                    style: TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.2,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              Flexible(
                child: Text(
                  'भाषा चुनें',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: textTertiary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Side-by-Side Language Cards
          Row(
            children: [
              for (final lang in kSupportedLanguages) ...[
                Expanded(
                  child: _buildLanguageCard(
                    lang: lang,
                    isSelected: selectedLanguage.code == lang.code,
                    brandOrange: brandOrange,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textSecondary: textSecondary,
                  ),
                ),
                if (lang != kSupportedLanguages.last) const SizedBox(width: 10),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageCard({
    required AppLanguage lang,
    required bool isSelected,
    required Color brandOrange,
    required Color cardBg,
    required Color borderColor,
    required Color textSecondary,
  }) {
    final isEnglish = lang.code == 'en';
    final displayName = lang.code == 'hi' ? 'हिंदी' : lang.nativeName;
    final badgeText = isEnglish ? 'EN' : 'अ';
    final subtitle = isEnglish ? 'Hello, Local!' : 'नमस्ते, स्थानीय खबरें!';

    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Select $displayName',
      child: GestureDetector(
        onTap: () {
          NagrikMotion.selectionClick();
          ref.read(onboardingStateProvider.notifier).selectLanguage(lang);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 9),
          decoration: BoxDecoration(
            color: isSelected
                ? brandOrange.withValues(alpha: 0.10)
                : cardBg.withValues(alpha: 0.7),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? brandOrange : borderColor,
              width: isSelected ? 1.5 : 0.85,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: brandOrange.withValues(alpha: 0.20),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            children: [
              // Script Badge (EN / अ)
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: isSelected
                      ? brandOrange
                      : Colors.white.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    badgeText,
                    style: TextStyle(
                      fontSize: isEnglish ? 11.5 : 13.5,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 7),
              // Name and Subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      displayName,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: isEnglish ? -0.1 : 0,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 1),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w400,
                        color: textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              // Check Indicator
              if (isSelected)
                Icon(
                  Icons.check_circle_rounded,
                  color: brandOrange,
                  size: 16,
                ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // 5. LOCATION SELECTION SECTION
  // ---------------------------------------------------------------------------
  Widget _buildLocationSection(
    BuildContext context,
    LocationItem? selectedLocation,
    Color brandOrange,
    Color cardBg,
    Color borderColor,
    Color textSecondary,
    Color textTertiary,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: borderColor,
          width: 0.85,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.location_on_rounded,
                    size: 16,
                    color: brandOrange,
                  ),
                  const SizedBox(width: 7),
                  const Text(
                    'Your Location',
                    style: TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.2,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              Flexible(
                child: Text(
                  'स्थान चुनें',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: textTertiary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Main Location Card
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0B0F17),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: borderColor,
                width: 0.85,
              ),
            ),
            child: Row(
              children: [
                // Pin Icon
                Icon(
                  Icons.location_on_rounded,
                  color: brandOrange,
                  size: 19,
                ),
                const SizedBox(width: 8),

                // Title and Subtitle (Tap to open full catalog)
                Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: _openLocationPicker,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          selectedLocation?.displayName ?? 'Select city / town',
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: -0.1,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          selectedLocation != null
                              ? '${selectedLocation.city}, ${selectedLocation.state}'
                              : 'Get news from your area',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w400,
                            color: textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(width: 6),

                // Action Buttons Row: Use GPS + All ▾
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // GPS Button
                    Semantics(
                      button: true,
                      label: 'Detect GPS location',
                      child: GestureDetector(
                        onTap: _isDetectingGps ? null : _detectGpsLocation,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: brandOrange.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: brandOrange.withValues(alpha: 0.40),
                              width: 0.85,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (_isDetectingGps)
                                SizedBox(
                                  width: 11,
                                  height: 11,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 1.6,
                                    valueColor:
                                        AlwaysStoppedAnimation(brandOrange),
                                  ),
                                )
                              else
                                Icon(
                                  Icons.my_location_rounded,
                                  size: 12,
                                  color: brandOrange,
                                ),
                              const SizedBox(width: 4),
                              Text(
                                _isDetectingGps ? 'Locating...' : 'Use GPS',
                                style: TextStyle(
                                  color: brandOrange,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 5),

                    // "All ▾" Button
                    Semantics(
                      button: true,
                      label: 'Browse all locations',
                      child: GestureDetector(
                        onTap: _openLocationPicker,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.14),
                              width: 0.85,
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'All',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(width: 2),
                              Icon(
                                Icons.keyboard_arrow_down_rounded,
                                size: 13,
                                color: Colors.white70,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 11),

          // Quick Pick Hubs Row
          Row(
            children: [
              Text(
                'Quick Pick:',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w500,
                  color: textTertiary,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      for (final item in _kQuickCities) ...[
                        _buildQuickCityChip(
                          item: item,
                          isSelected: selectedLocation?.city.toLowerCase() ==
                              item.city.toLowerCase(),
                          brandOrange: brandOrange,
                          cardBg: cardBg,
                          borderColor: borderColor,
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
    );
  }

  Widget _buildQuickCityChip({
    required LocationItem item,
    required bool isSelected,
    required Color brandOrange,
    required Color cardBg,
    required Color borderColor,
  }) {
    return GestureDetector(
      onTap: () {
        NagrikMotion.selectionClick();
        ref.read(onboardingStateProvider.notifier).selectLocation(item);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected
              ? brandOrange.withValues(alpha: 0.20)
              : cardBg.withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? brandOrange : borderColor,
            width: isSelected ? 1.2 : 0.85,
          ),
        ),
        child: Text(
          item.city,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? Colors.white : Colors.white70,
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // 6. PROMINENT "GET STARTED" CTA
  // ---------------------------------------------------------------------------
  Widget _buildGetStartedButton(Color brandOrange) {
    return Semantics(
      button: true,
      label: 'Get Started',
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _finishOnboarding,
        child: Container(
          width: double.infinity,
          height: 54,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFE5582B),
                Color(0xFFC84318),
              ],
            ),
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: brandOrange.withValues(alpha: 0.35),
                blurRadius: 18,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.arrow_forward_rounded,
                    color: Colors.white,
                    size: 19,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Get Started',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.2,
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  "It's free. No sign up needed.",
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.8),
                    fontSize: 10.5,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // 7. BOTTOM TRUST INDICATORS ROW
  // ---------------------------------------------------------------------------
  Widget _buildTrustIndicators(Color borderColor, Color textTertiary) {
    return Center(
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildTrustItem(
              icon: Icons.verified_user_outlined,
              label: 'Verified Local News',
              color: textTertiary,
            ),
            _buildTrustDivider(borderColor),
            _buildTrustItem(
              icon: Icons.speaker_notes_off_outlined,
              label: 'Ad-Transparent',
              color: textTertiary,
            ),
            _buildTrustDivider(borderColor),
            _buildTrustItem(
              icon: Icons.diversity_3_outlined,
              label: 'Zero Hate. Real Conversations.',
              color: textTertiary,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustItem({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 12,
          color: color,
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 9.5,
            fontWeight: FontWeight.w500,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildTrustDivider(Color borderColor) {
    return Container(
      width: 1,
      height: 10,
      margin: const EdgeInsets.symmetric(horizontal: 7),
      color: borderColor.withValues(alpha: 0.6),
    );
  }
}
