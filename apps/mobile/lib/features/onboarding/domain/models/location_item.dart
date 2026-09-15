/// Represents an Indian geographic location unit.
class LocationItem {
  const LocationItem({
    required this.id,
    required this.locality,
    required this.city,
    required this.district,
    required this.state,
    this.pincode,
    this.isCurrentLocation = false,
  });

  final String id;
  final String locality;
  final String city;
  final String district;
  final String state;
  final String? pincode;
  final bool isCurrentLocation;

  String get displayName => locality.isNotEmpty ? '$locality, $city' : '$city, $state';

  String get fullAddress {
    final parts = [
      if (locality.isNotEmpty) locality,
      if (city.isNotEmpty) city,
      if (district.isNotEmpty && district != city) district,
      if (state.isNotEmpty) state,
    ];
    final address = parts.join(', ');
    return pincode != null ? '$address - $pincode' : address;
  }

  bool matchesQuery(String query) {
    if (query.trim().isEmpty) return true;
    final q = query.trim().toLowerCase();
    return locality.toLowerCase().contains(q) ||
        city.toLowerCase().contains(q) ||
        district.toLowerCase().contains(q) ||
        state.toLowerCase().contains(q) ||
        (pincode?.contains(q) ?? false);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'locality': locality,
        'city': city,
        'district': district,
        'state': state,
        'pincode': pincode,
        'isCurrentLocation': isCurrentLocation,
      };

  factory LocationItem.fromJson(Map<String, dynamic> json) => LocationItem(
        id: json['id'] as String? ?? '',
        locality: json['locality'] as String? ?? '',
        city: json['city'] as String? ?? '',
        district: json['district'] as String? ?? '',
        state: json['state'] as String? ?? '',
        pincode: json['pincode'] as String?,
        isCurrentLocation: json['isCurrentLocation'] as bool? ?? false,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LocationItem &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
