import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, Heart, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderTimeline from '../components/customer/OrderTimeline';
import api from '../services/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/customer-dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Using demo customer dashboard data');
        setStats(demoCustomerStats);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-80 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back, {user?.name || 'Customer'}! 🌱</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track active harvest orders, saved produce wishlists, and delivery addresses.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all shrink-0"
        >
          Browse Marketplace <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalOrders || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Active Deliveries</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.activeOrdersCount || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Total Spent</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">${stats?.totalSpent?.toFixed(2) || '0.00'}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Wishlist Saved</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.wishlistCount || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900">Recent Order Activity</h3>
          <Link to="/customer/orders" className="text-xs font-bold text-brand-600 hover:underline">
            View Full Order History →
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No recent orders found.</p>
        ) : (
          <div className="space-y-6">
            {stats?.recentOrders?.slice(0, 2).map((ord) => (
              <div key={ord._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-brand-700">{ord.orderNumber}</span>
                  <span className="text-slate-900">${ord.totalAmount?.toFixed(2)}</span>
                </div>
                <OrderTimeline status={ord.orderStatus} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const demoCustomerStats = {
  totalOrders: 3,
  activeOrdersCount: 1,
  completedOrdersCount: 2,
  totalSpent: 42.50,
  wishlistCount: 4,
  recentOrders: [
    { _id: 'ord1', orderNumber: 'ORD-882910', totalAmount: 18.98, orderStatus: 'harvested_packed' }
  ]
};

export default CustomerDashboard;
