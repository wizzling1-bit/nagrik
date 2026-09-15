import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import '../fixtures/mock_feed_data.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/saved/data/saved_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Contract tests for the REAL repository layer.
///
/// The legacy `shared/repositories` mocks were deleted: the single source of
/// truth is [ContentRepository] (live API + cache) with [SavedRepository] as
/// the local-first saved store (no GET /saved endpoint exists on the backend).
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<SavedRepository> makeSavedRepo({bool reset = true}) async {
    if (reset) SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    final deviceService = DeviceIdService(prefs: prefs);
    await deviceService.setDeviceId('123e4567-e89b-12d3-a456-426614174000');
    final client = MockClient(
      (_) async => http.Response(jsonEncode({'success': true}), 200),
    );
    final apiClient = ApiClient(client: client, deviceIdService: deviceService);
    final remote = ContentRemoteDataSource(
      apiClient: apiClient,
      deviceIdService: deviceService,
    );
    final contentRepo = ContentRepository(
      remoteDataSource: remote,
      prefs: prefs,
    );
    return SavedRepository(contentRepo: contentRepo);
  }

  group('Repository layer (production contracts)', () {
    test('SavedRepository persists toggled posts across instances', () async {
      final repo = await makeSavedRepo();
      final post = kMockPosts.first;

      expect(await repo.isPostSaved(post.id), isFalse);
      expect(await repo.toggleSave(post), isTrue);
      expect(await repo.isPostSaved(post.id), isTrue);

      // A fresh repository over the same disk still sees the save.
      final reopened = await makeSavedRepo(reset: false);
      expect(await reopened.isPostSaved(post.id), isTrue);

      expect(await reopened.toggleSave(post), isFalse);
      expect(await reopened.isPostSaved(post.id), isFalse);
    });

    test('SavedRepository.removePost on missing id is a safe no-op', () async {
      final repo = await makeSavedRepo();
      await repo.removePost('missing-id');
      expect(await repo.getSavedPosts(), isEmpty);
    });

    test('SavedRepository.removePost drops saved posts', () async {
      final repo = await makeSavedRepo();
      final post = kMockPosts.first;
      await repo.toggleSave(post);
      await repo.removePost(post.id);
      expect(await repo.isPostSaved(post.id), isFalse);
    });
  });
}
