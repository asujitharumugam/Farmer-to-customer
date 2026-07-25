import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/users/address', addressData);
    return response.data;
  },

  removeAddress: async (addressId) => {
    const response = await api.delete(`/users/address/${addressId}`);
    return response.data;
  },

  toggleWishlist: async (productId) => {
    const response = await api.post('/users/wishlist/toggle', { productId });
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },

  getCustomerDashboard: async () => {
    const response = await api.get('/users/customer-dashboard');
    return response.data;
  }
};

export default userService;
