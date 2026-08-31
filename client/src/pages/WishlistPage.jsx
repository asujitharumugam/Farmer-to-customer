import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Plus, Minus, ArrowRight, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProduceCard from '../components/customer/ProduceCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { handleImageError } from '../utils/imageUtils';

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart, setIsDrawerOpen } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Quantities map for wishlist items
  const [quantities, setQuantities] = useState({});

  const getQuantity = (productId) => quantities[productId] || 1;

  const setQuantity = (productId, val) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, val)
    }));
  };

  const handleAddToCart = (product) => {
    const qty = getQuantity(product._id);
    addToCart(product, qty);
    showToast(`Added ${qty} ${product.unit}(s) of ${product.title} to your order!`, 'success');
  };

  const handleBuyNow = (product) => {
    const qty = getQuantity(product._id);
    addToCart(product, qty);
    navigate('/cart/checkout');
  };

  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      const qty = getQuantity(item._id);
      addToCart(item, qty);
    });
    showToast(`All ${wishlist.length} saved vegetables added to cart!`, 'success');
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 bg-slate-200/80 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Saved Fresh Produce & Vegetables
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Your Liked Vegetable Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Easily review your favorite Tamil Nadu organic vegetables and place quick direct orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {wishlist.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add All to Order ({wishlist.length})
              </button>
            )}

            <Link
              to="/shop"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-2xl backdrop-blur-md transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Catalog
            </Link>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 md:p-16 text-center border border-slate-200/80 max-w-lg mx-auto space-y-5 shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
            <Heart className="w-10 h-10 fill-rose-100" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Save your favorite fresh vegetables and Tamil Nadu crops while browsing to place instant re-orders anytime!
            </p>
          </div>
          
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-md shadow-brand-600/20 hover:scale-105 transition-all"
          >
            Explore Fresh Tamil Produce Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-3">
            <span>Showing {wishlist.length} saved produce items</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tamil Nadu Regional Fresh Crops
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => {
              const qty = getQuantity(product._id);
              const totalPrice = (product.pricePerUnit * qty).toFixed(2);
              const defaultImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
              const displayImg = product.images && product.images.length > 0 ? product.images[0] : defaultImg;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image + Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={displayImg}
                        alt={product.title}
                        onError={(e) => handleImageError(e, 'produce')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Delete / Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-700 rounded-full shadow-md backdrop-blur-md transition-all active:scale-90"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Organic Badge */}
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                        {product.isOrganic && (
                          <span className="bg-emerald-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md border border-emerald-400/30 shadow-sm">
                            100% Organic 🌿
                          </span>
                        )}
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        {product.farm && (
                          <p className="text-[10px] font-extrabold text-emerald-300 flex items-center gap-1 mb-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {product.farm.farmName || 'Verified Farm'}
                          </p>
                        )}
                        <h3 className="text-base font-extrabold line-clamp-1 leading-snug">
                          <Link to={`/produce/${product._id}`} className="hover:text-amber-300 transition-colors">
                            {product.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-5 space-y-4">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[11px] font-medium">Unit Price:</span>
                          <span className="text-base font-black text-slate-900 ml-1">₹{product.pricePerUnit?.toFixed(2)}</span>
                          <span className="text-[11px] text-slate-500"> / {product.unit}</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-700">Order Quantity:</span>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-sm">
                          <button
                            onClick={() => setQuantity(product._id, qty - 1)}
                            disabled={qty <= 1}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-900 w-6 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQuantity(product._id, qty + 1)}
                            disabled={qty >= product.stockQuantity}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-400 pl-1">{product.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 px-1">
                      <span>Total Amount:</span>
                      <span className="text-lg font-black text-brand-700">₹{totalPrice}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity <= 0}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-600/20 hover:scale-[1.02] active:scale-95 disabled:bg-slate-300 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Order
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stockQuantity <= 0}
                        className="flex items-center justify-center gap-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-700/20 hover:scale-[1.02] active:scale-95 disabled:bg-slate-300 transition-all"
                      >
                        Buy Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
