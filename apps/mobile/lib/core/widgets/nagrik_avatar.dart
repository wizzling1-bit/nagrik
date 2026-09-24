import 'package:flutter/material.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/theme/color_tokens.dart';

/// Avatar size tokens matching the design system.
enum NagrikAvatarSize {
  xs(24),
  sm(32),
  md(40),
  lg(56),
  xl(80);

  const NagrikAvatarSize(this.diameter);
  final double diameter;
}

/// Circular avatar with size tokens, initials fallback, optional image,
/// ring border, and status dot indicator.
class NagrikAvatar extends StatelessWidget {
  const NagrikAvatar({
    super.key,
    required this.name,
    this.imageUrl,
    this.size = NagrikAvatarSize.md,
    this.showBorder = false,
    this.isOnline = false,
  });

  final String name;
  final String? imageUrl;
  final NagrikAvatarSize size;
  final bool showBorder;
  final bool isOnline;

  String get _initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0].isNotEmpty ? parts[0][0].toUpperCase() : '?';
  }

  double get _fontSize => switch (size) {
        NagrikAvatarSize.xs => 10,
        NagrikAvatarSize.sm => 12,
        NagrikAvatarSize.md => 14,
        NagrikAvatarSize.lg => 20,
        NagrikAvatarSize.xl => 28,
      };

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;

    Widget avatarCore = CircleAvatar(
      radius: (size.diameter - (showBorder ? 3.0 : 0.0)) / 2,
      backgroundColor: isDark
          ? context.nagrikTheme.level2Elevated
          : context.colorScheme.primary.withValues(alpha: 0.12),
      foregroundColor: isDark
          ? NagrikDarkColors.textPrimary
          : context.colorScheme.primary,
      backgroundImage:
          imageUrl != null ? NetworkImage(imageUrl!) : null,
      child: imageUrl == null
          ? Text(
              _initials,
              style: TextStyle(
                fontSize: _fontSize,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.2,
              ),
            )
          : null,
    );

    if (showBorder) {
      avatarCore = Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: context.colorScheme.primary.withValues(alpha: 0.5),
            width: 1.5,
          ),
        ),
        child: avatarCore,
      );
    }

    return SizedBox(
      width: size.diameter,
      height: size.diameter,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(child: avatarCore),
          if (isOnline)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                width: (size.diameter * 0.26).clamp(8.0, 16.0),
                height: (size.diameter * 0.26).clamp(8.0, 16.0),
                decoration: BoxDecoration(
                  color: isDark
                      ? NagrikDarkColors.success
                      : NagrikLightColors.success,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isDark
                        ? context.nagrikTheme.level0Background
                        : context.nagrikTheme.level2Elevated,
                    width: 2,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
