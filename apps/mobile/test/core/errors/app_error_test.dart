import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/core/errors/app_error.dart';

void main() {
  group('AppError', () {
    test('NetworkError has default message', () {
      const error = NetworkError();
      expect(error.message, 'Network connection failed');
    });

    test('ValidationError requires a message', () {
      const error = ValidationError(message: 'Name is required');
      expect(error.message, 'Name is required');
    });

    test('sealed class supports exhaustive switch', () {
      const AppError error = NotFoundError();
      final result = switch (error) {
        NetworkError() => 'network',
        UnauthorizedError() => 'unauth',
        ValidationError() => 'validation',
        NotFoundError() => 'not_found',
        UploadError() => 'upload',
        LocationError() => 'location',
        UnknownError() => 'unknown',
      };
      expect(result, 'not_found');
    });

    test('toString includes type and message', () {
      const error = NetworkError();
      expect(error.toString(), 'NetworkError: Network connection failed');
    });
  });
}
