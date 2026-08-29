// =========================================================
// Phase 29: Order Provider (Farmer Order Management State)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';
import '../models/order_model.dart';
import '../services/order_service.dart';

class OrderProvider extends ChangeNotifier {
  final _service = OrderService();

  List<OrderModel> _orders = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<OrderModel> get orders        => _orders;
  bool             get isLoading     => _isLoading;
  String?          get errorMessage  => _errorMessage;

  List<OrderModel> get newOrders       => _orders.where((o) => o.status == AppConstants.orderNew).toList();
  List<OrderModel> get acceptedOrders  => _orders.where((o) => o.status == AppConstants.orderAccepted).toList();
  List<OrderModel> get completedOrders => _orders.where((o) => o.status == AppConstants.orderCompleted).toList();

  int get pendingCount => newOrders.length + acceptedOrders.length;

  Future<void> loadOrders({String? status}) async {
    _isLoading = true;
    notifyListeners();
    _orders = await _service.getOrders(status: status);
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> acceptOrder(String id) async {
    return _changeStatus(id, AppConstants.orderAccepted);
  }

  Future<bool> rejectOrder(String id, String reason) async {
    final result = await _service.updateOrderStatus(id, AppConstants.orderRejected, rejectionReason: reason);
    if (result['success'] == true) {
      _removeOrder(id);
      return true;
    }
    _errorMessage = result['message'];
    notifyListeners();
    return false;
  }

  Future<bool> markPreparing(String id)       => _changeStatus(id, AppConstants.orderPreparing);
  Future<bool> markReadyForPickup(String id)  => _changeStatus(id, AppConstants.orderReadyPickup);
  Future<bool> markPickedUp(String id)        => _changeStatus(id, AppConstants.orderPickedUp);
  Future<bool> markCompleted(String id)       => _changeStatus(id, AppConstants.orderCompleted);

  Future<bool> _changeStatus(String id, String newStatus) async {
    final result = await _service.updateOrderStatus(id, newStatus);
    if (result['success'] == true) {
      final idx = _orders.indexWhere((o) => o.id == id);
      if (idx != -1) notifyListeners();
      await loadOrders();
      return true;
    }
    _errorMessage = result['message'];
    notifyListeners();
    return false;
  }

  void _removeOrder(String id) {
    _orders.removeWhere((o) => o.id == id);
    notifyListeners();
  }
}
