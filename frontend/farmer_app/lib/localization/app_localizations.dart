// =========================================================
// Phase 29: Localization (8 Indian Languages)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;
  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) =>
      Localizations.of<AppLocalizations>(context, AppLocalizations);

  static const _strings = <String, Map<String, String>>{
    // ── English ──────────────────────────────────────────
    'en': {
      'app_name':            'Krishi Bazaar',
      'tagline':             'Grow. Sell. Prosper.',
      'dashboard':           'Dashboard',
      'products':            'My Produce',
      'orders':              'Orders',
      'chat':                'Conversations',
      'profile':             'Profile',
      'good_morning':        'Good Morning',
      'good_afternoon':      'Good Afternoon',
      'good_evening':        'Good Evening',
      'todays_sales':        "Today's Sales",
      'pending_orders':      'Pending Orders',
      'low_stock':           'Low Stock Items',
      'add_produce':         'Add Produce',
      'edit_produce':        'Edit Produce',
      'inventory':           'Inventory',
      'analytics':           'Sales Analytics',
      'wallet':              'My Wallet',
      'settlements':         'Settlements',
      'kyc':                 'KYC Verification',
      'kyc_pending':         'KYC Under Review',
      'kyc_approved':        'KYC Approved',
      'kyc_rejected':        'KYC Rejected – Please Resubmit',
      'accept_order':        'Accept Order',
      'reject_order':        'Reject Order',
      'mark_preparing':      'Mark as Preparing',
      'mark_ready':          'Ready for Pickup',
      'mark_completed':      'Mark Completed',
      'send_message':        'Send Message',
      'type_message':        'Type your reply...',
      'no_orders':           'No orders yet',
      'no_products':         'No produce listed yet',
      'no_conversations':    'No conversations yet',
      'loading':             'Loading...',
      'save':                'Save Changes',
      'logout':              'Sign Out',
      'price_per_unit':      'Price per Unit (₹)',
      'stock_qty':           'Available Stock',
      'min_order_qty':       'Minimum Order',
      'organic':             'Organically Grown',
    },
    // ── Hindi ─────────────────────────────────────────────
    'hi': {
      'app_name':            'कृषि बाजार',
      'tagline':             'उगाएं। बेचें। समृद्ध हों।',
      'dashboard':           'डैशबोर्ड',
      'products':            'मेरी उपज',
      'orders':              'ऑर्डर',
      'chat':                'बातचीत',
      'profile':             'प्रोफाइल',
      'good_morning':        'सुप्रभात',
      'good_afternoon':      'नमस्ते',
      'good_evening':        'शुभ संध्या',
      'todays_sales':        'आज की बिक्री',
      'pending_orders':      'लंबित ऑर्डर',
      'low_stock':           'कम स्टॉक',
      'add_produce':         'उपज जोड़ें',
      'edit_produce':        'उपज संपादित करें',
      'inventory':           'भंडार',
      'analytics':           'बिक्री विश्लेषण',
      'wallet':              'वॉलेट',
      'settlements':         'निपटान',
      'kyc':                 'KYC सत्यापन',
      'kyc_pending':         'KYC समीक्षाधीन',
      'kyc_approved':        'KYC स्वीकृत',
      'kyc_rejected':        'KYC अस्वीकृत – पुनः जमा करें',
      'accept_order':        'ऑर्डर स्वीकार करें',
      'reject_order':        'ऑर्डर अस्वीकार करें',
      'mark_preparing':      'तैयारी चल रही है',
      'mark_ready':          'पिकअप के लिए तैयार',
      'mark_completed':      'पूर्ण करें',
      'send_message':        'भेजें',
      'type_message':        'अपना संदेश लिखें...',
      'no_orders':           'अभी कोई ऑर्डर नहीं',
      'no_products':         'अभी कोई उपज नहीं',
      'no_conversations':    'अभी कोई बातचीत नहीं',
      'loading':             'लोड हो रहा है...',
      'save':                'सहेजें',
      'logout':              'साइन आउट',
      'price_per_unit':      'प्रति इकाई मूल्य (₹)',
      'stock_qty':           'उपलब्ध स्टॉक',
      'min_order_qty':       'न्यूनतम ऑर्डर',
      'organic':             'जैविक रूप से उगाया',
    },
    // ── Telugu ────────────────────────────────────────────
    'te': {
      'app_name':            'కృషి బజార్',
      'tagline':             'పెంచండి. అమ్మండి. సంపన్నులవండి.',
      'dashboard':           'డాష్‌బోర్డ్',
      'products':            'నా పంట',
      'orders':              'ఆర్డర్‌లు',
      'chat':                'సంభాషణలు',
      'profile':             'ప్రొఫైల్',
      'good_morning':        'శుభోదయం',
      'good_afternoon':      'నమస్కారం',
      'good_evening':        'శుభ సాయంత్రం',
      'todays_sales':        'నేటి అమ్మకాలు',
      'pending_orders':      'పెండింగ్ ఆర్డర్‌లు',
      'low_stock':           'తక్కువ స్టాక్',
      'add_produce':         'పంటను జోడించండి',
      'inventory':           'నిల్వ',
      'analytics':           'విక్రయ విశ్లేషణ',
      'wallet':              'వాలెట్',
      'kyc':                 'KYC ధృవీకరణ',
      'logout':              'సైన్ అవుట్',
    },
    // Remaining languages fall back to English
  };

  String t(String key) =>
      _strings[locale.languageCode]?[key] ?? _strings['en']![key] ?? key;

  static String greetingFor(DateTime now) {
    final h = now.hour;
    if (h < 12) return 'good_morning';
    if (h < 17) return 'good_afternoon';
    return 'good_evening';
  }
}

// ── Delegate ──────────────────────────────────────────────
class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  static const supportedCodes = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'gu', 'bn'];

  @override
  bool isSupported(Locale locale) => supportedCodes.contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async => AppLocalizations(locale);

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
