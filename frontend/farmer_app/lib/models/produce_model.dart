// =========================================================
// Phase 29: Produce / Product Model (Farmer side)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class ProduceModel {
  final String id;
  final String farmerId;
  final String farmName;
  final String title;
  final String description;
  final String category;
  final double pricePerUnit;
  final double? promotionalPrice;
  final String unit;       // kg | g | litre | box | piece | dozen
  final double stockQty;
  final double minOrderQty;
  final double? maxOrderQty;
  final bool isOrganic;
  final bool isActive;
  final List<String> images;
  final DateTime? harvestDate;
  final DateTime? availabilityStart;
  final DateTime? availabilityEnd;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ProduceModel({
    required this.id,
    required this.farmerId,
    required this.farmName,
    required this.title,
    required this.description,
    required this.category,
    required this.pricePerUnit,
    this.promotionalPrice,
    required this.unit,
    required this.stockQty,
    required this.minOrderQty,
    this.maxOrderQty,
    required this.isOrganic,
    required this.isActive,
    required this.images,
    this.harvestDate,
    this.availabilityStart,
    this.availabilityEnd,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProduceModel.fromJson(Map<String, dynamic> json) => ProduceModel(
        id: json['_id'] ?? json['id'] ?? '',
        farmerId: json['farmerId'] ?? '',
        farmName: json['farmName'] ?? '',
        title: json['title'] ?? '',
        description: json['description'] ?? '',
        category: json['category'] ?? '',
        pricePerUnit: (json['pricePerUnit'] as num?)?.toDouble() ?? 0.0,
        promotionalPrice: (json['promotionalPrice'] as num?)?.toDouble(),
        unit: json['unit'] ?? 'kg',
        stockQty: (json['stockQty'] as num?)?.toDouble() ?? 0.0,
        minOrderQty: (json['minOrderQty'] as num?)?.toDouble() ?? 1.0,
        maxOrderQty: (json['maxOrderQty'] as num?)?.toDouble(),
        isOrganic: json['isOrganic'] ?? false,
        isActive: json['isActive'] ?? true,
        images: List<String>.from(json['images'] ?? []),
        harvestDate: json['harvestDate'] != null ? DateTime.parse(json['harvestDate']) : null,
        availabilityStart: json['availabilityStart'] != null ? DateTime.parse(json['availabilityStart']) : null,
        availabilityEnd: json['availabilityEnd'] != null ? DateTime.parse(json['availabilityEnd']) : null,
        createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
        updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
      );

  Map<String, dynamic> toJson() => {
        'title': title,
        'description': description,
        'category': category,
        'pricePerUnit': pricePerUnit,
        'promotionalPrice': promotionalPrice,
        'unit': unit,
        'stockQty': stockQty,
        'minOrderQty': minOrderQty,
        'maxOrderQty': maxOrderQty,
        'isOrganic': isOrganic,
        'isActive': isActive,
      };

  bool get isLowStock => stockQty > 0 && stockQty < 10;
  bool get isOutOfStock => stockQty <= 0;
  double get effectivePrice => promotionalPrice ?? pricePerUnit;
}
