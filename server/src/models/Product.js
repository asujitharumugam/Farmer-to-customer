const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmProfile'
  },
  title: {
    type: String,
    required: [true, 'Produce title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Produce description is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price must be positive']
  },
  unit: {
    type: String,
    enum: ['kg', 'gram', 'piece', 'dozen', 'box', 'litre'],
    default: 'kg'
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative']
  },
  harvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'out_of_stock', 'pre_order_only', 'archived'],
    default: 'available'
  }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1, isOrganic: 1 });

module.exports = mongoose.model('Product', productSchema);
