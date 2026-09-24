import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/network/api_constants.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

/// Opens the Live API Diagnostics bottom sheet.
Future<void> showApiDiagnosticsSheet(BuildContext context) {
  final isDark = context.isDarkMode;
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: isDark
        ? context.nagrikTheme.level2Elevated
        : context.colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (context) => const ApiDiagnosticsSheet(),
  );
}

class ApiDiagnosticsSheet extends ConsumerStatefulWidget {
  const ApiDiagnosticsSheet({super.key});

  @override
  ConsumerState<ApiDiagnosticsSheet> createState() =>
      _ApiDiagnosticsSheetState();
}

class _ApiDiagnosticsSheetState extends ConsumerState<ApiDiagnosticsSheet> {
  int? _lastPingMs;
  bool _isPinging = false;
  String? _pingError;
  late final TextEditingController _customUrlController;

  @override
  void initState() {
    super.initState();
    _customUrlController = TextEditingController(text: ApiConstants.baseUrl);
  }

  @override
  void dispose() {
    _customUrlController.dispose();
    super.dispose();
  }

  Future<void> _applyServerUrl(String url) async {
    await ApiConstants.saveBaseUrl(url);
    if (mounted) {
      setState(() {
        _customUrlController.text = ApiConstants.baseUrl;
      });
    }
    ref.invalidate(apiCategoriesProvider);
    ref.invalidate(apiLocationsProvider);
    ref.invalidate(feedStateProvider);
    await _pingServer();
  }

  Future<void> _pingServer() async {
    setState(() {
      _isPinging = true;
      _pingError = null;
    });

    final stopwatch = Stopwatch()..start();
    try {
      final repo = ref.read(contentRepositoryProvider);
      await repo.getCategories();
      stopwatch.stop();
      if (mounted) {
        setState(() {
          _lastPingMs = stopwatch.elapsedMilliseconds;
          _isPinging = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _pingError = e.toString();
          _isPinging = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final categoriesAsync = ref.watch(apiCategoriesProvider);
    final locationsAsync = ref.watch(apiLocationsProvider);
    final deviceId = DeviceIdService.instance.currentDeviceId;

    final success =
        isDark ? NagrikDarkColors.success : NagrikLightColors.success;
    final textColor = context.colorScheme.onSurface;

    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      maxChildSize: 0.92,
      minChildSize: 0.5,
      expand: false,
      builder: (context, scrollController) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: NagrikSpacing.space4),
          child: ListView(
            controller: scrollController,
            children: [
              const SizedBox(height: 12),
              Center(
                child: Container(
                  width: 40,
                  height: 4.5,
                  decoration: BoxDecoration(
                    color: context.nagrikTheme.border,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title Header
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: success.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.cloud_done_rounded,
                      color: success,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Live API Integration',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: textColor,
                          ),
                        ),
                        Text(
                          ApiConstants.baseUrl,
                          style: TextStyle(
                            fontSize: 12.5,
                            color: context.nagrikTheme.textTertiary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3.5,
                    ),
                    decoration: BoxDecoration(
                      color: success.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6.5,
                          height: 6.5,
                          decoration: BoxDecoration(
                            color: success,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          'API',
                          style: TextStyle(
                            color: success,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Target Backend Switcher Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level3Interactive
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusCard,
                  border: Border.all(color: context.nagrikTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Backend Server Destination',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: textColor,
                          ),
                        ),
                        if (ApiConstants.baseUrl != ApiConstants.prodBaseUrl)
                          GestureDetector(
                            onTap: () async {
                              await ApiConstants.resetBaseUrl();
                              _customUrlController.text = ApiConstants.baseUrl;
                              ref.invalidate(apiCategoriesProvider);
                              ref.invalidate(apiLocationsProvider);
                              ref.invalidate(feedStateProvider);
                              await _pingServer();
                            },
                            child: Text(
                              'Reset Default',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: context.nagrikTheme.brandBright,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        ChoiceChip(
                          label: const Text('Production Supabase (Live)', style: TextStyle(fontSize: 11)),
                          selected: ApiConstants.baseUrl == ApiConstants.prodBaseUrl,
                          onSelected: (selected) {
                            if (selected) _applyServerUrl(ApiConstants.prodBaseUrl);
                          },
                        ),
                        ChoiceChip(
                          label: const Text('Local Dev (10.0.2.2:5000)', style: TextStyle(fontSize: 11)),
                          selected: ApiConstants.baseUrl == 'http://10.0.2.2:5000/api/v1',
                          onSelected: (selected) {
                            if (selected) _applyServerUrl('http://10.0.2.2:5000/api/v1');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _customUrlController,
                            style: TextStyle(fontSize: 12, fontFamily: 'monospace', color: textColor),
                            decoration: InputDecoration(
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              hintText: 'http://192.168.x.x:5000/api/v1',
                              hintStyle: TextStyle(fontSize: 11, color: context.nagrikTheme.textTertiary),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(color: context.nagrikTheme.border),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.tonal(
                          onPressed: () {
                            final text = _customUrlController.text.trim();
                            if (text.isNotEmpty) {
                              _applyServerUrl(text);
                            }
                          },
                          style: FilledButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            minimumSize: const Size(0, 36),
                          ),
                          child: const Text('Apply', style: TextStyle(fontSize: 12)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Ping Test Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level3Interactive
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusCard,
                  border: Border.all(color: context.nagrikTheme.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Server Roundtrip Latency',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        if (_isPinging)
                          const Text(
                            'Pinging server...',
                            style: TextStyle(fontSize: 12, color: Colors.amber),
                          )
                        else if (_lastPingMs != null)
                          Text(
                            '$_lastPingMs ms response time',
                            style: TextStyle(
                              fontSize: 12,
                              color: success,
                              fontWeight: FontWeight.w700,
                            ),
                          )
                        else
                          Text(
                            'Tap Test Ping to verify',
                            style: TextStyle(
                              fontSize: 12,
                              color: context.nagrikTheme.textTertiary,
                            ),
                          ),
                      ],
                    ),
                    FilledButton.tonal(
                      onPressed: _isPinging ? null : _pingServer,
                      child: _isPinging
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Test Ping'),
                    ),
                  ],
                ),
              ),

              if (_pingError != null) ...[
                const SizedBox(height: 8),
                Text(
                  _pingError!,
                  style: const TextStyle(color: Colors.red, fontSize: 11),
                ),
              ],

              const SizedBox(height: 16),

              // Anonymous Device UUID Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level3Interactive
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusCard,
                  border: Border.all(color: context.nagrikTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Anonymous Device UUID (x-device-id)',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            Clipboard.setData(ClipboardData(text: deviceId));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Device ID copied to clipboard'),
                                duration: Duration(seconds: 1),
                              ),
                            );
                          },
                          child: const Padding(
                            padding: EdgeInsets.all(4.0),
                            child: Icon(Icons.copy_rounded, size: 16),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    SelectableText(
                      deviceId,
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: context.nagrikTheme.brandBright,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Cloudflare R2 & PostGIS Status Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark
                      ? context.nagrikTheme.level3Interactive
                      : context.nagrikTheme.surfaceMuted,
                  borderRadius: NagrikRadii.borderRadiusCard,
                  border: Border.all(color: context.nagrikTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.bolt_rounded, size: 16, color: success),
                        const SizedBox(width: 6),
                        const Text(
                          'Cloudflare R2 Media & PostGIS Spatial',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'R2 CDN: ${ApiConstants.r2PublicBaseUrl}',
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: context.nagrikTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'PostGIS: 8-tier LGD Administrative Ranking Enabled',
                      style: TextStyle(
                        fontSize: 11,
                        color: context.nagrikTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Live Categories Section
              Text(
                'LIVE CATEGORIES FROM API (/content/categories)',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w800,
                  color: context.nagrikTheme.textTertiary,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              categoriesAsync.when(
                data: (categories) => Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: categories.map((cat) {
                    return Chip(
                      label: Text(cat.name),
                      avatar: Icon(Icons.check_circle, size: 14, color: success),
                      backgroundColor: isDark
                          ? context.nagrikTheme.level3Interactive
                          : context.nagrikTheme.surfaceMuted,
                    );
                  }).toList(),
                ),
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (e, _) => Text(
                  'Failed to fetch categories: $e',
                  style: const TextStyle(color: Colors.red, fontSize: 12),
                ),
              ),

              const SizedBox(height: 20),

              // Live Locations Section
              Text(
                'LIVE LOCATIONS FROM API (/content/locations)',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w800,
                  color: context.nagrikTheme.textTertiary,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              locationsAsync.when(
                data: (locations) => Column(
                  children: locations.map((loc) {
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(Icons.place_rounded, color: success, size: 20),
                      title: Text(
                        '${loc.area}, ${loc.city}',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      subtitle: Text(
                        '${loc.state}, ${loc.country}',
                        style: TextStyle(fontSize: 12, color: context.nagrikTheme.textTertiary),
                      ),
                    );
                  }).toList(),
                ),
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (e, _) => Text(
                  'Failed to fetch locations: $e',
                  style: const TextStyle(color: Colors.red, fontSize: 12),
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        );
      },
    );
  }
}
