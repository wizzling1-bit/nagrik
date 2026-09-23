import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nagrik/core/network/api_client.dart';
import 'package:nagrik/core/network/device_id_service.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/theme/color_tokens.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/presentation/screens/content_detail_screen.dart';
import 'package:nagrik/features/feed/presentation/widgets/video/nagrik_video_player.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ContentDetailScreen Editorial Redesign Tests', () {
    late SharedPreferences prefs;
    late ContentRepository repository;

    setUp(() async {
      SharedPreferences.setMockInitialValues({});
      prefs = await SharedPreferences.getInstance();
      final deviceService = DeviceIdService(prefs: prefs);
      await deviceService.setDeviceId('flutter-device-test-id');

      final client = MockClient((request) async {
        if (request.url.path.contains('/report')) {
          return http.Response(
            jsonEncode({'success': true, 'message': 'Report submitted.'}),
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
              'id': 'detail-test-1',
              'type': 'NEWS',
              'title': 'Patna Smart City Metro Phase 1',
              'description': 'The Patna Metro Rail Corporation has completed the underground tunneling.',
              'city': 'Patna',
              'area': 'Kankarbagh',
            },
          }),
          200,
        );
      });

      final apiClient = ApiClient(client: client, deviceIdService: deviceService);
      final remoteSource = ContentRemoteDataSource(apiClient: apiClient, deviceIdService: deviceService);
      repository = ContentRepository(remoteDataSource: remoteSource, prefs: prefs);
    });

    Widget buildTestWidget({
      required Post post,
      ThemeData? theme,
      EdgeInsets mediaQueryPadding = EdgeInsets.zero,
    }) {
      return ProviderScope(
        overrides: [
          contentRepositoryProvider.overrideWithValue(repository),
        ],
        child: MaterialApp(
          theme: theme ?? NagrikTheme.light(),
          home: MediaQuery(
            data: MediaQueryData(padding: mediaQueryPadding),
            child: ContentDetailScreen(
              contentId: post.id,
              initialPost: post,
            ),
          ),
        ),
      );
    }

    testWidgets('Renders editorial news layout with geofence pill, category, Newsreader headline, and verified author', (tester) async {
      final post = Post.fromJson({
        'id': 'news-post-101',
        'type': 'NEWS',
        'title': 'Patna Smart City Metro Phase 1',
        'description': 'The Patna Metro Rail Corporation has completed the underground tunneling.',
        'city': 'Patna',
        'area': 'Kankarbagh',
        'category': 'Civic',
        'mediaUrls': ['https://example.com/metro.jpg'],
        'likes': 240,
        'comments': 38,
        'author': {
          'id': 'author-1',
          'name': 'Rohan Sharma',
          'isVerified': true,
        },
      });

      await tester.pumpWidget(buildTestWidget(post: post));
      await tester.pumpAndSettle();

      // Category and Geofence tags
      expect(find.text('5KM RADIUS'), findsWidgets);
      expect(find.text('CIVIC'), findsOneWidget);

      // Dominant headline
      expect(find.text('Patna Smart City Metro Phase 1'), findsOneWidget);

      // Verified author card
      expect(find.text('Rohan Sharma'), findsOneWidget);
      expect(find.byType(VerificationBadge), findsWidgets);

      // Body copy and coverage location
      expect(find.text('The Patna Metro Rail Corporation has completed the underground tunneling.'), findsWidgets);
      expect(find.text('Kankarbagh, Patna'), findsWidgets);
    });

    testWidgets('Renders video report layout with video report title and video badge', (tester) async {
      final post = Post.fromJson({
        'id': 'video-post-202',
        'type': 'VIDEO',
        'title': 'Overpass Construction Progress Update',
        'description': 'On-site video review of the new elevated corridor.',
        'mediaUrl': 'https://example.com/corridor.mp4',
        'city': 'Patna',
        'area': 'Frazer Road',
        'category': 'Traffic',
        'likes': 88,
        'comments': 14,
        'author': {
          'id': 'author-2',
          'name': 'Priya Verma',
          'isVerified': true,
        },
      });

      await tester.pumpWidget(buildTestWidget(post: post));
      await tester.pumpAndSettle();

      // Video report title in AppBar
      expect(find.text('Video Report'), findsOneWidget);
      expect(find.text('Overpass Construction Progress Update'), findsOneWidget);
      expect(find.text('Priya Verma'), findsOneWidget);
      expect(find.byType(NagrikVideoPlayer), findsOneWidget);
    });

    testWidgets('Floating engagement bar reveals on scroll, toggles bookmark, and opens report sheet', (tester) async {
      final post = Post.fromJson({
        'id': 'engagement-post-303',
        'type': 'NEWS',
        'title': 'Monsoon Preparedness Drainage Upgrade',
        'description': 'Municipal authorities deploy suction machines across major low-lying wards. ' * 20,
        'city': 'Patna',
        'area': 'Rajendra Nagar',
        'category': 'Utilities',
        'likes': 312,
        'comments': 42,
        'isBookmarked': false,
        'author': {
          'id': 'author-3',
          'name': 'Amit Kumar',
          'isVerified': false,
        },
      });

      await tester.pumpWidget(
        buildTestWidget(
          post: post,
          mediaQueryPadding: const EdgeInsets.only(bottom: 50.0),
        ),
      );
      await tester.pumpAndSettle();

      // Scroll down by 450px to reveal the floating engagement dock
      await tester.drag(find.byType(SingleChildScrollView), const Offset(0, -450));
      await tester.pumpAndSettle();

      // Check AnimatedPositioned is visible with bottom offset
      final animatedPosFinder = find.byWidgetPredicate(
        (widget) => widget is AnimatedPositioned && widget.bottom != null && widget.bottom! > 0,
      );
      expect(animatedPosFinder, findsOneWidget);

      // Bookmark button toggle in floating bar
      final bookmarkFinder = find.byIcon(Icons.bookmark_outline_rounded);
      expect(bookmarkFinder, findsWidgets);
      await tester.tap(bookmarkFinder.last);
      await tester.pump();
      expect(find.text('Saved to bookmarks'), findsOneWidget);

      // Report / Flag icon opens ReportContentSheet
      final flagFinder = find.byIcon(Icons.flag_outlined);
      expect(flagFinder, findsWidgets);
      await tester.tap(flagFinder.last);
      await tester.pumpAndSettle();

      expect(find.text('Report Content'), findsOneWidget);
      expect(find.text('Misleading or inaccurate news'), findsOneWidget);
      expect(find.text('Submit Report'), findsOneWidget);
    });

    testWidgets('Renders properly in dark mode using dark canvas and dark verified badge', (tester) async {
      final post = Post.fromJson({
        'id': 'dark-post-404',
        'type': 'NEWS',
        'title': 'Night Market Opens Near Gandhi Maidan',
        'description': 'Street vendors and food stalls illuminate the downtown plaza.',
        'city': 'Patna',
        'area': 'Gandhi Maidan',
        'category': 'Civic',
        'likes': 155,
        'comments': 19,
        'author': {
          'id': 'author-4',
          'name': 'Sneha Roy',
          'isVerified': true,
        },
      });

      await tester.pumpWidget(
        buildTestWidget(
          post: post,
          theme: NagrikTheme.dark(),
        ),
      );
      await tester.pumpAndSettle();

      // Check scaffold background is dark
      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold).first);
      expect(scaffold.backgroundColor, NagrikDarkColors.background);

      // Verification checkmark in dark mode should use NagrikDarkColors.success
      final badgeFinder = find.byWidgetPredicate(
        (widget) => widget is Icon && widget.icon == Icons.verified && widget.color == NagrikDarkColors.success,
      );
      expect(badgeFinder, findsWidgets);
    });
  });
}
