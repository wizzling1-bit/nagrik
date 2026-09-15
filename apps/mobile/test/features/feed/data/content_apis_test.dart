import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Content APIs (APIs.md Contract Tests)', () {
    late SharedPreferences prefs;
    late DeviceIdService deviceIdService;

    setUp(() async {
      SharedPreferences.setMockInitialValues({});
      prefs = await SharedPreferences.getInstance();
      deviceIdService = DeviceIdService(prefs: prefs);
      await deviceIdService.setDeviceId('flutter-device-test-123');
    });

    test('1. GET /content/feed parses feed items and pagination exactly from APIs.md sample', () async {
      final sampleFeedJson = {
        'success': true,
        'items': [
          {
            'itemType': 'CONTENT',
            'data': {
              'id': 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
              '_id': 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
              'creatorId': 'cr_123',
              'type': 'VIDEO',
              'title': 'Patna Metro Construction Update Phase 2',
              'description': 'Full report on the underground tunneling progress near Patna Junction.',
              'mediaUrl': 'https://pub-r2.naagrik.news/media/videos/metro_update.mp4',
              'thumbnailUrl': 'https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg',
              'categoryId': {
                'id': 'c1b2c3d4-0000-0000-0000-000000000001',
                '_id': 'c1b2c3d4-0000-0000-0000-000000000001',
                'name': 'Politics',
                'slug': 'politics',
                'displayOrder': 1,
                'status': 'ACTIVE'
              },
              'location': {
                'country': 'India',
                'state': 'Bihar',
                'city': 'Patna',
                'area': 'Kankarbagh',
                'coordinates': {
                  'latitude': 25.5941,
                  'longitude': 85.1376
                }
              },
              'moderationStatus': 'APPROVED',
              'views': 1250,
              'eligibleViews': 840,
              'likes': 310,
              'shares': 45,
              'saves': 82,
              'publishedAt': '2026-09-04T07:27:32.662Z',
              'createdAt': '2026-09-04T07:27:32.662Z'
            }
          }
        ],
        'pagination': {
          'page': 1,
          'limit': 20,
          'totalItems': 45,
          'totalPages': 3
        }
      };

      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/feed'));
        expect(request.url.queryParameters['city'], 'Patna');
        return http.Response(jsonEncode(sampleFeedJson), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final result = await dataSource.getFeed(city: 'Patna');

      expect(result.posts.length, 1);
      final post = result.posts.first;
      expect(post.id, 'd1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(post.type, PostType.video);
      expect(post.title, 'Patna Metro Construction Update Phase 2');
      expect(post.body, 'Full report on the underground tunneling progress near Patna Junction.');
      expect(post.city, 'Patna');
      expect(post.locality, 'Kankarbagh');
      expect(post.likesCount, 310);
      expect(post.viewCount, 1250);
      expect(post.eligibleViews, 840);
      expect(post.sharesCount, 45);
      expect(post.savesCount, 82);
      expect(post.videoUrl, 'https://pub-r2.naagrik.news/media/videos/metro_update.mp4');
      expect(result.pagination.totalItems, 45);
      expect(result.pagination.totalPages, 3);
    });

    test('2. GET /content/search parses matching search results from APIs.md', () async {
      final sampleSearchJson = {
        'success': true,
        'contents': [
          {
            'id': 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
            'type': 'VIDEO',
            'title': 'Patna Metro Construction Update Phase 2',
            'description': 'Full report',
            'mediaUrl': 'https://pub-r2.naagrik.news/media/videos/metro_update.mp4',
            'thumbnailUrl': 'https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg',
            'city': 'Patna',
            'area': 'Kankarbagh',
          }
        ]
      };

      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/search'));
        expect(request.url.queryParameters['q'], 'Patna Metro');
        return http.Response(jsonEncode(sampleSearchJson), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final posts = await dataSource.search(query: 'Patna Metro');
      expect(posts.length, 1);
      expect(posts.first.title, 'Patna Metro Construction Update Phase 2');
    });

    test('3. GET /content/categories parses categories from APIs.md', () async {
      final sampleCategories = {
        'success': true,
        'categories': [
          {
            'id': 'c1b2c3d4-0000-0000-0000-000000000001',
            '_id': 'c1b2c3d4-0000-0000-0000-000000000001',
            'name': 'Politics',
            'slug': 'politics',
            'displayOrder': 1,
            'status': 'ACTIVE'
          }
        ]
      };

      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/categories'));
        return http.Response(jsonEncode(sampleCategories), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final categories = await dataSource.getCategories();
      expect(categories.length, 1);
      expect(categories.first.name, 'Politics');
      expect(categories.first.slug, 'politics');
    });

    test('4. GET /content/locations parses supported locations from APIs.md', () async {
      final sampleLocations = {
        'success': true,
        'locations': [
          {
            'country': 'India',
            'state': 'Bihar',
            'city': 'Patna',
            'area': 'Kankarbagh',
            'coordinates': {
              'latitude': 25.5941,
              'longitude': 85.1376
            }
          }
        ]
      };

      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/locations'));
        return http.Response(jsonEncode(sampleLocations), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final locations = await dataSource.getLocations();
      expect(locations.length, 1);
      expect(locations.first.city, 'Patna');
      expect(locations.first.area, 'Kankarbagh');
      expect(locations.first.coordinates?.latitude, 25.5941);
    });

    test('5. GET /content/{id} parses single content details from APIs.md', () async {
      final sampleDetail = {
        'success': true,
        'content': {
          'id': 'item-999',
          'type': 'ARTICLE',
          'title': 'Kolkata Book Fair 2026',
          'description': 'Annual literature festival returns to Salt Lake.',
          'city': 'Kolkata',
          'area': 'Salt Lake',
          'likes': 55,
        }
      };

      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/item-999'));
        return http.Response(jsonEncode(sampleDetail), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final post = await dataSource.getContentDetails('item-999');
      expect(post.id, 'item-999');
      expect(post.title, 'Kolkata Book Fair 2026');
      expect(post.likesCount, 55);
    });

    test('6. POST /content/{id}/like toggles like status', () async {
      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/post-1/like'));
        return http.Response(jsonEncode({'success': true, 'isLiked': true, 'likes': 311}), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final result = await dataSource.toggleLike('post-1');
      expect(result.success, isTrue);
      expect(result.isLiked, isTrue);
      expect(result.likes, 311);
    });

    test('7. POST /content/{id}/save toggles bookmark status', () async {
      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/post-1/save'));
        return http.Response(jsonEncode({'success': true, 'isSaved': true}), 200);
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final result = await dataSource.toggleSave('post-1');
      expect(result.success, isTrue);
      expect(result.isSaved, isTrue);
    });

    test('8. POST /content/{id}/report submits report with reason and deviceId', () async {
      late Map<String, dynamic> capturedBody;
      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/content/post-1/report'));
        capturedBody = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({'success': true, 'message': 'Report submitted for review.'}),
          200,
        );
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final response = await dataSource.reportContent(
        id: 'post-1',
        reason: 'Misleading information',
      );

      expect(response.success, isTrue);
      expect(response.message, 'Report submitted for review.');
      expect(capturedBody['reason'], 'Misleading information');
      expect(capturedBody['deviceId'], 'flutter-device-test-123');
    });

    test('9. POST /views registers view adhering to 3-view ceiling monetization rule', () async {
      late Map<String, dynamic> capturedBody;
      final client = MockClient((request) async {
        expect(request.url.path, endsWith('/views'));
        capturedBody = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({
            'success': true,
            'isEligibleView': true,
            'currentCountedViews': 2,
            'totalViews': 1251,
            'eligibleViews': 841
          }),
          200,
        );
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);

      final response = await dataSource.registerView(videoId: 'video-123');

      expect(response.success, isTrue);
      expect(response.isEligibleView, isTrue);
      expect(response.currentCountedViews, 2);
      expect(response.totalViews, 1251);
      expect(response.eligibleViews, 841);
      expect(capturedBody['videoId'], 'video-123');
      expect(capturedBody['deviceId'], 'flutter-device-test-123');
    });

    test('ContentRepository deduplicates video view registration in session', () async {
      int apiCallCount = 0;
      final client = MockClient((request) async {
        apiCallCount++;
        return http.Response(
          jsonEncode({
            'success': true,
            'isEligibleView': true,
            'currentCountedViews': 1,
            'totalViews': 100,
            'eligibleViews': 50
          }),
          200,
        );
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);
      final repo = ContentRepository(remoteDataSource: dataSource, prefs: prefs);

      final firstCall = await repo.registerVideoView(
        videoId: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
      );
      expect(firstCall, isNotNull);
      expect(apiCallCount, 1);

      // Second call in same session should deduplicate
      final secondCall = await repo.registerVideoView(
        videoId: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
      );
      expect(secondCall, isNull);
      expect(apiCallCount, 1);
    });

    test('ContentRepository falls back to cached/default posts on network error', () async {
      final client = MockClient((request) async {
        throw http.ClientException('Server Offline');
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceIdService);
      final dataSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceIdService);
      final repo = ContentRepository(remoteDataSource: dataSource, prefs: prefs);

      final post = Post.fromJson({
        'id': 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'type': 'ARTICLE',
        'title': 'Cached Article',
        'description': 'Offline content',
        'city': 'Patna',
      });
      await prefs.setInt('nagrik_cache_version', 2);
      await prefs.setString('nagrik_cached_feed_json', jsonEncode([post.toJson()]));

      final feed = await repo.getFeed();
      expect(feed.isNotEmpty, isTrue);
    });
  });
}
