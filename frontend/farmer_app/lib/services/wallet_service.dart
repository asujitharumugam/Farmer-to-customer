// =========================================================
// Phase 29: Wallet & Settlement Service
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import '../core/network/api_client.dart';
import '../models/settlement_model.dart';

class WalletService {
  final _api = ApiClient();

  Future<WalletSummary?> getWalletSummary() async {
    try {
      final res = await _api.get('/farmer/wallet');
      return WalletSummary.fromJson(res.data);
    } catch (_) {
      return null;
    }
  }

  Future<List<Settlement>> getSettlements({int page = 1}) async {
    try {
      final res = await _api.get('/farmer/settlements', params: {'page': page, 'limit': 20});
      final list = res.data['settlements'] as List<dynamic>? ?? [];
      return list.map((e) => Settlement.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }
}
