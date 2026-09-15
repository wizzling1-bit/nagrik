import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/theme/motion.dart';

void main() {
  group('Design QA: Motion Tokens & Micro-Interactions', () {
    test('NagrikMotion standardizes duration tokens', () {
      expect(NagrikMotion.durationInstant.inMilliseconds, 100);
      expect(NagrikMotion.durationFast.inMilliseconds, 160);
      expect(NagrikMotion.durationStandard.inMilliseconds, 220);
      expect(NagrikMotion.durationMedium.inMilliseconds, 280);
      expect(NagrikMotion.durationEmphasis.inMilliseconds, 300);
      expect(NagrikMotion.durationSlow.inMilliseconds, 400);
      expect(NagrikMotion.durationPress.inMilliseconds, 100);
      expect(NagrikMotion.durationSheet.inMilliseconds, 280);
    });

    test('NagrikMotion standardizes animation curves', () {
      expect(NagrikMotion.curveStandard, isNotNull);
      expect(NagrikMotion.curveDecelerate, isNotNull);
      expect(NagrikMotion.curveEmphasized, isNotNull);
      expect(NagrikMotion.curveSpring, isNotNull);
    });
  });
}
