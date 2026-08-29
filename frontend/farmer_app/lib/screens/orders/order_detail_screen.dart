// =========================================================
// Phase 29: Order Detail & Status Management Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/order_model.dart';
import '../../providers/order_provider.dart';

class OrderDetailScreen extends StatelessWidget {
  final OrderModel order;
  const OrderDetailScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<OrderProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(title: Text(order.orderNumber)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Status Progress ────────────────────────
            _StatusStepper(status: order.status),
            const SizedBox(height: 20),

            // ── Customer Info (Privacy Safe) ───────────
            const Text('Customer Information', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  children: [
                    _row('Name', order.customer.displayName),
                    if (order.customer.maskedPhone != null)
                      _row('Phone', order.customer.maskedPhone!),
                    _row('Delivery', order.customer.deliveryType.replaceAll('_', ' ')),
                    if (order.customer.deliveryAddress != null)
                      _row('Address', order.customer.deliveryAddress!),
                    if (order.specialInstructions != null && order.specialInstructions!.isNotEmpty)
                      _row('Notes', order.specialInstructions!),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // ── Order Items ────────────────────────────
            const Text('Ordered Items', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: Column(
                children: [
                  for (final item in order.items)
                    ListTile(
                      leading: const Icon(Icons.eco_outlined, color: AppConstants.primaryGreen),
                      title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: Text('${item.quantity} ${item.unit} × ₹${item.pricePerUnit.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                      trailing: Text('₹${item.subtotal.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  const Divider(height: 1),
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        Text('₹${order.total.toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppConstants.primaryGreen)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // ── Timestamps ────────────────────────────
            const Text('Timeline', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  children: [
                    _row('Placed', DateFormat('d MMM yyyy, h:mm a').format(order.createdAt)),
                    if (order.acceptedAt != null)
                      _row('Accepted', DateFormat('d MMM yyyy, h:mm a').format(order.acceptedAt!)),
                    if (order.completedAt != null)
                      _row('Completed', DateFormat('d MMM yyyy, h:mm a').format(order.completedAt!)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // ── Action Buttons ─────────────────────────
            _ActionButtons(order: order, provider: provider),
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 5),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(width: 90, child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppConstants.textMuted))),
            Expanded(child: Text(value, style: const TextStyle(fontSize: 12))),
          ],
        ),
      );
}

// ── Status Stepper Widget ─────────────────────────────────
class _StatusStepper extends StatelessWidget {
  final String status;
  const _StatusStepper({required this.status});

  static const _steps = [
    ('New',       AppConstants.orderNew),
    ('Accepted',  AppConstants.orderAccepted),
    ('Preparing', AppConstants.orderPreparing),
    ('Ready',     AppConstants.orderReadyPickup),
    ('Delivered', AppConstants.orderCompleted),
  ];

  @override
  Widget build(BuildContext context) {
    final currentIdx = _steps.indexWhere((s) => s.$2 == status);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: List.generate(_steps.length * 2 - 1, (i) {
            if (i.isOdd) {
              final stepIdx = i ~/ 2;
              final isActive = stepIdx < currentIdx;
              return Expanded(child: Container(height: 2, color: isActive ? AppConstants.primaryGreen : Colors.grey.shade200));
            }
            final stepIdx = i ~/ 2;
            final isActive = stepIdx <= currentIdx;
            return Column(
              children: [
                Icon(
                  isActive ? Icons.check_circle : Icons.radio_button_unchecked,
                  size: 20,
                  color: isActive ? AppConstants.primaryGreen : Colors.grey,
                ),
                const SizedBox(height: 4),
                Text(_steps[stepIdx].$1, style: TextStyle(fontSize: 8, color: isActive ? AppConstants.primaryGreen : AppConstants.textMuted), textAlign: TextAlign.center),
              ],
            );
          }),
        ),
      ),
    );
  }
}

// ── Contextual Action Buttons ─────────────────────────────
class _ActionButtons extends StatelessWidget {
  final OrderModel order;
  final OrderProvider provider;
  const _ActionButtons({required this.order, required this.provider});

  @override
  Widget build(BuildContext context) {
    if (order.status == AppConstants.orderNew) {
      return Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(side: const BorderSide(color: AppConstants.errorRed), foregroundColor: AppConstants.errorRed),
              icon: const Icon(Icons.cancel_outlined),
              label: const Text('Reject'),
              onPressed: () => _rejectDialog(context),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton.icon(
              icon: const Icon(Icons.check_circle_outline),
              label: const Text('Accept Order'),
              onPressed: () async {
                await provider.acceptOrder(order.id);
                if (context.mounted) Navigator.pop(context);
              },
            ),
          ),
        ],
      );
    } else if (order.status == AppConstants.orderAccepted) {
      return _fullBtn(context, 'Start Preparing', Icons.kitchen_outlined, () async {
        await provider.markPreparing(order.id);
        if (context.mounted) Navigator.pop(context);
      });
    } else if (order.status == AppConstants.orderPreparing) {
      return _fullBtn(context, 'Mark Ready for Pickup', Icons.done_outline, () async {
        await provider.markReadyForPickup(order.id);
        if (context.mounted) Navigator.pop(context);
      });
    } else if (order.status == AppConstants.orderReadyPickup) {
      return _fullBtn(context, 'Mark as Picked Up', Icons.local_shipping_outlined, () async {
        await provider.markPickedUp(order.id);
        if (context.mounted) Navigator.pop(context);
      });
    } else if (order.status == AppConstants.orderPickedUp) {
      return _fullBtn(context, 'Mark Completed', Icons.verified_outlined, () async {
        await provider.markCompleted(order.id);
        if (context.mounted) Navigator.pop(context);
      });
    }
    return const SizedBox.shrink();
  }

  Widget _fullBtn(BuildContext context, String label, IconData icon, VoidCallback onPressed) =>
      SizedBox(
        width: double.infinity,
        height: 50,
        child: ElevatedButton.icon(
          icon: Icon(icon),
          label: Text(label, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          onPressed: onPressed,
        ),
      );

  void _rejectDialog(BuildContext context) {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Reject Order'),
        content: TextField(controller: ctrl, decoration: const InputDecoration(hintText: 'Reason for rejection...')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppConstants.errorRed),
            onPressed: () async {
              Navigator.pop(context);
              await provider.rejectOrder(order.id, ctrl.text);
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Confirm Rejection'),
          ),
        ],
      ),
    );
  }
}
