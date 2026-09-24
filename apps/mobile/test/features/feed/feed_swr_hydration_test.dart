import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nagrik/core/network/offline_cache_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('OfflineCacheService returns instant cached items without network call', () async {
    SharedPreferences.setMockInitialValues({});
    final testPosts = [
      {'id': 'p1', 'title': 'Instant Local Story 1'},
      {'id': 'p2', 'title': 'Instant Local Story 2'},
    ];
    await OfflineCacheService.saveFeedCache(testPosts);

    final cached = await OfflineCacheService.getFeedCache();
    expect(cached.length, 2);
    expect(cached.first['title'], 'Instant Local Story 1');
  });
}
