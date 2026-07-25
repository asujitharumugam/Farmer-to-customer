import api from './api';

export const orderService = {
  createOrder: async (orderPayload) => {
    const response = await api.post('/orders', orderPayload);
    return response.data;
  },

  createStripeIntent: async (amount) => {
    const response = await api.post('/orders/create-stripe-intent', { amount });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelMyOrder: async (id, reason) => {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  getFarmerOrders: async (statusFilter = 'all') => {
    const response = await api.get(`/orders/farmer-orders?status=${statusFilter}`);
    return response.data;
  },

  getFarmerOrderHistory: async () => {
    const response = await api.get('/orders/farmer-history');
    return response.data;
  },

  acceptOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/accept`);
    return response.data;
  },

  rejectOrder: async (id, cancellationReason) => {
    const response = await api.patch(`/orders/${id}/reject`, { cancellationReason });
    return response.data;
  },

  updateOrderStatus: async (id, status, reason = '') => {
    const response = await api.patch(`/orders/${id}/status`, { status, reason });
    return response.data;
  }
};

export default orderService;
