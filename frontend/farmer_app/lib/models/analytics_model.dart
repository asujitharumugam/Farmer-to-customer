// =========================================================
// Phase 29: Analytics / Sales Summary Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class DailySales {
  final DateTime date;
  final double revenue;
  final int orderCount;

  const DailySales({required this.date, required this.revenue, required this.orderCount});

  factory DailySales.fromJson(Map<String, dynamic> json) => DailySales(
        date: DateTime.parse(json['date']),
        revenue: (json['revenue'] as num?)?.toDouble() ?? 0.0,
        orderCount: json['orderCount'] ?? 0,
      );
}

class ProductPerformance {
  final String produceId;
  final String title;
  final double totalRevenue;
  final double totalQtySold;
  final int orderCount;

  const ProductPerformance({
    required this.produceId,
    required this.title,
    required this.totalRevenue,
    required this.totalQtySold,
    required this.orderCount,
  });

  factory ProductPerformance.fromJson(Map<String, dynamic> json) => ProductPerformance(
        produceId: json['produceId'] ?? '',
        title: json['title'] ?? '',
        totalRevenue: (json['totalRevenue'] as num?)?.toDouble() ?? 0.0,
        totalQtySold: (json['totalQtySold'] as num?)?.toDouble() ?? 0.0,
        orderCount: json['orderCount'] ?? 0,
      );
}

class AnalyticsSummary {
  final double todaySales;
  final double weeklySales;
  final double monthlySales;
  final int todayOrders;
  final int totalOrders;
  final double averageOrderValue;
  final List<DailySales> dailyBreakdown;
  final List<ProductPerformance> topProducts;

  const AnalyticsSummary({
    required this.todaySales,
    required this.weeklySales,
    required this.monthlySales,
    required this.todayOrders,
    required this.totalOrders,
    required this.averageOrderValue,
    required this.dailyBreakdown,
    required this.topProducts,
  });

  factory AnalyticsSummary.fromJson(Map<String, dynamic> json) => AnalyticsSummary(
        todaySales: (json['todaySales'] as num?)?.toDouble() ?? 0.0,
        weeklySales: (json['weeklySales'] as num?)?.toDouble() ?? 0.0,
        monthlySales: (json['monthlySales'] as num?)?.toDouble() ?? 0.0,
        todayOrders: json['todayOrders'] ?? 0,
        totalOrders: json['totalOrders'] ?? 0,
        averageOrderValue: (json['averageOrderValue'] as num?)?.toDouble() ?? 0.0,
        dailyBreakdown: (json['dailyBreakdown'] as List<dynamic>? ?? [])
            .map((e) => DailySales.fromJson(e))
            .toList(),
        topProducts: (json['topProducts'] as List<dynamic>? ?? [])
            .map((e) => ProductPerformance.fromJson(e))
            .toList(),
      );
}
