// =========================================================
// Phase 29: Order Management Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/order_model.dart';
import '../../providers/order_provider.dart';
import 'order_detail_screen.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  final _tabs = [
    ('New',      AppConstants.orderNew),
    ('Accepted', AppConstants.orderAccepted),
    ('Preparing',AppConstants.orderPreparing),
    ('Ready',    AppConstants.orderReadyPickup),
    ('Done',     AppConstants.orderCompleted),
  ];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<OrderProvider>(context, listen: false).loadOrders();
    });
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<OrderProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Management'),
        bottom: TabBar(
          controller: _tab,
          isScrollable: true,
          indicatorColor: AppConstants.primaryGreen,
          labelColor: AppConstants.primaryGreen,
          unselectedLabelColor: AppConstants.textMuted,
          tabs: _tabs.map((t) {
            final count = provider.orders.where((o) => o.status == t.$2).length;
            return Tab(text: count > 0 ? '${t.$1} ($count)' : t.$1);
          }).toList(),
        ),
      ),
      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => provider.loadOrders(),
              child: TabBarView(
                controller: _tab,
                children: _tabs.map((t) {
                  final filtered = provider.orders.where((o) => o.status == t.$2).toList();
                  return _OrderList(orders: filtered, status: t.$2);
                }).toList(),
              ),
            ),
    );
  }
}

class _OrderList extends StatelessWidget {
  final List<OrderModel> orders;
  final String status;
  const _OrderList({required this.orders, required this.status});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(_statusIcon(status), size: 64, color: AppConstants.textMuted),
            const SizedBox(height: 12),
            Text('No ${status.replaceAll('_', ' ')} orders', style: const TextStyle(color: AppConstants.textMuted, fontSize: 14)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, i) => _OrderTile(order: orders[i]),
    );
  }

  IconData _statusIcon(String s) {
    switch (s) {
      case 'new':            return Icons.inbox_outlined;
      case 'accepted':       return Icons.check_circle_outline;
      case 'preparing':      return Icons.kitchen_outlined;
      case 'ready_for_pickup': return Icons.done_all_outlined;
      default:               return Icons.history_outlined;
    }
  }
}

class _OrderTile extends StatelessWidget {
  final OrderModel order;
  const _OrderTile({required this.order});

  Color _statusColor(String s) {
    switch (s) {
      case 'new':             return AppConstants.infoBlueDark;
      case 'accepted':        return AppConstants.primaryGreen;
      case 'preparing':       return AppConstants.accentAmber;
      case 'ready_for_pickup':return AppConstants.accentOrange;
      case 'completed':       return AppConstants.successGreen;
      default:                return AppConstants.textMuted;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => OrderDetailScreen(order: order)),
        ).then((_) => Provider.of<OrderProvider>(context, listen: false).loadOrders()),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(order.orderNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppConstants.primaryGreen)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: _statusColor(order.status).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      order.status.replaceAll('_', ' ').toUpperCase(),
                      style: TextStyle(color: _statusColor(order.status), fontWeight: FontWeight.bold, fontSize: 10),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(order.customer.displayName, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
              Text('${order.items.length} item${order.items.length > 1 ? 's' : ''} · ${order.customer.deliveryType.replaceAll('_', ' ')}',
                  style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(DateFormat('d MMM • h:mm a').format(order.createdAt),
                      style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                  Text('₹${order.total.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppConstants.primaryGreen)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
