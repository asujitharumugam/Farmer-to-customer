// =========================================================
// Phase 28: User Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String avatar;
  final List<dynamic> addresses;
  final List<dynamic> wishlist;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.avatar,
    required this.addresses,
    required this.wishlist,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'customer',
      avatar: json['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      addresses: json['addresses'] ?? [],
      wishlist: json['wishlist'] ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'avatar': avatar,
      'addresses': addresses,
      'wishlist': wishlist,
    };
  }
}
