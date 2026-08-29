// =========================================================
// Phase 29: App-Wide Constants
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';

class AppConstants {
  // ── Brand Colors ──────────────────────────────────────
  static const Color primaryGreen   = Color(0xFF2E7D32); // Deep farm green
  static const Color lightGreen     = Color(0xFF66BB6A);
  static const Color accentAmber    = Color(0xFFFFA000); // Harvest amber
  static const Color accentOrange   = Color(0xFFEF6C00);
  static const Color errorRed       = Color(0xFFC62828);
  static const Color warningYellow  = Color(0xFFF9A825);
  static const Color successGreen   = Color(0xFF388E3C);
  static const Color infoBlueDark   = Color(0xFF1565C0);

  // ── Surface / Background ───────────────────────────────
  static const Color backgroundLight = Color(0xFFF1F8E9);
  static const Color backgroundDark  = Color(0xFF1B2B1C);
  static const Color cardSurface     = Colors.white;
  static const Color cardDark        = Color(0xFF243325);

  // ── Text ──────────────────────────────────────────────
  static const Color textDark  = Color(0xFF1C1C1C);
  static const Color textMuted = Color(0xFF757575);
  static const Color textLight = Color(0xFFFFFFFF);

  // ── API ───────────────────────────────────────────────
  static const String baseUrl        = 'http://10.0.2.2:5000/api'; // Android emulator
  static const String socketUrl      = 'http://10.0.2.2:5000';
  static const Duration apiTimeout   = Duration(seconds: 30);

  // ── Secure Storage Keys ───────────────────────────────
  static const String tokenKey       = 'farmer_auth_token';
  static const String refreshKey     = 'farmer_refresh_token';
  static const String userIdKey      = 'farmer_user_id';

  // ── Pagination ────────────────────────────────────────
  static const int pageSize          = 20;

  // ── Supported Languages ───────────────────────────────
  static const List<String> supportedLocales = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'gu', 'bn'];

  // ── KYC Document Types ────────────────────────────────
  static const List<String> kycDocTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Farmer ID / PM-KISAN Card',
    'Land Ownership Document',
    'Bank Passbook Cover',
  ];

  // ── Produce Categories ────────────────────────────────
  static const List<String> produceCategories = [
    'Vegetables',
    'Fruits',
    'Grains & Pulses',
    'Dairy',
    'Poultry & Eggs',
    'Spices & Herbs',
    'Oilseeds',
    'Flowers',
    'Raw Honey',
    'Organic Certified',
  ];

  // ── Order Status ──────────────────────────────────────
  static const String orderNew           = 'new';
  static const String orderAccepted      = 'accepted';
  static const String orderPreparing     = 'preparing';
  static const String orderReadyPickup   = 'ready_for_pickup';
  static const String orderPickedUp      = 'picked_up';
  static const String orderCompleted     = 'completed';
  static const String orderRejected      = 'rejected';
  static const String orderCancelled     = 'cancelled';

  // ── Settlement Status ─────────────────────────────────
  static const String settlePending    = 'pending';
  static const String settleProcessing = 'processing';
  static const String settleCompleted  = 'completed';
  static const String settleFailed     = 'failed';
}
