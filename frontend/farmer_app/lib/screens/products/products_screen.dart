// =========================================================
// Phase 29: Product Management Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/produce_model.dart';
import '../../providers/produce_provider.dart';
import 'add_edit_product_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProduceProvider>(context, listen: false).loadProducts();
    });
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ProduceProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Produce Listings'),
        bottom: TabBar(
          controller: _tab,
          indicatorColor: AppConstants.primaryGreen,
          labelColor: AppConstants.primaryGreen,
          unselectedLabelColor: AppConstants.textMuted,
          tabs: [
            Tab(text: 'Active (${provider.activeProducts.length})'),
            Tab(text: 'Low Stock (${provider.lowStockProducts.length})'),
            Tab(text: 'All (${provider.products.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppConstants.primaryGreen,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Produce', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AddEditProductScreen()),
        ).then((_) => provider.loadProducts()),
      ),
      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tab,
              children: [
                _ProductList(products: provider.activeProducts),
                _ProductList(products: provider.lowStockProducts),
                _ProductList(products: provider.products),
              ],
            ),
    );
  }
}

class _ProductList extends StatelessWidget {
  final List<ProduceModel> products;
  const _ProductList({required this.products});

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inventory_2_outlined, size: 64, color: AppConstants.textMuted),
            SizedBox(height: 12),
            Text('No produce in this category', style: TextStyle(color: AppConstants.textMuted, fontSize: 14)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: products.length,
      itemBuilder: (context, i) {
        final p = products[i];
        return _ProduceCard(produce: p);
      },
    );
  }
}

class _ProduceCard extends StatelessWidget {
  final ProduceModel produce;
  const _ProduceCard({required this.produce});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ProduceProvider>(context, listen: false);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            // Product Image
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: produce.images.isNotEmpty
                  ? Image.network(produce.images.first, width: 70, height: 70, fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(width: 70, height: 70, color: AppConstants.backgroundLight, child: const Icon(Icons.eco, color: AppConstants.primaryGreen)))
                  : Container(width: 70, height: 70, color: AppConstants.backgroundLight, child: const Icon(Icons.eco, size: 32, color: AppConstants.primaryGreen)),
            ),
            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(produce.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                      if (produce.isOrganic)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(6)),
                          child: const Text('Organic', style: TextStyle(color: AppConstants.primaryGreen, fontSize: 9, fontWeight: FontWeight.bold)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text('₹${produce.effectivePrice.toStringAsFixed(0)} / ${produce.unit}',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppConstants.primaryGreen)),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Icon(
                        produce.isOutOfStock ? Icons.block : (produce.isLowStock ? Icons.warning_amber : Icons.check_circle),
                        size: 12,
                        color: produce.isOutOfStock ? AppConstants.errorRed : (produce.isLowStock ? AppConstants.warningYellow : AppConstants.successGreen),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Stock: ${produce.stockQty.toStringAsFixed(1)} ${produce.unit}',
                        style: TextStyle(
                          fontSize: 11,
                          color: produce.isOutOfStock ? AppConstants.errorRed : AppConstants.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Actions
            PopupMenuButton<String>(
              onSelected: (value) async {
                switch (value) {
                  case 'edit':
                    await Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => AddEditProductScreen(produce: produce)),
                    );
                    await provider.loadProducts();
                    break;
                  case 'toggle':
                    await provider.toggleActive(produce.id, !produce.isActive);
                    break;
                  case 'delete':
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('Delete Produce'),
                        content: Text('Are you sure you want to delete "${produce.title}"?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: AppConstants.errorRed),
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Delete'),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true) await provider.deleteProduct(produce.id);
                    break;
                }
              },
              itemBuilder: (_) => [
                PopupMenuItem(value: 'edit', child: Row(children: const [Icon(Icons.edit_outlined, size: 18), SizedBox(width: 8), Text('Edit')])),
                PopupMenuItem(value: 'toggle', child: Row(children: [Icon(produce.isActive ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 18), const SizedBox(width: 8), Text(produce.isActive ? 'Deactivate' : 'Activate')])),
                PopupMenuItem(value: 'delete', child: Row(children: const [Icon(Icons.delete_outline, size: 18, color: AppConstants.errorRed), SizedBox(width: 8), Text('Delete', style: TextStyle(color: AppConstants.errorRed))])),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
