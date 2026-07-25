import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-brand-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review your reserved produce items before proceeding to checkout.
          </p>
        </div>

        <Link to="/shop" className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your cart is currently empty</h3>
          <p className="text-xs text-slate-400">Explore local organic farms to add fresh seasonal produce!</p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cart Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-400">Cart Items ({cart.length})</span>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-2xl border"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ${item.pricePerUnit?.toFixed(2)} / {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="p-1 text-slate-600 hover:bg-white rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="p-1 text-slate-600 hover:bg-white rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-slate-900 w-16 text-right">
                      ${(item.pricePerUnit * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-rose-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>Subtotal</span>
                <span className="text-base font-extrabold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-400">Delivery fees calculated at checkout step.</p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default CartPage;
