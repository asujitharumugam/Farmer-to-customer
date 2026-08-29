// =========================================================
// Phase 28: Core API Client Network Handler
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

class ApiClient {
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConstants.keyAuthToken);
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  static Future<dynamic> get(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final url = Uri.parse('${AppConstants.apiBaseUrl}$endpoint');
      final response = await http.get(url, headers: headers).timeout(const Duration(seconds: 15));
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final url = Uri.parse('${AppConstants.apiBaseUrl}$endpoint');
      final response = await http.post(url, headers: headers, body: jsonEncode(body)).timeout(const Duration(seconds: 15));
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static dynamic _handleResponse(http.Response response) {
    final body = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      throw Exception(body['message'] ?? 'API Request Failed');
    }
  }
}
