import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CartCheckout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '742 Evergreen Terrace',
    city: user?.addresses?.[0]?.city || 'Springfield',
    state: user?.addresses?.[0]?.state || 'IL',
    zipCode: user?.addresses?.[0]?.zipCode || '62704',
    phone: user?.phone || '+1 555 019 3344'
  });

  const [deliveryMethod, setDeliveryMethod] = useState('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const deliveryFee = deliveryMethod === 'home_delivery' ? 4.99 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);

    try {
      if (paymentMethod === 'stripe') {
        // Optional Stripe PaymentIntent call
        await api.post('/orders/create-stripe-intent', { amount: grandTotal });
      }

      const res = await api.post('/orders', {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: address,
        deliveryMethod,
        paymentMethod
      });

      if (res.data.success) {
        setOrderSuccess(res.data.data.order);
        clearCart();
      }
    } catch (err) {
      // Demo order creation fallback if API offline
      const demoOrder = {
        orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        totalAmount: grandTotal,
        orderStatus: 'pending',
        paymentInfo: { method: paymentMethod, status: paymentMethod === 'stripe' ? 'paid' : 'pending' },
        createdAt: new Date()
      };
      setOrderSuccess(demoOrder);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Order Placed Successfully! 🌱</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Order Number: <strong className="text-brand-700 font-extrabold">{orderSuccess.orderNumber}</strong>
        </p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The farmer has been notified and will prepare your fresh harvest. You can track fulfillment status in real-time.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/customer/orders')}
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Track Order Status
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Please add items from the produce marketplace before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <h1 className="text-3xl font-extrabold text-slate-900">Complete Produce Booking</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" /> Delivery Address
            </h3>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" /> Delivery Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setDeliveryMethod('home_delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'home_delivery'
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-900">Direct Home Delivery</span>
                <span className="text-[11px] text-slate-500 font-semibold mt-1">Dispatched fresh from farm ($4.99)</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('farm_pickup')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'farm_pickup'
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-900">Farm Gate Pickup</span>
                <span className="text-[11px] text-slate-500 font-semibold mt-1">Pick up directly at farm (Free)</span>
              </label>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" /> Payment Options
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-900">Cash / Pay on Delivery</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Pay when produce is delivered.</p>
              </label>

              <label
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-extrabold text-slate-900">Stripe Card (Optional)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Secure online card payment.</p>
              </label>
            </div>

            {paymentMethod === 'stripe' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-bold">
                <label className="block text-slate-700">Card Number (Mock Stripe Integration)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Items Summary ({cart.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-400">{item.quantity} x ${item.pricePerUnit?.toFixed(2)} / {item.unit}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ${(item.pricePerUnit * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Produce Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Farm Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount Due</span>
                <span className="text-brand-700 text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-600/30 transition-all"
            >
              {submitting ? 'Processing Order...' : 'Confirm & Place Booking Order'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default CartCheckout;
