// =========================================================
// Phase 29: Chat Message Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class ChatMessage {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderRole; // farmer | customer
  final String text;
  final String? attachmentUrl;
  final String? attachmentType; // image | product | order
  final bool isRead;
  final DateTime timestamp;

  const ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderRole,
    required this.text,
    this.attachmentUrl,
    this.attachmentType,
    required this.isRead,
    required this.timestamp,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
        id: json['_id'] ?? json['id'] ?? '',
        conversationId: json['conversationId'] ?? '',
        senderId: json['senderId'] ?? '',
        senderRole: json['senderRole'] ?? 'customer',
        text: json['text'] ?? '',
        attachmentUrl: json['attachmentUrl'],
        attachmentType: json['attachmentType'],
        isRead: json['isRead'] ?? false,
        timestamp: json['timestamp'] != null
            ? DateTime.parse(json['timestamp'])
            : DateTime.now(),
      );

  bool get isFromFarmer => senderRole == 'farmer';
}

class Conversation {
  final String id;
  final String customerId;
  final String customerName;
  final String? customerAvatar;
  final String farmerId;
  final ChatMessage? lastMessage;
  final int unreadCount;
  final DateTime updatedAt;

  const Conversation({
    required this.id,
    required this.customerId,
    required this.customerName,
    this.customerAvatar,
    required this.farmerId,
    this.lastMessage,
    required this.unreadCount,
    required this.updatedAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) => Conversation(
        id: json['_id'] ?? json['id'] ?? '',
        customerId: json['customerId'] ?? '',
        customerName: json['customerName'] ?? 'Customer',
        customerAvatar: json['customerAvatar'],
        farmerId: json['farmerId'] ?? '',
        lastMessage: json['lastMessage'] != null
            ? ChatMessage.fromJson(json['lastMessage'])
            : null,
        unreadCount: json['unreadCount'] ?? 0,
        updatedAt: json['updatedAt'] != null
            ? DateTime.parse(json['updatedAt'])
            : DateTime.now(),
      );
}
