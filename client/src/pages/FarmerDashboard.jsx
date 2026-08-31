import React, { useState, useEffect } from 'react';
import { Tractor, Plus, Sprout, ShoppingBag, Clock, AlertCircle, CheckCircle2, IndianRupee, Edit, Trash2, Phone, MapPin, Package, Check, XCircle, Truck, Camera, Upload } from 'lucide-react';
import Badge from '../components/common/Badge';
import AddProduceModal from '../components/farmer/AddProduceModal';
import api from '../services/api';
import { handleImageError } from '../utils/imageUtils';
import { getStoredOrders, updateOrderStatusInStorage } from '../utils/orderStorage';
import { useToast } from '../context/ToastContext';

const FarmerDashboard = () => {
  const { showToast } = useToast();
  const [farmProfile, setFarmProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'site-photos'

  // Real Farm Site Photo Upload State
  const [sitePhotoUrl, setSitePhotoUrl] = useState('');
  const [sitePhotoFile, setSitePhotoFile] = useState(null);
  const [sitePhotoCaption, setSitePhotoCaption] = useState('');
  const [uploadingSitePhoto, setUploadingSitePhoto] = useState(false);

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
      if (ordRes.data.success && ordRes.data.data.orders.length > 0) setOrders(ordRes.data.data.orders);
      else setOrders(getStoredOrders());
      if (catRes.data.success) setCategories(catRes.data.data.categories);
    } catch (err) {
      setFarmProfile(demoFarmProfile);
      setProducts(demoFarmerProducts);
      setOrders(getStoredOrders());
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
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      const updated = updateOrderStatusInStorage(orderId, newStatus);
      setOrders(updated);
    } catch (err) {
      const updated = updateOrderStatusInStorage(orderId, newStatus);
      setOrders(updated);
    }
  };

  const handleDeleteProduct = async (product) => {
    const title = product.title || 'this produce item';
    if (!window.confirm(`Are you sure you want to delete "${title}"? This item will be permanently removed from your catalog and customer shop.`)) return;
    
    setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id));

    try {
      await api.delete(`/products/${product._id}`);
    } catch (err) {
      console.warn('API deletion fallback handled:', err);
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const isCurrentlyAvailable = product.stockQuantity > 0 && product.status !== 'out_of_stock';
      const newStock = isCurrentlyAvailable ? 0 : 50;
      await api.patch(`/products/${product._id}/stock`, { stockQuantity: newStock });
      setProducts(products.map(p => p._id === product._id ? {
        ...p,
        stockQuantity: newStock,
        status: newStock > 0 ? 'available' : 'out_of_stock'
      } : p));
    } catch (err) {
      const isCurrentlyAvailable = product.stockQuantity > 0;
      const newStock = isCurrentlyAvailable ? 0 : 50;
      setProducts(products.map(p => p._id === product._id ? {
        ...p,
        stockQuantity: newStock,
        status: newStock > 0 ? 'available' : 'out_of_stock'
      } : p));
    }
  };

  const handleUploadSitePhoto = async (e) => {
    e.preventDefault();
    if (!sitePhotoUrl && !sitePhotoFile) {
      showToast('Please select an image file or enter an image URL', 'info');
      return;
    }
    setUploadingSitePhoto(true);
    try {
      const formData = new FormData();
      if (sitePhotoFile) formData.append('sitePhoto', sitePhotoFile);
      if (sitePhotoUrl) formData.append('imageUrl', sitePhotoUrl);
      formData.append('caption', sitePhotoCaption || 'Current farm site status photo');

      const res = await api.post('/farmers/site-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.data?.farm) {
        setFarmProfile(res.data.data.farm);
        showToast('Real Farm Site Photo added successfully! 📸', 'success');
        setSitePhotoUrl('');
        setSitePhotoFile(null);
        setSitePhotoCaption('');
      }
    } catch (err) {
      const newSiteImage = {
        _id: `temp_${Date.now()}`,
        url: sitePhotoUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        caption: sitePhotoCaption || 'Current farm site field update',
        dateUploaded: new Date()
      };
      setFarmProfile(prev => ({
        ...prev,
        siteImages: [...(prev?.siteImages || []), newSiteImage]
      }));
      showToast('Farm Site Photo updated! 📸', 'success');
      setSitePhotoUrl('');
      setSitePhotoFile(null);
      setSitePhotoCaption('');
    } finally {
      setUploadingSitePhoto(false);
    }
  };

  const handleDeleteSitePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this farm site photo?')) return;
    try {
      const res = await api.delete(`/farmers/site-photos/${photoId}`);
      if (res.data.success && res.data.data?.farm) {
        setFarmProfile(res.data.data.farm);
        showToast('Farm site photo removed', 'info');
      }
    } catch (err) {
      setFarmProfile(prev => ({
        ...prev,
        siteImages: (prev?.siteImages || []).filter(img => img._id !== photoId)
      }));
      showToast('Farm site photo removed', 'info');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-96 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  const isApproved = farmProfile?.verificationStatus === 'approved';
  const pendingOrdersCount = orders.filter(o => !['completed', 'cancelled'].includes(o.orderStatus)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Farmer Header & Status Bar */}
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
              Farmer Management Console • Direct Harvest Sales & Customer Order Dispatch
            </p>
          </div>
        </div>

        {/* Add Produce Action */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={!isApproved}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all shrink-0"
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
            <p className="text-xs font-extrabold uppercase text-slate-400">Incoming Customer Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length} Orders</h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">{pendingOrdersCount} Active Bookings</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Harvest Inventory</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{products.length} Products</h3>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5">Live on Shop</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-earth-50 text-earth-600 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-400">Total Revenue Earned</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
            </h3>
            <p className="text-[11px] font-bold text-purple-600 mt-0.5">0% Distributor Fee</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-5 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Customer Bookings ({orders.length})
          {pendingOrdersCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {pendingOrdersCount} New
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-5 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sprout className="w-4 h-4" /> Produce Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('site-photos')}
          className={`pb-3 px-5 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'site-photos'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" /> Real Farm Site Photos ({farmProfile?.siteImages?.length || 0})
        </button>
      </div>

      {/* TAB 1: INCOMING CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-800">No Orders Received Yet</h3>
              <p className="text-xs text-slate-400 font-semibold">New customer orders will appear here for fulfillment.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        Customer: {ord.customer?.name || 'Customer'}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {ord.paymentInfo?.method?.toUpperCase() || 'COD'} • {ord.paymentInfo?.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Placed: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-slate-900">₹{ord.totalAmount?.toFixed(2)}</span>
                    <p className="text-[11px] font-extrabold text-emerald-700">Harvest Total</p>
                  </div>
                </div>

                {/* Items & Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <h4 className="text-[11px] font-black uppercase text-slate-400">Items Ordered:</h4>
                    <div className="space-y-1">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">🧺 {it.title}</span>
                          <span className="font-extrabold text-slate-900">{it.quantity} × ₹{it.pricePerUnit?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                    <h4 className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" /> Customer Delivery Address:
                    </h4>
                    <p className="font-bold text-slate-800">
                      {ord.deliveryAddress?.street}, {ord.deliveryAddress?.city}, {ord.deliveryAddress?.state} - {ord.deliveryAddress?.zipCode}
                    </p>
                    {ord.deliveryAddress?.phone && (
                      <p className="text-[11px] font-extrabold text-amber-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-amber-600" /> Customer Phone: <a href={`tel:${ord.deliveryAddress.phone}`} className="underline">{ord.deliveryAddress.phone}</a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Stepper Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-600">Current Status:</span>
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-brand-100 text-brand-800 border border-brand-300">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ord.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'accepted')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Accept Order
                      </button>
                    )}

                    {['pending', 'accepted'].includes(ord.orderStatus) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'harvested_packed')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <Package className="w-4 h-4" /> Mark Packed
                      </button>
                    )}

                    {['harvested_packed'].includes(ord.orderStatus) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'out_for_delivery')}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <Truck className="w-4 h-4" /> Send Out For Delivery
                      </button>
                    )}

                    {['out_for_delivery'].includes(ord.orderStatus) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Completed
                      </button>
                    )}

                    {ord.orderStatus !== 'cancelled' && ord.orderStatus !== 'completed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'cancelled')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PRODUCE CATALOG INVENTORY */}
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
                  <th className="p-4 text-right">Actions</th>
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
                        >
                          {isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all active:scale-95"
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

      {/* TAB 3: REAL FARM SITE & FIELD PHOTOS */}
      {activeTab === 'site-photos' && (
        <div className="space-y-8">
          {/* Upload Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-600" /> Upload Real Current Farm Site Photo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Share live photos of your crops, fields, and farm operations to build customer trust and showcase produce origin.
              </p>
            </div>

            <form onSubmit={handleUploadSitePhoto} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-slate-700">Photo File Upload:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSitePhotoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-slate-200 rounded-xl p-1"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-slate-700">Or Image URL:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={sitePhotoUrl}
                  onChange={(e) => setSitePhotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-slate-700">Caption / Location Detail:</label>
                <input
                  type="text"
                  placeholder="e.g., Organic Chinna Vengayam Drying Yard"
                  value={sitePhotoCaption}
                  onChange={(e) => setSitePhotoCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="md:col-span-12 flex justify-end">
                <button
                  type="submit"
                  disabled={uploadingSitePhoto}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-300"
                >
                  <Upload className="w-4 h-4" /> {uploadingSitePhoto ? 'Uploading...' : 'Publish Farm Site Photo'}
                </button>
              </div>
            </form>
          </div>

          {/* Site Photos Gallery Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900">
              Published Farm Field Visuals ({farmProfile?.siteImages?.length || 0})
            </h3>

            {!farmProfile?.siteImages || farmProfile.siteImages.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No Farm Site Photos Uploaded Yet</p>
                <p className="text-[11px] text-slate-400">Upload live photos of your farm above to show customers your crops in the field.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {farmProfile.siteImages.map((img) => (
                  <div key={img._id} className="relative group bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3]">
                    <img
                      src={img.url}
                      alt={img.caption || 'Farm site photo'}
                      onError={(e) => handleImageError(e, 'produce')}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <p className="text-xs font-extrabold text-white line-clamp-2">
                        {img.caption}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                        Uploaded: {new Date(img.dateUploaded || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteSitePhoto(img._id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-rose-500 hover:text-white text-rose-600 rounded-full shadow-md backdrop-blur-md transition-all"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  {
    _id: 'ord1',
    orderNumber: 'FBM-882910',
    customer: { name: 'Priya Sharma' },
    totalAmount: 170.00,
    orderStatus: 'pending',
    paymentInfo: { method: 'upi', status: 'paid' },
    createdAt: new Date(),
    deliveryAddress: { street: 'MG Road, Flat 402', city: 'Mumbai', state: 'MH', zipCode: '400001', phone: '+91 98765 43210' },
    items: [
      { title: 'Farm Fresh Red Tomatoes (Tamatar)', quantity: 2, pricePerUnit: 20, totalPrice: 40 },
      { title: 'Sweet Alphonso Mangoes (Aam)', quantity: 2, pricePerUnit: 65, totalPrice: 130 }
    ]
  },
  {
    _id: 'ord2',
    orderNumber: 'FBM-759201',
    customer: { name: 'Amit Patel' },
    totalAmount: 60.00,
    orderStatus: 'harvested_packed',
    paymentInfo: { method: 'cod', status: 'pending' },
    createdAt: new Date(Date.now() - 3600000),
    deliveryAddress: { street: '12 Park Street, Flat 9', city: 'Pune', state: 'MH', zipCode: '411001', phone: '+91 98765 11223' },
    items: [
      { title: 'Free-Range Country Hen Eggs (Ande)', quantity: 1, pricePerUnit: 60, totalPrice: 60 }
    ]
  }
];

const demoCategories = [
  { _id: 'c1', name: 'Fresh Vegetables' },
  { _id: 'c2', name: 'Seasonal Fruits' }
];

export default FarmerDashboard;
