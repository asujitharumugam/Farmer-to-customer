export const initialDemoOrders = [
  {
    _id: 'ord101',
    orderNumber: 'FBM-882910',
    customer: { name: 'Anand Kumar', phone: '+91 98401 23456' },
    totalAmount: 134.00,
    orderStatus: 'pending',
    paymentInfo: { method: 'upi', status: 'paid' },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveryAddress: { street: '12th Main Road, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040', phone: '+91 98401 23456' },
    items: [
      { title: 'Madurai Country Organic Tomatoes (மதுரை தக்காளி)', quantity: 2, pricePerUnit: 22, totalPrice: 44 },
      { title: 'Perambalur Small Onions (சின்ன வெங்காயம்)', quantity: 2, pricePerUnit: 45, totalPrice: 90 }
    ]
  },
  {
    _id: 'ord102',
    orderNumber: 'FBM-759201',
    customer: { name: 'Karthik Raja', phone: '+91 94431 88776' },
    totalAmount: 90.00,
    orderStatus: 'harvested_packed',
    paymentInfo: { method: 'cod', status: 'pending' },
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    deliveryAddress: { street: '15 Cross Street, RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641002', phone: '+91 94431 88776' },
    items: [
      { title: 'Chettinad Country Free-Range Eggs (செட்டிநாடு முட்டை)', quantity: 1, pricePerUnit: 90, totalPrice: 90 }
    ]
  }
];

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem('agri_app_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage order read error:', e);
  }
  localStorage.setItem('agri_app_orders', JSON.stringify(initialDemoOrders));
  return initialDemoOrders;
};

export const saveNewOrder = (newOrder) => {
  try {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing];
    localStorage.setItem('agri_app_orders', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage order write error:', e);
    return [newOrder];
  }
};

export const updateOrderStatusInStorage = (orderId, newStatus, reason = '') => {
  try {
    const existing = getStoredOrders();
    const updated = existing.map(o => {
      if (o._id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          orderStatus: newStatus,
          cancellationReason: reason || o.cancellationReason
        };
      }
      return o;
    });
    localStorage.setItem('agri_app_orders', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage order update error:', e);
    return [];
  }
};
