// =========================================================
// Phase 29: Analytics Service
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import '../core/network/api_client.dart';
import '../models/analytics_model.dart';

class AnalyticsService {
  final _api = ApiClient();

  Future<AnalyticsSummary?> getSummary() async {
    try {
      final res = await _api.get('/farmer/analytics/summary');
      return AnalyticsSummary.fromJson(res.data);
    } catch (_) {
      return null;
    }
  }

  Future<List<DailySales>> getDailyBreakdown({int days = 7}) async {
    try {
      final res = await _api.get('/farmer/analytics/daily', params: {'days': days});
      final list = res.data['data'] as List<dynamic>? ?? [];
      return list.map((e) => DailySales.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }
}
