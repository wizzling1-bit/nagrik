import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/presentation/widgets/post_author_header.dart';

void main() {
  group('PostAuthorHeader', () {
    testWidgets('renders author name, locality, timeAgo, and verification badge',
        (tester) async {
      const author = PostAuthor(
        id: '1',
        name: 'Sourav Ganguly',
        isVerified: true,
        distanceKm: 1.5,
      );

      await tester.pumpWidget(
        MaterialApp(
          theme: NagrikTheme.light(),
          home: const Scaffold(
            body: PostAuthorHeader(
              author: author,
              locality: 'Behala',
              timeAgo: '10m ago',
              categoryLabel: 'Civic',
              showDistance: true,
            ),
          ),
        ),
      );

      expect(find.text('Sourav Ganguly'), findsOneWidget);
      expect(find.text('Behala'), findsOneWidget);
      expect(find.text(' • 1.5 km away'), findsOneWidget);
      expect(find.text('Civic'), findsOneWidget);
      expect(find.byType(VerificationBadge), findsOneWidget);
    });
  });
}
