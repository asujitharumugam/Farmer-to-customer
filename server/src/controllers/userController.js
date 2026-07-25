const User = require('../models/User');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json({
    success: true,
    data: { user }
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, phone } = req.body;

  let avatarUrl;
  if (req.file) {
    avatarUrl = await uploadToCloudinary(req.file.buffer, 'user_avatars');
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone !== undefined) updateFields.phone = phone;
  if (avatarUrl) updateFields.avatar = avatarUrl;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
    runValidators: true
  }).populate('wishlist');

  res.status(200).json({
    success: true,
    data: { user: updatedUser }
  });
});

exports.addAddress = catchAsync(async (req, res, next) => {
  const { street, city, state, zipCode, isDefault } = req.body;

  if (!street || !city || !state) {
    return next(new AppError('Street, city, and state are required.', 400));
  }

  const user = await User.findById(req.user._id);

  if (isDefault) {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  user.addresses.push({
    street,
    city,
    state,
    zipCode: zipCode || '',
    isDefault: isDefault || user.addresses.length === 0
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: { addresses: user.addresses }
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  const addressId = req.params.addressId;
  const user = await User.findById(req.user._id);

  user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
  await user.save();

  res.status(200).json({
    success: true,
    data: { addresses: user.addresses }
  });
});

exports.toggleWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  if (!productId) {
    return next(new AppError('Product ID is required.', 400));
  }

  const user = await User.findById(req.user._id);
  const existsIndex = user.wishlist.findIndex(id => id.toString() === productId);

  let isAdded = false;
  if (existsIndex > -1) {
    user.wishlist.splice(existsIndex, 1);
  } else {
    user.wishlist.push(productId);
    isAdded = true;
  }

  await user.save();
  await user.populate('wishlist');

  res.status(200).json({
    success: true,
    message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
    isWishlisted: isAdded,
    data: { wishlist: user.wishlist }
  });
});

exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'farm', select: 'farmName ratingAverage' }
  });

  res.status(200).json({
    success: true,
    results: user.wishlist.length,
    data: { wishlist: user.wishlist }
  });
});

exports.getCustomerDashboard = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;

  const orders = await Order.find({ customer: customerId });
  const activeOrders = orders.filter(o => ['pending', 'accepted', 'harvested_packed', 'out_for_delivery'].includes(o.orderStatus));
  const completedOrders = orders.filter(o => o.orderStatus === 'completed');
  
  const totalSpent = orders
    .filter(o => o.orderStatus === 'completed' || o.paymentInfo.status === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const user = await User.findById(customerId);

  res.status(200).json({
    success: true,
    data: {
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      completedOrdersCount: completedOrders.length,
      totalSpent,
      wishlistCount: user.wishlist ? user.wishlist.length : 0,
      recentOrders: orders.slice(0, 5)
    }
  });
});
