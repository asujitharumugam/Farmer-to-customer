// =========================================================
// Phase 28: Multi-Step Order Checkout Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../providers/cart_provider.dart';
import '../orders/orders_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedPayment = 'cod';
  String _selectedDelivery = 'home_delivery';
  bool _isPlacingOrder = false;

  void _placeOrder() async {
    setState(() => _isPlacingOrder = true);
    await Future.delayed(const Duration(seconds: 2));

    final cart = Provider.of<CartProvider>(context, listen: false);
    cart.clearCart();

    if (!mounted) return;
    setState(() => _isPlacingOrder = false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Column(
          children: const [
            Icon(Icons.check_circle, size: 64, color: AppConstants.primaryGreen),
            SizedBox(height: 12),
            Text('Booking Confirmed!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        content: const Text(
          'Your harvest order #ORD-991823 has been dispatched to local farmers for morning pickup.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12, color: AppConstants.textMuted),
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const OrdersScreen()),
              );
            },
            child: const Text('View Order Tracking'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout & Payment')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Delivery Address Card
            const Text('Delivery Address', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on_outlined, color: AppConstants.primaryGreen),
                title: const Text('Home - Indiranagar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: const Text('12 Green Avenue, 4th Block, Bangalore 560001', style: TextStyle(fontSize: 11)),
                trailing: const Icon(Icons.chevron_right),
              ),
            ),

            const SizedBox(height: 20),

            // Delivery Method Selector
            const Text('Fulfillment Option', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('🚚 Doorstep Delivery'),
                    selected: _selectedDelivery == 'home_delivery',
                    onSelected: (val) => setState(() => _selectedDelivery = 'home_delivery'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('🚜 Farm Gate Pickup'),
                    selected: _selectedDelivery == 'farm_pickup',
                    onSelected: (val) => setState(() => _selectedDelivery = 'farm_pickup'),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Payment Options
            const Text('Select Payment Method', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            RadioListTile<String>(
              value: 'upi',
              groupValue: _selectedPayment,
              title: const Text('UPI (Google Pay / PhonePe / Paytm)'),
              onChanged: (val) => setState(() => _selectedPayment = val!),
            ),
            RadioListTile<String>(
              value: 'card',
              groupValue: _selectedPayment,
              title: const Text('Credit / Debit Card (Stripe)'),
              onChanged: (val) => setState(() => _selectedPayment = val!),
            ),
            RadioListTile<String>(
              value: 'cod',
              groupValue: _selectedPayment,
              title: const Text('Cash on Delivery (Pay at Gate/Door)'),
              onChanged: (val) => setState(() => _selectedPayment = val!),
            ),

            const SizedBox(height: 24),

            // Order Summary
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Amount Payable', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('₹${cart.grandTotal.toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppConstants.primaryGreen)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isPlacingOrder ? null : _placeOrder,
                child: _isPlacingOrder
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Confirm & Book Order', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
