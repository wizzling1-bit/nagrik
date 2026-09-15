import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/errors/app_error.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/saved/data/saved_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _testUuid = '123e4567-e89b-12d3-a456-426614174000';

Future<(ContentRepository, int Function(), SharedPreferences)> _makeRepo({
  required Future<http.Response> Function(http.BaseRequest request) handler,
}) async {
  SharedPreferences.setMockInitialValues({});
  final prefs = await SharedPreferences.getInstance();
  var calls = 0;
  final client = MockClient((request) async {
    calls++;
    return handler(request);
  });
  final deviceService = DeviceIdService(prefs: prefs);
  await deviceService.setDeviceId(_testUuid);
  final apiClient = ApiClient(client: client, deviceIdService: deviceService);
  final remote = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceService);
  final repo = ContentRepository(remoteDataSource: remote, prefs: prefs);
  return (repo, () => calls, prefs);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Post categorySlug (backend taxonomy)', () {
    test('fromJson preserves raw backend slug verbatim', () {
      final post = Post.fromJson({
        'id': _testUuid,
        'type': 'ARTICLE',
        'title': 'T',
        'description': 'B',
        'city': 'Patna',
        'categoryId': {'id': 'c1', 'name': 'Politics', 'slug': 'politics'},
      });
      expect(post.categorySlug, 'politics');
    });

    test('categorySlug round-trips through toJson', () {
      final post = Post.fromJson({
        'id': _testUuid,
        'type': 'ARTICLE',
        'title': 'T',
        'description': 'B',
        'city': 'Patna',
        'categorySlug': 'sports',
      });
      final restored = Post.fromJson(post.toJson());
      expect(restored.categorySlug, 'sports');
    });
  });

  group('friendlyErrorMessage', () {
    test('never exposes raw transport internals', () {
      for (final raw in [
        const ApiException(message: 'Network unreachable. Please check connection. (Failed host lookup)'),
        const ApiException(statusCode: 500, message: 'Server encountered an issue. Please try again.'),
        const ApiException(statusCode: 404, message: 'Requested content not found.'),
      ]) {
        final msg = friendlyErrorMessage(raw);
        expect(msg, isNot(contains('SocketException')));
        expect(msg, isNot(contains('DioException')));
        expect(msg, isNot(contains('500 Internal Server Error')));
        expect(msg.trim(), isNotEmpty);
      }
    });
  });

  group('ContentRepository', () {
    test('reportContent never throws and rejects non-UUID honestly', () async {
      final (repo, _, _) = await _makeRepo(
        handler: (_) async => http.Response('{}', 500),
      );
      final offline = await repo.reportContent(id: 'post_breaking_1', reason: 'Spam');
      expect(offline.success, isFalse);

      final failed = await repo.reportContent(id: _testUuid, reason: 'Spam');
      expect(failed.success, isFalse);
      expect(failed.message.trim(), isNotEmpty);
    });

    test('feed falls back to cache with a single network attempt', () async {
      final (repo, calls, prefs) = await _makeRepo(
        handler: (_) async => http.Response('Server error', 500),
      );
      final post = Post.fromJson({
        'id': _testUuid,
        'type': 'ARTICLE',
        'title': 'Cached News',
        'description': 'Body',
        'city': 'Patna',
        'categorySlug': 'politics',
      });
      await prefs.setInt('nagrik_cache_version', 2);
      await prefs.setString(
        'nagrik_cached_feed_json',
        jsonEncode([post.toJson()]),
      );

      final result = await repo.getFeedWithItems(city: 'Patna');
      expect(calls(), 1, reason: 'must not re-hit the network on failure');
      expect(result.items, isNotEmpty, reason: 'cache fallback keeps UI populated');
    });

    test('offline search fallback respects backend category slug', () async {
      final (repo, _, prefs) = await _makeRepo(
        handler: (_) async => http.Response('Server error', 500),
      );
      // Seed the cache with two slugged posts (plus the cache-version key
      // so the v2 migration does not wipe the seed, mirroring real flow).
      final politics = Post.fromJson({
        'id': _testUuid, 'type': 'ARTICLE', 'title': 'Metro politics row',
        'description': 'Body', 'city': 'Patna', 'categorySlug': 'politics',
      });
      await prefs.setInt('nagrik_cache_version', 2);
      await prefs.setString(
        'nagrik_cached_feed_json',
        jsonEncode([politics.toJson()]),
      );

      final matched = await repo.searchContent(query: 'metro', categoryId: 'politics');
      expect(matched.map((p) => p.id), contains(_testUuid));

      final missed = await repo.searchContent(query: 'metro', categoryId: 'sports');
      expect(missed, isEmpty);
    });
  });

  group('SavedRepository', () {
    test('removePost on non-saved id never contacts backend', () async {
      SharedPreferences.setMockInitialValues({});
      var calls = 0;
      final client = MockClient((_) async {
        calls++;
        return http.Response(jsonEncode({'success': true, 'isSaved': true}), 200);
      });
      final prefs = await SharedPreferences.getInstance();
      final deviceService = DeviceIdService(prefs: prefs);
      await deviceService.setDeviceId(_testUuid);
      final apiClient = ApiClient(client: client, deviceIdService: deviceService);
      final remote = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceService);
      final contentRepo = ContentRepository(remoteDataSource: remote, prefs: prefs);
      final saved = SavedRepository(contentRepo: contentRepo);

      await saved.removePost('non-existent-id');
      expect(calls, 0, reason: 'toggle endpoints would re-save');
    });
  });

  group('DeviceIdService', () {
    test('returns one stable ID across calls', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      final service = DeviceIdService(prefs: prefs);
      final first = await service.getDeviceId();
      final second = await service.getDeviceId();
      expect(first, second);
      expect(prefs.getString('nagrik_anonymous_device_id'), first);
    });
  });
}
