// =========================================================
// Phase 29: App Theme (Light + Dark)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';

class AppTheme {
  // ── Light Theme ───────────────────────────────────────
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppConstants.primaryGreen,
          primary: AppConstants.primaryGreen,
          secondary: AppConstants.accentAmber,
          background: AppConstants.backgroundLight,
        ),
        scaffoldBackgroundColor: AppConstants.backgroundLight,
        fontFamily: 'Outfit',
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          scrolledUnderElevation: 1,
          iconTheme: IconThemeData(color: AppConstants.textDark),
          titleTextStyle: TextStyle(
            color: AppConstants.textDark,
            fontSize: 18,
            fontWeight: FontWeight.bold,
            fontFamily: 'Outfit',
          ),
        ),
        cardTheme: CardTheme(
          elevation: 2,
          shadowColor: Colors.black.withOpacity(0.06),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: Colors.white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppConstants.primaryGreen,
            foregroundColor: Colors.white,
            elevation: 2,
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: AppConstants.primaryGreen,
            side: const BorderSide(color: AppConstants.primaryGreen),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade200),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: AppConstants.primaryGreen, width: 2),
          ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Colors.white,
          selectedItemColor: AppConstants.primaryGreen,
          unselectedItemColor: AppConstants.textMuted,
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        chipTheme: ChipThemeData(
          backgroundColor: AppConstants.backgroundLight,
          selectedColor: AppConstants.primaryGreen.withOpacity(0.15),
          labelStyle: const TextStyle(fontSize: 12, fontFamily: 'Outfit'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );

  // ── Dark Theme ────────────────────────────────────────
  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppConstants.primaryGreen,
          brightness: Brightness.dark,
          primary: AppConstants.lightGreen,
          secondary: AppConstants.accentAmber,
          background: AppConstants.backgroundDark,
        ),
        scaffoldBackgroundColor: AppConstants.backgroundDark,
        fontFamily: 'Outfit',
        appBarTheme: AppBarTheme(
          backgroundColor: AppConstants.cardDark,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
          titleTextStyle: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
            fontFamily: 'Outfit',
          ),
        ),
        cardTheme: CardTheme(
          color: AppConstants.cardDark,
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppConstants.lightGreen,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
          ),
        ),
      );
}
