// =========================================================
// Phase 29: Order Model (Farmer Perspective)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class OrderItem {
  final String produceId;
  final String title;
  final String unit;
  final double quantity;
  final double pricePerUnit;
  final double subtotal;

  const OrderItem({
    required this.produceId,
    required this.title,
    required this.unit,
    required this.quantity,
    required this.pricePerUnit,
    required this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        produceId: json['produceId'] ?? '',
        title: json['title'] ?? '',
        unit: json['unit'] ?? 'kg',
        quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
        pricePerUnit: (json['pricePerUnit'] as num?)?.toDouble() ?? 0.0,
        subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      );
}

class CustomerInfo {
  // Only expose what is needed for fulfilment
  final String displayName;
  final String? maskedPhone; // e.g. +91 98765 XXXXX
  final String deliveryType; // home_delivery | farm_pickup
  final String? deliveryAddress;

  const CustomerInfo({
    required this.displayName,
    this.maskedPhone,
    required this.deliveryType,
    this.deliveryAddress,
  });

  factory CustomerInfo.fromJson(Map<String, dynamic> json) => CustomerInfo(
        displayName: json['displayName'] ?? 'Customer',
        maskedPhone: json['maskedPhone'],
        deliveryType: json['deliveryType'] ?? 'home_delivery',
        deliveryAddress: json['deliveryAddress'],
      );
}

class OrderModel {
  final String id;
  final String orderNumber;
  final CustomerInfo customer;
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String status;
  final String paymentMethod;
  final String paymentStatus;
  final DateTime createdAt;
  final DateTime? acceptedAt;
  final DateTime? completedAt;
  final String? rejectionReason;
  final String? specialInstructions;

  const OrderModel({
    required this.id,
    required this.orderNumber,
    required this.customer,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.status,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.createdAt,
    this.acceptedAt,
    this.completedAt,
    this.rejectionReason,
    this.specialInstructions,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) => OrderModel(
        id: json['_id'] ?? json['id'] ?? '',
        orderNumber: json['orderNumber'] ?? '',
        customer: CustomerInfo.fromJson(json['customer'] ?? {}),
        items: (json['items'] as List<dynamic>? ?? [])
            .map((e) => OrderItem.fromJson(e))
            .toList(),
        subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
        deliveryFee: (json['deliveryFee'] as num?)?.toDouble() ?? 0.0,
        total: (json['total'] as num?)?.toDouble() ?? 0.0,
        status: json['status'] ?? 'new',
        paymentMethod: json['paymentMethod'] ?? 'cod',
        paymentStatus: json['paymentStatus'] ?? 'pending',
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'])
            : DateTime.now(),
        acceptedAt: json['acceptedAt'] != null ? DateTime.parse(json['acceptedAt']) : null,
        completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt']) : null,
        rejectionReason: json['rejectionReason'],
        specialInstructions: json['specialInstructions'],
      );

  bool get isNew       => status == 'new';
  bool get isAccepted  => status == 'accepted';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
}
