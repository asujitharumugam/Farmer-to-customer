// =========================================================
// Phase 28: Order History & Live Order Tracking Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockOrders = [
      {
        'id': 'ORD-991823',
        'date': '14 Aug 2026',
        'amount': 220.0,
        'status': 'harvested_packed',
        'items': 'Heirloom Organic Tomatoes (4 kg), Alphonso Mangoes (1 box)',
        'farm': 'Organic Valley Farm',
      },
      {
        'id': 'ORD-882104',
        'date': '10 Aug 2026',
        'amount': 150.0,
        'status': 'completed',
        'items': 'Fresh Organic Carrots (2 kg)',
        'farm': 'Sunrise Orchard',
      },
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('My Orders & Tracking')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: mockOrders.length,
        itemBuilder: (context, index) {
          final ord = mockOrders[index];
          final isCompleted = ord['status'] == 'completed';

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(ord['id'].toString(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppConstants.primaryGreen)),
                      Text(ord['date'].toString(), style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(ord['items'].toString(), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 4),
                  Text('Seller: ${ord['farm']}', style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                  const Divider(height: 20),

                  // Order Timeline Stepper
                  _OrderStatusTimeline(status: ord['status'].toString()),

                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('₹${(ord['amount'] as num).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Chip(
                        label: Text(
                          isCompleted ? 'Delivered' : 'In Transit',
                          style: TextStyle(color: isCompleted ? Colors.green : Colors.amber.shade900, fontWeight: FontWeight.bold, fontSize: 11),
                        ),
                        backgroundColor: isCompleted ? Colors.green.shade50 : Colors.amber.shade50,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _OrderStatusTimeline extends StatelessWidget {
  final String status;
  const _OrderStatusTimeline({required this.status});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _buildStep('Order Confirmed', true),
        _buildLine(true),
        _buildStep('Packed', status == 'harvested_packed' || status == 'completed'),
        _buildLine(status == 'completed'),
        _buildStep('Delivered', status == 'completed'),
      ],
    );
  }

  Widget _buildStep(String title, bool isActive) {
    return Expanded(
      child: Column(
        children: [
          Icon(
            isActive ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 18,
            color: isActive ? AppConstants.primaryGreen : Colors.grey,
          ),
          const SizedBox(height: 4),
          Text(title, style: TextStyle(fontSize: 9, color: isActive ? AppConstants.textDark : AppConstants.textMuted), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildLine(bool isActive) {
    return Container(
      width: 20,
      height: 2,
      color: isActive ? AppConstants.primaryGreen : Colors.grey.shade300,
    );
  }
}
