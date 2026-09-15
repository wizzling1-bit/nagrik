import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/widgets/nagrik_button.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';

/// Opens the report content bottom sheet for a given post/video.
Future<void> showReportContentSheet(
  BuildContext context, {
  required String contentId,
  String? contentTitle,
}) {
  final isDark = context.isDarkMode;
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: isDark
        ? context.nagrikTheme.level2Elevated
        : context.colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
        top: Radius.circular(NagrikRadii.sheet),
      ),
    ),
    builder: (context) =>
        ReportContentSheet(contentId: contentId, contentTitle: contentTitle),
  );
}

class ReportContentSheet extends ConsumerStatefulWidget {
  const ReportContentSheet({
    super.key,
    required this.contentId,
    this.contentTitle,
  });

  final String contentId;
  final String? contentTitle;

  @override
  ConsumerState<ReportContentSheet> createState() => _ReportContentSheetState();
}

class _ReportContentSheetState extends ConsumerState<ReportContentSheet> {
  static const List<String> _reportReasons = [
    'Misleading or inaccurate news',
    'Hate speech or discriminatory language',
    'Graphic violence or dangerous content',
    'Spam, impersonation, or copyright issue',
    'Harassment or privacy violation',
    'Other editorial concern',
  ];

  String _selectedReason = _reportReasons.first;
  final _customReasonController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _customReasonController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    setState(() => _isSubmitting = true);
    NagrikMotion.mediumImpact();

    final finalReason =
        _selectedReason == 'Other editorial concern' &&
            _customReasonController.text.trim().isNotEmpty
        ? _customReasonController.text.trim()
        : _selectedReason;

    try {
      final repository = ref.read(contentRepositoryProvider);
      final response = await repository.reportContent(
        id: widget.contentId,
        reason: finalReason,
      );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              response.message.isNotEmpty
                  ? response.message
                  : 'Report submitted for editorial review.',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: const Color(0xFF1E293B),
            shape: RoundedRectangleBorder(
              borderRadius: NagrikRadii.borderRadiusSm,
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to submit report. Please try again.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final primaryColor = isDark
        ? context.nagrikTheme.brandBright
        : context.colorScheme.primary;

    return Padding(
      padding: EdgeInsets.only(
        bottom:
            math.max(0.0, MediaQuery.of(context).viewInsets.bottom) +
            NagrikSpacing.space4,
        left: NagrikSpacing.space4,
        right: NagrikSpacing.space4,
        top: NagrikSpacing.space3,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Drag Handle
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: NagrikSpacing.space3),
                decoration: BoxDecoration(
                  color: context.nagrikTheme.border.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.flag_outlined,
                      color: isDark
                          ? const Color(0xFFF87171)
                          : const Color(0xFFDC2626),
                      size: 22,
                    ),
                    const SizedBox(width: NagrikSpacing.space2),
                    Text(
                      'Report Content',
                      style: context.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 17,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),

            if (widget.contentTitle != null &&
                widget.contentTitle!.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                widget.contentTitle!,
                style: context.textTheme.bodySmall?.copyWith(
                  color: context.nagrikTheme.textSecondary,
                  fontStyle: FontStyle.italic,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],

            const SizedBox(height: NagrikSpacing.space2),
            Text(
              'Help us maintain journalistic integrity. Why are you reporting this?',
              style: context.textTheme.bodyMedium?.copyWith(
                color: context.nagrikTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: NagrikSpacing.space3),

            // Predefined Reasons
            ..._reportReasons.asMap().entries.map((entry) {
              final reason = entry.value;
              final isSelected = _selectedReason == reason;
              return Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Semantics(
                  inMutuallyExclusiveGroup: true,
                  selected: isSelected,
                  label: 'Report reason: $reason',
                  child: NagrikSpringPressable(
                    onTap: () {
                      NagrikMotion.lightImpact();
                      setState(() => _selectedReason = reason);
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      padding: const EdgeInsets.symmetric(
                        vertical: 10,
                        horizontal: 12,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? primaryColor.withValues(
                                alpha: isDark ? 0.14 : 0.08,
                              )
                            : Colors.transparent,
                        borderRadius: NagrikRadii.borderRadiusSm,
                        border: Border.all(
                          color: isSelected
                              ? primaryColor.withValues(alpha: 0.4)
                              : Colors.transparent,
                        ),
                      ),
                      child: Row(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            width: 22,
                            height: 22,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSelected
                                    ? primaryColor
                                    : context.nagrikTheme.border,
                                width: 2,
                              ),
                            ),
                            child: Center(
                              child: AnimatedScale(
                                scale: isSelected ? 1.0 : 0.0,
                                duration: const Duration(milliseconds: 180),
                                curve: Curves.easeOutBack,
                                child: Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: primaryColor,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              reason,
                              style: context.textTheme.bodyMedium?.copyWith(
                                fontWeight: isSelected
                                    ? FontWeight.w700
                                    : FontWeight.w500,
                                color: isSelected
                                    ? context.colorScheme.onSurface
                                    : context.nagrikTheme.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),

            // Additional comment if "Other" selected (Animated expansion)
            AnimatedSize(
              duration: const Duration(milliseconds: 240),
              curve: Curves.easeOutCubic,
              child: _selectedReason == 'Other editorial concern'
                  ? Padding(
                      padding: const EdgeInsets.only(top: NagrikSpacing.space2),
                      child: TextField(
                        controller: _customReasonController,
                        autofocus: true,
                        maxLines: 2,
                        decoration: InputDecoration(
                          labelText: 'Please specify reason',
                          hintText: 'Describe the concern...',
                          border: OutlineInputBorder(
                            borderRadius: NagrikRadii.borderRadiusSm,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: NagrikRadii.borderRadiusSm,
                            borderSide: BorderSide(
                              color: primaryColor,
                              width: 1.5,
                            ),
                          ),
                          contentPadding: const EdgeInsets.all(
                            NagrikSpacing.space3,
                          ),
                        ),
                      ),
                    )
                  : const SizedBox.shrink(),
            ),

            const SizedBox(height: NagrikSpacing.space4),

            // Submit Button
            NagrikButton(
              label: _isSubmitting ? 'Submitting...' : 'Submit Report',
              onPressed: _isSubmitting ? null : _submitReport,
              isLoading: _isSubmitting,
              fullWidth: true,
            ),
          ],
        ),
      ),
    );
  }
}
