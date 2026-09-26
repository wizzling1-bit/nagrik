import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/features/onboarding/presentation/widgets/lgd_cascading_sheet.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late DeviceIdService deviceIdService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    deviceIdService = DeviceIdService(prefs: prefs);
    await deviceIdService.setDeviceId('test-device-id');
    LgdCascadingSheet.clearCache();
  });

  tearDown(() {
    LgdCascadingSheet.clearCache();
  });

  testWidgets('LgdCascadingSheet fetches states, caches them, and cascades hierarchy', (tester) async {
    int requestCount = 0;

    final mockClient = MockClient((request) async {
      requestCount++;
      final path = request.url.path;

      if (path.contains('lgd_states')) {
        return http.Response(
          jsonEncode([
            {'state_code': 10, 'state_name': 'Bihar'},
            {'state_code': 27, 'state_name': 'Maharashtra'},
          ]),
          200,
          headers: {'content-type': 'application/json'},
        );
      } else if (path.contains('lgd_districts')) {
        return http.Response(
          jsonEncode([
            {'district_code': 214, 'district_name': 'Patna'},
          ]),
          200,
          headers: {'content-type': 'application/json'},
        );
      } else if (path.contains('lgd_subdistricts')) {
        return http.Response(
          jsonEncode([
            {'subdistrict_code': 1001, 'subdistrict_name': 'Patna Sadar'},
          ]),
          200,
          headers: {'content-type': 'application/json'},
        );
      } else if (path.contains('lgd_local_bodies')) {
        return http.Response(
          jsonEncode([
            {'local_body_code': 5001, 'local_body_name': 'Kankarbagh', 'pincode': '800020'},
          ]),
          200,
          headers: {'content-type': 'application/json'},
        );
      }
      return http.Response('[]', 200, headers: {'content-type': 'application/json'});
    });

    final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);
    LgdSelectionResult? selectedResult;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: LgdCascadingSheet(
            apiClient: apiClient,
            onSelected: (result) {
              selectedResult = result;
            },
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Initial State Step
    expect(find.text('Select State (राज्य)'), findsOneWidget);
    expect(find.text('Bihar'), findsOneWidget);
    expect(find.text('Maharashtra'), findsOneWidget);
    expect(requestCount, equals(1)); // initial states fetch

    // Tap Bihar
    await tester.tap(find.text('Bihar'));
    await tester.pumpAndSettle();

    // 2. District Step
    expect(find.text('Select District (ज़िला)'), findsOneWidget);
    expect(find.text('Patna'), findsOneWidget);
    expect(requestCount, equals(2)); // district fetch

    // Tap Patna
    await tester.tap(find.text('Patna'));
    await tester.pumpAndSettle();

    // 3. Sub-District Step
    expect(find.text('Select Tehsil / Block (प्रखंड)'), findsOneWidget);
    expect(find.text('Patna Sadar'), findsOneWidget);
    expect(requestCount, equals(3)); // subdistrict fetch

    // Tap Patna Sadar
    await tester.tap(find.text('Patna Sadar'));
    await tester.pumpAndSettle();

    // 4. Local Body Step
    expect(find.text('Select Village / Ward (ग्राम / वार्ड)'), findsOneWidget);
    expect(find.text('Kankarbagh'), findsOneWidget);
    expect(find.text('PIN: 800020'), findsOneWidget);
    expect(requestCount, equals(4)); // local body fetch

    // Tap Kankarbagh
    await tester.tap(find.text('Kankarbagh'));
    await tester.pumpAndSettle();

    // Verify selection result
    expect(selectedResult, isNotNull);
    expect(selectedResult!.stateCode, equals(10));
    expect(selectedResult!.stateName, equals('Bihar'));
    expect(selectedResult!.districtCode, equals(214));
    expect(selectedResult!.districtName, equals('Patna'));
    expect(selectedResult!.subdistrictCode, equals(1001));
    expect(selectedResult!.subdistrictName, equals('Patna Sadar'));
    expect(selectedResult!.localBodyCode, equals(5001));
    expect(selectedResult!.localBodyName, equals('Kankarbagh'));
    expect(selectedResult!.pincode, equals('800020'));
    expect(selectedResult!.displayName, equals('Kankarbagh, Patna'));
  });

  testWidgets('LgdCascadingSheet uses in-memory cache on subsequent mounts', (tester) async {
    int requestCount = 0;

    final mockClient = MockClient((request) async {
      requestCount++;
      return http.Response(
        jsonEncode([
          {'state_code': 10, 'state_name': 'Bihar'},
        ]),
        200,
        headers: {'content-type': 'application/json'},
      );
    });

    final apiClient = ApiClient(client: mockClient, deviceIdService: deviceIdService);

    // First mount
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: LgdCascadingSheet(
            apiClient: apiClient,
            onSelected: (_) {},
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(requestCount, equals(1));

    // Second mount in new widget hierarchy
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: LgdCascadingSheet(
            apiClient: apiClient,
            onSelected: (_) {},
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // requestCount should STILL be 1 because states were cached in memory!
    expect(requestCount, equals(1));
  });
}
