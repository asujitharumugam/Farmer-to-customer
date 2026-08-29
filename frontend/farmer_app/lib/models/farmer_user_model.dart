// =========================================================
// Phase 29: Farmer User Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class FarmerUser {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? avatar;
  final String role;
  final String kycStatus; // not_started | submitted | under_review | approved | rejected
  final String? village;
  final String? district;
  final String? state;
  final String? pinCode;
  final DateTime createdAt;

  const FarmerUser({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.avatar,
    required this.role,
    required this.kycStatus,
    this.village,
    this.district,
    this.state,
    this.pinCode,
    required this.createdAt,
  });

  factory FarmerUser.fromJson(Map<String, dynamic> json) => FarmerUser(
        id: json['_id'] ?? json['id'] ?? '',
        name: json['name'] ?? '',
        phone: json['phone'] ?? '',
        email: json['email'],
        avatar: json['avatar'],
        role: json['role'] ?? 'farmer',
        kycStatus: json['kycStatus'] ?? 'not_started',
        village: json['village'],
        district: json['district'],
        state: json['state'],
        pinCode: json['pinCode'],
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'])
            : DateTime.now(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'email': email,
        'avatar': avatar,
        'role': role,
        'kycStatus': kycStatus,
        'village': village,
        'district': district,
        'state': state,
        'pinCode': pinCode,
        'createdAt': createdAt.toIso8601String(),
      };

  bool get isKycApproved => kycStatus == 'approved';
  bool get isKycPending  => kycStatus == 'submitted' || kycStatus == 'under_review';
}
