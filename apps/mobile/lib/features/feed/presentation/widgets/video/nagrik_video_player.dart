import 'dart:async';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:video_player/video_player.dart';
import 'package:nagrik/core/extensions/theme_extensions.dart';
import 'package:nagrik/core/localization/nagrik_localizations.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/core/ads/ad_frequency_manager.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';

/// Production-ready, leak-free video player for Nagrik Local News & Video Reports.
/// Elevated with cinema-grade frosted controls, NagrikIconMorph play/pause toggle,
/// double-tap 10s seek gestures with visual ripple, and smooth opacity fades.
class NagrikVideoPlayer extends ConsumerStatefulWidget {
  const NagrikVideoPlayer({
    super.key,
    required this.videoUrl,
    required this.postId,
    this.thumbnailUrl,
    this.autoPlay = false,
    this.aspectRatio,
  });

  final String videoUrl;
  final String postId;
  final String? thumbnailUrl;
  final bool autoPlay;
  final double? aspectRatio;

  @override
  ConsumerState<NagrikVideoPlayer> createState() => _NagrikVideoPlayerState();
}

class _NagrikVideoPlayerState extends ConsumerState<NagrikVideoPlayer> {
  VideoPlayerController? _controller;
  bool _isInitialized = false;
  bool _hasError = false;
  String? _errorMessage;
  bool _showControls = true;
  bool _hasRegisteredView = false;
  bool _lastPlaying = false;
  bool _lastBuffering = false;
  int _lastSecond = -1;
  Timer? _hideControlsTimer;
  int _seekDelta = 0; // -10 or +10 for double tap seek feedback
  Timer? _seekResetTimer;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  @override
  void didUpdateWidget(covariant NagrikVideoPlayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.videoUrl != widget.videoUrl) {
      _disposeController();
      _hasRegisteredView = false;
      _initializePlayer();
    }
  }

  Future<void> _initializePlayer() async {
    setState(() {
      _isInitialized = false;
      _hasError = false;
      _errorMessage = null;
    });

    final uri = Uri.tryParse(widget.videoUrl);
    if (uri == null || (!uri.isScheme('http') && !uri.isScheme('https'))) {
      if (mounted) {
        setState(() {
          _hasError = true;
          _errorMessage = 'Invalid video streaming URL';
        });
      }
      return;
    }

    try {
      final controller = VideoPlayerController.networkUrl(uri);
      _controller = controller;

      await controller.initialize();
      if (!mounted) {
        controller.dispose();
        return;
      }

      controller.addListener(_videoListener);

      setState(() {
        _isInitialized = true;
      });

      if (widget.autoPlay) {
        _play();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _hasError = true;
          _errorMessage = 'Could not load video stream: $e';
        });
      }
    }
  }

  void _videoListener() {
    if (!mounted) return;
    // Throttle rebuilds: position ticks arrive far more often than the UI
    // needs. Rebuild only on playing/buffering flips or second changes.
    final v = _controller?.value;
    if (v == null) return;
    final playing = v.isPlaying;
    final buffering = v.isBuffering;
    final second = v.position.inSeconds;
    if (playing != _lastPlaying ||
        buffering != _lastBuffering ||
        second != _lastSecond) {
      if (playing != _lastPlaying) {
        ref.read(adFrequencyManagerProvider.notifier).setVideoPlaying(playing);
      }
      _lastPlaying = playing;
      _lastBuffering = buffering;
      _lastSecond = second;
      setState(() {});
    }
  }

  void _play() {
    final controller = _controller;
    if (controller == null || !controller.value.isInitialized) return;

    controller.play();
    _scheduleHideControls();

    // Register view with backend once playback actually begins
    if (!_hasRegisteredView) {
      _hasRegisteredView = true;
      ref.read(contentRepositoryProvider).registerVideoView(videoId: widget.postId);
    }
  }

  void _pause() {
    _controller?.pause();
    _cancelHideControls();
    setState(() {
      _showControls = true;
    });
  }

  void _togglePlayPause() {
    final controller = _controller;
    if (controller == null) return;

    if (controller.value.isPlaying) {
      _pause();
    } else {
      _play();
    }
  }

  void _onTapVideo() {
    if (_showControls) {
      _togglePlayPause();
    } else {
      setState(() {
        _showControls = true;
      });
      _scheduleHideControls();
    }
  }

  void _seekRelative(int seconds) {
    final controller = _controller;
    if (controller == null || !controller.value.isInitialized) return;

    final current = controller.value.position;
    final total = controller.value.duration;
    final target = current + Duration(seconds: seconds);
    final clamped = Duration(
      milliseconds: target.inMilliseconds.clamp(0, total.inMilliseconds),
    );

    controller.seekTo(clamped);

    setState(() {
      _seekDelta = seconds;
      _showControls = true;
    });

    _scheduleHideControls();

    _seekResetTimer?.cancel();
    _seekResetTimer = Timer(const Duration(milliseconds: 800), () {
      if (mounted) {
        setState(() {
          _seekDelta = 0;
        });
      }
    });
  }

  void _scheduleHideControls() {
    _cancelHideControls();
    _hideControlsTimer = Timer(const Duration(seconds: 3), () {
      if (mounted && (_controller?.value.isPlaying ?? false)) {
        setState(() {
          _showControls = false;
        });
      }
    });
  }

  void _cancelHideControls() {
    _hideControlsTimer?.cancel();
    _hideControlsTimer = null;
  }

  void _disposeController() {
    ref.read(adFrequencyManagerProvider.notifier).setVideoPlaying(false);
    _cancelHideControls();
    _seekResetTimer?.cancel();
    final controller = _controller;
    _controller = null;
    if (controller != null) {
      controller.removeListener(_videoListener);
      controller.pause();
      controller.dispose();
    }
  }

  @override
  void dispose() {
    _disposeController();
    super.dispose();
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    if (duration.inHours > 0) {
      return '${duration.inHours}:$minutes:$seconds';
    }
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.isDarkMode;
    final primaryColor = context.colorScheme.primary;
    final controller = _controller;

    final targetAspectRatio = widget.aspectRatio ??
        (controller != null && controller.value.isInitialized && controller.value.aspectRatio > 0
            ? controller.value.aspectRatio
            : 16 / 9);

    return ClipRRect(
      borderRadius: NagrikRadii.borderRadiusMd,
      child: Container(
        color: Colors.black,
        child: AspectRatio(
          aspectRatio: targetAspectRatio,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // 1. Video Surface or Placeholder
              if (_isInitialized && controller != null)
                Center(
                  child: AspectRatio(
                    aspectRatio: controller.value.aspectRatio,
                    child: VideoPlayer(controller),
                  ),
                )
              else if (widget.thumbnailUrl != null && widget.thumbnailUrl!.isNotEmpty)
                CachedNetworkImage(
                  imageUrl: widget.thumbnailUrl!,
                  memCacheWidth: 640,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(color: Colors.black),
                  errorWidget: (context, url, error) => Container(color: Colors.black),
                )
              else
                Container(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFF1E293B),
                  child: const Center(
                    child: Icon(Icons.videocam_outlined, color: Colors.white54, size: 48),
                  ),
                ),

              // 2. Loading Indicator while initializing or buffering
              if (!_isInitialized && !_hasError)
                Container(
                  color: Colors.black38,
                  child: Center(
                    child: SizedBox(
                      width: 40,
                      height: 40,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                      ),
                    ),
                  ),
                )
              else if (_isInitialized && controller != null && controller.value.isBuffering)
                Center(
                  child: SizedBox(
                    width: 36,
                    height: 36,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                    ),
                  ),
                ),

              // 3. Error Fallback Overlay
              if (_hasError)
                Container(
                  color: Colors.black87,
                  padding: const EdgeInsets.all(NagrikSpacing.space4),
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 36),
                        const SizedBox(height: 8),
                        Text(
                          _errorMessage ?? 'Unable to play video',
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 12),
                        TextButton.icon(
                          onPressed: _initializePlayer,
                          icon: const Icon(Icons.refresh_rounded, size: 18, color: Colors.white),
                          label: const Text('Retry', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.white.withValues(alpha: 0.15),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // 4. Double-Tap Seek Gestures & Tap Toggle
              if (!_hasError)
                Positioned.fill(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      return GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: _onTapVideo,
                        onDoubleTapDown: (details) {
                          final halfWidth = constraints.maxWidth / 2;
                          if (details.localPosition.dx < halfWidth) {
                            _seekRelative(-10);
                          } else {
                            _seekRelative(10);
                          }
                        },
                        onDoubleTap: () {}, // Handled in onDoubleTapDown
                        child: const SizedBox.expand(),
                      );
                    },
                  ),
                ),

              // 5. Double-Tap Seek Visual Feedback Badge (-10s / +10s)
              if (_seekDelta != 0)
                Positioned.fill(
                  child: IgnorePointer(
                    child: Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.75),
                          borderRadius: BorderRadius.circular(NagrikRadii.pill),
                          border: Border.all(
                            color: primaryColor.withValues(alpha: 0.5),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _seekDelta < 0 ? Icons.replay_10_rounded : Icons.forward_10_rounded,
                              color: primaryColor,
                              size: 24,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _seekDelta < 0 ? '-10s' : '+10s',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

              // 6. Cinema Frosted Controls Overlay with Smooth Opacity Fade
              if (_isInitialized && controller != null && !_hasError)
                Positioned.fill(
                  child: IgnorePointer(
                    ignoring: !_showControls,
                    child: AnimatedOpacity(
                      opacity: _showControls ? 1.0 : 0.0,
                      duration: const Duration(milliseconds: 220),
                      curve: Curves.easeInOut,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha: 0.35),
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.70),
                            ],
                          ),
                        ),
                        child: Stack(
                          children: [
                            // Center Play/Pause Button with NagrikIconMorph
                            Center(
                              child: Semantics(
                                button: true,
                                label: controller.value.isPlaying
                                    ? ref.watch(appStringsProvider).pauseVideoLabel
                                    : ref.watch(appStringsProvider).playVideoLabel,
                                child: NagrikSpringPressable(
                                  onTap: _togglePlayPause,
                                  child: Container(
                                    width: 56,
                                    height: 56,
                                    decoration: BoxDecoration(
                                      color: Colors.black.withValues(alpha: 0.65),
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: Colors.white.withValues(alpha: 0.8),
                                        width: 2,
                                      ),
                                    ),
                                    child: Center(
                                      child: NagrikIconMorph(
                                        icon: controller.value.isPlaying
                                            ? Icons.pause_rounded
                                            : Icons.play_arrow_rounded,
                                        size: 34,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),

                            // Bottom Scrubber Bar & Timers with Vibrant Cyan Glow
                            Positioned(
                              left: 12,
                              right: 12,
                              bottom: 8,
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        _formatDuration(controller.value.position),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Semantics(
                                          label: 'Video progress',
                                          value:
                                              '${_formatDuration(controller.value.position)} of ${_formatDuration(controller.value.duration)}',
                                          excludeSemantics: true,
                                          child: VideoProgressIndicator(
                                            controller,
                                            allowScrubbing: true,
                                            padding: const EdgeInsets.symmetric(vertical: 14),
                                            colors: VideoProgressColors(
                                              playedColor: primaryColor,
                                              bufferedColor: Colors.white24,
                                              backgroundColor: Colors.white12,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        _formatDuration(controller.value.duration),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
