import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Clock, MapPin, PackageCheck, Truck, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Phone, Star, ArrowLeft,
  Package, RotateCcw, AlertCircle, Loader2, Home
} from 'lucide-react';
import api from '../services/api';

// --- Status Config ---
const STATUS_CONFIG = {
  pending: {
    label: 'Order Placed', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    icon: '📋', canCancel: true, steps: 1
  },
  accepted: {
    label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
    icon: '✅', canCancel: false, steps: 2
  },
  harvested_packed: {
    label: 'Packed', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',
    icon: '📦', canCancel: false, steps: 3
  },
  out_for_delivery: {
    label: 'Out For Delivery', color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200',
    icon: '🛵', canCancel: false, steps: 4
  },
  completed: {
    label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
    icon: '🎉', canCancel: false, steps: 5
  },
  cancelled: {
    label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200',
    icon: '❌', canCancel: false, steps: 0
  }
};

const TIMELINE_STEPS = [
  { key: 'pending',           label: 'Order Placed',     icon: '📋', desc: 'Your order has been placed' },
  { key: 'accepted',          label: 'Seller Confirmed', icon: '✅', desc: 'Seller accepted the order' },
  { key: 'harvested_packed',  label: 'Packed',           icon: '📦', desc: 'Item packed and ready' },
  { key: 'out_for_delivery',  label: 'Out for Delivery', icon: '🛵', desc: 'On the way to you' },
  { key: 'completed',         label: 'Delivered',        icon: '🎉', desc: 'Delivered successfully' }
];

// --- Order Timeline Component ---
const TrackTimeline = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl">
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="text-sm font-black text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500 font-semibold">This order has been cancelled and refund (if paid) will be processed.</p>
        </div>
      </div>
    );
  }

  const activeStep = STATUS_CONFIG[status]?.steps || 1;
  return (
    <div className="relative">
      <div className="flex items-start justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-brand-500 z-0 transition-all duration-700"
          style={{ width: `${((activeStep - 1) / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />

        {TIMELINE_STEPS.map((step, i) => {
          const isDone = i + 1 < activeStep;
          const isActive = i + 1 === activeStep;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                isDone ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' :
                isActive ? 'bg-brand-600 border-brand-600 shadow-lg shadow-brand-200 scale-110' :
                'bg-white border-slate-300'
              }`}>
                {isDone ? '✓' : step.icon}
              </div>
              <div className="text-center hidden sm:block">
                <p className={`text-[10px] font-black ${isActive ? 'text-brand-700' : isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold max-w-[70px]">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Cancel Modal ---
const CancelModal = ({ order, onConfirm, onClose, loading }) => {
  const [reason, setReason] = useState('');
  const reasons = [
    'Ordered by mistake',
    'Found better price elsewhere',
    'Delivery taking too long',
    'Changed my mind',
    'Duplicate order',
    'Other'
  ];
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Cancel Order?</h3>
            <p className="text-[11px] text-slate-500 font-semibold">{order.orderNumber}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-semibold bg-amber-50 border border-amber-200 p-3 rounded-xl">
          ⚠️ Once cancelled, this action cannot be undone. Any prepaid amount will be refunded within 5-7 business days.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-black text-slate-700">Select Cancellation Reason:</p>
          <div className="space-y-2">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                  reason === r ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {reason === r ? '● ' : '○ '}{r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-black text-xs rounded-2xl hover:bg-slate-200 transition-all"
          >
            Keep Order
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason || loading}
            className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-2xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Single Order Card ---
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;

  const handleCancel = async (reason) => {
    setCancelling(true);
    try {
      await onCancel(order._id, reason);
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center text-lg border ${cfg.border}`}>
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900">{order.orderNumber}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-base font-black text-slate-900">₹{order.totalAmount?.toFixed(2)}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              {order.paymentInfo?.method?.toUpperCase()} • {order.paymentInfo?.status}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* First item preview */}
      {!expanded && order.items?.length > 0 && (
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">🧺</div>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{order.items[0].title}</p>
              {order.items.length > 1 && (
                <p className="text-[10px] text-slate-400">+{order.items.length - 1} more items</p>
              )}
            </div>
          </div>
          <button onClick={() => setExpanded(true)} className="text-[10px] font-black text-brand-600 hover:underline">
            View Details
          </button>
        </div>
      )}

      {/* Expanded Section */}
      {expanded && (
        <div className="p-5 space-y-6">
          {/* Live Tracking Timeline */}
          <div>
            <h4 className="text-xs font-black text-slate-700 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" /> Live Order Tracking
            </h4>
            <TrackTimeline status={order.orderStatus} />
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" /> Order Items
            </h4>
            <div className="space-y-2">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base">🧺</div>
                    <div>
                      <p className="text-xs font-black text-slate-900 line-clamp-1">{it.title}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{it.quantity} × ₹{it.pricePerUnit?.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">₹{it.totalPrice?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-[11px] font-black text-slate-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Delivery Address
              </h4>
              <p className="text-xs font-semibold text-slate-700">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            {cfg.canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 text-xs font-black text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-2xl hover:bg-red-100 transition-all"
              >
                <XCircle className="w-4 h-4" /> Cancel Order
              </button>
            )}

            {order.orderStatus === 'completed' && (
              <button className="flex items-center gap-2 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl hover:bg-amber-100 transition-all">
                <Star className="w-4 h-4" /> Rate & Review
              </button>
            )}

            <button className="flex items-center gap-2 text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl hover:bg-slate-200 transition-all">
              <Phone className="w-4 h-4" /> Contact Support
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <CancelModal
          order={order}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelling}
        />
      )}
    </div>
  );
};

// --- Main Orders Page ---
const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) setOrders(res.data.data.orders);
      } catch {
        setOrders(demoOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`, { reason });
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? res.data.data.order : o));
      }
    } catch {
      // Optimistic demo cancel
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'cancelled', cancellationReason: reason } : o));
    }
  };

  const FILTERS = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Active' },
    { key: 'completed', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = filter === 'all' ? orders :
    filter === 'pending' ? orders.filter(o => !['completed', 'cancelled'].includes(o.orderStatus)) :
    orders.filter(o => o.orderStatus === filter);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-4">
        {[1,2].map(n => <div key={n} className="h-40 bg-slate-200 rounded-3xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">

      {/* Header */}
      <div>
        <Link to="/customer/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Track, manage, and cancel your grocery orders.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-black px-4 py-2 rounded-2xl border transition-all ${
              filter === f.key
                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === f.key ? 'bg-white/30' : 'bg-slate-100'
            }`}>
              {f.key === 'all' ? orders.length :
               f.key === 'pending' ? orders.filter(o => !['completed','cancelled'].includes(o.orderStatus)).length :
               orders.filter(o => o.orderStatus === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-400">
            {filter === 'all' ? "You haven't placed any grocery orders yet." :
             `No ${filter} orders found.`}
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl mt-2">
            <Home className="w-4 h-4" /> Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} onCancel={handleCancelOrder} />
          ))}
        </div>
      )}

    </div>
  );
};

const demoOrders = [
  {
    _id: 'ord1',
    orderNumber: 'FBM-882910',
    totalAmount: 89.00,
    orderStatus: 'out_for_delivery',
    paymentInfo: { method: 'upi', status: 'paid' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    deliveryAddress: { street: '402 MG Road', city: 'Mumbai', state: 'MH', zipCode: '400001' },
    items: [
      { title: 'Farm Fresh Red Tomatoes (Tamatar)', quantity: 2, pricePerUnit: 20, totalPrice: 40 },
      { title: 'Ripe Golden Bananas (Kela)', quantity: 1, pricePerUnit: 35, totalPrice: 35 }
    ]
  },
  {
    _id: 'ord2',
    orderNumber: 'FBM-759201',
    totalAmount: 130.00,
    orderStatus: 'pending',
    paymentInfo: { method: 'cod', status: 'pending' },
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    deliveryAddress: { street: '12 Park Street', city: 'Pune', state: 'MH', zipCode: '411001' },
    items: [
      { title: 'Sweet Alphonso Mangoes (Aam)', quantity: 2, pricePerUnit: 65, totalPrice: 130 }
    ]
  },
  {
    _id: 'ord3',
    orderNumber: 'FBM-634521',
    totalAmount: 60.00,
    orderStatus: 'completed',
    paymentInfo: { method: 'card', status: 'paid' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deliveryAddress: { street: '9 Bandra West', city: 'Mumbai', state: 'MH', zipCode: '400050' },
    items: [
      { title: 'Free-Range Country Hen Eggs (Ande)', quantity: 1, pricePerUnit: 60, totalPrice: 60 }
    ]
  }
];

export default CustomerOrders;
