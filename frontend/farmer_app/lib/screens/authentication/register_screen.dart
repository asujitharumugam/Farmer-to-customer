// =========================================================
// Phase 29: Farmer Registration Screen
// Krishi Bazaar – Farmer Mobile Application
// =========================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../providers/auth_provider.dart';
import '../kyc/kyc_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameCtrl     = TextEditingController();
  final _phoneCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _villageCtrl  = TextEditingController();
  final _districtCtrl = TextEditingController();
  final _pinCtrl      = TextEditingController();
  String _selectedState = 'Karnataka';
  int _currentStep = 0;

  final _indianStates = [
    'Andhra Pradesh','Assam','Bihar','Gujarat','Haryana','Himachal Pradesh',
    'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab',
    'Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal',
  ];

  Future<void> _register() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final ok = await auth.register(
      name: _nameCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      password: _passwordCtrl.text.trim(),
      village: _villageCtrl.text.trim(),
      district: _districtCtrl.text.trim(),
      state: _selectedState,
      pinCode: _pinCtrl.text.trim(),
    );
    if (!mounted) return;
    if (ok) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const KycScreen()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.errorMessage ?? 'Registration failed'), backgroundColor: AppConstants.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Farmer Registration')),
      body: Theme(
        data: Theme.of(context).copyWith(colorScheme: Theme.of(context).colorScheme.copyWith(primary: AppConstants.primaryGreen)),
        child: Stepper(
          currentStep: _currentStep,
          onStepContinue: () {
            if (_currentStep < 2) {
              setState(() => _currentStep++);
            } else {
              _register();
            }
          },
          onStepCancel: () {
            if (_currentStep > 0) setState(() => _currentStep--);
          },
          controlsBuilder: (context, details) => Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Row(
              children: [
                ElevatedButton(
                  onPressed: auth.isLoading ? null : details.onStepContinue,
                  child: auth.isLoading && _currentStep == 2
                      ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(_currentStep == 2 ? 'Create Account' : 'Continue'),
                ),
                if (_currentStep > 0) ...[
                  const SizedBox(width: 12),
                  OutlinedButton(onPressed: details.onStepCancel, child: const Text('Back')),
                ],
              ],
            ),
          ),
          steps: [
            // ── Step 1: Personal Details ──────────────────
            Step(
              title: const Text('Personal Details'),
              isActive: _currentStep >= 0,
              state: _currentStep > 0 ? StepState.complete : StepState.indexed,
              content: Column(
                children: [
                  _field(_nameCtrl, 'Full Name', Icons.person_outline, hint: 'Ramesh Kumar Patel'),
                  const SizedBox(height: 14),
                  _field(_phoneCtrl, 'Mobile Number', Icons.phone_outlined, hint: '+91 98765 43210', type: TextInputType.phone),
                  const SizedBox(height: 14),
                  _field(_passwordCtrl, 'Password (min. 8 characters)', Icons.lock_outline, hint: '••••••••', obscure: true),
                ],
              ),
            ),
            // ── Step 2: Farm Location ─────────────────────
            Step(
              title: const Text('Farm Location'),
              isActive: _currentStep >= 1,
              state: _currentStep > 1 ? StepState.complete : StepState.indexed,
              content: Column(
                children: [
                  _field(_villageCtrl, 'Village / Town', Icons.location_city_outlined, hint: 'Nagercoil Village'),
                  const SizedBox(height: 14),
                  _field(_districtCtrl, 'District', Icons.map_outlined, hint: 'Kanyakumari'),
                  const SizedBox(height: 14),
                  DropdownButtonFormField<String>(
                    value: _selectedState,
                    items: _indianStates.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) => setState(() => _selectedState = v!),
                    decoration: const InputDecoration(labelText: 'State', prefixIcon: Icon(Icons.flag_outlined)),
                  ),
                  const SizedBox(height: 14),
                  _field(_pinCtrl, 'PIN Code', Icons.pin_drop_outlined, hint: '629001', type: TextInputType.number),
                ],
              ),
            ),
            // ── Step 3: Confirmation ──────────────────────
            Step(
              title: const Text('Review & Submit'),
              isActive: _currentStep >= 2,
              content: Card(
                color: AppConstants.backgroundLight,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _reviewRow('Name', _nameCtrl.text),
                      _reviewRow('Phone', _phoneCtrl.text),
                      _reviewRow('Village', _villageCtrl.text),
                      _reviewRow('District', _districtCtrl.text),
                      _reviewRow('State', _selectedState),
                      _reviewRow('PIN', _pinCtrl.text),
                      const SizedBox(height: 12),
                      const Text('After registration, you will be guided to complete KYC verification.', style: TextStyle(color: AppConstants.textMuted, fontSize: 12)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String label,
    IconData icon, {
    String hint = '',
    TextInputType type = TextInputType.text,
    bool obscure = false,
  }) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, size: 20),
      ),
    );
  }

  Widget _reviewRow(String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            SizedBox(width: 80, child: Text('$label:', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppConstants.textMuted))),
            Expanded(child: Text(value.isEmpty ? '—' : value, style: const TextStyle(fontSize: 13))),
          ],
        ),
      );
}
