import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  getAllFarmers: async () => {
    const response = await api.get('/admin/farmers');
    return response.data;
  },

  getPendingFarmers: async () => {
    const response = await api.get('/admin/farmers/pending');
    return response.data;
  },

  verifyFarmer: async (farmId, status, rejectionReason = '') => {
    const response = await api.patch(`/admin/farmers/${farmId}/verify`, { status, rejectionReason });
    return response.data;
  },

  getAllCustomers: async () => {
    const response = await api.get('/admin/customers');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleUserStatus: async (userId, status) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  }
};

export default adminService;
