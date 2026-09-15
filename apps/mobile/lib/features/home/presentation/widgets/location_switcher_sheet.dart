import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/network/connectivity_provider.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/error_state.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/onboarding/data/location_service.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

/// Helper to show the location switcher modal bottom sheet.
Future<LocationItem?> showLocationSwitcher(BuildContext context) {
  final isDark = context.isDarkMode;
  return showModalBottomSheet<LocationItem>(
    context: context,
    isScrollControlled: true,
    backgroundColor: isDark
        ? context.nagrikTheme.level2Elevated
        : context.colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (context) => const LocationSwitcherSheet(),
  );
}

class LocationSwitcherSheet extends ConsumerStatefulWidget {
  const LocationSwitcherSheet({super.key});

  @override
  ConsumerState<LocationSwitcherSheet> createState() =>
      _LocationSwitcherSheetState();
}

class _LocationSwitcherSheetState extends ConsumerState<LocationSwitcherSheet> {
  final _searchController = TextEditingController();
  String _searchQuery = '';
  String? _selectedCityFilter; // null means 'All'
  bool _isDetecting = false;
  String? _detectionMessage;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _handleUseCurrentLocation(
    List<LocationModel> supportedLocations,
  ) async {
    if (_isDetecting) return;
    setState(() {
      _isDetecting = true;
      _detectionMessage = null;
    });

    final locationService = ref.read(locationServiceProvider);
    final result = await locationService.detectAndMatchLocation(
      supportedLocations: supportedLocations,
    );

    if (!mounted) return;
    setState(() => _isDetecting = false);

    switch (result) {
      case LocationDetectionSuccess(:final location):
        _showConfirmationDialog(
          title: ref.watch(appStringsProvider).detectedLocationTitle,
          location: location.toLocationItem(isCurrentLocation: true),
          isDetected: true,
        );
      case LocationPermissionDenied(:final isPermanent):
        _showPermissionInfoDialog(isPermanent: isPermanent);
      case LocationServiceDisabled():
        _showNoticeDialog(
          title: ref.watch(appStringsProvider).gpsDisabledTitle,
          message: ref.watch(appStringsProvider).gpsDisabledMessage,
        );
      case LocationDetectionFailure(:final message):
        _showNoticeDialog(
          title: ref.watch(appStringsProvider).locationUnavailableTitle,
          message:
              '$message\n\n${ref.watch(appStringsProvider).selectManuallyHint}',
        );
    }
  }

  void _showConfirmationDialog({
    required String title,
    required LocationItem location,
    required bool isDetected,
  }) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        final isDark = dialogCtx.isDarkMode;
        final brandColor = isDark
            ? dialogCtx.nagrikTheme.brandBright
            : dialogCtx.colorScheme.primary;
        final surfaceColor = isDark
            ? NagrikDarkColors.level2Elevated
            : Colors.white;

        return AlertDialog(
          backgroundColor: surfaceColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: BorderSide(
              color: isDark
                  ? Colors.white.withValues(alpha: 0.12)
                  : Colors.black.withValues(alpha: 0.08),
              width: 1.2,
            ),
          ),
          title: Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: brandColor.withValues(alpha: isDark ? 0.20 : 0.12),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: brandColor.withValues(alpha: 0.35),
                    width: 1.2,
                  ),
                ),
                child: Icon(
                  Icons.location_on_rounded,
                  color: brandColor,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark
                      ? NagrikDarkColors.level1Surface
                      : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.08)
                        : Colors.black.withValues(alpha: 0.05),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            location.displayName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            location.fullAddress,
                            style: TextStyle(
                              fontSize: 13,
                              color: dialogCtx.nagrikTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.check_circle_rounded,
                      color: brandColor,
                      size: 22,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.security_rounded,
                    size: 14,
                    color: dialogCtx.nagrikTheme.textTertiary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      ref.watch(appStringsProvider).locationPrivacyNote,
                      style: TextStyle(
                        fontSize: 11.5,
                        color: dialogCtx.nagrikTheme.textTertiary,
                        height: 1.35,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          actions: [
            if (isDetected)
              TextButton(
                onPressed: () => Navigator.pop(dialogCtx),
                child: Text(
                  ref.watch(appStringsProvider).chooseAnother,
                  style: TextStyle(
                    color: dialogCtx.nagrikTheme.textSecondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: brandColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                Navigator.pop(dialogCtx);
                ref
                    .read(onboardingStateProvider.notifier)
                    .selectLocation(location);
                Navigator.pop(context, location);
                NagrikMotion.mediumImpact();
              },
              child: Text(
                isDetected
                    ? ref.watch(appStringsProvider).useThisLocation
                    : ref.watch(appStringsProvider).continueBtn,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        );
      },
    );
  }

  void _showPermissionInfoDialog({required bool isPermanent}) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.security_outlined, size: 22),
            const SizedBox(width: 10),
            Text(
              ref.watch(appStringsProvider).permissionTitle,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
            ),
          ],
        ),
        content: Text(
          isPermanent
              ? ref.watch(appStringsProvider).permissionDeniedBody
              : ref.watch(appStringsProvider).permissionBody,
          style: const TextStyle(fontSize: 14, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text(ref.watch(appStringsProvider).selectManually),
          ),
        ],
      ),
    );
  }

  void _showNoticeDialog({required String title, required String message}) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          title,
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        content: Text(message, style: const TextStyle(fontSize: 14, height: 1.4)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedLocation = ref.watch(selectedLocationProvider);
    final apiLocationsAsync = ref.watch(apiLocationsProvider);
    final strings = ref.watch(appStringsProvider);
    final isDark = context.isDarkMode;
    final primaryColor = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;

    final supportedLocations =
        apiLocationsAsync.valueOrNull ?? const <LocationModel>[];

    // Extract unique city names for filter pills
    final availableCities = <String>{};
    for (final loc in supportedLocations) {
      if (loc.city.isNotEmpty) {
        availableCities.add(loc.city);
      }
    }
    final cityList = availableCities.toList()..sort();

    // Local search & city filter over supported locations
    final q = _searchQuery.trim().toLowerCase();
    final filtered = supportedLocations.where((loc) {
      final matchesCity = _selectedCityFilter == null ||
          loc.city.toLowerCase() == _selectedCityFilter!.toLowerCase();
      if (!matchesCity) return false;

      if (q.isEmpty) return true;
      return loc.area.toLowerCase().contains(q) ||
          loc.city.toLowerCase().contains(q) ||
          loc.state.toLowerCase().contains(q) ||
          loc.country.toLowerCase().contains(q);
    }).toList();

    final bottomPadding = MediaQuery.paddingOf(context).bottom;

    return DraggableScrollableSheet(
      initialChildSize: 0.82,
      minChildSize: 0.50,
      maxChildSize: 0.94,
      expand: false,
      builder: (context, scrollController) {
        return Material(
          color: isDark
              ? context.nagrikTheme.level2Elevated
              : context.colorScheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            side: BorderSide(
              color: isDark
                  ? Colors.white.withValues(alpha: 0.12)
                  : Colors.black.withValues(alpha: 0.06),
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 10),

              // 1. Drag Handle
              Center(
                child: Container(
                  width: 44,
                  height: 4.5,
                  decoration: BoxDecoration(
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.22)
                        : Colors.black.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(2.5),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // 2. Header with Emblem Badge & Close Button
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: NagrikSpacing.space4,
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            NagrikBrandColors.sapphireGlow,
                            NagrikBrandColors.royalNavy,
                            NagrikBrandColors.midnight,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: NagrikBrandColors.sapphireGlow.withValues(
                              alpha: isDark ? 0.35 : 0.20,
                            ),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.22),
                          width: 1,
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.location_on_rounded,
                          color: Colors.white,
                          size: 22,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Select your location',
                            style: context.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Hyperlocal news & civic updates for your area',
                            style: context.textTheme.bodySmall?.copyWith(
                              color: context.nagrikTheme.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: isDark
                              ? Colors.white.withValues(alpha: 0.08)
                              : Colors.black.withValues(alpha: 0.05),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.close_rounded, size: 18),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 40,
                        minHeight: 40,
                      ),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              // 3. Current Selected Location Banner (if active)
              if (selectedLocation != null)
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: NagrikSpacing.space4,
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: isDark
                          ? NagrikDarkColors.level1Surface
                          : const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isDark
                            ? const Color(0xFF10B981).withValues(alpha: 0.35)
                            : const Color(0xFF86EFAC),
                        width: 1.2,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Color(0xFF10B981),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Color(0xFF10B981),
                                blurRadius: 6,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'CURRENT ACTIVE LOCATION',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.8,
                                  color: isDark
                                      ? const Color(0xFF34D399)
                                      : const Color(0xFF059669),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${selectedLocation.displayName} • ${selectedLocation.state}',
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w700,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF0F172A),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Active',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF10B981),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // 4. Standout GPS "Use current location" Beacon Card
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: NagrikSpacing.space4,
                ),
                child: NagrikSpringPressable(
                  onTap: () => _handleUseCurrentLocation(supportedLocations),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: isDark
                            ? [
                                const Color(0xFF102746),
                                const Color(0xFF0B192E),
                              ]
                            : [
                                const Color(0xFFEFF6FF),
                                const Color(0xFFDBEAFE),
                              ],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark
                            ? NagrikBrandColors.sapphireGlow.withValues(alpha: 0.5)
                            : const Color(0xFF93C5FD),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: isDark
                              ? NagrikBrandColors.sapphireGlow.withValues(alpha: 0.25)
                              : const Color(0xFF3B82F6).withValues(alpha: 0.12),
                          blurRadius: 14,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        // Pulsing GPS radar emblem
                        if (_isDetecting)
                          Container(
                            width: 40,
                            height: 40,
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: primaryColor.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: CircularProgressIndicator(
                              strokeWidth: 2.2,
                              color: primaryColor,
                            ),
                          )
                        else
                          NagrikPulseBadge(
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: primaryColor.withValues(
                                  alpha: isDark ? 0.25 : 0.15,
                                ),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: primaryColor.withValues(alpha: 0.4),
                                  width: 1,
                                ),
                              ),
                              child: Center(
                                child: Icon(
                                  Icons.my_location_rounded,
                                  color: primaryColor,
                                  size: 20,
                                ),
                              ),
                            ),
                          ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isDetecting
                                    ? strings.detectingLocation
                                    : strings.useCurrentLocation,
                                style: TextStyle(
                                  color: isDark
                                      ? Colors.white
                                      : NagrikLightColors.textPrimary,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: -0.2,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                _isDetecting
                                    ? 'Matching nearest neighborhood...'
                                    : 'Auto-detect via GPS & nearest hub',
                                style: TextStyle(
                                  color: isDark
                                      ? context.nagrikTheme.brandBright
                                      : const Color(0xFF1D4ED8),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 9,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: primaryColor.withValues(alpha: isDark ? 0.2 : 0.12),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: primaryColor.withValues(alpha: 0.3),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'GPS',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: primaryColor,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                Icons.arrow_forward_ios_rounded,
                                size: 10,
                                color: primaryColor,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              if (_detectionMessage != null) ...[
                const SizedBox(height: 6),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    _detectionMessage!,
                    style: TextStyle(
                      color: context.nagrikTheme.textTertiary,
                      fontSize: 12,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],

              const SizedBox(height: 14),

              // 5. Modern Search Input Field
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: NagrikSpacing.space4,
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: isDark
                        ? context.nagrikTheme.level4Muted
                        : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isDark
                          ? Colors.white.withValues(alpha: 0.10)
                          : const Color(0xFFE2E8F0),
                      width: 1.2,
                    ),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                    decoration: InputDecoration(
                      hintText: strings.searchCityOrNeighborhood,
                      hintStyle: TextStyle(
                        fontSize: 14,
                        color: context.nagrikTheme.textTertiary,
                      ),
                      prefixIcon: Icon(
                        Icons.search_rounded,
                        color: primaryColor,
                        size: 22,
                      ),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.cancel_rounded, size: 20),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                    ),
                  ),
                ),
              ),

              // 6. Quick City / District Filter Chips
              if (cityList.length > 1) ...[
                const SizedBox(height: 10),
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                      horizontal: NagrikSpacing.space4,
                    ),
                    children: [
                      _buildFilterChip(
                        label: 'All Locations',
                        isSelected: _selectedCityFilter == null,
                        isDark: isDark,
                        primaryColor: primaryColor,
                        onTap: () {
                          setState(() => _selectedCityFilter = null);
                        },
                      ),
                      for (final city in cityList) ...[
                        const SizedBox(width: 8),
                        _buildFilterChip(
                          label: city,
                          isSelected: _selectedCityFilter?.toLowerCase() ==
                              city.toLowerCase(),
                          isDark: isDark,
                          primaryColor: primaryColor,
                          onTap: () {
                            setState(() {
                              if (_selectedCityFilter?.toLowerCase() ==
                                  city.toLowerCase()) {
                                _selectedCityFilter = null;
                              } else {
                                _selectedCityFilter = city;
                              }
                            });
                          },
                        ),
                      ],
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 10),

              // 7. Supported Locations List
              Expanded(
                child: apiLocationsAsync.when(
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(strokeWidth: 2.5),
                    ),
                  ),
                  error: (err, _) {
                    final isOnline = ref.watch(connectivityStatusProvider);
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(NagrikSpacing.space4),
                        child: NagrikErrorState(
                          message: isOnline
                              ? strings.locationsLoadError
                              : strings.offlineTitle,
                          description: isOnline ? null : strings.offlineDesc,
                          onRetry: () => ref.invalidate(apiLocationsProvider),
                        ),
                      ),
                    );
                  },
                  data: (_) {
                    if (filtered.isEmpty) {
                      return Center(
                        child: Padding(
                          padding: const EdgeInsets.all(NagrikSpacing.space4),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: primaryColor.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.location_off_rounded,
                                  color: primaryColor,
                                  size: 28,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                strings.noMatchingLocationsTitle,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                strings.noMatchingLocationsDesc,
                                style: TextStyle(
                                  color: context.nagrikTheme.textSecondary,
                                  fontSize: 13,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              if (_searchQuery.isNotEmpty ||
                                  _selectedCityFilter != null) ...[
                                const SizedBox(height: 12),
                                TextButton.icon(
                                  onPressed: () {
                                    setState(() {
                                      _searchController.clear();
                                      _searchQuery = '';
                                      _selectedCityFilter = null;
                                    });
                                  },
                                  icon: const Icon(Icons.refresh_rounded, size: 16),
                                  label: const Text('Reset filters'),
                                ),
                              ],
                            ],
                          ),
                        ),
                      );
                    }

                    return ListView.separated(
                      controller: scrollController,
                      padding: EdgeInsets.fromLTRB(
                        NagrikSpacing.space4,
                        4,
                        NagrikSpacing.space4,
                        bottomPadding + 16,
                      ),
                      itemCount: filtered.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final locModel = filtered[index];
                        final locItem = locModel.toLocationItem();
                        final isSelected =
                            selectedLocation?.city.toLowerCase() ==
                                locModel.city.toLowerCase() &&
                            selectedLocation?.locality.toLowerCase() ==
                                locModel.area.toLowerCase();

                        return NagrikSpringPressable(
                          onTap: () {
                            _showConfirmationDialog(
                              title: 'Selected Location',
                              location: locItem,
                              isDetected: false,
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? primaryColor.withValues(
                                      alpha: isDark ? 0.16 : 0.08,
                                    )
                                  : (isDark
                                      ? NagrikDarkColors.level1Surface
                                      : const Color(0xFFFFFFFF)),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isSelected
                                    ? primaryColor.withValues(
                                        alpha: isDark ? 0.55 : 0.45,
                                      )
                                    : (isDark
                                        ? Colors.white.withValues(alpha: 0.06)
                                        : Colors.black.withValues(alpha: 0.06)),
                                width: isSelected ? 1.5 : 1.0,
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: primaryColor.withValues(
                                          alpha: isDark ? 0.20 : 0.10,
                                        ),
                                        blurRadius: 10,
                                        offset: const Offset(0, 3),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Row(
                              children: [
                                // Location Pin Icon Badge
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: primaryColor.withValues(
                                      alpha: isSelected ? 0.22 : 0.10,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: primaryColor.withValues(
                                        alpha: isSelected ? 0.40 : 0.18,
                                      ),
                                    ),
                                  ),
                                  child: Center(
                                    child: Icon(
                                      isSelected
                                          ? Icons.location_on_rounded
                                          : Icons.location_on_outlined,
                                      color: primaryColor,
                                      size: 20,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        locItem.displayName,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: isSelected
                                              ? FontWeight.w800
                                              : FontWeight.w600,
                                          color: isSelected
                                              ? (isDark
                                                  ? Colors.white
                                                  : primaryColor)
                                              : (isDark
                                                  ? Colors.white
                                                  : const Color(0xFF0F172A)),
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${locModel.area} • ${locModel.city}, ${locModel.state}',
                                        style: TextStyle(
                                          fontSize: 12.5,
                                          color: context.nagrikTheme.textSecondary,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: primaryColor.withValues(alpha: 0.16),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.check_circle_rounded,
                                          color: primaryColor,
                                          size: 14,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Selected',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: primaryColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                else
                                  Icon(
                                    Icons.arrow_forward_ios_rounded,
                                    size: 13,
                                    color: isDark
                                        ? Colors.white.withValues(alpha: 0.25)
                                        : Colors.black.withValues(alpha: 0.25),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),

              // 8. Bottom Privacy Trust Note
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.lock_outline_rounded,
                      size: 12,
                      color: context.nagrikTheme.textTertiary,
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        strings.locationPrivacyNote,
                        style: TextStyle(
                          fontSize: 11,
                          color: context.nagrikTheme.textTertiary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilterChip({
    required String label,
    required bool isSelected,
    required bool isDark,
    required Color primaryColor,
    required VoidCallback onTap,
  }) {
    return NagrikSpringPressable(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? primaryColor
              : (isDark
                  ? NagrikDarkColors.level1Surface
                  : const Color(0xFFF1F5F9)),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected
                ? primaryColor
                : (isDark
                    ? Colors.white.withValues(alpha: 0.10)
                    : const Color(0xFFCBD5E1)),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: primaryColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              color: isSelected
                  ? Colors.white
                  : (isDark ? Colors.white : const Color(0xFF334155)),
            ),
          ),
        ),
      ),
    );
  }
}
