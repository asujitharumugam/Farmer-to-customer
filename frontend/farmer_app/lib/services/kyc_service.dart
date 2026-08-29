// =========================================================
// Phase 29: KYC Service
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:dio/dio.dart';
import '../core/network/api_client.dart';
import '../models/kyc_model.dart';

class KycService {
  final _api = ApiClient();

  Future<KycSubmission?> getKycStatus() async {
    try {
      final res = await _api.get('/farmer/kyc');
      return KycSubmission.fromJson(res.data['kyc'] ?? res.data);
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>> submitKyc({
    required String docType,
    required String filePath,
  }) async {
    try {
      final formData = FormData.fromMap({
        'docType': docType,
        'document': await MultipartFile.fromFile(filePath),
      });
      final res = await _api.postFormData('/farmer/kyc/upload', formData);
      return {'success': true, 'message': res.data['message'] ?? 'Document uploaded'};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Upload failed'};
    }
  }

  Future<Map<String, dynamic>> submitForReview() async {
    try {
      final res = await _api.post('/farmer/kyc/submit');
      return {'success': true, 'message': res.data['message'] ?? 'KYC submitted for review'};
    } on DioException catch (e) {
      return {'success': false, 'message': e.response?.data?['message'] ?? 'Submission failed'};
    }
  }
}
