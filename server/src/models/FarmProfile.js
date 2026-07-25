const mongoose = require('mongoose');

const farmProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  farmName: {
    type: String,
    required: [true, 'Please enter your farm name'],
    trim: true
  },
  story: {
    type: String,
    required: [true, 'Please share your farm story and practices']
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  farmSizeAcres: {
    type: Number,
    default: 5
  },
  verificationDocs: [{
    docType: { type: String, default: 'Land Registry / Accreditation' },
    fileUrl: { type: String, required: true }
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  ratingAverage: {
    type: Number,
    default: 4.8
  },
  ratingCount: {
    type: Number,
    default: 12
  }
}, { timestamps: true });

farmProfileSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('FarmProfile', farmProfileSchema);
