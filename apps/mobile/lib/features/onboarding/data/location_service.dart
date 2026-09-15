import 'dart:math' as math;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';

/// Result of attempting to detect and match device location against supported API locations.
sealed class LocationDetectionResult {
  const LocationDetectionResult();
}

class LocationDetectionSuccess extends LocationDetectionResult {
  const LocationDetectionSuccess({
    required this.location,
    required this.distanceKm,
  });

  final LocationModel location;
  final double distanceKm;
}

class LocationPermissionDenied extends LocationDetectionResult {
  const LocationPermissionDenied({required this.isPermanent});
  final bool isPermanent;
}

class LocationServiceDisabled extends LocationDetectionResult {
  const LocationServiceDisabled();
}

class LocationDetectionFailure extends LocationDetectionResult {
  const LocationDetectionFailure(this.message);
  final String message;
}

/// Service handling device GPS, permission states, and Haversine matching
/// strictly against supported locations returned by GET /content/locations.
class LocationService {
  const LocationService();

  /// Known coordinates for Indian cities used when backend coordinates are null.
  static const Map<String, (double, double)> _cityCoordinateFallbacks = {
    'patna': (25.5941, 85.1376),
    'gaya': (24.7914, 85.0002),
    'kolkata': (22.5726, 88.3639),
    'mumbai': (19.0760, 72.8777),
    'bengaluru': (12.9716, 77.5946),
    'new delhi': (28.6139, 77.2090),
    'delhi': (28.6139, 77.2090),
    'ranchi': (23.3441, 85.3096),
    'hyderabad': (17.3850, 78.4867),
    'chennai': (13.0827, 80.2707),
    'lucknow': (26.8467, 80.9462),
    'varanasi': (25.3176, 82.9739),
  };

  /// Requests permission, acquires device position, and matches against supported locations.
  Future<LocationDetectionResult> detectAndMatchLocation({
    required List<LocationModel> supportedLocations,
  }) async {
    if (supportedLocations.isEmpty) {
      return const LocationDetectionFailure('No supported locations available from API.');
    }

    // 1. Check if location services are enabled on device
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return const LocationServiceDisabled();
    }

    // 2. Check and request location permission
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return const LocationPermissionDenied(isPermanent: false);
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return const LocationPermissionDenied(isPermanent: true);
    }

    // 3. Acquire current device position
    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.medium,
          timeLimit: Duration(seconds: 8),
        ),
      );

      // 4. Match against supported locations via Haversine spherical distance
      return matchCoordinatesToSupportedLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        supportedLocations: supportedLocations,
      );
    } catch (e) {
      return LocationDetectionFailure('Unable to acquire device coordinates: $e');
    }
  }

  /// Calculates the closest supported location to the given GPS coordinates.
  LocationDetectionResult matchCoordinatesToSupportedLocation({
    required double latitude,
    required double longitude,
    required List<LocationModel> supportedLocations,
  }) {
    if (supportedLocations.isEmpty) {
      return const LocationDetectionFailure('Supported locations list is empty.');
    }

    LocationModel? closestLocation;
    double minDistanceKm = double.infinity;

    for (final loc in supportedLocations) {
      final coords = _getCoordinatesForLocation(loc);
      if (coords == null) continue;

      final distance = _calculateHaversineDistanceKm(
        lat1: latitude,
        lon1: longitude,
        lat2: coords.$1,
        lon2: coords.$2,
      );

      if (distance < minDistanceKm) {
        minDistanceKm = distance;
        closestLocation = loc;
      }
    }

    if (closestLocation != null) {
      return LocationDetectionSuccess(
        location: closestLocation,
        distanceKm: minDistanceKm,
      );
    }

    // Default to the first supported location if no coordinates could be calculated
    return LocationDetectionSuccess(
      location: supportedLocations.first,
      distanceKm: 0.0,
    );
  }

  (double, double)? _getCoordinatesForLocation(LocationModel loc) {
    if (loc.coordinates != null) {
      return (loc.coordinates!.latitude, loc.coordinates!.longitude);
    }

    final cityKey = loc.city.trim().toLowerCase();
    return _cityCoordinateFallbacks[cityKey];
  }

  /// Haversine spherical formula for great-circle distance between two points in km.
  static double _calculateHaversineDistanceKm({
    required double lat1,
    required double lon1,
    required double lat2,
    required double lon2,
  }) {
    const earthRadiusKm = 6371.0;
    final dLat = _degToRad(lat2 - lat1);
    final dLon = _degToRad(lon2 - lon1);

    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_degToRad(lat1)) *
            math.cos(_degToRad(lat2)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);

    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  static double _degToRad(double deg) => deg * (math.pi / 180.0);
}

final locationServiceProvider = Provider<LocationService>((ref) {
  return const LocationService();
});
