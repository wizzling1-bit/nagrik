import 'dart:async';
import 'dart:ui';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:video_player/video_player.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/widgets/comments_bottom_sheet.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';
import 'package:nagrik/features/feed/presentation/widgets/share_bottom_sheet.dart';
import 'package:nagrik/features/videos/presentation/providers/videos_provider.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_overlay.dart';

/// Full-screen vertical video card with aspect ratio adaptation:
/// 9:16 vertical full bleed vs 16:9 landscape centered with ambient blur.
class VerticalVideoCard extends ConsumerStatefulWidget {
  const VerticalVideoCard({
    super.key,
    required this.post,
    required this.controller,
    required this.isMuted,
    required this.onToggleMute,
    required this.onTogglePlayPause,
  });

  final Post post;
  final VideoPlayerController? controller;
  final bool isMuted;
  final VoidCallback onToggleMute;
  final VoidCallback onTogglePlayPause;

  @override
  ConsumerState<VerticalVideoCard> createState() => _VerticalVideoCardState();
}

class _VerticalVideoCardState extends ConsumerState<VerticalVideoCard>
    with SingleTickerProviderStateMixin {
  bool _showPlayPauseRipple = false;
  bool _wasPlayingOnRipple = false;
  int _seekRipple = 0; // -10 or +10
  Timer? _rippleTimer;
  Timer? _seekTimer;

  void _triggerPlayPause() {
    NagrikMotion.lightImpact();
    final controller = widget.controller;
    final isPlaying = controller?.value.isPlaying ?? false;

    setState(() {
      _showPlayPauseRipple = true;
      _wasPlayingOnRipple = !isPlaying;
    });

    widget.onTogglePlayPause();

    _rippleTimer?.cancel();
    _rippleTimer = Timer(const Duration(milliseconds: 650), () {
      if (mounted) {
        setState(() => _showPlayPauseRipple = false);
      }
    });
  }

  void _seekRelative(int seconds) {
    final controller = widget.controller;
    if (controller == null || !controller.value.isInitialized) return;

    NagrikMotion.lightImpact();
    final current = controller.value.position;
    final total = controller.value.duration;
    final target = current + Duration(seconds: seconds);
    final clamped = Duration(
      milliseconds: target.inMilliseconds.clamp(0, total.inMilliseconds),
    );

    controller.seekTo(clamped);

    setState(() => _seekRipple = seconds);

    _seekTimer?.cancel();
    _seekTimer = Timer(const Duration(milliseconds: 700), () {
      if (mounted) {
        setState(() => _seekRipple = 0);
      }
    });
  }

  @override
  void dispose() {
    _rippleTimer?.cancel();
    _seekTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.controller;
    final isInitialized = controller?.value.isInitialized ?? false;
    final isBuffering = controller?.value.isBuffering ?? false;
    final post = widget.post;

    return Container(
      color: Colors.black,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Video Surface or Poster Image
          if (isInitialized && controller != null) ...[
            _buildAdaptiveVideoSurface(controller),
          ] else ...[
            _buildPosterSurface(post.thumbnailUrl),
          ],

          // Buffering Indicator
          if (isBuffering)
            const Center(
              child: SizedBox(
                width: 44,
                height: 44,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    NagrikBrandColors.orangePrimary,
                  ),
                ),
              ),
            ),

          // Double Tap Seek Gesture Zones (Left 30% / Right 30%) and Center Tap
          Positioned.fill(
            child: Row(
              children: [
                // Left 30% zone for Double Tap rewind 10s
                Expanded(
                  flex: 3,
                  child: GestureDetector(
                    behavior: HitTestBehavior.translucent,
                    onDoubleTap: () => _seekRelative(-10),
                    onTap: _triggerPlayPause,
                  ),
                ),
                // Center 40% zone for single tap toggle play/pause
                Expanded(
                  flex: 4,
                  child: GestureDetector(
                    behavior: HitTestBehavior.translucent,
                    onTap: _triggerPlayPause,
                  ),
                ),
                // Right 30% zone for Double Tap fast forward 10s
                Expanded(
                  flex: 3,
                  child: GestureDetector(
                    behavior: HitTestBehavior.translucent,
                    onDoubleTap: () => _seekRelative(10),
                    onTap: _triggerPlayPause,
                  ),
                ),
              ],
            ),
          ),

          // Animated Play / Pause Center Ripple Feedback
          if (_showPlayPauseRipple)
            Center(
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.55),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _wasPlayingOnRipple
                      ? Icons.play_arrow_rounded
                      : Icons.pause_rounded,
                  color: Colors.white,
                  size: 44,
                ),
              ),
            ),

          // Double Tap Seek Feedback Ripple
          if (_seekRipple != 0)
            Align(
              alignment: _seekRipple < 0
                  ? Alignment.centerLeft
                  : Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.60),
                    shape: BoxShape.circle,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        _seekRipple < 0
                            ? Icons.replay_10_rounded
                            : Icons.forward_10_rounded,
                        color: Colors.white,
                        size: 32,
                      ),
                      Text(
                        '${_seekRipple.abs()}s',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // Persistent Center Paused Badge when video is paused
          if (isInitialized && controller != null && !controller.value.isPlaying && !_showPlayPauseRipple)
            Center(
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: _triggerPlayPause,
                child: Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.58),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.28),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.45),
                        blurRadius: 20,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.play_arrow_rounded,
                    color: Colors.white,
                    size: 48,
                  ),
                ),
              ),
            ),

          // Journalist Overlays & Interactions
          IgnorePointer(
            ignoring: false,
            child: VerticalVideoOverlay(
              post: post,
              controller: controller,
              isMuted: widget.isMuted,
              isPlaying: controller?.value.isPlaying ?? false,
              onTogglePlayPause: _triggerPlayPause,
              onToggleMute: widget.onToggleMute,
              onLike: () {
                ref.read(videosFeedProvider.notifier).toggleLike(post.id);
              },
              onComment: () {
                showCommentsBottomSheet(context, post);
              },
              onShare: () {
                showShareSheet(context, post);
              },
              onSave: () {
                ref.read(videosFeedProvider.notifier).toggleSave(post.id);
              },
              onReport: () {
                showReportContentSheet(
                  context,
                  contentId: post.id,
                  contentTitle: post.title,
                );
              },
              onSeek: (pos) {
                controller?.seekTo(pos);
              },
            ),
          ),
        ],
      ),
    );
  }

  /// Adapts between portrait 9:16 and landscape 16:9 news reporting
  Widget _buildAdaptiveVideoSurface(VideoPlayerController controller) {
    final videoAspect = controller.value.aspectRatio;
    final isLandscape = videoAspect >= 1.0;

    if (!isLandscape) {
      // 9:16 Vertical Video: Full bleed cover
      return FittedBox(
        fit: BoxFit.cover,
        clipBehavior: Clip.hardEdge,
        child: SizedBox(
          width: controller.value.size.width,
          height: controller.value.size.height,
          child: VideoPlayer(controller),
        ),
      );
    }

    // 16:9 Landscape Video: Centered contain with ambient darkened blur backdrop
    return Stack(
      fit: StackFit.expand,
      children: [
        // Ambient Blurred Backdrop
        FittedBox(
          fit: BoxFit.cover,
          clipBehavior: Clip.hardEdge,
          child: SizedBox(
            width: controller.value.size.width,
            height: controller.value.size.height,
            child: VideoPlayer(controller),
          ),
        ),
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 25, sigmaY: 25),
          child: Container(
            color: Colors.black.withValues(alpha: 0.65),
          ),
        ),
        // Sharp Center Video Frame
        Center(
          child: AspectRatio(
            aspectRatio: videoAspect,
            child: VideoPlayer(controller),
          ),
        ),
      ],
    );
  }

  /// Poster image with dark backdrop while stream initializes
  Widget _buildPosterSurface(String? thumbnailUrl) {
    if (thumbnailUrl != null && thumbnailUrl.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: thumbnailUrl,
        fit: BoxFit.cover,
        memCacheWidth: 720,
        memCacheHeight: 1280,
        placeholder: (_, _) => Container(color: Colors.black),
        errorWidget: (_, _, _) => Container(
          color: const Color(0xFF101522),
          child: const Center(
            child: Icon(Icons.videocam_outlined, color: Colors.white24, size: 48),
          ),
        ),
      );
    }

    return Container(
      color: const Color(0xFF101522),
      child: const Center(
        child: Icon(Icons.play_circle_outline_rounded,
            color: Colors.white24, size: 64),
      ),
    );
  }
}
