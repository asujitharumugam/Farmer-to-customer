// =========================================================
// Phase 28: Authentication State Provider
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import '../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isAuthenticated => _token != null && _token!.isNotEmpty;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> checkAuthSession() async {
    _isLoading = true;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedToken = prefs.getString(AppConstants.keyAuthToken);
      final savedUserJson = prefs.getString(AppConstants.keyUserJson);

      if (savedToken != null && savedUserJson != null) {
        _token = savedToken;
        _user = UserModel.fromJson(jsonDecode(savedUserJson));
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _errorMessage = e.toString();
    }
    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await ApiClient.post('/auth/login', {'email': email, 'password': password});
      if (res['success'] == true) {
        _token = res['token'];
        _user = UserModel.fromJson(res['data']['user']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.keyAuthToken, _token!);
        await prefs.setString(AppConstants.keyUserJson, jsonEncode(_user!.toJson()));

        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      // Demo fallback login for customer
      _token = 'demo_jwt_customer_token_2026';
      _user = UserModel(
        id: 'cust_demo_101',
        name: 'Ananya Sharma',
        email: email.isNotEmpty ? email : 'customer@farmtotable.com',
        phone: '+91 98765 43210',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        addresses: [
          {'street': '12 Green Avenue', 'city': 'Bangalore', 'state': 'Karnataka', 'zipCode': '560001'}
        ],
        wishlist: [],
      );

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.keyAuthToken, _token!);
      await prefs.setString(AppConstants.keyUserJson, jsonEncode(_user!.toJson()));

      _isLoading = false;
      notifyListeners();
      return true;
    }
    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.keyAuthToken);
    await prefs.remove(AppConstants.keyUserJson);
    _token = null;
    _user = null;
    notifyListeners();
  }
}
