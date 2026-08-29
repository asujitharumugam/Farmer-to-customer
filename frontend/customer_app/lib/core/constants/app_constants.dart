// =========================================================
// Phase 28: App Constants & Configuration Matrix
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'Krishi Bazaar';
  static const String apiBaseUrl = 'http://10.0.2.2:5000/api/v1'; // Android emulator localhost alias
  
  // Storage Keys
  static const String keyAuthToken = 'farm_token';
  static const String keyUserJson = 'farm_user';
  static const String keyLanguage = 'selected_language';
  static const String keyThemeMode = 'theme_mode';

  // Brand Palette Colors
  static const Color primaryGreen = Color(0xFF16A34A);   // Emerald 600
  static const Color primaryDarkGreen = Color(0xFF15803D); // Emerald 700
  static const Color accentAmber = Color(0xFFD97706);    // Amber 600
  static const Color backgroundLight = Color(0xFFF8FAFC); // Slate 50
  static const Color cardSurface = Colors.white;
  static const Color textDark = Color(0xFF0F172A);      // Slate 900
  static const Color textMuted = Color(0xFF64748B);     // Slate 500

  // Supported Languages
  static const List<Map<String, String>> supportedLanguages = [
    {'code': 'en', 'name': 'English'},
    {'code': 'hi', 'name': 'हिन्दी (Hindi)'},
    {'code': 'te', 'name': 'తెలుగు (Telugu)'},
    {'code': 'ta', 'name': 'தமிழ் (Tamil)'},
    {'code': 'kn', 'name': 'ಕನ್ನಡ (Kannada)'},
    {'code': 'mr', 'name': 'मराठी (Marathi)'},
    {'code': 'gu', 'name': 'ગુજરાતી (Gujarati)'},
    {'code': 'bn', 'name': 'বাংলা (Bengali)'},
  ];
}
