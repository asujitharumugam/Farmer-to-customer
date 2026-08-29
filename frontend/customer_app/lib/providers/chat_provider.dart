// =========================================================
// Phase 28: Farmer ↔ Customer Chat State Provider
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../models/chat_model.dart';

class ChatProvider with ChangeNotifier {
  final Map<String, List<ChatMessageModel>> _conversations = {};

  List<ChatMessageModel> getMessagesForFarmer(String farmerId) {
    if (!_conversations.containsKey(farmerId)) {
      // Seed default welcoming conversation
      _conversations[farmerId] = [
        ChatMessageModel(
          id: '1',
          senderId: farmerId,
          receiverId: 'cust_current',
          messageText: 'Namaste! Welcome to Organic Valley Farm. All our vegetables are harvested fresh this morning.',
          timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
          isRead: true,
        ),
      ];
    }
    return _conversations[farmerId]!;
  }

  void sendMessage(String farmerId, String senderId, String text) {
    if (text.trim().isEmpty) return;

    final newMessage = ChatMessageModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: senderId,
      receiverId: farmerId,
      messageText: text,
      timestamp: DateTime.now(),
      isRead: true,
    );

    if (!_conversations.containsKey(farmerId)) {
      _conversations[farmerId] = [];
    }
    _conversations[farmerId]!.add(newMessage);
    notifyListeners();

    // Auto-reply simulation from Farmer
    Future.delayed(const Duration(seconds: 2), () {
      final autoReply = ChatMessageModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        senderId: farmerId,
        receiverId: senderId,
        messageText: 'Thank you for reaching out! We can package your order for pickup or delivery right away.',
        timestamp: DateTime.now(),
        isRead: true,
      );
      _conversations[farmerId]!.add(autoReply);
      notifyListeners();
    });
  }
}
