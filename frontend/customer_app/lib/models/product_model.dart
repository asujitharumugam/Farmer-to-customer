// =========================================================
// Phase 28: Product & Produce Item Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

class ProductModel {
  final String id;
  final String title;
  final String description;
  final double pricePerUnit;
  final String unit;
  final int stockQuantity;
  final DateTime harvestDate;
  final bool isOrganic;
  final List<String> images;
  final String status;
  final String farmerId;
  final String farmName;
  final double farmRating;

  ProductModel({
    required this.id,
    required this.title,
    required this.description,
    required this.pricePerUnit,
    required this.unit,
    required this.stockQuantity,
    required this.harvestDate,
    required this.isOrganic,
    required this.images,
    required this.status,
    required this.farmerId,
    required this.farmName,
    required this.farmRating,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    final farm = json['farm'] is Map ? json['farm'] : {};
    final farmer = json['farmer'] is Map ? json['farmer'] : {};

    List<String> imgList = [];
    if (json['images'] is List) {
      imgList = (json['images'] as List).map((e) => e.toString()).toList();
    }
    if (imgList.isEmpty) {
      imgList.add('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80');
    }

    return ProductModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? 'Fresh Produce',
      description: json['description'] ?? '',
      pricePerUnit: (json['pricePerUnit'] as num?)?.toDouble() ?? 0.0,
      unit: json['unit'] ?? 'kg',
      stockQuantity: json['stockQuantity'] ?? 0,
      harvestDate: json['harvestDate'] != null ? DateTime.parse(json['harvestDate']) : DateTime.now(),
      isOrganic: json['isOrganic'] ?? true,
      images: imgList,
      status: json['status'] ?? 'available',
      farmerId: farmer['_id'] ?? json['farmer'] ?? '',
      farmName: farm['farmName'] ?? 'Organic Valley Farm',
      farmRating: (farm['ratingAverage'] as num?)?.toDouble() ?? 4.9,
    );
  }
}
