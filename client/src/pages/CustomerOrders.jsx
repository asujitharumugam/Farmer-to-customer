import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Clock, MapPin, PackageCheck, Truck, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Phone, Star, ArrowLeft,
  Package, RotateCcw, AlertCircle, Loader2, Home
} from 'lucide-react';
import api from '../services/api';
import { getStoredOrders, updateOrderStatusInStorage } from '../utils/orderStorage';

// --- Status Config ---
const STATUS_CONFIG = {
  pending: {
    label: 'Order Placed', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    icon: '📋', canCancel: true, steps: 1
  },
  accepted: {
    label: 'Confirmed by Farmer', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
    icon: '✅', canCancel: true, steps: 2
  },
  harvested_packed: {
    label: 'Harvested & Packed', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',
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
  { key: 'pending',           label: 'Order Placed',     icon: '📋', desc: 'Order logged' },
  { key: 'accepted',          label: 'Farmer Accepted',  icon: '✅', desc: 'Farmer confirmed batch' },
  { key: 'harvested_packed',  label: 'Harvested & Packed',icon: '📦', desc: 'Packed at farm' },
  { key: 'out_for_delivery',  label: 'In Transit',       icon: '🛵', desc: 'Out for delivery' },
  { key: 'completed',         label: 'Delivered',        icon: '🎉', desc: 'Order complete' }
];

// --- Order Timeline Stepper ---
const TrackTimeline = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl">
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="text-sm font-black text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500 font-semibold">This order has been cancelled and refund is processing.</p>
        </div>
      </div>
    );
  }

  const activeStep = STATUS_CONFIG[status]?.steps || 1;
  return (
    <div className="relative pt-2">
      <div className="flex items-start justify-between relative">
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' :
                isActive ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100 shadow-lg scale-110' :
                'bg-white border-slate-300 text-slate-400'
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
    'Incorrect delivery address',
    'Other'
  ];
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
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
          ⚠️ Once cancelled, this order will stop processing. Refund (if paid online) takes 3-5 business days.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-black text-slate-700">Select Reason for Cancellation:</p>
          <div className="space-y-1.5">
            {reasons.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`w-full text-left text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all ${
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
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-black text-xs rounded-2xl hover:bg-slate-200"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={!reason || loading}
            className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-2xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Farmer Contact Modal ---
const FarmerContactModal = ({ farmerName, farmName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              👨‍🌾
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{farmerName || 'Ramesh Kumar (Organic Farmer)'}</h3>
              <p className="text-xs font-bold text-amber-700">{farmName || 'Green Earth Organic Valley'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200">✕</button>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs font-semibold text-amber-900">
          <p>📍 <strong>Farm Region:</strong> Nashik District, Maharashtra</p>
          <p>📞 <strong>Direct Helpline:</strong> +91 98765 12345</p>
          <p>🕒 <strong>Available Hours:</strong> 7:00 AM – 7:00 PM IST</p>
        </div>

        <div className="flex gap-3">
          <a
            href="tel:+919876512345"
            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-md text-center flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call Farmer Now
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Farmer Direct Chat Modal ---
const FarmerChatModal = ({ orderNumber, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'farmer', text: 'Namaste! Thank you for ordering from our fresh harvest batch. Let us know if you have specific delivery notes!' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender: 'customer', text: inputText }]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'farmer', text: 'Got it! Our farm harvest & dispatch team has been notified.' }]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl flex flex-col h-[480px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Direct Farmer Chat</h3>
              <p className="text-[11px] text-slate-500 font-semibold">{orderNumber} • Direct Communication</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-semibold ${
                m.sender === 'customer' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Type message to farmer..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:bg-white"
          />
          <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-black text-xs rounded-xl shadow-md">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Single Order Card ---
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
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
      {/* Card Top Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center text-lg border ${cfg.border}`}>
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900">{order.orderNumber}</span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
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

      {/* First Item Preview */}
      {!expanded && order.items?.length > 0 && (
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base">🧺</div>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{order.items[0].title}</p>
              {order.items.length > 1 && (
                <p className="text-[10px] text-slate-400 font-semibold">+{order.items.length - 1} more produce items</p>
              )}
            </div>
          </div>
          <button onClick={() => setExpanded(true)} className="text-[10px] font-black text-brand-600 hover:underline">
            View Live Tracking & Details
          </button>
        </div>
      )}

      {/* Expanded Order Details */}
      {expanded && (
        <div className="p-5 space-y-6">
          {/* Live Order Tracking Timeline Stepper */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" /> Real-Time Order Tracking Timeline
            </h4>
            <TrackTimeline status={order.orderStatus} />
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" /> Purchased Produce Items
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
              <h4 className="text-[11px] font-black text-slate-600 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Customer Delivery Address
              </h4>
              <p className="text-xs font-bold text-slate-800">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
              </p>
              {order.deliveryAddress.phone && (
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">📞 Contact Phone: {order.deliveryAddress.phone}</p>
              )}
            </div>
          )}

          {/* Customer & Farmer Communication Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {cfg.canCancel && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-2xl hover:bg-red-100 transition-all"
              >
                <XCircle className="w-4 h-4" /> Cancel Order
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl hover:bg-amber-100 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-700" /> Call Farmer
            </button>

            <button
              type="button"
              onClick={() => setShowChatModal(true)}
              className="flex items-center gap-1.5 text-xs font-black text-brand-700 bg-brand-50 border border-brand-200 px-4 py-2.5 rounded-2xl hover:bg-brand-100 transition-all"
            >
              💬 Chat with Farmer
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

      {showContactModal && (
        <FarmerContactModal
          farmerName="Ramesh Kumar (Organic Farmer)"
          farmName="Green Earth Farms"
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showChatModal && (
        <FarmerChatModal
          orderNumber={order.orderNumber}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

// --- Main Customer Orders Page ---
const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success && res.data.data.orders && res.data.data.orders.length > 0) {
          setOrders(res.data.data.orders);
        } else {
          setOrders(getStoredOrders());
        }
      } catch {
        setOrders(getStoredOrders());
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
        const updated = updateOrderStatusInStorage(orderId, 'cancelled', reason);
        setOrders(updated);
      }
    } catch {
      const updated = updateOrderStatusInStorage(orderId, 'cancelled', reason);
      setOrders(updated);
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
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-4 font-sans">
        {[1,2].map(n => <div key={n} className="h-40 bg-slate-200 rounded-3xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">

      {/* Top 24/7 Support Helpline Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-2xl border border-amber-400/30 shrink-0">
            📞
          </div>
          <div>
            <h4 className="text-sm font-black text-white">24/7 Customer & Farmer Support Helpline</h4>
            <p className="text-xs text-amber-300 font-bold mt-0.5">Toll Free: 1800-FARM-FRESH (1800-3276-3737) • WhatsApp Active</p>
          </div>
        </div>

        <a
          href="tel:180032763737"
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all text-center shrink-0"
        >
          Call Helpline Now
        </a>
      </div>

      {/* Header */}
      <div>
        <Link to="/customer/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Orders & Product Tracking</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Track harvest fulfillment, cancel orders, or communicate directly with farmers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-black px-4 py-2.5 rounded-2xl border transition-all ${
              filter === f.key
                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-[10px] px-2 py-0.5 rounded-full ${
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
          <p className="text-xs text-slate-400 font-semibold">
            {filter === 'all' ? "You haven't placed any grocery orders yet." :
             `No ${filter} orders found.`}
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl mt-2 shadow-md">
            <Home className="w-4 h-4" /> Shop Farm Marketplace
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
    deliveryAddress: { street: '402 MG Road, Flat 3A', city: 'Mumbai', state: 'MH', zipCode: '400001', phone: '+91 98765 43210' },
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
    deliveryAddress: { street: '12 Park Street, Lane 4', city: 'Pune', state: 'MH', zipCode: '411001', phone: '+91 98765 88990' },
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
    deliveryAddress: { street: '9 Bandra West', city: 'Mumbai', state: 'MH', zipCode: '400050', phone: '+91 98765 11223' },
    items: [
      { title: 'Free-Range Country Hen Eggs (Ande)', quantity: 1, pricePerUnit: 60, totalPrice: 60 }
    ]
  }
];

export default CustomerOrders;
