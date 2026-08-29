// =========================================================
// Phase 28: Farmer ↔ Customer Real-Time Chat Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/farmer_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';

class ChatScreen extends StatefulWidget {
  final FarmerModel farmer;

  const ChatScreen({super.key, required this.farmer});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final chatProvider = Provider.of<ChatProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final messages = chatProvider.getMessagesForFarmer(widget.farmer.id);
    final currentUserId = authProvider.user?.id ?? 'cust_current';

    return Scaffold(
      appBar: AppBar(
        titleRow: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage(widget.farmer.farmerAvatar),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.farmer.farmerName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                Text(widget.farmer.farmName, style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final msg = messages[index];
                final isMe = msg.senderId == currentUserId;

                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isMe ? AppConstants.primaryGreen : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4)],
                    ),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAlignment.end : CrossAlignment.start,
                      children: [
                        Text(
                          msg.messageText,
                          style: TextStyle(
                            color: isMe ? Colors.white : AppConstants.textDark,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${msg.timestamp.hour}:${msg.timestamp.minute.toString().padLeft(2, '0')}',
                          style: TextStyle(
                            color: isMe ? Colors.white70 : AppConstants.textMuted,
                            fontSize: 9,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Message Input Field
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Type your question about harvest...',
                      filled: true,
                      fillColor: AppConstants.backgroundLight,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: AppConstants.primaryGreen),
                  onPressed: () {
                    if (_messageController.text.isNotEmpty) {
                      chatProvider.sendMessage(widget.farmer.id, currentUserId, _messageController.text);
                      _messageController.clear();
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

extension AppBarTitleRow on AppBar {
  static AppBar withRow({required Widget titleRow}) {
    return AppBar(title: titleRow);
  }
}
