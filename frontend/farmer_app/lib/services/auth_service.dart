// =========================================================
// Phase 29: Authentication Service
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:dio/dio.dart';
import '../core/network/api_client.dart';
import '../core/storage/secure_storage_service.dart';
import '../models/farmer_user_model.dart';

class AuthService {
  final _api = ApiClient();

  Future<Map<String, dynamic>> login({
    required String phone,
    required String password,
  }) async {
    try {
      final res = await _api.post('/auth/login', data: {
        'phone': phone,
        'password': password,
        'role': 'farmer',
      });
      final data = res.data as Map<String, dynamic>;
      await SecureStorageService.saveToken(data['token'] ?? '');
      if (data['refreshToken'] != null) {
        await SecureStorageService.saveRefreshToken(data['refreshToken']);
      }
      await SecureStorageService.saveUserId(data['user']?['_id'] ?? '');
      return {'success': true, 'user': FarmerUser.fromJson(data['user'] ?? {})};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Login failed'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String phone,
    required String password,
    required String village,
    required String district,
    required String state,
    required String pinCode,
  }) async {
    try {
      final res = await _api.post('/auth/register', data: {
        'name': name,
        'phone': phone,
        'password': password,
        'role': 'farmer',
        'village': village,
        'district': district,
        'state': state,
        'pinCode': pinCode,
      });
      final data = res.data as Map<String, dynamic>;
      await SecureStorageService.saveToken(data['token'] ?? '');
      await SecureStorageService.saveUserId(data['user']?['_id'] ?? '');
      return {'success': true, 'user': FarmerUser.fromJson(data['user'] ?? {})};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Registration failed'};
    }
  }

  Future<FarmerUser?> getMe() async {
    try {
      final res = await _api.get('/auth/me');
      return FarmerUser.fromJson(res.data['user'] ?? res.data);
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {}
    await SecureStorageService.clearAll();
  }
}
