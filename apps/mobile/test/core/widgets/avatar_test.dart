import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/app_theme.dart';
import 'package:nagrik/core/widgets/nagrik_avatar.dart';
import 'package:nagrik/core/widgets/verification_badge.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: NagrikTheme.light(),
      home: Scaffold(body: Center(child: child)),
    );
  }

  group('NagrikAvatar', () {
    testWidgets('renders with initials fallback', (tester) async {
      await tester.pumpWidget(buildApp(
        const NagrikAvatar(name: 'Arun Kumar'),
      ));

      expect(find.text('AK'), findsOneWidget);
    });

    testWidgets('renders correct size for each token', (tester) async {
      await tester.pumpWidget(buildApp(
        const NagrikAvatar(
          name: 'Test',
          size: NagrikAvatarSize.lg,
        ),
      ));

      final size = tester.getSize(find.byType(NagrikAvatar));
      expect(size.width, 56.0);
      expect(size.height, 56.0);
    });
  });

  group('VerificationBadge', () {
    testWidgets('renders checkmark icon', (tester) async {
      await tester.pumpWidget(buildApp(
        const VerificationBadge(),
      ));

      expect(find.byIcon(Icons.verified), findsOneWidget);
    });

    testWidgets('renders with text label when provided', (tester) async {
      await tester.pumpWidget(buildApp(
        const VerificationBadge(label: 'Verified'),
      ));

      expect(find.text('Verified'), findsOneWidget);
    });
  });
}
