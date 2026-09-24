import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:video_player/video_player.dart';
import 'package:nagrik/core/ads/ad_placement_policy.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/videos/presentation/providers/videos_provider.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_ad_card.dart';
import 'package:nagrik/features/videos/presentation/widgets/vertical_video_card.dart';

/// Dedicated, full-screen vertical swipe news video feed screen.
/// Implements a 3-controller sliding window, location-prioritized ranking,
/// background lifecycle pausing, and seamless AdMob native interleaving.
class VideosScreen extends ConsumerStatefulWidget {
  const VideosScreen({super.key});

  @override
  ConsumerState<VideosScreen> createState() => _VideosScreenState();
}

class _VideosScreenState extends ConsumerState<VideosScreen>
    with WidgetsBindingObserver {
  late final PageController _pageController;
  final Map<int, VideoPlayerController> _controllers = {};
  final Set<int> _initializingIndices = {};
  final Set<String> _registeredViews = {};
  int _currentPage = 0;
  bool _isDisposed = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _pageController = PageController();
  }

  @override
  void dispose() {
    _isDisposed = true;
    WidgetsBinding.instance.removeObserver(this);
    _pageController.dispose();
    _disposeAllControllers();
    super.dispose();
  }

  void _disposeAllControllers() {
    for (final controller in _controllers.values) {
      try {
        controller.pause();
        controller.dispose();
      } catch (_) {}
    }
    _controllers.clear();
    _initializingIndices.clear();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      _controllers[_currentPage]?.pause();
    } else if (state == AppLifecycleState.resumed) {
      if (mounted) {
        final isMuted = ref.read(videosMutedProvider);
        final ctrl = _controllers[_currentPage];
        if (ctrl != null && ctrl.value.isInitialized) {
          ctrl.setVolume(isMuted ? 0.0 : 1.0);
          ctrl.play();
        }
      }
    }
  }

  Future<void> _initControllerForIndex(
    int pageIndex,
    List<Post> posts, {
    bool autoPlay = false,
  }) async {
    if (_isDisposed) return;
    if (AdPlacementPolicy.isAdIndex(pageIndex, frequency: 4)) return;

    final organicIndex =
        AdPlacementPolicy.getOrganicIndex(pageIndex, frequency: 4);
    if (organicIndex < 0 || organicIndex >= posts.length) return;

    if (_controllers.containsKey(pageIndex) ||
        _initializingIndices.contains(pageIndex)) {
      if (autoPlay && _controllers.containsKey(pageIndex)) {
        final ctrl = _controllers[pageIndex];
        if (ctrl != null && ctrl.value.isInitialized) {
          final isMuted = ref.read(videosMutedProvider);
          ctrl.setVolume(isMuted ? 0.0 : 1.0);
          ctrl.play();
        }
      }
      return;
    }

    final post = posts[organicIndex];
    final videoUrl = post.videoUrl ?? (post.mediaUrls.isNotEmpty ? post.mediaUrls.first : null);
    if (videoUrl == null || videoUrl.isEmpty) return;

    final uri = Uri.tryParse(videoUrl);
    if (uri == null || (!uri.isScheme('http') && !uri.isScheme('https'))) return;

    _initializingIndices.add(pageIndex);

    try {
      final controller = VideoPlayerController.networkUrl(uri);
      await controller.initialize();
      if (_isDisposed || !mounted) {
        controller.dispose();
        return;
      }

      final isMuted = ref.read(videosMutedProvider);
      controller.setLooping(true);
      controller.setVolume(isMuted ? 0.0 : 1.0);

      _controllers[pageIndex] = controller;
      _initializingIndices.remove(pageIndex);

      if (autoPlay && _currentPage == pageIndex) {
        controller.play();
        _recordViewOnce(post.id);
      }

      if (mounted) setState(() {});
    } catch (_) {
      _initializingIndices.remove(pageIndex);
    }
  }

  void _recordViewOnce(String postId) {
    if (!_registeredViews.contains(postId)) {
      _registeredViews.add(postId);
      ref.read(contentRepositoryProvider).registerVideoView(videoId: postId);
    }
  }

  void _onPageChanged(int newPage, List<Post> posts) {
    if (_currentPage == newPage) return;

    final oldPage = _currentPage;
    _currentPage = newPage;

    // Pause previous video controller
    _controllers[oldPage]?.pause();

    final isAd = AdPlacementPolicy.isAdIndex(newPage, frequency: 4);
    if (!isAd) {
      final organicIndex =
          AdPlacementPolicy.getOrganicIndex(newPage, frequency: 4);
      if (organicIndex >= 0 && organicIndex < posts.length) {
        final post = posts[organicIndex];
        // 1. Play active video
        if (_controllers.containsKey(newPage)) {
          final ctrl = _controllers[newPage];
          if (ctrl != null && ctrl.value.isInitialized) {
            final isMuted = ref.read(videosMutedProvider);
            ctrl.setVolume(isMuted ? 0.0 : 1.0);
            ctrl.play();
            _recordViewOnce(post.id);
          }
        } else {
          _initControllerForIndex(newPage, posts, autoPlay: true);
        }

        // Pagination preload check: if nearing end of posts
        if (organicIndex >= posts.length - 3) {
          ref.read(videosFeedProvider.notifier).loadMore();
        }
      }
    }

    // 2. Preload next video in advance
    final nextPageIndex = newPage + 1;
    if (!AdPlacementPolicy.isAdIndex(nextPageIndex, frequency: 4)) {
      _initControllerForIndex(nextPageIndex, posts, autoPlay: false);
    }

    // 3. Keep previous video warm (for instant reverse swipe)
    final prevPageIndex = newPage - 1;
    if (prevPageIndex >= 0 &&
        !AdPlacementPolicy.isAdIndex(prevPageIndex, frequency: 4)) {
      _initControllerForIndex(prevPageIndex, posts, autoPlay: false);
    }

    // 4. Dispose distant controllers outside [newPage - 1, newPage, newPage + 1]
    _pruneDistantControllers(newPage);

    setState(() {});
  }

  void _pruneDistantControllers(int currentPage) {
    final keysToRemove = <int>[];
    for (final index in _controllers.keys) {
      if ((index - currentPage).abs() > 1) {
        keysToRemove.add(index);
      }
    }
    for (final key in keysToRemove) {
      final ctrl = _controllers.remove(key);
      try {
        ctrl?.pause();
        ctrl?.dispose();
      } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    final feedState = ref.watch(videosFeedProvider);
    final isMuted = ref.watch(videosMutedProvider);
    final posts = feedState.posts;

    // Update audio volume across active controllers when mute flips
    ref.listen<bool>(videosMutedProvider, (_, muted) {
      for (final ctrl in _controllers.values) {
        if (ctrl.value.isInitialized) {
          ctrl.setVolume(muted ? 0.0 : 1.0);
        }
      }
    });

    if (feedState.isLoading && posts.isEmpty) {
      return _buildLoadingSkeleton();
    }

    if (feedState.errorMessage != null && posts.isEmpty) {
      return _buildErrorState(feedState.errorMessage!);
    }

    if (posts.isEmpty) {
      return _buildEmptyState();
    }

    final totalCount = AdPlacementPolicy.getTotalCount(
      posts.length,
      frequency: 4,
    );

    // Initial setup on first render: initialize first video and preload second
    if (_controllers.isEmpty && !_initializingIndices.contains(0)) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _initControllerForIndex(0, posts, autoPlay: true);
        if (totalCount > 1) {
          _initControllerForIndex(1, posts, autoPlay: false);
        }
      });
    }

    return Scaffold(
      backgroundColor: Colors.black,
      body: PageView.builder(
        controller: _pageController,
        scrollDirection: Axis.vertical,
        itemCount: totalCount,
        onPageChanged: (idx) => _onPageChanged(idx, posts),
        itemBuilder: (context, index) {
          final isAd = AdPlacementPolicy.isAdIndex(index, frequency: 4);

          if (isAd) {
            final adSeq =
                AdPlacementPolicy.getAdSequenceNumber(index, frequency: 4);
            return VerticalVideoAdCard(adIndex: adSeq);
          }

          final organicIndex =
              AdPlacementPolicy.getOrganicIndex(index, frequency: 4);
          if (organicIndex < 0 || organicIndex >= posts.length) {
            return const SizedBox.shrink();
          }

          final post = posts[organicIndex];
          final controller = _controllers[index];

          return RepaintBoundary(
            child: VerticalVideoCard(
              key: ValueKey('video_${post.id}'),
              post: post,
              controller: controller,
              isMuted: isMuted,
              onToggleMute: () {
                ref.read(videosMutedProvider.notifier).toggle();
              },
              onTogglePlayPause: () {
                final ctrl = _controllers[index];
                if (ctrl != null && ctrl.value.isInitialized) {
                  if (ctrl.value.isPlaying) {
                    ctrl.pause();
                  } else {
                    ctrl.play();
                  }
                  setState(() {});
                }
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadingSkeleton() {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 48,
              height: 48,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation<Color>(
                  NagrikBrandColors.orangePrimary,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Loading local video reports...',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.75),
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(String message) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(NagrikSpacing.space6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.06),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.cloud_off_rounded,
                    color: NagrikBrandColors.orangePrimary,
                    size: 44,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  'Could Not Connect to Feed',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.65),
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: NagrikBrandColors.orangePrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: NagrikRadii.borderRadiusPill,
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: const Text(
                    'Retry',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    NagrikMotion.lightImpact();
                    ref.read(videosFeedProvider.notifier).refreshFeed();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(NagrikSpacing.space6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.06),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.videocam_outlined,
                    color: NagrikBrandColors.orangePrimary,
                    size: 48,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  'No Local News Videos Yet',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'There are currently no verified video reports published in your selected locality. Check back soon for ground reports.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.65),
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: NagrikBrandColors.orangePrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: NagrikRadii.borderRadiusPill,
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: const Text(
                    'Refresh Feed',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    NagrikMotion.lightImpact();
                    ref.read(videosFeedProvider.notifier).refreshFeed();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
