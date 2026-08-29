// =========================================================
// Phase 29: Produce Provider (Product Management State)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../models/produce_model.dart';
import '../services/produce_service.dart';

class ProduceProvider extends ChangeNotifier {
  final _service = ProduceService();

  List<ProduceModel> _products = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<ProduceModel> get products         => _products;
  bool               get isLoading        => _isLoading;
  String?            get errorMessage     => _errorMessage;
  List<ProduceModel> get activeProducts   => _products.where((p) => p.isActive).toList();
  List<ProduceModel> get lowStockProducts => _products.where((p) => p.isLowStock).toList();
  List<ProduceModel> get outOfStock       => _products.where((p) => p.isOutOfStock).toList();

  Future<void> loadProducts() async {
    _isLoading = true;
    notifyListeners();
    _products = await _service.getMyProduce();
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> addProduct(Map<String, dynamic> payload) async {
    final result = await _service.addProduce(payload);
    if (result['success'] == true) {
      _products.insert(0, result['product'] as ProduceModel);
      notifyListeners();
      return true;
    }
    _errorMessage = result['message'];
    notifyListeners();
    return false;
  }

  Future<bool> updateProduct(String id, Map<String, dynamic> payload) async {
    final result = await _service.updateProduce(id, payload);
    if (result['success'] == true) {
      final idx = _products.indexWhere((p) => p.id == id);
      if (idx != -1) _products[idx] = result['product'] as ProduceModel;
      notifyListeners();
      return true;
    }
    _errorMessage = result['message'];
    notifyListeners();
    return false;
  }

  Future<bool> deleteProduct(String id) async {
    final ok = await _service.deleteProduce(id);
    if (ok) {
      _products.removeWhere((p) => p.id == id);
      notifyListeners();
    }
    return ok;
  }

  Future<void> toggleActive(String id, bool isActive) async {
    await _service.toggleActive(id, isActive);
    final idx = _products.indexWhere((p) => p.id == id);
    if (idx != -1) {
      // Optimistic UI update - reload will confirm from backend
      await loadProducts();
    }
  }

  Future<void> adjustStock(String id, double delta) async {
    await _service.adjustStock(id, delta);
    await loadProducts();
  }
}
