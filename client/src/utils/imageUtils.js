/**
 * Default High-Reliability Fallback Images for Produce, Farmers, and Avatars
 */
export const FALLBACK_IMAGES = {
  produce: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  farm: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
};

/**
 * Resolves image URL to handle relative uploaded files, base64 data, and remote URLs
 * @param {string} url 
 * @param {'produce' | 'farm' | 'avatar'} type 
 * @returns {string}
 */
export const getImageUrl = (url, type = 'produce') => {
  if (!url) return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.produce;
  if (url.startsWith('/uploads')) {
    return url;
  }
  return url;
};

/**
 * Image onError handler to prevent broken image icons on UI
 * @param {Event} e 
 * @param {'produce' | 'farm' | 'avatar'} type 
 */
export const handleImageError = (e, type = 'produce') => {
  e.target.onerror = null; // Prevent infinite loop if fallback fails
  e.target.src = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.produce;
};
