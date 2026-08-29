// =========================================================
// Phase 29: KYC Submission Model
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

class KycDocument {
  final String docType;      // aadhaar | pan | farmer_id | land_doc | bank_passbook
  final String fileUrl;
  final String status;       // pending | approved | rejected
  final String? rejectionNote;

  const KycDocument({
    required this.docType,
    required this.fileUrl,
    required this.status,
    this.rejectionNote,
  });

  factory KycDocument.fromJson(Map<String, dynamic> json) => KycDocument(
        docType: json['docType'] ?? '',
        fileUrl: json['fileUrl'] ?? '',
        status: json['status'] ?? 'pending',
        rejectionNote: json['rejectionNote'],
      );
}

class KycSubmission {
  final String id;
  final String farmerId;
  final String status; // not_started | submitted | under_review | approved | rejected
  final String? rejectionReason;
  final List<KycDocument> documents;
  final DateTime? submittedAt;
  final DateTime? reviewedAt;

  const KycSubmission({
    required this.id,
    required this.farmerId,
    required this.status,
    this.rejectionReason,
    required this.documents,
    this.submittedAt,
    this.reviewedAt,
  });

  factory KycSubmission.fromJson(Map<String, dynamic> json) => KycSubmission(
        id: json['_id'] ?? json['id'] ?? '',
        farmerId: json['farmerId'] ?? '',
        status: json['status'] ?? 'not_started',
        rejectionReason: json['rejectionReason'],
        documents: (json['documents'] as List<dynamic>? ?? [])
            .map((e) => KycDocument.fromJson(e))
            .toList(),
        submittedAt: json['submittedAt'] != null
            ? DateTime.parse(json['submittedAt'])
            : null,
        reviewedAt: json['reviewedAt'] != null
            ? DateTime.parse(json['reviewedAt'])
            : null,
      );

  bool get isApproved    => status == 'approved';
  bool get isRejected    => status == 'rejected';
  bool get isUnderReview => status == 'under_review';
  bool get canResubmit   => isRejected;
}
