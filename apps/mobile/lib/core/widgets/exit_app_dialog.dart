import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/spacing.dart';

/// Shows an exit confirmation dialog allowing the user to cleanly quit the app.
/// Enhanced with specular lighting, red aura accent, and spring press feedback.
Future<bool?> showExitAppDialog(BuildContext context) {
  final isDark = context.isDarkMode;

  return showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      backgroundColor: isDark
          ? NagrikDarkColors.level2Elevated
          : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
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
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444).withValues(alpha: isDark ? 0.2 : 0.12),
              shape: BoxShape.circle,
              border: Border.all(
                color: const Color(0xFFEF4444).withValues(alpha: 0.35),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFEF4444).withValues(alpha: isDark ? 0.25 : 0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: const Icon(
              Icons.power_settings_new_rounded,
              color: Color(0xFFEF4444),
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'Exit Nagrik?',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              letterSpacing: -0.2,
            ),
          ),
        ],
      ),
      content: Text(
        'Are you sure you want to close and exit the application?',
        style: TextStyle(
          fontSize: 14,
          height: 1.5,
          color: context.nagrikTheme.textSecondary,
        ),
      ),
      actionsPadding: const EdgeInsets.symmetric(
        horizontal: NagrikSpacing.space4,
        vertical: NagrikSpacing.space3,
      ),
      actions: [
        NagrikSpringPressable(
          onTap: () {
            NagrikMotion.lightImpact();
            Navigator.of(context).pop(false);
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Text(
              'Cancel',
              style: TextStyle(
                color: context.nagrikTheme.textSecondary,
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
          ),
        ),
        NagrikSpringPressable(
          onTap: () {
            NagrikMotion.mediumImpact();
            Navigator.of(context).pop(true);
            SystemNavigator.pop();
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFDC2626),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFDC2626).withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: const Text(
              'Exit App',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ],
    ),
  );
}
