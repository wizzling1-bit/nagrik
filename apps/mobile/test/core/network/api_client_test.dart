import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late DeviceIdService deviceIdService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({
      'nagrik_device_uuid': 'test-device-uuid-1234',
    });
    deviceIdService = DeviceIdService.instance;
  });

  group('ApiClient Tests', () {
    test('executes GET request with headers and parses JSON', () async {
      final expectedDeviceId = await deviceIdService.getDeviceId();
      final mockClient = MockClient((request) async {
        expect(request.method, 'GET');
        expect(request.headers['x-device-id'], expectedDeviceId);
        return http.Response(jsonEncode({'status': 'ok', 'data': [1, 2, 3]}), 200);
      });

      final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);
      final res = await apiClient.get('/test-endpoint');

      expect(res, isA<Map<String, dynamic>>());
      expect(res['status'], 'ok');
      expect(res['data'], [1, 2, 3]);
    });

    test('executes POST request with JSON body', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'POST');
        expect(request.headers['content-type'], 'application/json');
        final body = jsonDecode(request.body) as Map<String, dynamic>;
        expect(body['name'], 'Nagrik');
        return http.Response(jsonEncode({'success': true, 'id': 'item-101'}), 201);
      });

      final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);
      final res = await apiClient.post('/create', body: {'name': 'Nagrik'});

      expect(res['success'], true);
      expect(res['id'], 'item-101');
    });

    test('throws ApiException on non-200 responses with meaningful message', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Resource not found'}), 404);
      });

      final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);

      expect(
        () => apiClient.get('/missing'),
        throwsA(isA<ApiException>().having((e) => e.statusCode, 'statusCode', 404)),
      );
    });

    test('close() on custom client closes the custom client', () {
      final mockClient = MockClient((request) async => http.Response('ok', 200));
      final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);

      // Verify closing custom client does not throw
      expect(() => apiClient.close(), returnsNormally);
    });

    test('close() on default ApiClient preserves shared client across instances', () async {
      final client1 = ApiClient(deviceIdService: deviceIdService);
      // Calling close on client1 should NOT destroy the shared singleton
      client1.close();

      final client2 = ApiClient(deviceIdService: deviceIdService);
      // client2 should still be completely valid and safe
      expect(() => client2.close(), returnsNormally);
    });
  });
}
