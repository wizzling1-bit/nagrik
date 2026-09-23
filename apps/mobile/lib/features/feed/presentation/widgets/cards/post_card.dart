import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/core/theme/motion.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/news_card.dart';
import 'package:nagrik/features/feed/presentation/widgets/cards/video_card.dart';

/// Universal card dispatcher routing between News Post and Video Report.
class PostCard extends ConsumerStatefulWidget {
  const PostCard({
    super.key,
    required this.post,
    this.onTap,
    this.isFeatured = false,
  });

  final Post post;
  final VoidCallback? onTap;
  final bool isFeatured;

  @override
  ConsumerState<PostCard> createState() => _PostCardState();
}

class _PostCardState extends ConsumerState<PostCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _heartAnimController;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _heartAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    _scaleAnimation = Tween<double>(begin: 0.4, end: 1.25).animate(
      CurvedAnimation(
        parent: _heartAnimController,
        curve: const Interval(0.0, 0.7, curve: Curves.elasticOut),
      ),
    );

    _opacityAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _heartAnimController,
        curve: const Interval(0.7, 1.0, curve: Curves.easeOut),
      ),
    );
  }

  @override
  void dispose() {
    _heartAnimController.dispose();
    super.dispose();
  }

  void _handleDoubleTap() {
    NagrikMotion.lightImpact();
    ref.read(feedPostsProvider.notifier).toggleLike(widget.post.id);
    _heartAnimController.forward(from: 0.0);
  }

  @override
  Widget build(BuildContext context) {
    final cardContent = switch (widget.post.type) {
      PostType.news => NewsCard(
          post: widget.post,
          onTap: widget.onTap,
          isFeatured: widget.isFeatured,
        ),
      PostType.video => VideoCard(post: widget.post, onTap: widget.onTap),
    };

    return GestureDetector(
      onDoubleTap: _handleDoubleTap,
      child: Stack(
        alignment: Alignment.center,
        children: [
          cardContent,
          AnimatedBuilder(
            animation: _heartAnimController,
            builder: (context, child) {
              if (_heartAnimController.isDismissed) {
                return const SizedBox.shrink();
              }
              return Opacity(
                opacity: _opacityAnimation.value,
                child: Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.55),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.redAccent.withValues(alpha: 0.4),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.favorite_rounded,
                      color: Colors.redAccent,
                      size: 52,
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
