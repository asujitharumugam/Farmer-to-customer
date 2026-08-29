// =========================================================
// Phase 28: Order & Delivery Lifecycle Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

class OrderItemModel {
  final String productId;
  final String title;
  final int quantity;
  final double pricePerUnit;
  final String unit;
  final double totalPrice;

  OrderItemModel({
    required this.productId,
    required this.title,
    required this.quantity,
    required this.pricePerUnit,
    required this.unit,
    required this.totalPrice,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      productId: json['product'] is Map ? json['product']['_id'] : json['product'] ?? '',
      title: json['title'] ?? (json['product'] is Map ? json['product']['title'] : 'Produce Item'),
      quantity: json['quantity'] ?? 1,
      pricePerUnit: (json['pricePerUnit'] as num?)?.toDouble() ?? 0.0,
      unit: json['unit'] ?? 'kg',
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class OrderModel {
  final String id;
  final String orderNumber;
  final List<OrderItemModel> items;
  final String deliveryMethod;
  final String orderStatus;
  final double totalAmount;
  final String paymentMethod;
  final String paymentStatus;
  final DateTime createdAt;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.items,
    required this.deliveryMethod,
    required this.orderStatus,
    required this.totalAmount,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.createdAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    var rawItems = json['items'] as List? ?? [];
    List<OrderItemModel> itemList = rawItems.map((i) => OrderItemModel.fromJson(i)).toList();
    final paymentInfo = json['paymentInfo'] is Map ? json['paymentInfo'] : {};

    return OrderModel(
      id: json['_id'] ?? '',
      orderNumber: json['orderNumber'] ?? 'ORD-000000',
      items: itemList,
      deliveryMethod: json['deliveryMethod'] ?? 'home_delivery',
      orderStatus: json['orderStatus'] ?? 'pending',
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      paymentMethod: paymentInfo['method'] ?? 'cod',
      paymentStatus: paymentInfo['status'] ?? 'pending',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}
