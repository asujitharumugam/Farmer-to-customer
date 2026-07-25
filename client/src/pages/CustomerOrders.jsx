import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, MapPin, PackageCheck } from 'lucide-react';
import OrderTimeline from '../components/customer/OrderTimeline';
import api from '../services/api';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) setOrders(res.data.data.orders);
      } catch (err) {
        console.warn('Using demo orders fallback');
        setOrders(demoOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-64 bg-slate-200 rounded-3xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Farm Booking Orders</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Track real-time harvest and fulfillment progress for your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-400">You haven't placed any farm produce bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {ord.orderNumber}
                  </span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Placed on: {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-slate-900">${ord.totalAmount?.toFixed(2)}</span>
                  <p className="text-[11px] text-slate-400 uppercase font-bold">Payment: {ord.paymentInfo?.method} ({ord.paymentInfo?.status})</p>
                </div>
              </div>

              {/* Status Timeline */}
              <OrderTimeline status={ord.orderStatus} />

              {/* Order Items */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-700">Reserved Items:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                  {ord.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span>{it.title} ({it.quantity} x ${it.pricePerUnit?.toFixed(2)})</span>
                      <span className="font-bold text-slate-900">${it.totalPrice?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

const demoOrders = [
  {
    _id: 'ord1',
    orderNumber: 'ORD-882910',
    totalAmount: 18.98,
    orderStatus: 'harvested_packed',
    paymentInfo: { method: 'cod', status: 'pending' },
    createdAt: new Date(),
    items: [
      { title: 'Heirloom Vine Tomatoes', quantity: 2, pricePerUnit: 3.50, totalPrice: 7.00 },
      { title: 'Organic Hass Avocados', quantity: 2, pricePerUnit: 4.99, totalPrice: 9.98 }
    ]
  }
];

export default CustomerOrders;
