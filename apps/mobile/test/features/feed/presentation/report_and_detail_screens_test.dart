import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/screens/content_detail_screen.dart';
import 'package:nagrik/features/feed/presentation/widgets/report_content_sheet.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ReportContentSheet & ContentDetailScreen', () {
    late SharedPreferences prefs;
    late ContentRepository repository;

    setUp(() async {
      SharedPreferences.setMockInitialValues({});
      prefs = await SharedPreferences.getInstance();
      final deviceService = DeviceIdService(prefs: prefs);
      await deviceService.setDeviceId('flutter-device-widget-test');

      final client = MockClient((request) async {
        if (request.url.path.contains('/report')) {
          return http.Response(
            jsonEncode({'success': true, 'message': 'Report submitted for review.'}),
            200,
          );
        }
        if (request.url.path.contains('/views')) {
          return http.Response(
            jsonEncode({
              'success': true,
              'isEligibleView': true,
              'currentCountedViews': 1,
              'totalViews': 10,
              'eligibleViews': 5,
            }),
            200,
          );
        }
        return http.Response(
          jsonEncode({
            'success': true,
            'content': {
              'id': 'test-post-1',
              'type': 'VIDEO',
              'title': 'Test Headline',
              'description': 'Test story content',
              'city': 'Patna',
              'area': 'Kankarbagh',
            }
          }),
          200,
        );
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceService);
      final remoteSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceService);
      repository = ContentRepository(remoteDataSource: remoteSource, prefs: prefs);
    });

    testWidgets('ReportContentSheet renders reasons and submits report', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            contentRepositoryProvider.overrideWithValue(repository),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: const Scaffold(
              body: ReportContentSheet(
                contentId: 'test-1',
                contentTitle: 'Controversial Story',
              ),
            ),
          ),
        ),
      );

      expect(find.text('Report Content'), findsOneWidget);
      expect(find.text('Controversial Story'), findsOneWidget);
      expect(find.text('Misleading or inaccurate news'), findsOneWidget);
      expect(find.text('Submit Report'), findsOneWidget);

      await tester.tap(find.text('Submit Report'));
      await tester.pumpAndSettle();
    });

    testWidgets('ContentDetailScreen renders headline, author and body', (tester) async {
      final post = Post.fromJson({
        'id': 'test-post-1',
        'type': 'VIDEO',
        'title': 'Metro Line Construction',
        'description': 'Exciting underground tunneling underway.',
        'city': 'Patna',
        'area': 'Kankarbagh',
        'likes': 100,
      });

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            contentRepositoryProvider.overrideWithValue(repository),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: ContentDetailScreen(
              contentId: 'test-post-1',
              initialPost: post,
            ),
          ),
        ),
      );

      expect(find.text('Video Report'), findsOneWidget);
      expect(find.text('Metro Line Construction'), findsOneWidget);
      expect(find.text('Exciting underground tunneling underway.'), findsOneWidget);
      // Location appears in both the author meta row and the coverage card.
      expect(find.text('Kankarbagh, Patna'), findsWidgets);
      expect(find.byIcon(Icons.more_vert), findsOneWidget);
    });

    testWidgets('ContentDetailScreen floating engagement bar respects bottom navigation bar inset', (tester) async {
      final post = Post.fromJson({
        'id': 'test-post-1',
        'type': 'NEWS',
        'title': 'Traffic Advisory',
        'description': 'Diversions announced in Patna.',
        'city': 'Patna',
        'area': 'Kankarbagh',
        'likes': 168,
        'comments': 34,
      });

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            contentRepositoryProvider.overrideWithValue(repository),
          ],
          child: MaterialApp(
            theme: NagrikTheme.light(),
            home: MediaQuery(
              data: const MediaQueryData(
                padding: EdgeInsets.only(bottom: 48.0),
              ),
              child: ContentDetailScreen(
                contentId: 'test-post-1',
                initialPost: post,
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Scroll down to reveal floating bar (>240px)
      await tester.drag(find.byType(SingleChildScrollView), const Offset(0, -400));
      await tester.pumpAndSettle();

      final animatedPositionedFinder = find.byWidgetPredicate(
        (widget) => widget is AnimatedPositioned && widget.bottom != null && widget.bottom! > 0,
      );
      expect(animatedPositionedFinder, findsOneWidget);
      final animatedPos = tester.widget<AnimatedPositioned>(animatedPositionedFinder);
      // bottomInset (48) + 10 = 58.0
      expect(animatedPos.bottom, 58.0);
    });
  });
}

