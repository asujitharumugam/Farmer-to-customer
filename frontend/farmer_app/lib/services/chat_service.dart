// =========================================================
// Phase 29: Chat Service with Socket.IO Real-Time
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../core/constants/app_constants.dart';
import '../core/network/api_client.dart';
import '../core/storage/secure_storage_service.dart';
import '../models/chat_model.dart';

class ChatService {
  final _api = ApiClient();
  IO.Socket? _socket;

  // ── REST: Get all farmer conversations ────────────────
  Future<List<Conversation>> getConversations() async {
    try {
      final res = await _api.get('/farmer/conversations');
      final list = res.data['conversations'] as List<dynamic>? ?? [];
      return list.map((e) => Conversation.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  // ── REST: Get messages for a conversation ─────────────
  Future<List<ChatMessage>> getMessages(String conversationId, {int page = 1}) async {
    try {
      final res = await _api.get('/farmer/conversations/$conversationId/messages',
          params: {'page': page, 'limit': 30});
      final list = res.data['messages'] as List<dynamic>? ?? [];
      return list.map((e) => ChatMessage.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  // ── Socket.IO: Connect ────────────────────────────────
  Future<void> connect() async {
    final token = await SecureStorageService.getToken();
    _socket = IO.io(
      AppConstants.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableReconnection()
          .setReconnectionAttempts(5)
          .build(),
    );
    _socket!.connect();
  }

  // ── Socket.IO: Join a conversation room ───────────────
  void joinConversation(String conversationId) {
    _socket?.emit('join_conversation', {'conversationId': conversationId});
  }

  // ── Socket.IO: Send a message ─────────────────────────
  void sendMessage(String conversationId, String text) {
    _socket?.emit('send_message', {
      'conversationId': conversationId,
      'text': text,
      'senderRole': 'farmer',
    });
  }

  // ── Socket.IO: Listen for incoming messages ───────────
  void onMessage(String conversationId, void Function(ChatMessage) callback) {
    _socket?.on('receive_message', (data) {
      if (data['conversationId'] == conversationId) {
        callback(ChatMessage.fromJson(data));
      }
    });
  }

  // ── Socket.IO: Mark messages read ─────────────────────
  void markRead(String conversationId) {
    _socket?.emit('mark_read', {'conversationId': conversationId, 'role': 'farmer'});
  }

  // ── Disconnect ────────────────────────────────────────
  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
