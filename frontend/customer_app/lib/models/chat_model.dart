// =========================================================
// Phase 28: Farmer ↔ Customer Chat Data Model
// Krishi Bazaar Customer Mobile Application
// =========================================================

class ChatMessageModel {
  final String id;
  final String senderId;
  final String receiverId;
  final String messageText;
  final String? imageUrl;
  final DateTime timestamp;
  final bool isRead;

  ChatMessageModel({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.messageText,
    this.imageUrl,
    required this.timestamp,
    this.isRead = false,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: json['senderId'] ?? '',
      receiverId: json['receiverId'] ?? '',
      messageText: json['messageText'] ?? '',
      imageUrl: json['imageUrl'],
      timestamp: json['timestamp'] != null ? DateTime.parse(json['timestamp']) : DateTime.now(),
      isRead: json['isRead'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'senderId': senderId,
      'receiverId': receiverId,
      'messageText': messageText,
      'imageUrl': imageUrl,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
    };
  }
}
