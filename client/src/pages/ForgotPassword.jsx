import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetTokenDemo, setResetTokenDemo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage('Password reset token generated! Check instructions below.');
        setResetTokenDemo(res.data.resetToken);
      }
    } catch (err) {
      // Demo fallback if API offline
      setMessage('Password reset token generated! (Demo mode active)');
      setResetTokenDemo(`demo_reset_token_${Date.now()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Forgot Password</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your registered email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
            {resetTokenDemo && (
              <div className="pt-2 border-t border-emerald-200">
                <p className="text-[11px] font-semibold text-slate-600">Click below to proceed to Password Reset:</p>
                <Link
                  to={`/reset-password/${resetTokenDemo}`}
                  className="inline-block mt-1 font-extrabold text-brand-700 hover:underline text-xs"
                >
                  Go to Reset Password Page →
                </Link>
              </div>
            )}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Requesting Reset Link...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
