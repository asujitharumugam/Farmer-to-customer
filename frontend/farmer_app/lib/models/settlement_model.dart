// =========================================================
// Phase 29: Settlement Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class Settlement {
  final String id;
  final String farmerId;
  final double amount;
  final String status; // pending | processing | completed | failed
  final DateTime settlementDate;
  final String? utrReference;      // UTR / bank reference
  final List<String> relatedOrderIds;
  final DateTime createdAt;

  const Settlement({
    required this.id,
    required this.farmerId,
    required this.amount,
    required this.status,
    required this.settlementDate,
    this.utrReference,
    required this.relatedOrderIds,
    required this.createdAt,
  });

  factory Settlement.fromJson(Map<String, dynamic> json) => Settlement(
        id: json['_id'] ?? json['id'] ?? '',
        farmerId: json['farmerId'] ?? '',
        amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
        status: json['status'] ?? 'pending',
        settlementDate: json['settlementDate'] != null
            ? DateTime.parse(json['settlementDate'])
            : DateTime.now(),
        utrReference: json['utrReference'],
        relatedOrderIds: List<String>.from(json['relatedOrderIds'] ?? []),
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'])
            : DateTime.now(),
      );

  bool get isCompleted  => status == 'completed';
  bool get isPending    => status == 'pending';
  bool get isProcessing => status == 'processing';
  bool get isFailed     => status == 'failed';
}

class WalletSummary {
  final double currentBalance;
  final double pendingEarnings;
  final double availableForSettlement;
  final double totalEarned;
  final double totalSettled;

  const WalletSummary({
    required this.currentBalance,
    required this.pendingEarnings,
    required this.availableForSettlement,
    required this.totalEarned,
    required this.totalSettled,
  });

  factory WalletSummary.fromJson(Map<String, dynamic> json) => WalletSummary(
        currentBalance: (json['currentBalance'] as num?)?.toDouble() ?? 0.0,
        pendingEarnings: (json['pendingEarnings'] as num?)?.toDouble() ?? 0.0,
        availableForSettlement: (json['availableForSettlement'] as num?)?.toDouble() ?? 0.0,
        totalEarned: (json['totalEarned'] as num?)?.toDouble() ?? 0.0,
        totalSettled: (json['totalSettled'] as num?)?.toDouble() ?? 0.0,
      );
}
