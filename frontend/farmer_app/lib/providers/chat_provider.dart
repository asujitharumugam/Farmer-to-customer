// =========================================================
// Phase 29: Chat Provider (Farmer ↔ Customer Conversations)
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../models/chat_model.dart';
import '../services/chat_service.dart';

class ChatProvider extends ChangeNotifier {
  final _service = ChatService();

  List<Conversation> _conversations = [];
  final Map<String, List<ChatMessage>> _messages = {};
  bool _isLoading = false;
  bool _isConnected = false;

  List<Conversation> get conversations => _conversations;
  bool               get isLoading     => _isLoading;
  bool               get isConnected   => _isConnected;

  int get totalUnread => _conversations.fold(0, (sum, c) => sum + c.unreadCount);

  List<ChatMessage> messagesFor(String conversationId) =>
      _messages[conversationId] ?? [];

  // ── Socket connection lifecycle ───────────────────────
  Future<void> connect() async {
    await _service.connect();
    _isConnected = true;
    notifyListeners();
  }

  void disconnect() {
    _service.disconnect();
    _isConnected = false;
    notifyListeners();
  }

  // ── Load all conversations ────────────────────────────
  Future<void> loadConversations() async {
    _isLoading = true;
    notifyListeners();
    _conversations = await _service.getConversations();
    _isLoading = false;
    notifyListeners();
  }

  // ── Load messages and start listening ────────────────
  Future<void> openConversation(String conversationId) async {
    _isLoading = true;
    notifyListeners();
    _messages[conversationId] = await _service.getMessages(conversationId);
    _isLoading = false;
    notifyListeners();

    _service.joinConversation(conversationId);
    _service.markRead(conversationId);

    _service.onMessage(conversationId, (msg) {
      _messages[conversationId] = [...(_messages[conversationId] ?? []), msg];
      notifyListeners();
    });
  }

  // ── Send a message ────────────────────────────────────
  void sendMessage(String conversationId, String farmerId, String text) {
    if (text.trim().isEmpty) return;
    _service.sendMessage(conversationId, text);

    // Optimistic local append
    final optimistic = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: conversationId,
      senderId: farmerId,
      senderRole: 'farmer',
      text: text,
      isRead: false,
      timestamp: DateTime.now(),
    );
    _messages[conversationId] = [...(_messages[conversationId] ?? []), optimistic];
    notifyListeners();
  }
}
