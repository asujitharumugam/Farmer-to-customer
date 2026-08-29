// =========================================================
// Phase 28: Customer Marketplace Home Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/farmer_model.dart';
import '../../models/product_model.dart';
import '../../providers/cart_provider.dart';
import '../chat/chat_screen.dart';
import '../farmers/farmer_profile_screen.dart';
import '../products/product_details_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    // Mock Sample Produce Items
    final sampleProducts = [
      ProductModel(
        id: 'p101',
        title: 'Heirloom Organic Tomatoes',
        description: 'Naturally grown farm-fresh red tomatoes harvested at dawn.',
        pricePerUnit: 40.0,
        unit: 'kg',
        stockQuantity: 25,
        harvestDate: DateTime.now(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
        status: 'available',
        farmerId: 'f101',
        farmName: 'Organic Valley Farm',
        farmRating: 4.9,
      ),
      ProductModel(
        id: 'p102',
        title: 'Alphonso Mangoes (Ratnagiri)',
        description: 'Sweet naturally ripened GI-tagged Alphonso mangoes.',
        pricePerUnit: 180.0,
        unit: 'box',
        stockQuantity: 15,
        harvestDate: DateTime.now(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'],
        status: 'available',
        farmerId: 'f102',
        farmName: 'Sunrise Orchard',
        farmRating: 4.8,
      ),
    ];

    // Mock Sample Farmers
    final sampleFarmer = FarmerModel(
      id: 'f101',
      farmName: 'Organic Valley Farm',
      story: '3rd generation family farm committed to 100% chemical-free organic farming.',
      locationAddress: 'Greenfield Valley, Block A',
      city: 'Bangalore',
      state: 'Karnataka',
      verificationStatus: 'approved',
      ratingAverage: 4.9,
      ratingCount: 38,
      farmerName: 'Ramesh Patel',
      farmerAvatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
      farmerPhone: '+91 98765 11223',
    );

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('📍 Delivery Location', style: TextStyle(fontSize: 11, color: AppConstants.textMuted)),
            Text('Indiranagar, Bangalore', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Input
            TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search, color: AppConstants.textMuted),
                hintText: 'Search organic tomatoes, mangoes, honey...',
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Category Bar
            const Text('Categories', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: const [
                  _CategoryChip(label: '🥦 Vegetables', isSelected: true),
                  _CategoryChip(label: '🍎 Fruits'),
                  _CategoryChip(label: '🌾 Grains & Pulses'),
                  _CategoryChip(label: '🍯 Raw Honey'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Fresh From Farmers Banner Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Fresh From Farmers', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('View All', style: TextStyle(fontSize: 13, color: AppConstants.primaryGreen, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),

            // Produce Items List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: sampleProducts.length,
              itemBuilder: (context, index) {
                final product = sampleProducts[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(product.images.first, width: 60, height: 60, fit: BoxFit.cover),
                    ),
                    title: Text(product.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: Text('₹${product.pricePerUnit.toStringAsFixed(0)} / ${product.unit} • ${product.farmName}',
                        style: const TextStyle(fontSize: 12, color: AppConstants.textMuted)),
                    trailing: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      onPressed: () {
                        cart.addToCart(product);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${product.title} added to cart!'), duration: const Duration(seconds: 1)),
                        );
                      },
                      child: const Text('+ Add', style: TextStyle(fontSize: 12)),
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ProductDetailsScreen(product: product, farmer: sampleFarmer)),
                      );
                    },
                  ),
                );
              },
            ),

            const SizedBox(height: 20),

            // Nearby Verified Farmers Header
            const Text('Nearby Verified Farmers', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            // Farmer Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundImage: NetworkImage(sampleFarmer.farmerAvatar),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(sampleFarmer.farmName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text(sampleFarmer.farmerName, style: const TextStyle(fontSize: 12, color: AppConstants.textMuted)),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star, size: 14, color: AppConstants.accentAmber),
                              Text(' ${sampleFarmer.ratingAverage} (${sampleFarmer.ratingCount} reviews)',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chat_bubble_outline, color: AppConstants.primaryGreen),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => ChatScreen(farmer: sampleFarmer)),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

          ],
        ),
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  const _CategoryChip({required this.label, this.isSelected = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppConstants.primaryGreen : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isSelected ? AppConstants.primaryGreen : Colors.grey.shade300),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : AppConstants.textDark,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}
