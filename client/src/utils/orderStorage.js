export const initialDemoOrders = [
  {
    _id: 'ord101',
    orderNumber: 'FBM-882910',
    customer: { name: 'Priya Sharma', phone: '+91 98765 43210' },
    totalAmount: 170.00,
    orderStatus: 'pending',
    paymentInfo: { method: 'upi', status: 'paid' },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveryAddress: { street: 'MG Road, Flat 402', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001', phone: '+91 98765 43210' },
    items: [
      { title: 'Farm Fresh Red Tomatoes (Tamatar)', quantity: 2, pricePerUnit: 20, totalPrice: 40 },
      { title: 'Sweet Alphonso Mangoes (Aam)', quantity: 2, pricePerUnit: 65, totalPrice: 130 }
    ]
  },
  {
    _id: 'ord102',
    orderNumber: 'FBM-759201',
    customer: { name: 'Amit Patel', phone: '+91 98765 11223' },
    totalAmount: 60.00,
    orderStatus: 'harvested_packed',
    paymentInfo: { method: 'cod', status: 'pending' },
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    deliveryAddress: { street: '12 Park Street, Flat 9', city: 'Pune', state: 'Maharashtra', zipCode: '411001', phone: '+91 98765 11223' },
    items: [
      { title: 'Free-Range Country Hen Eggs (Ande)', quantity: 1, pricePerUnit: 60, totalPrice: 60 }
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
