// =========================================================
// Phase 29: KYC Verification Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../models/kyc_model.dart';
import '../../services/kyc_service.dart';
import '../main_navigation_screen.dart';

class KycScreen extends StatefulWidget {
  const KycScreen({super.key});

  @override
  State<KycScreen> createState() => _KycScreenState();
}

class _KycScreenState extends State<KycScreen> {
  final _service = KycService();
  KycSubmission? _kyc;
  bool _loading = true;
  final Map<String, String?> _selectedFiles = {};
  final Map<String, bool> _uploading = {};

  @override
  void initState() {
    super.initState();
    _loadKyc();
  }

  Future<void> _loadKyc() async {
    setState(() => _loading = true);
    _kyc = await _service.getKycStatus();
    setState(() => _loading = false);
  }

  Future<void> _pickAndUpload(String docType) async {
    final result = await FilePicker.platform.pickFiles(type: FileType.image);
    if (result == null || result.files.single.path == null) return;
    final path = result.files.single.path!;

    setState(() => _uploading[docType] = true);
    final res = await _service.submitKyc(docType: docType, filePath: path);
    setState(() => _uploading[docType] = false);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(res['message'] ?? ''),
        backgroundColor: res['success'] == true ? AppConstants.successGreen : AppConstants.errorRed,
      ),
    );
    if (res['success'] == true) {
      setState(() => _selectedFiles[docType] = path);
    }
  }

  Future<void> _submitForReview() async {
    final res = await _service.submitForReview();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(res['message'] ?? ''),
        backgroundColor: res['success'] == true ? AppConstants.successGreen : AppConstants.errorRed,
      ),
    );
    if (res['success'] == true) await _loadKyc();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final status = _kyc?.status ?? 'not_started';

    return Scaffold(
      appBar: AppBar(title: const Text('KYC Verification')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Status Banner ────────────────────────────
            _StatusBanner(status: status, rejectionReason: _kyc?.rejectionReason),

            const SizedBox(height: 24),

            if (status == 'approved') ...[
              Center(
                child: Column(
                  children: [
                    const Icon(Icons.verified, size: 80, color: AppConstants.primaryGreen),
                    const SizedBox(height: 12),
                    const Text('Your KYC is Approved!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                      ),
                      child: const Text('Go to Dashboard'),
                    ),
                  ],
                ),
              ),
            ] else if (status == 'under_review' || status == 'submitted') ...[
              const Center(
                child: Column(
                  children: [
                    Icon(Icons.hourglass_top_rounded, size: 80, color: AppConstants.accentAmber),
                    SizedBox(height: 12),
                    Text('Documents Under Review', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 6),
                    Text('Our team will verify your documents within 24-48 hours.', textAlign: TextAlign.center, style: TextStyle(color: AppConstants.textMuted, fontSize: 13)),
                  ],
                ),
              ),
            ] else ...[
              // ── Document Upload Section ─────────────────
              const Text('Required Documents', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              const Text('Please upload clear photos of all required documents.', style: TextStyle(color: AppConstants.textMuted, fontSize: 13)),
              const SizedBox(height: 16),

              for (final docType in AppConstants.kycDocTypes)
                _DocUploadTile(
                  docType: docType,
                  isUploading: _uploading[docType] ?? false,
                  isUploaded: _selectedFiles[docType] != null,
                  onTap: () => _pickAndUpload(docType),
                ),

              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.send_outlined),
                  label: const Text('Submit for Verification', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  onPressed: _selectedFiles.length >= 3 ? _submitForReview : null,
                ),
              ),
              if (_selectedFiles.length < 3)
                const Padding(
                  padding: EdgeInsets.only(top: 8),
                  child: Text('Upload at least 3 documents to submit.', style: TextStyle(color: AppConstants.textMuted, fontSize: 12), textAlign: TextAlign.center),
                ),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatusBanner extends StatelessWidget {
  final String status;
  final String? rejectionReason;
  const _StatusBanner({required this.status, this.rejectionReason});

  @override
  Widget build(BuildContext context) {
    Color bg; IconData icon; String label;
    switch (status) {
      case 'approved':    bg = Colors.green.shade50;  icon = Icons.verified;          label = 'KYC Approved ✅';          break;
      case 'rejected':    bg = Colors.red.shade50;    icon = Icons.cancel_outlined;   label = 'KYC Rejected';              break;
      case 'under_review':
      case 'submitted':   bg = Colors.amber.shade50;  icon = Icons.hourglass_top;     label = 'Under Review';              break;
      default:            bg = Colors.blue.shade50;   icon = Icons.info_outline;      label = 'KYC Not Started';           break;
    }
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Icon(icon, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
                if (rejectionReason != null)
                  Text('Reason: $rejectionReason', style: const TextStyle(fontSize: 12, color: AppConstants.errorRed)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DocUploadTile extends StatelessWidget {
  final String docType;
  final bool isUploading;
  final bool isUploaded;
  final VoidCallback onTap;
  const _DocUploadTile({required this.docType, required this.isUploading, required this.isUploaded, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: Icon(
          isUploaded ? Icons.check_circle : Icons.upload_file_outlined,
          color: isUploaded ? AppConstants.primaryGreen : AppConstants.textMuted,
          size: 28,
        ),
        title: Text(docType, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(isUploaded ? '✓ Uploaded' : 'Tap to upload image', style: TextStyle(fontSize: 11, color: isUploaded ? AppConstants.successGreen : AppConstants.textMuted)),
        trailing: isUploading
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
            : Icon(Icons.chevron_right, color: isUploaded ? AppConstants.primaryGreen : AppConstants.textMuted),
        onTap: isUploading ? null : onTap,
      ),
    );
  }
}
