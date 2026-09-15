import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/api_constants.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ApiConstants', () {
    tearDown(() {
      ApiConstants.resetBaseUrl();
    });

    test('builds correct endpoint paths', () {
      expect(ApiConstants.feed, '/content/feed');
      expect(ApiConstants.search, '/content/search');
      expect(ApiConstants.categories, '/content/categories');
      expect(ApiConstants.locations, '/content/locations');
      expect(ApiConstants.contentDetail('123'), '/content/123');
      expect(ApiConstants.likeContent('123'), '/content/123/like');
      expect(ApiConstants.saveContent('123'), '/content/123/save');
      expect(ApiConstants.reportContent('123'), '/content/123/report');
      expect(ApiConstants.views, '/views');
      expect(ApiConstants.seed, '/seed');
    });

    test('supports setting custom base URL', () {
      ApiConstants.setBaseUrl('http://api.naagrik.news/api/v1/');
      expect(ApiConstants.baseUrl, 'http://api.naagrik.news/api/v1');
    });
  });

  group('DeviceIdService', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('generates persistent anonymous device id as UUID v4', () async {
      final prefs = await SharedPreferences.getInstance();
      final service = DeviceIdService(prefs: prefs);

      final id1 = await service.getDeviceId();
      expect(
        RegExp(r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
            .hasMatch(id1),
        isTrue,
      );

      final id2 = await service.getDeviceId();
      expect(id2, equals(id1));
      expect(service.currentDeviceId, equals(id1));
    });

    test('supports setting explicit device id', () async {
      final prefs = await SharedPreferences.getInstance();
      final service = DeviceIdService(prefs: prefs);

      await service.setDeviceId('flutter-device-test-123');
      expect(service.currentDeviceId, 'flutter-device-test-123');
      expect(await service.getDeviceId(), 'flutter-device-test-123');
    });
  });

  group('ApiClient', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
      ApiConstants.resetBaseUrl();
    });

    test('attaches device ID and Content-Type header on GET', () async {
      final prefs = await SharedPreferences.getInstance();
      final deviceService = DeviceIdService(prefs: prefs);
      await deviceService.setDeviceId('flutter-device-test-abc');

      late http.Request capturedRequest;
      final mockClient = MockClient((request) async {
        capturedRequest = request;
        return http.Response(
          jsonEncode({'success': true, 'data': 'ok'}),
          200,
        );
      });

      final apiClient = ApiClient(
        client: mockClient,
        deviceIdService: deviceService,
      );

      final response = await apiClient.get('/test', queryParameters: {'city': 'Patna'});

      expect(response, {'success': true, 'data': 'ok'});
      expect(capturedRequest.headers['x-device-id'], 'flutter-device-test-abc');
      expect(capturedRequest.headers['Content-Type'], 'application/json');
      expect(capturedRequest.url.queryParameters['city'], 'Patna');
    });

    test('sends JSON body on POST and parses JSON response', () async {
      final prefs = await SharedPreferences.getInstance();
      final deviceService = DeviceIdService(prefs: prefs);

      late http.Request capturedRequest;
      final mockClient = MockClient((request) async {
        capturedRequest = request;
        return http.Response(
          jsonEncode({'success': true, 'isLiked': true}),
          200,
        );
      });

      final apiClient = ApiClient(
        client: mockClient,
        deviceIdService: deviceService,
      );

      final response = await apiClient.post(
        '/content/123/like',
        body: {'reason': 'spam'},
      );

      expect(response['isLiked'], isTrue);
      expect(capturedRequest.body, jsonEncode({'reason': 'spam'}));
    });

    test('throws ApiException on HTTP 400/500 error response', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'success': false, 'message': 'Not Found'}),
          404,
        );
      });

      final apiClient = ApiClient(client: mockClient);

      expect(
        () => apiClient.get('/unknown'),
        throwsA(isA<ApiException>().having(
          (e) => e.statusCode,
          'statusCode',
          404,
        )),
      );
    });
  });
}
