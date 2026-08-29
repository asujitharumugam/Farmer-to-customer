import React, { useState, useEffect } from 'react';
import { Tractor, Plus, Sprout, ShoppingBag, Clock, AlertCircle, CheckCircle2, IndianRupee, Edit, Trash2 } from 'lucide-react';
import Badge from '../components/common/Badge';
import AddProduceModal from '../components/farmer/AddProduceModal';
import api from '../services/api';
import { handleImageError } from '../utils/imageUtils';

const FarmerDashboard = () => {
  const [farmProfile, setFarmProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [farmRes, prodRes, ordRes, catRes] = await Promise.all([
        api.get('/farmers/profile'),
        api.get('/products?status=all'),
        api.get('/orders/farmer-orders'),
        api.get('/admin/categories')
      ]);

      if (farmRes.data.success) setFarmProfile(farmRes.data.data.farm);
      if (prodRes.data.success) setProducts(prodRes.data.data.products);
      if (ordRes.data.success) setOrders(ordRes.data.data.orders);
      if (catRes.data.success) setCategories(catRes.data.data.categories);
    } catch (err) {
      console.warn('Using demo farmer dataset');
      setFarmProfile(demoFarmProfile);
      setProducts(demoFarmerProducts);
      setOrders(demoFarmerOrders);
      setCategories(demoCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDeleteProduct = async (product) => {
    const title = product.title || 'this produce item';
    if (!window.confirm(`Are you sure you want to delete "${title}"? This item will be permanently removed from your catalog and customer shop.`)) return;
    
    // Remove from UI immediately for snappy feedback
    setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id));

    try {
      await api.delete(`/products/${product._id}`);
    } catch (err) {
      console.warn('API deletion fallback handled:', err);
      // Even if API fails (e.g. demo data ID), local state remains filtered
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const isCurrentlyAvailable = product.stockQuantity > 0 && product.status !== 'out_of_stock';
      const newStock = isCurrentlyAvailable ? 0 : 50;
      const res = await api.patch(`/products/${product._id}/stock`, { stockQuantity: newStock });
      if (res.data.success) {
        setProducts(products.map(p => p._id === product._id ? {
          ...p,
          stockQuantity: newStock,
          status: newStock > 0 ? 'available' : 'out_of_stock'
        } : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update produce availability status');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-96 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  const isApproved = farmProfile?.verificationStatus === 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Farmer Banner & Status Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-earth-500/20 text-earth-800 flex items-center justify-center font-bold text-2xl border border-earth-200">
            🚜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {farmProfile?.farmName || 'Green Acres Organic Valley'}
              </h1>
              <Badge variant={farmProfile?.verificationStatus || 'approved'}>
                {farmProfile?.verificationStatus || 'approved'}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Farmer Management Console • Direct Harvest Sales
            </p>
          </div>
        </div>

        {/* Add Produce Action */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={!isApproved}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Produce Listing
        </button>
      </div>

      {!isApproved && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            Your farm verification status is <strong>{farmProfile?.verificationStatus || 'pending'}</strong>. 
            An administrator must verify your accreditation documents before you can post public produce listings.
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Active Listings</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Incoming Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-earth-50 text-earth-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Total Farm Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'inventory'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Produce Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Bookings ({orders.length})
        </button>
      </div>

      {/* Tab 1: Produce Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                  <th className="p-4">Produce</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Harvest Date</th>
                  <th className="p-4">Organic</th>
                  <th className="p-4 text-right">Actions & Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {products.map((p) => {
                  const isAvailable = p.stockQuantity > 0 && p.status !== 'out_of_stock';
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'}
                          alt={p.title}
                          onError={(e) => handleImageError(e, 'produce')}
                          className="w-10 h-10 object-cover rounded-xl border"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[10px] text-slate-400">{p.unit}</p>
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">₹{p.pricePerUnit?.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isAvailable ? `In Stock (${p.stockQuantity} ${p.unit}s)` : 'Out of Stock (0)'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {p.harvestDate ? new Date(p.harvestDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        {p.isOrganic ? <span className="text-emerald-600 font-bold">Yes 🌿</span> : <span className="text-slate-400">No</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                            isAvailable
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title={isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                        >
                          {isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all active:scale-95"
                          title="Delete produce listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Incoming Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {ord.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Customer: {ord.customer?.name || 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Total: <strong className="text-slate-900">₹{ord.totalAmount?.toFixed(2)}</strong> • Address: {ord.deliveryAddress?.street}, {ord.deliveryAddress?.city}
                </p>
              </div>

              {/* Status Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Update Fulfillment:</span>
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">1. Pending Review</option>
                  <option value="accepted">2. Accepted Order</option>
                  <option value="harvested_packed">3. Harvested & Packed</option>
                  <option value="out_for_delivery">4. Out for Delivery</option>
                  <option value="completed">5. Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Produce Modal */}
      <AddProduceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchData}
        categories={categories}
      />

    </div>
  );
};

const demoFarmProfile = {
  _id: 'f1',
  farmName: 'Green Acres Organic Valley',
  verificationStatus: 'approved'
};

const demoFarmerProducts = [
  { _id: 'p1', title: 'Farm Fresh Red Tomatoes (Tamatar)', pricePerUnit: 20.00, unit: 'kg', stockQuantity: 150, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80'] },
  { _id: 'p2', title: 'Sweet Alphonso Mangoes (Aam)', pricePerUnit: 65.00, unit: 'kg', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=80'] }
];

const demoFarmerOrders = [
  { _id: 'ord1', orderNumber: 'ORD-882910', customer: { name: 'Priya Sharma' }, totalAmount: 170.00, orderStatus: 'harvested_packed', deliveryAddress: { street: 'MG Road, Flat 402', city: 'Mumbai' } }
];

const demoCategories = [
  { _id: 'c1', name: 'Fresh Vegetables' },
  { _id: 'c2', name: 'Seasonal Fruits' }
];

export default FarmerDashboard;
