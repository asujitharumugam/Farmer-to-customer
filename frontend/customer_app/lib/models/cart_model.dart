// =========================================================
// Phase 28: Cart Item Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'product_model.dart';

class CartItemModel {
  final ProductModel product;
  int quantity;

  CartItemModel({
    required this.product,
    this.quantity = 1,
  });

  double get totalPrice => product.pricePerUnit * quantity;

  Map<String, dynamic> toJson() {
    return {
      'product': product.id,
      'quantity': quantity,
      'pricePerUnit': product.pricePerUnit,
      'unit': product.unit,
      'totalPrice': totalPrice,
    };
  }
}
