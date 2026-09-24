import 'package:nagrik/features/onboarding/domain/models/location_item.dart';

/// API Data Transfer Objects (DTOs) adhering strictly to APIs.md contract.

class CategoryModel {
  const CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.displayOrder = 0,
    this.status = 'ACTIVE',
  });

  final String id;
  final String name;
  final String slug;
  final int displayOrder;
  final String status;

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    final id = (json['id'] ?? json['_id'] ?? '').toString();
    final order = (json['displayOrder'] ?? json['display_order']) as num?;
    return CategoryModel(
      id: id,
      name: (json['name'] ?? '').toString(),
      slug: (json['slug'] ?? '').toString(),
      displayOrder: order?.toInt() ?? 0,
      status: (json['status'] ?? 'ACTIVE').toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'slug': slug,
    'displayOrder': displayOrder,
    'status': status,
  };
}

class LocationCoordinates {
  const LocationCoordinates({
    required this.latitude,
    required this.longitude,
  });

  final double latitude;
  final double longitude;

  factory LocationCoordinates.fromJson(Map<String, dynamic> json) {
    return LocationCoordinates(
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
    'latitude': latitude,
    'longitude': longitude,
  };
}

class LocationModel {
  const LocationModel({
    required this.country,
    required this.state,
    required this.city,
    required this.area,
    this.coordinates,
  });

  final String country;
  final String state;
  final String city;
  final String area;
  final LocationCoordinates? coordinates;

  String get displayName => area.isNotEmpty ? '$area, $city' : '$city, $state';
  String get fullAddress => area.isNotEmpty ? '$area, $city, $state, $country' : '$city, $state, $country';

  factory LocationModel.fromJson(Map<String, dynamic> json) {
    final coordJson = json['coordinates'];
    return LocationModel(
      country: (json['country'] ?? 'India').toString(),
      state: (json['state'] ?? '').toString(),
      city: (json['city'] ?? '').toString(),
      area: (json['area'] ?? json['locality'] ?? '').toString(),
      coordinates: coordJson is Map<String, dynamic>
          ? LocationCoordinates.fromJson(coordJson)
          : null,
    );
  }

  LocationItem toLocationItem({bool isCurrentLocation = false}) {
    String slug(String s) => s
        .trim()
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9]+'), '_')
        .replaceAll(RegExp(r'_+'), '_')
        .replaceAll(RegExp(r'^_|_$'), '');
    return LocationItem(
      id: 'loc_${slug(state)}_${slug(city)}_${slug(area)}',
      locality: area,
      city: city,
      district: city,
      state: state,
      isCurrentLocation: isCurrentLocation,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    );
  }

  Map<String, dynamic> toJson() => {
    'country': country,
    'state': state,
    'city': city,
    'area': area,
    if (coordinates != null) 'coordinates': coordinates!.toJson(),
  };
}

class ReportRequest {
  const ReportRequest({
    required this.reason,
    required this.deviceId,
  });

  final String reason;
  final String deviceId;

  Map<String, dynamic> toJson() => {
    'reason': reason,
    'deviceId': deviceId,
  };
}

class ReportResponse {
  const ReportResponse({
    required this.success,
    required this.message,
  });

  final bool success;
  final String message;

  factory ReportResponse.fromJson(Map<String, dynamic> json) {
    return ReportResponse(
      success: json['success'] == true,
      message: (json['message'] ?? '').toString(),
    );
  }
}

class ViewRegistrationRequest {
  const ViewRegistrationRequest({
    required this.videoId,
    required this.deviceId,
  });

  final String videoId;
  final String deviceId;

  Map<String, dynamic> toJson() => {
    'videoId': videoId,
    'deviceId': deviceId,
  };
}

class ViewRegistrationResponse {
  const ViewRegistrationResponse({
    required this.success,
    required this.isEligibleView,
    required this.currentCountedViews,
    required this.totalViews,
    required this.eligibleViews,
  });

  final bool success;
  final bool isEligibleView;
  final int currentCountedViews;
  final int totalViews;
  final int eligibleViews;

  factory ViewRegistrationResponse.fromJson(Map<String, dynamic> json) {
    return ViewRegistrationResponse(
      success: json['success'] == true,
      isEligibleView: json['isEligibleView'] == true ||
          json['counted_as_monetized'] == true,
      currentCountedViews: ((json['currentCountedViews'] ??
              json['counted_views_for_viewer']) as num?)
              ?.toInt() ??
          0,
      totalViews: (json['totalViews'] as num?)?.toInt() ?? 0,
      eligibleViews: (json['eligibleViews'] as num?)?.toInt() ?? 0,
    );
  }
}

class FeedPagination {
  const FeedPagination({
    this.page = 1,
    this.limit = 20,
    this.totalItems = 0,
    this.totalPages = 1,
  });

  final int page;
  final int limit;
  final int totalItems;
  final int totalPages;

  factory FeedPagination.fromJson(Map<String, dynamic> json) {
    return FeedPagination(
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 20,
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      totalPages: (json['totalPages'] as num?)?.toInt() ?? 1,
    );
  }
}
