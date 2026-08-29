// =========================================================
// Phase 29: Farmer Login Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../providers/auth_provider.dart';
import '../main_navigation_screen.dart';
import '../kyc/kyc_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscurePassword = true;

  Future<void> _login() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(
      _phoneCtrl.text.trim(),
      _passwordCtrl.text.trim(),
    );
    if (!mounted) return;
    if (success) {
      if (auth.isKycApproved) {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainNavigationScreen()));
      } else {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const KycScreen()));
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.errorMessage ?? 'Login failed'), backgroundColor: AppConstants.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // ── Hero Banner ─────────────────────────────
              Container(
                width: double.infinity,
                height: 220,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppConstants.primaryGreen, Color(0xFF1B5E20)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.agriculture, size: 64, color: Colors.white),
                    const SizedBox(height: 12),
                    const Text('Krishi Bazaar', style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                    Text('Farmer Edition', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13, letterSpacing: 2)),
                  ],
                ),
              ),

              // ── Form ────────────────────────────────────
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Sign In', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    const Text('Access your Krishi Bazaar farmer account', style: TextStyle(color: AppConstants.textMuted, fontSize: 13)),
                    const SizedBox(height: 28),

                    const Text('Phone Number', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.phone_outlined, size: 20),
                        hintText: '+91 98765 43210',
                      ),
                    ),

                    const SizedBox(height: 16),
                    const Text('Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _passwordCtrl,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock_outline, size: 20),
                        hintText: '••••••••',
                        suffixIcon: IconButton(
                          icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: auth.isLoading ? null : _login,
                        child: auth.isLoading
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Text('Sign In to Farmer Dashboard', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ),

                    const SizedBox(height: 20),
                    Center(
                      child: TextButton(
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen())),
                        child: RichText(
                          text: const TextSpan(
                            text: 'New farmer? ',
                            style: TextStyle(color: AppConstants.textMuted, fontSize: 13),
                            children: [
                              TextSpan(text: 'Register Here', style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
