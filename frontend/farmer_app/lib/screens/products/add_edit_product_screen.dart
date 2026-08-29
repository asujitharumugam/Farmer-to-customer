// =========================================================
// Phase 29: Add / Edit Produce Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/produce_model.dart';
import '../../providers/produce_provider.dart';

class AddEditProductScreen extends StatefulWidget {
  final ProduceModel? produce;
  const AddEditProductScreen({super.key, this.produce});

  @override
  State<AddEditProductScreen> createState() => _AddEditProductScreenState();
}

class _AddEditProductScreenState extends State<AddEditProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl   = TextEditingController();
  final _descCtrl    = TextEditingController();
  final _priceCtrl   = TextEditingController();
  final _promoCtrl   = TextEditingController();
  final _stockCtrl   = TextEditingController();
  final _minOrdCtrl  = TextEditingController();

  String _category = AppConstants.produceCategories.first;
  String _unit     = 'kg';
  bool   _isOrganic = false;
  bool   _isActive  = true;
  bool   _isSaving  = false;

  final _units = ['kg', 'g', 'litre', 'box', 'piece', 'dozen', 'bunch'];

  bool get _isEditing => widget.produce != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      final p = widget.produce!;
      _titleCtrl.text   = p.title;
      _descCtrl.text    = p.description;
      _priceCtrl.text   = p.pricePerUnit.toString();
      _promoCtrl.text   = p.promotionalPrice?.toString() ?? '';
      _stockCtrl.text   = p.stockQty.toString();
      _minOrdCtrl.text  = p.minOrderQty.toString();
      _category  = p.category;
      _unit      = p.unit;
      _isOrganic = p.isOrganic;
      _isActive  = p.isActive;
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    final provider = Provider.of<ProduceProvider>(context, listen: false);
    final payload = {
      'title': _titleCtrl.text.trim(),
      'description': _descCtrl.text.trim(),
      'category': _category,
      'pricePerUnit': double.tryParse(_priceCtrl.text) ?? 0,
      if (_promoCtrl.text.isNotEmpty)
        'promotionalPrice': double.tryParse(_promoCtrl.text),
      'unit': _unit,
      'stockQty': double.tryParse(_stockCtrl.text) ?? 0,
      'minOrderQty': double.tryParse(_minOrdCtrl.text) ?? 1,
      'isOrganic': _isOrganic,
      'isActive': _isActive,
    };

    bool ok;
    if (_isEditing) {
      ok = await provider.updateProduct(widget.produce!.id, payload);
    } else {
      ok = await provider.addProduct(payload);
    }
    setState(() => _isSaving = false);

    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_isEditing ? 'Produce updated!' : 'Produce added!'), backgroundColor: AppConstants.successGreen),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.errorMessage ?? 'Failed to save'), backgroundColor: AppConstants.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isEditing ? 'Edit Produce' : 'Add New Produce')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _sectionLabel('Basic Information'),

            // Title
            TextFormField(
              controller: _titleCtrl,
              decoration: const InputDecoration(labelText: 'Produce Name *', prefixIcon: Icon(Icons.eco_outlined)),
              validator: (v) => (v == null || v.isEmpty) ? 'Name is required' : null,
            ),
            const SizedBox(height: 14),

            // Category Dropdown
            DropdownButtonFormField<String>(
              value: _category,
              items: AppConstants.produceCategories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (v) => setState(() => _category = v!),
              decoration: const InputDecoration(labelText: 'Category *', prefixIcon: Icon(Icons.category_outlined)),
            ),
            const SizedBox(height: 14),

            // Description
            TextFormField(
              controller: _descCtrl,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Description *', prefixIcon: Icon(Icons.description_outlined), alignLabelWithHint: true),
              validator: (v) => (v == null || v.isEmpty) ? 'Description is required' : null,
            ),
            const SizedBox(height: 24),

            _sectionLabel('Pricing & Units'),

            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _priceCtrl,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9.]'))],
                    decoration: const InputDecoration(labelText: 'Price (₹) *', prefixIcon: Icon(Icons.currency_rupee)),
                    validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _unit,
                    items: _units.map((u) => DropdownMenuItem(value: u, child: Text('per $u'))).toList(),
                    onChanged: (v) => setState(() => _unit = v!),
                    decoration: const InputDecoration(labelText: 'Unit'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            TextFormField(
              controller: _promoCtrl,
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9.]'))],
              decoration: const InputDecoration(labelText: 'Promotional Price (₹) – Optional', prefixIcon: Icon(Icons.local_offer_outlined)),
            ),
            const SizedBox(height: 24),

            _sectionLabel('Inventory'),

            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _stockCtrl,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9.]'))],
                    decoration: const InputDecoration(labelText: 'Available Stock *', prefixIcon: Icon(Icons.inventory_outlined)),
                    validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _minOrdCtrl,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9.]'))],
                    decoration: const InputDecoration(labelText: 'Min Order Qty *', prefixIcon: Icon(Icons.shopping_bag_outlined)),
                    validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            _sectionLabel('Settings'),

            SwitchListTile(
              title: const Text('Organically Grown', style: TextStyle(fontSize: 14)),
              subtitle: const Text('Certified / Natural farming methods', style: TextStyle(fontSize: 11)),
              value: _isOrganic,
              onChanged: (v) => setState(() => _isOrganic = v),
              activeColor: AppConstants.primaryGreen,
            ),
            SwitchListTile(
              title: const Text('Active Listing', style: TextStyle(fontSize: 14)),
              subtitle: const Text('Visible to customers on the marketplace', style: TextStyle(fontSize: 11)),
              value: _isActive,
              onChanged: (v) => setState(() => _isActive = v),
              activeColor: AppConstants.primaryGreen,
            ),

            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isSaving ? null : _save,
                child: _isSaving
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : Text(_isEditing ? 'Update Produce' : 'Add to Marketplace', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionLabel(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Text(text, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppConstants.primaryGreen)),
      );
}
