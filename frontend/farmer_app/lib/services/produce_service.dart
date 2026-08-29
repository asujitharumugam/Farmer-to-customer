// =========================================================
// Phase 29: Produce / Product Service
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:dio/dio.dart';
import '../core/network/api_client.dart';
import '../models/produce_model.dart';

class ProduceService {
  final _api = ApiClient();

  Future<List<ProduceModel>> getMyProduce() async {
    try {
      final res = await _api.get('/farmer/products');
      final list = res.data['products'] as List<dynamic>? ?? [];
      return list.map((e) => ProduceModel.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<Map<String, dynamic>> addProduce(Map<String, dynamic> payload) async {
    try {
      final res = await _api.post('/farmer/products', data: payload);
      return {'success': true, 'product': ProduceModel.fromJson(res.data['product'] ?? {})};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Failed to add product'};
    }
  }

  Future<Map<String, dynamic>> updateProduce(String id, Map<String, dynamic> payload) async {
    try {
      final res = await _api.put('/farmer/products/$id', data: payload);
      return {'success': true, 'product': ProduceModel.fromJson(res.data['product'] ?? {})};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Update failed'};
    }
  }

  Future<bool> deleteProduce(String id) async {
    try {
      await _api.delete('/farmer/products/$id');
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> toggleActive(String id, bool isActive) async {
    try {
      await _api.patch('/farmer/products/$id/toggle', data: {'isActive': isActive});
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> adjustStock(String id, double qty) async {
    try {
      await _api.patch('/farmer/products/$id/stock', data: {'adjustment': qty});
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>> uploadImages(String id, List<String> filePaths) async {
    try {
      final formData = FormData.fromMap({
        'images': [
          for (final path in filePaths)
            await MultipartFile.fromFile(path),
        ],
      });
      final res = await _api.postFormData('/farmer/products/$id/images', formData);
      return {'success': true, 'urls': res.data['urls']};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Upload failed'};
    }
  }
}
