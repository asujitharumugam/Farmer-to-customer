import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Tractor, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  
  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState(initialRole);
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('customer123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'customer') {
      setEmail('customer@example.com');
      setPassword('customer123');
    } else if (role === 'farmer') {
      setEmail('farmer@example.com');
      setPassword('farmer123');
    } else if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    }
  };

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
      switchRoleDemo(activeRole);
      if (activeRole === 'farmer') navigate('/farmer/dashboard');
      else if (activeRole === 'admin') navigate('/admin/dashboard');
      else navigate('/shop');
    }
  };

  const roleTheme = {
    customer: {
      title: 'Customer Portal Login',
      subtitle: 'Shop 100% farm-fresh produce directly from local growers',
      badge: 'Customer Access',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnBg: 'bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 shadow-brand-600/30',
      icon: <Sprout className="w-6 h-6 text-white" />
    },
    farmer: {
      title: 'Farmer & Grower Hub Login',
      subtitle: 'List your harvest batches, manage orders & track earnings',
      badge: 'Farmer / Producer Access',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      btnBg: 'bg-gradient-to-r from-amber-600 to-earth-800 hover:from-amber-700 hover:to-earth-900 shadow-amber-600/30',
      icon: <Tractor className="w-6 h-6 text-white" />
    },
    admin: {
      title: 'Platform Control Panel Login',
      subtitle: 'Supervise categories, manage verification & system metrics',
      badge: 'Administrator Access',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      btnBg: 'bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-purple-600/30',
      icon: <ShieldCheck className="w-6 h-6 text-white" />
    }
  }[activeRole];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleRoleTabChange('customer')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              activeRole === 'customer'
                ? 'bg-white text-emerald-700 shadow-md font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" /> Customer
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('farmer')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              activeRole === 'farmer'
                ? 'bg-white text-amber-800 shadow-md font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-4 h-4" /> Farmer
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              activeRole === 'admin'
                ? 'bg-white text-purple-800 shadow-md font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
            activeRole === 'customer' ? 'bg-emerald-600' : activeRole === 'farmer' ? 'bg-amber-600' : 'bg-purple-700'
          }`}>
            {roleTheme.icon}
          </div>

          <span className={`inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${roleTheme.badgeBg}`}>
            {roleTheme.badge}
          </span>

          <h2 className="text-2xl font-black text-slate-900">{roleTheme.title}</h2>
          <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">{roleTheme.subtitle}</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* 1-Click Auto Demo Login Bar */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            ⚡ Quick Demo Auto-Fill:
          </p>
          <button
            type="button"
            onClick={() => { switchRoleDemo(activeRole); navigate(activeRole === 'farmer' ? '/farmer/dashboard' : activeRole === 'admin' ? '/admin/dashboard' : '/shop'); }}
            className="w-full py-2.5 px-3 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-black shadow-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            1-Click Sign In as {activeRole.toUpperCase()}
          </button>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:bg-white"
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
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${roleTheme.btnBg}`}
          >
            {loading ? 'Authenticating...' : `Sign In as ${activeRole.toUpperCase()}`} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to={`/register?role=${activeRole}`} className="font-bold text-brand-600 hover:underline">
            Register as {activeRole}
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
