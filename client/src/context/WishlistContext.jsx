import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/users/wishlist');
      if (res.data.success) {
        setWishlist(res.data.data.wishlist || []);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const targetId = typeof productId === 'object' ? productId._id : productId;
    return wishlist.some(item => {
      const itemId = typeof item === 'object' ? item._id : item;
      return itemId === targetId;
    });
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      showToast('Please log in to save items to your wishlist', 'info');
      return false;
    }

    const productId = typeof product === 'object' ? product._id : product;
    const isCurrentlySaved = isInWishlist(productId);

    try {
      // Optimistic state update
      if (isCurrentlySaved) {
        setWishlist(prev => prev.filter(item => (typeof item === 'object' ? item._id : item) !== productId));
        showToast('Removed from Wishlist', 'info');
      } else {
        if (typeof product === 'object') {
          setWishlist(prev => [...prev, product]);
        }
        showToast('Added to Wishlist! ❤️', 'success');
      }

      const res = await api.post('/users/wishlist/toggle', { productId });
      if (res.data.success && res.data.data?.wishlist) {
        setWishlist(res.data.data.wishlist);
      }
      return !isCurrentlySaved;
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      showToast(err.response?.data?.message || 'Failed to update wishlist', 'error');
      // Rollback on failure
      fetchWishlist();
      return isCurrentlySaved;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;
    try {
      setWishlist(prev => prev.filter(item => (typeof item === 'object' ? item._id : item) !== productId));
      showToast('Removed from Wishlist', 'info');
      const res = await api.post('/users/wishlist/toggle', { productId });
      if (res.data.success && res.data.data?.wishlist) {
        setWishlist(res.data.data.wishlist);
      }
    } catch (err) {
      console.error('Remove wishlist error:', err);
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
