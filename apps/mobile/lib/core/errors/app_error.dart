/// Typed application errors.
///
/// UI maps these to user-friendly messages — never expose raw exceptions.
sealed class AppError {
  const AppError({required this.message, this.cause});

  final String message;
  final Object? cause;

  @override
  String toString() => '$runtimeType: $message';
}

class NetworkError extends AppError {
  const NetworkError({
    super.message = 'Network connection failed',
    super.cause,
  });
}

class UnauthorizedError extends AppError {
  const UnauthorizedError({
    super.message = 'Authentication required',
    super.cause,
  });
}

class ValidationError extends AppError {
  const ValidationError({
    required super.message,
    super.cause,
  });
}

class NotFoundError extends AppError {
  const NotFoundError({
    super.message = 'Resource not found',
    super.cause,
  });
}

class UploadError extends AppError {
  const UploadError({
    super.message = 'Upload failed',
    super.cause,
  });
}

class LocationError extends AppError {
  const LocationError({
    super.message = 'Could not determine location',
    super.cause,
  });
}

class UnknownError extends AppError {
  const UnknownError({
    super.message = 'Something went wrong',
    super.cause,
  });
}

/// Maps any thrown object to a user-facing message. Never exposes raw
/// exceptions (SocketException, ApiException internals, status codes).
String friendlyErrorMessage(Object error, {String fallback = 'Something went wrong. Please try again.'}) {
  final mapped = mapToAppError(error, fallback: fallback);
  return mapped.message;
}

/// Maps transport/domain failures to a typed [AppError].
AppError mapToAppError(Object error, {String fallback = 'Something went wrong. Please try again.'}) {
  final text = error.toString();
  final lower = text.toLowerCase();
  if (lower.contains('socketexception') ||
      lower.contains('network unreachable') ||
      lower.contains('failed host lookup') ||
      lower.contains('connection refused') ||
      lower.contains('network connection failed')) {
    return NetworkError(cause: error);
  }
  if (lower.contains('timed out') || lower.contains('timeout')) {
    return const NetworkError(message: 'Request timed out. Please check your connection and retry.');
  }
  if (lower.contains('404') || lower.contains('not found')) {
    return NotFoundError(cause: error);
  }
  if (lower.contains('401') || lower.contains('authentication required')) {
    return UnauthorizedError(cause: error);
  }
  if (lower.contains('400') || lower.contains('invalid request')) {
    return ValidationError(message: 'That request could not be completed.', cause: error);
  }
  if (lower.contains('429') || lower.contains('too many requests')) {
    return const ValidationError(message: 'Too many requests. Please wait a moment and retry.');
  }
  if (lower.contains('500') ||
      lower.contains('502') ||
      lower.contains('503') ||
      lower.contains('504') ||
      lower.contains('service temporarily unavailable') ||
      lower.contains('server encountered')) {
    return const UnknownError(message: 'Server is busy. Please try again shortly.');
  }
  if (error is AppError) return error;
  // Strip "ApiException(status: ..., message: ...)" wrappers to the message.
  final apiMsg = RegExp(r'message:\s*(.*?)\)?\s*$').firstMatch(text);
  if (text.startsWith('ApiException') && apiMsg != null && apiMsg.group(1)!.trim().isNotEmpty) {
    return UnknownError(message: apiMsg.group(1)!.trim(), cause: error);
  }
  return UnknownError(message: fallback, cause: error);
}
