import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Tractor, ShoppingBag, IndianRupee, Plus, CheckCircle2, XCircle } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import VerificationCard from '../components/admin/VerificationCard';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingFarms, setPendingFarms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, catRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/farmers/pending'),
        api.get('/admin/categories'),
        api.get('/admin/users')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (pendingRes.data.success) setPendingFarms(pendingRes.data.data.farms);
      if (catRes.data.success) setCategories(catRes.data.data.categories);
      if (usersRes.data.success) setUsers(usersRes.data.data.users);
    } catch (err) {
      console.warn('Using demo admin dataset');
      setStats(demoStats);
      setPendingFarms(demoPendingFarms);
      setCategories(demoCategories);
      setUsers(demoUsers);
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

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-96 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900">Platform Control Center</h1>
            <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg">Admin Superuser</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage farmer accreditation, platform GMV, category taxonomy, and moderation.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gross Merchandise (GMV)"
          value={`₹${stats?.totalGMV?.toFixed(2) || '0.00'}`}
          icon={IndianRupee}
          color="brand"
          subtext="Total processed volume"
        />
        <StatsCard
          title="Verified Farmers"
          value={stats?.totalFarmers || 0}
          icon={Tractor}
          color="amber"
          subtext="Registered farm accounts"
        />
        <StatsCard
          title="Pending Applications"
          value={stats?.pendingVerifications || pendingFarms.length}
          icon={ShieldCheck}
          color="purple"
          subtext="Require document review"
        />
        <StatsCard
          title="Customer Accounts"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="blue"
          subtext="Active platform buyers"
        />
      </div>

      {/* Farmer Verification Applications Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" /> Pending Farmer Verification Queue ({pendingFarms.length})
        </h2>

        {pendingFarms.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs font-bold text-slate-500">
            No pending farmer applications requiring review at this time. 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {pendingFarms.map((farm) => (
              <VerificationCard key={farm._id} farm={farm} onActionComplete={fetchData} />
            ))}
          </div>
        )}
      </div>

      {/* Category Creator & Manager Section */}
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
    farmName: 'Sunrise Hill Hydroponics',
    user: { name: 'Robert Vance', email: 'vance@sunrise.com', phone: '+1 555 992 1100' },
    location: { address: '88 River Road', city: 'Salinas', state: 'CA' },
    verificationDocs: [{ docType: 'Hydroponics Permit', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }]
  }
];

const demoCategories = [
  { _id: 'c1', name: 'Fresh Vegetables', slug: 'vegetables' },
  { _id: 'c2', name: 'Seasonal Fruits', slug: 'fruits' },
  { _id: 'c3', name: 'Grains & Pulses', slug: 'grains' }
];

const demoUsers = [
  { _id: 'u1', name: 'John Harvest', email: 'farmer@greenacres.com', role: 'farmer' },
  { _id: 'u2', name: 'Sarah Jenkins', email: 'customer@gmail.com', role: 'customer' }
];

export default AdminDashboard;
