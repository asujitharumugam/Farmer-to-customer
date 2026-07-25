import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProduceCard from '../components/customer/ProduceCard';
import api from '../services/api';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/users/wishlist');
      if (res.data.success) {
        setWishlist(res.data.data.wishlist);
      }
    } catch (err) {
      console.warn('Wishlist API query failed, using empty array');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await api.post('/users/wishlist/toggle', { productId });
      if (res.data.success) {
        setWishlist(wishlist.filter(item => item._id !== productId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item from wishlist.');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-80 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Saved Produce Wishlist
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Keep track of your favorite organic produce items for quick seasonal ordering.
          </p>
        </div>

        <Link to="/shop" className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Browse Shop
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400">Save items while browsing the market to re-order quickly.</p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Explore Produce Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="relative group">
              <ProduceCard product={item} />
              <button
                onClick={() => handleRemoveFromWishlist(item._id)}
                className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-full shadow-md backdrop-blur-sm transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
