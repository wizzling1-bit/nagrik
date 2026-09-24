import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:video_player/video_player.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';

/// Full-screen journalistic video overlay: location, creator, headline,
/// expandable description, timeline scrubber, and right action column.
class VerticalVideoOverlay extends ConsumerStatefulWidget {
  const VerticalVideoOverlay({
    super.key,
    required this.post,
    this.controller,
    required this.isMuted,
    this.isPlaying,
    this.onTogglePlayPause,
    required this.onToggleMute,
    required this.onLike,
    required this.onComment,
    required this.onShare,
    required this.onSave,
    required this.onReport,
    this.onSeek,
  });

  final Post post;
  final VideoPlayerController? controller;
  final bool isMuted;
  final bool? isPlaying;
  final VoidCallback? onTogglePlayPause;
  final VoidCallback onToggleMute;
  final VoidCallback onLike;
  final VoidCallback onComment;
  final VoidCallback onShare;
  final VoidCallback onSave;
  final VoidCallback onReport;
  final void Function(Duration position)? onSeek;

  @override
  ConsumerState<VerticalVideoOverlay> createState() =>
      _VerticalVideoOverlayState();
}

class _VerticalVideoOverlayState extends ConsumerState<VerticalVideoOverlay> {
  bool _isDescriptionExpanded = false;
  bool _isFollowing = false;

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    if (duration.inHours > 0) {
      final hours = duration.inHours.toString().padLeft(2, '0');
      return '$hours:$minutes:$seconds';
    }
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final post = widget.post;
    final controller = widget.controller;
    final isInitialized = controller?.value.isInitialized ?? false;
    final position = controller?.value.position ?? Duration.zero;
    final duration = controller?.value.duration ?? Duration.zero;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Top and bottom gradients for text legibility
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: const [0.0, 0.22, 0.55, 1.0],
                colors: [
                  Colors.black.withValues(alpha: 0.65),
                  Colors.transparent,
                  Colors.black.withValues(alpha: 0.35),
                  Colors.black.withValues(alpha: 0.90),
                ],
              ),
            ),
          ),
        ),

        // Top Bar
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: NagrikSpacing.space4,
                vertical: NagrikSpacing.space2,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // App / Videos Section Branding Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.40),
                      borderRadius: NagrikRadii.borderRadiusPill,
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.15),
                        width: 0.8,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: const BoxDecoration(
                            color: NagrikBrandColors.orangePrimary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'VIDEOS',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Mute / Unmute Button
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.black.withValues(alpha: 0.45),
                      foregroundColor: Colors.white,
                    ),
                    icon: Icon(
                      widget.isMuted
                          ? Icons.volume_off_rounded
                          : Icons.volume_up_rounded,
                      size: 20,
                    ),
                    onPressed: () {
                      NagrikMotion.selectionClick();
                      widget.onToggleMute();
                    },
                  ),
                ],
              ),
            ),
          ),
        ),

        // Right Action Column
        Positioned(
          right: NagrikSpacing.space3,
          bottom: 48,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Play / Pause Action
              if (widget.onTogglePlayPause != null) ...[
                _ActionButton(
                  key: const Key('video_play_pause_action_btn'),
                  icon: (widget.isPlaying ?? (controller?.value.isPlaying ?? false))
                      ? Icons.pause_circle_filled_rounded
                      : Icons.play_circle_fill_rounded,
                  iconColor: (widget.isPlaying ?? (controller?.value.isPlaying ?? false))
                      ? Colors.white
                      : NagrikBrandColors.orangePrimary,
                  label: (widget.isPlaying ?? (controller?.value.isPlaying ?? false))
                      ? 'Pause'
                      : 'Play',
                  onTap: () {
                    NagrikMotion.lightImpact();
                    widget.onTogglePlayPause?.call();
                  },
                ),
                const SizedBox(height: 16),
              ],

              // Like Action
              _ActionButton(
                icon: post.isLiked
                    ? Icons.favorite_rounded
                    : Icons.favorite_border_rounded,
                iconColor: post.isLiked
                    ? const Color(0xFFEF4444)
                    : Colors.white,
                label: '${post.likesCount}',
                onTap: () {
                  NagrikMotion.lightImpact();
                  widget.onLike();
                },
              ),
              const SizedBox(height: 16),

              // Comment Action
              _ActionButton(
                icon: Icons.chat_bubble_outline_rounded,
                iconColor: Colors.white,
                label: '${post.commentsCount}',
                onTap: () {
                  NagrikMotion.lightImpact();
                  widget.onComment();
                },
              ),
              const SizedBox(height: 16),

              // Share Action
              _ActionButton(
                icon: Icons.share_rounded,
                iconColor: Colors.white,
                label: post.sharesCount > 0 ? '${post.sharesCount}' : 'Share',
                onTap: () {
                  NagrikMotion.lightImpact();
                  widget.onShare();
                },
              ),
              const SizedBox(height: 16),

              // Bookmark / Save Action
              _ActionButton(
                icon: post.isBookmarked
                    ? Icons.bookmark_rounded
                    : Icons.bookmark_border_rounded,
                iconColor: post.isBookmarked
                    ? NagrikBrandColors.orangePrimary
                    : Colors.white,
                label: 'Save',
                onTap: () {
                  NagrikMotion.lightImpact();
                  widget.onSave();
                },
              ),
              const SizedBox(height: 16),

              // More / Report
              IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black.withValues(alpha: 0.35),
                  foregroundColor: Colors.white70,
                ),
                icon: const Icon(Icons.more_vert_rounded, size: 20),
                onPressed: widget.onReport,
              ),
            ],
          ),
        ),

        // Bottom Left News Metadata
        Positioned(
          left: NagrikSpacing.space4,
          right: 80,
          bottom: 30,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Location Pill & Category Tag
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.16),
                      borderRadius: NagrikRadii.borderRadiusPill,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.location_on_rounded,
                          size: 12,
                          color: NagrikBrandColors.orangePrimary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          post.locality.isNotEmpty ? post.locality : post.city,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  if (post.categorySlug != null &&
                      post.categorySlug!.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: NagrikBrandColors.orangePrimary
                            .withValues(alpha: 0.25),
                        borderRadius: NagrikRadii.borderRadiusPill,
                        border: Border.all(
                          color: NagrikBrandColors.orangePrimary
                              .withValues(alpha: 0.6),
                          width: 0.7,
                        ),
                      ),
                      child: Text(
                        post.categorySlug!.toUpperCase(),
                        style: const TextStyle(
                          color: NagrikBrandColors.orangePrimary,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 8),

              // Author Row
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: 13,
                    backgroundColor: NagrikBrandColors.orangePrimary,
                    child: Text(
                      post.author.name.isNotEmpty
                          ? post.author.name[0].toUpperCase()
                          : 'N',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 7),
                  Flexible(
                    child: Text(
                      post.author.name,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  if (post.author.isVerified) ...[
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.verified_rounded,
                      size: 14,
                      color: Color(0xFF38BDF8),
                    ),
                  ],
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () {
                      NagrikMotion.selectionClick();
                      setState(() => _isFollowing = !_isFollowing);
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: _isFollowing
                              ? Colors.white54
                              : NagrikBrandColors.orangePrimary,
                          width: 1,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        color: _isFollowing
                            ? Colors.transparent
                            : NagrikBrandColors.orangePrimary
                                .withValues(alpha: 0.2),
                      ),
                      child: Text(
                        _isFollowing ? 'Following' : 'Follow',
                        style: TextStyle(
                          color: _isFollowing
                              ? Colors.white70
                              : NagrikBrandColors.orangePrimary,
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Headline (Multi-line bold)
              Text(
                post.title,
                maxLines: _isDescriptionExpanded ? 5 : 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  height: 1.3,
                  letterSpacing: -0.2,
                ),
              ),

              // Expandable Description
              if (post.body.isNotEmpty) ...[
                const SizedBox(height: 4),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isDescriptionExpanded = !_isDescriptionExpanded;
                    });
                  },
                  child: Text(
                    post.body,
                    maxLines: _isDescriptionExpanded ? 8 : 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.82),
                      fontSize: 12.5,
                      height: 1.35,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 4),

              // Time & Duration Row
              Row(
                children: [
                  Text(
                    post.timeAgo,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.60),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (duration.inSeconds > 0) ...[
                    Text(
                      ' • ${_formatDuration(duration)}',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.60),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),

        // Bottom Timeline Scrubber Progress Indicator
        if (isInitialized && duration.inMilliseconds > 0)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SliderTheme(
              data: SliderThemeData(
                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 4),
                trackShape: const RectangularSliderTrackShape(),
                trackHeight: 2.5,
                thumbColor: NagrikBrandColors.orangePrimary,
                activeTrackColor: NagrikBrandColors.orangePrimary,
                inactiveTrackColor: Colors.white.withValues(alpha: 0.3),
                overlayShape: SliderComponentShape.noOverlay,
              ),
              child: Slider(
                value: position.inMilliseconds
                    .clamp(0, duration.inMilliseconds)
                    .toDouble(),
                min: 0,
                max: duration.inMilliseconds.toDouble(),
                onChanged: (val) {
                  widget.onSeek?.call(Duration(milliseconds: val.toInt()));
                },
              ),
            ),
          ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.38),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: iconColor,
              size: 26,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11.5,
              fontWeight: FontWeight.w700,
              shadows: [
                Shadow(
                  color: Colors.black,
                  blurRadius: 4,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
