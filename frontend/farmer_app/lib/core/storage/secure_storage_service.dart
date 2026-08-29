// =========================================================
// Phase 29: Secure Token Storage Wrapper
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  // ── Token Operations ──────────────────────────────────
  static Future<void> saveToken(String token) async =>
      _storage.write(key: AppConstants.tokenKey, value: token);

  static Future<String?> getToken() async =>
      _storage.read(key: AppConstants.tokenKey);

  static Future<void> saveRefreshToken(String token) async =>
      _storage.write(key: AppConstants.refreshKey, value: token);

  static Future<String?> getRefreshToken() async =>
      _storage.read(key: AppConstants.refreshKey);

  static Future<void> saveUserId(String id) async =>
      _storage.write(key: AppConstants.userIdKey, value: id);

  static Future<String?> getUserId() async =>
      _storage.read(key: AppConstants.userIdKey);

  // ── Clear All ─────────────────────────────────────────
  static Future<void> clearAll() async => _storage.deleteAll();
}
