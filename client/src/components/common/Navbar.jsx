import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Sprout, ShieldCheck, Tractor, Search, Menu, X, ChevronDown, Heart, Settings as SettingsIcon, Info, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const { cartItemCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                Farm<span className="text-brand-600">Direct</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-700 font-sans">
                Farm-to-Table Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search heirloom tomatoes, avocados, honey..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </form>

          {/* Nav Links & Controls */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/shop"
              className={`text-sm font-semibold transition-colors hover:text-brand-600 ${
                location.pathname === '/shop' ? 'text-brand-600 font-bold' : 'text-slate-700'
              }`}
            >
              Shop Produce
            </Link>

            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors hover:text-brand-600 ${
                location.pathname === '/about' ? 'text-brand-600 font-bold' : 'text-slate-700'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors hover:text-brand-600 ${
                location.pathname === '/contact' ? 'text-brand-600 font-bold' : 'text-slate-700'
              }`}
            >
              Contact
            </Link>

            {user?.role === 'farmer' && (
              <Link
                to="/farmer/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-earth-800 bg-earth-50 px-3 py-1.5 rounded-lg border border-earth-100 hover:bg-earth-100 transition-colors"
              >
                <Tractor className="w-4 h-4 text-earth-500" /> Farmer Hub
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Control
              </Link>
            )}

            {user?.role === 'customer' && (
              <>
                <Link
                  to="/customer/dashboard"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/customer/orders"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Orders
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-3">

            {/* Quick Role Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
              <span className="px-2 text-[10px] uppercase font-bold text-slate-400">Demo Role:</span>
              <button
                onClick={() => switchRoleDemo('customer')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  user?.role === 'customer' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRoleDemo('farmer')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  user?.role === 'farmer' ? 'bg-white text-earth-800 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => switchRoleDemo('admin')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  user?.role === 'admin' ? 'bg-white text-purple-700 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Auth Dropdown */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-all border border-slate-200">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                  />
                  <span className="hidden md:inline text-xs font-bold text-slate-800 pr-1 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition-all z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      Role: {user.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-500" /> Profile & Addresses
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-500" /> Settings
                  </Link>

                  {user.role === 'farmer' && (
                    <Link
                      to="/farmer/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Tractor className="w-4 h-4 text-earth-600" /> Farmer Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'customer' && (
                    <>
                      <Link
                        to="/customer/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-brand-600" /> Customer Dashboard
                      </Link>
                      <Link
                        to="/customer/orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-600" /> Order History
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Heart className="w-4 h-4 text-rose-500" /> Wishlist
                      </Link>
                    </>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
          >
            Landing Page
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
          >
            Shop Produce Catalog
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
          >
            Contact Support
          </Link>

          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
              >
                My Profile & Addresses
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-800 py-2 border-b border-slate-100"
              >
                Settings
              </Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
              <Link
                to="/customer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-brand-700 py-2 border-b border-slate-100"
              >
                Customer Dashboard
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-rose-600 py-2 border-b border-slate-100"
              >
                Saved Wishlist
              </Link>
            </>
          )}

          {user?.role === 'farmer' && (
            <Link
              to="/farmer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-earth-800 py-2 border-b border-slate-100"
            >
              Farmer Dashboard
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-purple-800 py-2 border-b border-slate-100"
            >
              Admin Control Panel
            </Link>
          )}

          <div className="pt-2">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Switch Demo User Role:</p>
            <div className="flex gap-2">
              <button
                onClick={() => { switchRoleDemo('customer'); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs font-bold bg-brand-50 text-brand-700 rounded-lg border border-brand-200"
              >
                Customer
              </button>
              <button
                onClick={() => { switchRoleDemo('farmer'); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs font-bold bg-earth-50 text-earth-800 rounded-lg border border-earth-200"
              >
                Farmer
              </button>
              <button
                onClick={() => { switchRoleDemo('admin'); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs font-bold bg-purple-50 text-purple-800 rounded-lg border border-purple-200"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
