import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/features/videos/presentation/providers/videos_provider.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';

void main() {
  test('videosFeedProvider initializes with loading state and empty items', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    final state = container.read(videosFeedProvider);
    expect(state.isLoading, true);
    expect(state.items, isEmpty);
  });

  test('videosMutedProvider toggles audio state correctly', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    expect(container.read(videosMutedProvider), false);
    container.read(videosMutedProvider.notifier).toggle();
    expect(container.read(videosMutedProvider), true);
    container.read(videosMutedProvider.notifier).setMuted(false);
    expect(container.read(videosMutedProvider), false);
  });
}
