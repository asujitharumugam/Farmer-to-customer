// =========================================================
// Phase 28: Product Details & Produce Specs Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/farmer_model.dart';
import '../../models/product_model.dart';
import '../../providers/cart_provider.dart';
import '../chat/chat_screen.dart';

class ProductDetailsScreen extends StatelessWidget {
  final ProductModel product;
  final FarmerModel farmer;

  const ProductDetailsScreen({
    super.key,
    required this.product,
    required this.farmer,
  });

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(product.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Hero Image
            Image.network(
              product.images.first,
              width: double.infinity,
              height: 250,
              fit: BoxFit.cover,
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Organic Badge
                  if (product.isOrganic)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('🌱 100% Certified Organic',
                          style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                  const SizedBox(height: 10),

                  Text(product.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  Text('₹${product.pricePerUnit.toStringAsFixed(0)} / ${product.unit}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppConstants.primaryGreen)),

                  const SizedBox(height: 16),
                  const Text('Description', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(product.description, style: const TextStyle(fontSize: 13, color: AppConstants.textMuted)),

                  const SizedBox(height: 24),
                  // Origin Farm Card
                  const Text('Farmer Origin & Harvest', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundImage: NetworkImage(farmer.farmerAvatar),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(farmer.farmName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text('Harvested Today at ${farmer.city}', style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                              ],
                            ),
                          ),
                          OutlinedButton.icon(
                            icon: const Icon(Icons.chat_outlined, size: 16),
                            label: const Text('Chat'),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => ChatScreen(farmer: farmer)),
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
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
        ),
        child: SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.shopping_bag_outlined),
            label: const Text('Add To Shopping Cart', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            onPressed: () {
              cart.addToCart(product);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${product.title} added to cart!'), duration: const Duration(seconds: 1)),
              );
            },
          ),
        ),
      ),
    );
  }
}
