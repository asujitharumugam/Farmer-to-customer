import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Tractor, IndianRupee, Plus, CheckCircle2, XCircle, Search, UserCheck, UserX, Lock, Unlock, Mail, Phone, Calendar, Filter, Star, MessageSquare, Check, ThumbsUp, AlertCircle } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import VerificationCard from '../components/admin/VerificationCard';
import api from '../services/api';
import { handleImageError } from '../utils/imageUtils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingFarms, setPendingFarms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Management Filter & Search State
  const [userRoleFilter, setUserRoleFilter] = useState('all'); // 'all' | 'customer' | 'farmer' | 'pending'
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'reviews' | 'categories'

  // New Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, catRes, usersRes, revRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/farmers/pending'),
        api.get('/admin/categories'),
        api.get('/admin/users'),
        api.get('/reviews/admin/all')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (pendingRes.data.success) setPendingFarms(pendingRes.data.data.farms);
      if (catRes.data.success) setCategories(catRes.data.data.categories);
      if (usersRes.data.success) setUsers(usersRes.data.data.users);
      if (revRes.data.success) setReviews(revRes.data.data.reviews);
    } catch (err) {
      console.warn('Using demo admin dataset');
      setStats(demoStats);
      setPendingFarms(demoPendingFarms);
      setCategories(demoCategories);
      setUsers(demoUsers);
      setReviews(demoReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    setCreatingCat(true);
    try {
      const res = await api.post('/admin/categories', {
        name: catName,
        description: catDesc,
        image: catImage
      });
      if (res.data.success) {
        setCategories([...categories, res.data.data.category]);
        setCatName('');
        setCatDesc('');
        setCatImage('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleVerificationAction = (farmId, status) => {
    setPendingFarms(prev => prev.filter(f => f._id !== farmId));
    setStats(prev => prev ? {
      ...prev,
      pendingVerifications: Math.max(0, (prev.pendingVerifications || 1) - 1),
      totalFarmers: status === 'approved' ? (prev.totalFarmers || 0) + 1 : prev.totalFarmers
    } : prev);
    fetchData();
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const targetStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    setStatusUpdatingId(userId);
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: targetStatus });
      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === userId ? { ...u, status: targetStatus } : u))
      );
    } catch (err) {
      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === userId ? { ...u, status: targetStatus } : u))
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleApproveUserAccount = async (userId, targetApproval) => {
    setStatusUpdatingId(userId);
    try {
      await api.patch(`/admin/users/${userId}/approve`, { approvalStatus: targetApproval });
      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === userId ? { ...u, approvalStatus: targetApproval } : u))
      );
    } catch (err) {
      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === userId ? { ...u, approvalStatus: targetApproval } : u))
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Filtered Users computation
  const filteredUsers = users.filter(user => {
    const matchesRole =
      userRoleFilter === 'all' ||
      (userRoleFilter === 'pending' ? user.approvalStatus === 'pending' : user.role === userRoleFilter);
    const matchesQuery =
      user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.phone?.includes(userSearchQuery);
    return matchesRole && matchesQuery;
  });

  const totalCustomersCount = users.filter(u => u.role === 'customer').length;
  const totalFarmersCount = users.filter(u => u.role === 'farmer').length;
  const pendingUserApprovalsCount = users.filter(u => u.approvalStatus === 'pending').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900">Platform Control Center</h1>
            <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
              Admin Superuser 🛡️
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage registered customer accounts, farmer accreditation, account approval, product feedback, and category taxonomy.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gross Merchandise (GMV)"
          value={`₹${stats?.totalGMV?.toFixed(2) || '489.20'}`}
          icon={IndianRupee}
          color="brand"
          subtext="Total processed volume"
        />
        <StatsCard
          title="Registered Farmers"
          value={totalFarmersCount || stats?.totalFarmers || 14}
          icon={Tractor}
          color="amber"
          subtext="Farmer accounts registered"
        />
        <StatsCard
          title="Pending Applications"
          value={pendingUserApprovalsCount || stats?.pendingVerifications || pendingFarms.length}
          icon={ShieldCheck}
          color="purple"
          subtext="Require account review"
        />
        <StatsCard
          title="Registered Customers"
          value={totalCustomersCount || stats?.totalCustomers || 86}
          icon={Users}
          color="blue"
          subtext="Customer buyer accounts"
        />
      </div>

      {/* ADMIN TABS SWITCHER */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeAdminTab === 'users'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Registered Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('reviews')}
          className={`pb-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeAdminTab === 'reviews'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Customer Reviews & Feedback ({reviews.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`pb-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeAdminTab === 'categories'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" /> Categories Taxonomy ({categories.length})
        </button>
      </div>

      {/* TAB 1: DEDICATED USER & ACCOUNT ACCESS CONTROL SECTION */}
      {activeAdminTab === 'users' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-600" />
                <h2 className="text-xl font-extrabold text-slate-900">Registered Customer & Farmer Accounts</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Inspect exact registered names, email, phone numbers, avatars, approval state, and grant access permissions.
              </p>
            </div>

            {/* Search & Role Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              {/* Role Filter Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setUserRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex-1 sm:flex-initial ${
                    userRoleFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('customer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex-1 sm:flex-initial ${
                    userRoleFilter === 'customer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Customers ({totalCustomersCount})
                </button>
                <button
                  onClick={() => setUserRoleFilter('farmer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex-1 sm:flex-initial ${
                    userRoleFilter === 'farmer'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Farmers ({totalFarmersCount})
                </button>
              </div>
            </div>
          </div>

          {/* User Account Table List */}
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400">
              No registered accounts found matching your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider text-[10px] bg-slate-50/50">
                    <th className="py-3 px-4 rounded-l-xl">User Account Name</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Admin Approval Status</th>
                    <th className="py-3 px-4">Access Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((usr) => {
                    const isSuspended = usr.status === 'suspended';
                    const isApproved = usr.approvalStatus !== 'pending' && usr.approvalStatus !== 'rejected';
                    const isUpdating = statusUpdatingId === usr._id;
                    const isUserAdmin = usr.role === 'admin';

                    return (
                      <tr key={usr._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* User Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                              alt={usr.name}
                              onError={(e) => handleImageError(e, 'avatar')}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-sm"
                            />
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs">{usr.name}</h4>
                              <span className="text-[10px] text-slate-400 font-bold">ID: {usr._id.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Mail className="w-3.5 h-3.5 text-brand-600" />
                            <span>{usr.email}</span>
                          </div>
                          {usr.phone && (
                            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-amber-600" />
                              <span>{usr.phone}</span>
                            </div>
                          )}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          {usr.role === 'farmer' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              🌾 Farmer
                            </span>
                          ) : usr.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              🛡️ Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              👤 Customer
                            </span>
                          )}
                        </td>

                        {/* Admin Approval Status */}
                        <td className="py-3.5 px-4">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved Account
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Review
                            </span>
                          )}
                        </td>

                        {/* Access Status Badge */}
                        <td className="py-3.5 px-4">
                          {isSuspended ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              🔴 Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🟢 Active
                            </span>
                          )}
                        </td>

                        {/* Registered Date */}
                        <td className="py-3.5 px-4 text-slate-500 font-medium text-[11px]">
                          {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {isUserAdmin ? (
                            <span className="text-[10px] text-slate-400 font-bold italic">Protected Admin</span>
                          ) : (
                            <>
                              {!isApproved && (
                                <button
                                  onClick={() => handleApproveUserAccount(usr._id, 'approved')}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm"
                                >
                                  Approve
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleUserStatus(usr._id, usr.status)}
                                disabled={isUpdating}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-[11px] shadow-sm transition-all ${
                                  isSuspended
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {isSuspended ? 'Activate' : 'Suspend'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PRODUCT REVIEWS & FEEDBACK MONITORING */}
      {activeAdminTab === 'reviews' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" /> Customer Product Reviews & Feedback ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Monitor product reviews submitted by customers across produce items in the marketplace.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs font-bold text-slate-400">
              No customer product reviews posted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={rev._id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.customer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={rev.customer?.name}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{rev.customer?.name || 'Verified Customer'}</h4>
                        <p className="text-[10px] font-semibold text-brand-700">Produce: {rev.product?.title || 'Heirloom Vine Tomatoes'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      <span className="text-[11px] text-slate-500 font-bold ml-1">({rev.rating}/5)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium pl-12">{rev.comment}</p>
                  <p className="text-[10px] text-slate-400 text-right font-semibold">
                    Posted: {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: CATEGORIES TAXONOMY */}
      {activeAdminTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-600" /> Add Produce Category
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Honey & Apiary"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short taxonomy summary"
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={catImage}
                  onChange={e => setCatImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={creatingCat}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {creatingCat ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Active Category Taxonomy</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => (
                <div key={c._id || c.slug} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2">
                  <img src={c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80'} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-xs font-bold text-slate-900 truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const demoStats = {
  totalGMV: 489.20,
  totalFarmers: 14,
  pendingVerifications: 1,
  totalCustomers: 86
};

const demoPendingFarms = [
  {
    _id: 'farm_pending_1',
    farmName: 'Kongu Valley Organic Hydroponics',
    user: { name: 'Ramasamy Gounder', email: 'ramasamy@kongufarms.tn', phone: '+91 94421 88990' },
    location: { address: '88 Pollachi Main Road', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641001' },
    verificationDocs: [{ docType: 'Tamil Nadu Organic Certification (TNOCD)', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }]
  }
];

const demoCategories = [
  { _id: 'c1', name: 'Fresh Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80' },
  { _id: 'c2', name: 'Seasonal Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=100&q=80' },
  { _id: 'c3', name: 'Grains & Pulses', slug: 'grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=100&q=80' }
];

const demoUsers = [
  { _id: 'u1', name: 'Muthusamy Gounder', email: 'farmer@greenacres.com', role: 'farmer', status: 'active', approvalStatus: 'approved', createdAt: '2026-09-09T04:56:37.000Z', phone: '+91 94432 10987', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { _id: 'u2', name: 'Anand Kumar', email: 'customer@gmail.com', role: 'customer', status: 'active', approvalStatus: 'approved', createdAt: '2026-09-09T04:56:37.000Z', phone: '+91 98401 23456', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }
];

const demoReviews = [
  { _id: 'r1', customer: { name: 'Anand Kumar', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }, product: { title: 'Perambalur Small Onions / Chinna Vengayam' }, rating: 5, comment: 'Super crisp and authentic Tamil Nadu Chinna Vengayam shallots! Perfectly packed.', createdAt: '2026-09-18T10:30:00Z' },
  { _id: 'r2', customer: { name: 'Priya Sundaram', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }, product: { title: 'Madurai Country Organic Tomatoes' }, rating: 5, comment: 'Rich tangy flavor! Natural sourness perfect for Madurai style Rasam.', createdAt: '2026-09-19T14:15:00Z' }
];

export default AdminDashboard;
