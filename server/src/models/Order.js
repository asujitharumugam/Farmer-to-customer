const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    totalPrice: { type: Number, required: true }
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  deliveryMethod: {
    type: String,
    enum: ['home_delivery', 'farm_pickup'],
    default: 'home_delivery'
  },
  paymentInfo: {
    method: { type: String, enum: ['cod', 'stripe'], default: 'cod' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    stripePaymentIntentId: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'harvested_packed', 'out_for_delivery', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  cancellationReason: String
}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.farmer': 1, orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
