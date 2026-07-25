import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      if (res.user.role === 'farmer') navigate('/farmer/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/shop');
    } else {
      setError(res?.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 font-medium">Sign in to manage your farm orders or produce listings</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Quick Demo Role Auto-Login Buttons */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 text-center">
            ⚡ Quick 1-Click Demo Logins:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { switchRoleDemo('customer'); navigate('/shop'); }}
              className="py-2 px-1 text-[11px] font-bold bg-white text-brand-700 border border-slate-200 rounded-xl hover:bg-brand-50 shadow-sm"
            >
              Customer
            </button>
            <button
              onClick={() => { switchRoleDemo('farmer'); navigate('/farmer/dashboard'); }}
              className="py-2 px-1 text-[11px] font-bold bg-white text-earth-800 border border-slate-200 rounded-xl hover:bg-earth-50 shadow-sm"
            >
              Farmer
            </button>
            <button
              onClick={() => { switchRoleDemo('admin'); navigate('/admin/dashboard'); }}
              className="py-2 px-1 text-[11px] font-bold bg-white text-purple-800 border border-slate-200 rounded-xl hover:bg-purple-50 shadow-sm"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
