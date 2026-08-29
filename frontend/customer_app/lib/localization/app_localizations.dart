// =========================================================
// Phase 28: Indian Languages Localization Dictionary
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const _localizedValues = <String, Map<String, String>>{
    'en': {
      'app_title': 'Krishi Bazaar',
      'search_placeholder': 'Search organic tomatoes, mangoes...',
      'fresh_harvest': 'Fresh From Farmers',
      'nearby_farmers': 'Nearby Verified Farmers',
      'add_to_cart': 'Add to Cart',
      'chat_farmer': 'Chat with Farmer',
      'checkout': 'Proceed to Checkout',
      'order_history': 'My Orders',
    },
    'hi': {
      'app_title': 'कृषि बाजार',
      'search_placeholder': 'ताजी सब्जियां और फल खोजें...',
      'fresh_harvest': 'किसानों से सीधे ताजा',
      'nearby_farmers': 'आस-पास के सत्यापित किसान',
      'add_to_cart': 'कार्ट में जोड़ें',
      'chat_farmer': 'किसान से चैट करें',
      'checkout': 'ऑर्डर पूरा करें',
      'order_history': 'मेरे ऑर्डर',
    },
    'te': {
      'app_title': 'కృషి బజార్',
      'search_placeholder': 'తాజా కూరగాయలు వెతకండి...',
      'fresh_harvest': 'రైతుల నుండి నేరుగా',
      'nearby_farmers': 'సమీప రైతులు',
      'add_to_cart': 'కార్ట్‌కు జోడించండి',
      'chat_farmer': 'రైతుతో చాట్ చేయండి',
      'checkout': 'చెక్అవుట్',
      'order_history': 'నా ఆర్డర్‌లు',
    },
  };

  String translate(String key) {
    return _localizedValues[locale.languageCode]?[key] ?? _localizedValues['en']![key] ?? key;
  }
}
