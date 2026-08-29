// =========================================================
// Phase 28: Farmer & Farm Profile Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

class FarmerModel {
  final String id;
  final String farmName;
  final String story;
  final String locationAddress;
  final String city;
  final String state;
  final String verificationStatus;
  final double ratingAverage;
  final int ratingCount;
  final String farmerName;
  final String farmerAvatar;
  final String farmerPhone;

  FarmerModel({
    required this.id,
    required this.farmName,
    required this.story,
    required this.locationAddress,
    required this.city,
    required this.state,
    required this.verificationStatus,
    required this.ratingAverage,
    required this.ratingCount,
    required this.farmerName,
    required this.farmerAvatar,
    required this.farmerPhone,
  });

  factory FarmerModel.fromJson(Map<String, dynamic> json) {
    final user = json['user'] is Map ? json['user'] : {};
    final location = json['location'] is Map ? json['location'] : {};

    return FarmerModel(
      id: json['_id'] ?? '',
      farmName: json['farmName'] ?? 'Organic Family Farm',
      story: json['story'] ?? 'Dedicated to sustainable chemical-free agriculture.',
      locationAddress: location['address'] ?? 'Farm Road',
      city: location['city'] ?? 'Greenfield',
      state: location['state'] ?? 'State',
      verificationStatus: json['verificationStatus'] ?? 'approved',
      ratingAverage: (json['ratingAverage'] as num?)?.toDouble() ?? 4.8,
      ratingCount: json['ratingCount'] ?? 24,
      farmerName: user['name'] ?? 'Local Farmer',
      farmerAvatar: user['avatar'] ?? 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
      farmerPhone: user['phone'] ?? '',
    );
  }
}
