// =========================================================
// Phase 29: Connectivity Helper
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityUtils {
  static Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result != ConnectivityResult.none;
  }

  static Stream<ConnectivityResult> get onConnectivityChanged =>
      Connectivity().onConnectivityChanged;
}
