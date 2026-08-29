// =========================================================
// Phase 29: Order Service (Farmer Perspective)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:dio/dio.dart';
import '../core/network/api_client.dart';
import '../models/order_model.dart';

class OrderService {
  final _api = ApiClient();

  Future<List<OrderModel>> getOrders({String? status, int page = 1}) async {
    try {
      final res = await _api.get('/farmer/orders', params: {
        if (status != null) 'status': status,
        'page': page,
        'limit': 20,
      });
      final list = res.data['orders'] as List<dynamic>? ?? [];
      return list.map((e) => OrderModel.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<OrderModel?> getOrderById(String id) async {
    try {
      final res = await _api.get('/farmer/orders/$id');
      return OrderModel.fromJson(res.data['order'] ?? {});
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>> updateOrderStatus(
      String id, String status, {String? rejectionReason}) async {
    try {
      await _api.patch('/farmer/orders/$id/status', data: {
        'status': status,
        if (rejectionReason != null) 'rejectionReason': rejectionReason,
      });
      return {'success': true};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Update failed'};
    }
  }
}
