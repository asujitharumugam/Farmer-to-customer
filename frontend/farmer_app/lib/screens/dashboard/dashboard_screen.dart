// =========================================================
// Phase 29: Farmer Dashboard Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../localization/app_localizations.dart';
import '../../models/order_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/produce_provider.dart';
import '../orders/orders_screen.dart';
import '../products/products_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadAll());
  }

  Future<void> _loadAll() async {
    final orders   = Provider.of<OrderProvider>(context, listen: false);
    final products = Provider.of<ProduceProvider>(context, listen: false);
    final chat     = Provider.of<ChatProvider>(context, listen: false);
    await Future.wait([
      orders.loadOrders(),
      products.loadProducts(),
      chat.loadConversations(),
    ]);
  }

  String _greeting(AppLocalizations l10n) {
    final key = AppLocalizations.greetingFor(DateTime.now());
    return l10n.t(key);
  }

  @override
  Widget build(BuildContext context) {
    final auth     = Provider.of<AuthProvider>(context);
    final orders   = Provider.of<OrderProvider>(context);
    final products = Provider.of<ProduceProvider>(context);
    final chat     = Provider.of<ChatProvider>(context);
    final l10n     = AppLocalizations.of(context)!;
    final fmt      = NumberFormat.currency(symbol: '₹', decimalDigits: 0);

    // Compute today's sales from completed orders
    final todaySales = orders.completedOrders
        .where((o) => o.completedAt != null &&
            DateFormat('yyyyMMdd').format(o.completedAt!) ==
                DateFormat('yyyyMMdd').format(DateTime.now()))
        .fold(0.0, (sum, o) => sum + o.total);

    return Scaffold(
      backgroundColor: AppConstants.backgroundLight,
      body: RefreshIndicator(
        onRefresh: _loadAll,
        child: CustomScrollView(
          slivers: [
            // ── Sticky Gradient Header ──────────────────
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              backgroundColor: AppConstants.primaryGreen,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppConstants.primaryGreen, Color(0xFF1B5E20)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        '${_greeting(l10n)}, ${auth.user?.name.split(' ').first ?? 'Farmer'} 👨‍🌾',
                        style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        DateFormat('EEEE, d MMMM yyyy').format(DateTime.now()),
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                  onPressed: () {},
                ),
              ],
            ),

            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── KPI Cards Row ─────────────────────
                    Row(
                      children: [
                        Expanded(child: _KpiCard(label: l10n.t('todays_sales'), value: fmt.format(todaySales), icon: Icons.trending_up, color: AppConstants.primaryGreen)),
                        const SizedBox(width: 12),
                        Expanded(child: _KpiCard(label: l10n.t('pending_orders'), value: '${orders.pendingCount}', icon: Icons.pending_actions, color: AppConstants.accentAmber)),
                        const SizedBox(width: 12),
                        Expanded(child: _KpiCard(label: l10n.t('low_stock'), value: '${products.lowStockProducts.length}', icon: Icons.inventory_2_outlined, color: AppConstants.errorRed)),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // ── Chat Unread Banner ─────────────────
                    if (chat.totalUnread > 0)
                      GestureDetector(
                        onTap: () {},
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(colors: [Colors.blue.shade50, Colors.blue.shade100]),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.chat_bubble_outline, color: AppConstants.infoBlueDark),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  '💬 ${chat.totalUnread} unread message${chat.totalUnread > 1 ? 's' : ''} from customers',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppConstants.infoBlueDark, fontSize: 13),
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: AppConstants.infoBlueDark),
                            ],
                          ),
                        ),
                      ),

                    const SizedBox(height: 20),

                    // ── Recent New Orders ─────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('New Orders', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        TextButton(
                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const OrdersScreen())),
                          child: const Text('View All', style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    if (orders.isLoading)
                      const Center(child: CircularProgressIndicator())
                    else if (orders.newOrders.isEmpty)
                      _EmptyCard(message: l10n.t('no_orders'), icon: Icons.inbox_outlined)
                    else
                      for (final order in orders.newOrders.take(3))
                        _OrderCard(order: order),

                    const SizedBox(height: 20),

                    // ── Low Stock Alerts ──────────────────
                    if (products.lowStockProducts.isNotEmpty) ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('⚠ Low Stock Alerts', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppConstants.errorRed)),
                          TextButton(
                            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsScreen())),
                            child: const Text('Manage', style: TextStyle(color: AppConstants.primaryGreen)),
                          ),
                        ],
                      ),
                      for (final p in products.lowStockProducts.take(3))
                        Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: const Icon(Icons.warning_amber_rounded, color: AppConstants.accentAmber),
                            title: Text(p.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: Text('Only ${p.stockQty.toStringAsFixed(1)} ${p.unit} remaining', style: const TextStyle(fontSize: 11, color: AppConstants.errorRed)),
                            trailing: const Icon(Icons.chevron_right),
                          ),
                        ),
                    ],
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

// ── KPI Summary Card ──────────────────────────────────────
class _KpiCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _KpiCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 8),
              Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
              const SizedBox(height: 2),
              Text(label, style: const TextStyle(fontSize: 10, color: AppConstants.textMuted)),
            ],
          ),
        ),
      );
}

// ── Order Quick Card ──────────────────────────────────────
class _OrderCard extends StatelessWidget {
  final OrderModel order;
  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) => Card(
        margin: const EdgeInsets.only(bottom: 10),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AppConstants.primaryGreen.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.shopping_basket_outlined, color: AppConstants.primaryGreen, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(order.orderNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('${order.customer.displayName} · ${order.items.length} item${order.items.length > 1 ? 's' : ''}',
                        style: const TextStyle(fontSize: 11, color: AppConstants.textMuted)),
                  ],
                ),
              ),
              Text('₹${order.total.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppConstants.primaryGreen, fontSize: 14)),
            ],
          ),
        ),
      );
}

// ── Empty State Card ──────────────────────────────────────
class _EmptyCard extends StatelessWidget {
  final String message;
  final IconData icon;
  const _EmptyCard({required this.message, required this.icon});

  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
          child: Center(
            child: Column(
              children: [
                Icon(icon, size: 48, color: AppConstants.textMuted),
                const SizedBox(height: 10),
                Text(message, style: const TextStyle(color: AppConstants.textMuted, fontSize: 14)),
              ],
            ),
          ),
        ),
      );
}
