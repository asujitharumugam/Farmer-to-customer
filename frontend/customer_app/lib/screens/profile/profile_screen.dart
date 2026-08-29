// =========================================================
// Phase 28: Profile & Settings Screen
// Krishi Bazaar Customer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../providers/auth_provider.dart';
import '../authentication/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile & Settings')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // User Avatar Header
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundImage: NetworkImage(
                      user?.avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(user?.name ?? 'Ananya Sharma', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Text(user?.email ?? 'customer@farmtotable.com', style: const TextStyle(fontSize: 12, color: AppConstants.textMuted)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('Verified Customer', style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold, fontSize: 10)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Profile Actions List
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.location_on_outlined, color: AppConstants.primaryGreen),
                    title: const Text('Saved Shipping Addresses', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Manage home and office delivery addresses', style: TextStyle(fontSize: 11)),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.language_outlined, color: AppConstants.primaryGreen),
                    title: const Text('Language Preference', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                    subtitle: const Text('English / हिन्दी / తెలుగు', style: TextStyle(fontSize: 11)),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.lock_outline, color: AppConstants.primaryGreen),
                    title: const Text('Security & Privacy', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Logout Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.logout, color: Colors.red),
                label: const Text('Sign Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                onPressed: () async {
                  await auth.logout();
                  if (context.mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
