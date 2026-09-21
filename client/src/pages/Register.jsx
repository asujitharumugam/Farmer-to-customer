import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, User, Mail, Lock, Phone, ArrowRight, Tractor, ShoppingBag, ShieldCheck, Check, KeyRound, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const { register, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Authentication Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState('phone'); // 'phone' | 'email'
  const [generatedOtpCode, setGeneratedOtpCode] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleStartOtpVerification = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all registration fields.');
      return;
    }

    setShowOtpModal(true);
    triggerSendOtp('phone');
  };

  const triggerSendOtp = async (channelType) => {
    setOtpType(channelType);
    setOtpSending(true);
    setOtpError('');
    setUserOtpInput('');

    const target = channelType === 'phone' ? phone : email;
    const res = await sendOTP(target, channelType);

    setOtpSending(false);
    if (res?.success) {
      setGeneratedOtpCode(res.otpCode);
    } else {
      setOtpError('Failed to send OTP code. Please retry.');
    }
  };

  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!userOtpInput || userOtpInput.length !== 6) {
      setOtpError('Please enter the valid 6-digit OTP code.');
      return;
    }

    const target = otpType === 'phone' ? phone : email;
    const res = await verifyOTP(target, userOtpInput);

    if (res?.success) {
      setIsOtpVerified(true);
      setShowOtpModal(false);
      // Submit final registration
      executeFinalRegistration();
    } else {
      setOtpError(res?.message || 'Invalid OTP code entered.');
    }
  };

  const executeFinalRegistration = async () => {
    setLoading(true);
    setError('');

    const res = await register({ name, email, phone, password, role, otpVerified: true });
    setLoading(false);

    if (res?.success) {
      if (role === 'farmer') navigate('/farmer/onboarding');
      else navigate('/shop');
    } else {
      setError(res?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500 font-medium">Join our farm-to-table produce marketplace</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              role === 'customer'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Customer
          </button>

          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              role === 'farmer'
                ? 'bg-white text-earth-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-4 h-4" /> Farmer / Grower
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleStartOtpVerification} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Harvest"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phone Number (For OTP Verification)</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98401 23456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Verify OTP & Create Account'} <KeyRound className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>

      </div>

      {/* OTP AUTHENTICATION INTERACTIVE MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">OTP Authentication</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Verify ownership of your account contact</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Channel: Phone SMS vs Email OTP */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => triggerSendOtp('phone')}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  otpType === 'phone'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> SMS Mobile OTP
              </button>

              <button
                type="button"
                onClick={() => triggerSendOtp('email')}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  otpType === 'email'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email OTP
              </button>
            </div>

            {/* Generated Code Simulation Notification Banner */}
            {generatedOtpCode && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-2 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-900 text-xs font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>OTP Code Dispatched to {otpType === 'phone' ? phone : email}:</span>
                </div>
                <div className="text-2xl font-black tracking-widest text-emerald-700 bg-white py-1 px-4 rounded-xl border border-emerald-300 inline-block">
                  {generatedOtpCode}
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setUserOtpInput(generatedOtpCode)}
                    className="text-[11px] font-black text-brand-700 hover:underline bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200"
                  >
                    ⚡ Click to Auto-fill OTP Code
                  </button>
                </div>
              </div>
            )}

            {otpError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <div className="space-y-1 text-center">
                <label className="text-xs font-bold text-slate-700 block">Enter 6-Digit OTP Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 684920"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-widest text-xl font-black bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => triggerSendOtp(otpType)}
                  disabled={otpSending}
                  className="text-brand-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={otpSending}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Verify OTP & Create Account
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
