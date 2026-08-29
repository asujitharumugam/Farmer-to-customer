// =========================================================
// Phase 29: Farm Profile Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class FarmModel {
  final String id;
  final String farmerId;
  final String farmName;
  final String description;
  final String locationAddress;
  final String city;
  final String state;
  final String pinCode;
  final double? latitude;
  final double? longitude;
  final List<String> images;
  final List<String> produceCategories;
  final bool isOrganic;
  final String? certificationNumber;
  final double ratingAverage;
  final int ratingCount;
  final bool isAvailable;
  final String verificationStatus;

  const FarmModel({
    required this.id,
    required this.farmerId,
    required this.farmName,
    required this.description,
    required this.locationAddress,
    required this.city,
    required this.state,
    required this.pinCode,
    this.latitude,
    this.longitude,
    required this.images,
    required this.produceCategories,
    required this.isOrganic,
    this.certificationNumber,
    required this.ratingAverage,
    required this.ratingCount,
    required this.isAvailable,
    required this.verificationStatus,
  });

  factory FarmModel.fromJson(Map<String, dynamic> json) => FarmModel(
        id: json['_id'] ?? json['id'] ?? '',
        farmerId: json['farmerId'] ?? '',
        farmName: json['farmName'] ?? '',
        description: json['description'] ?? '',
        locationAddress: json['locationAddress'] ?? '',
        city: json['city'] ?? '',
        state: json['state'] ?? '',
        pinCode: json['pinCode'] ?? '',
        latitude: (json['latitude'] as num?)?.toDouble(),
        longitude: (json['longitude'] as num?)?.toDouble(),
        images: List<String>.from(json['images'] ?? []),
        produceCategories: List<String>.from(json['produceCategories'] ?? []),
        isOrganic: json['isOrganic'] ?? false,
        certificationNumber: json['certificationNumber'],
        ratingAverage: (json['ratingAverage'] as num?)?.toDouble() ?? 0.0,
        ratingCount: json['ratingCount'] ?? 0,
        isAvailable: json['isAvailable'] ?? true,
        verificationStatus: json['verificationStatus'] ?? 'pending',
      );

  Map<String, dynamic> toJson() => {
        'farmName': farmName,
        'description': description,
        'locationAddress': locationAddress,
        'city': city,
        'state': state,
        'pinCode': pinCode,
        'produceCategories': produceCategories,
        'isOrganic': isOrganic,
        'isAvailable': isAvailable,
      };
}
