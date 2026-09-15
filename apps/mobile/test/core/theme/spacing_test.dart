import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/radii.dart';
import 'package:nagrik/core/theme/spacing.dart';

void main() {
  group('NagrikSpacing', () {
    test('follows 4dp base unit scale', () {
      expect(NagrikSpacing.space1, 4.0);
      expect(NagrikSpacing.space2, 8.0);
      expect(NagrikSpacing.space3, 12.0);
      expect(NagrikSpacing.space4, 16.0);
      expect(NagrikSpacing.space5, 20.0);
      expect(NagrikSpacing.space6, 24.0);
      expect(NagrikSpacing.space7, 32.0);
      expect(NagrikSpacing.space8, 40.0);
      expect(NagrikSpacing.space9, 48.0);
      expect(NagrikSpacing.space10, 64.0);
    });

    test('screenPadding is 16-20 range', () {
      expect(NagrikSpacing.screenPadding, 16.0);
    });

    test('sectionSpacing is 24-32 range', () {
      expect(NagrikSpacing.sectionSpacing, 24.0);
    });
  });

  group('NagrikRadii', () {
    test('follows restrained radius system', () {
      expect(NagrikRadii.xs, 4.0);
      expect(NagrikRadii.sm, 8.0);
      expect(NagrikRadii.md, 12.0);
      expect(NagrikRadii.lg, 16.0);
      expect(NagrikRadii.xl, 20.0);
    });
  });
}
