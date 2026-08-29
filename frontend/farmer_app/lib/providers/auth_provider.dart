// =========================================================
// Phase 29: Authentication Provider
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../models/farmer_user_model.dart';
import '../services/auth_service.dart';
import '../core/storage/secure_storage_service.dart';

class AuthProvider extends ChangeNotifier {
  final _authService = AuthService();

  FarmerUser? _user;
  bool _isLoading = false;
  String? _errorMessage;

  FarmerUser? get user          => _user;
  bool        get isLoading     => _isLoading;
  String?     get errorMessage  => _errorMessage;
  bool        get isLoggedIn    => _user != null;
  bool        get isKycApproved => _user?.isKycApproved ?? false;

  // ── Check existing session on app start ───────────────
  Future<bool> checkSession() async {
    final token = await SecureStorageService.getToken();
    if (token == null) return false;
    _isLoading = true;
    notifyListeners();
    _user = await _authService.getMe();
    _isLoading = false;
    notifyListeners();
    return _user != null;
  }

  // ── Login ─────────────────────────────────────────────
  Future<bool> login(String phone, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final result = await _authService.login(phone: phone, password: password);
    _isLoading = false;

    if (result['success'] == true) {
      _user = result['user'] as FarmerUser;
      notifyListeners();
      return true;
    }
    _errorMessage = result['message'] as String?;
    notifyListeners();
    return false;
  }

  // ── Register ──────────────────────────────────────────
  Future<bool> register({
    required String name,
    required String phone,
    required String password,
    required String village,
    required String district,
    required String state,
    required String pinCode,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final result = await _authService.register(
      name: name,
      phone: phone,
      password: password,
      village: village,
      district: district,
      state: state,
      pinCode: pinCode,
    );
    _isLoading = false;

    if (result['success'] == true) {
      _user = result['user'] as FarmerUser;
      notifyListeners();
      return true;
    }
    _errorMessage = result['message'] as String?;
    notifyListeners();
    return false;
  }

  // ── Logout ────────────────────────────────────────────
  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
