// =========================================================
// Phase 28: Shopping Cart State Provider
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../models/cart_model.dart';
import '../models/product_model.dart';

class CartProvider with ChangeNotifier {
  final List<CartItemModel> _items = [];

  List<CartItemModel> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get deliveryFee => _items.isEmpty ? 0.0 : 40.0; // ₹40 standard delivery fee

  double get grandTotal => subtotal + deliveryFee;

  void addToCart(ProductModel product) {
    final index = _items.indexWhere((item) => item.product.id == product.id);
    if (index >= 0) {
      if (_items[index].quantity < product.stockQuantity) {
        _items[index].quantity++;
      }
    } else {
      _items.add(CartItemModel(product: product, quantity: 1));
    }
    notifyListeners();
  }

  void updateQuantity(String productId, int delta) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      final newQty = _items[index].quantity + delta;
      if (newQty <= 0) {
        _items.removeAt(index);
      } else if (newQty <= _items[index].product.stockQuantity) {
        _items[index].quantity = newQty;
      }
      notifyListeners();
    }
  }

  void removeFromCart(String productId) {
    _items.removeWhere((item) => item.product.id == productId);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}
