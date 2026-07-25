const User = require('../models/User');
const FarmProfile = require('../models/FarmProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// 1. Dashboard & Analytics
exports.getAdminStats = catchAsync(async (req, res, next) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalFarmers = await User.countDocuments({ role: 'farmer' });
  const pendingVerifications = await FarmProfile.countDocuments({ verificationStatus: 'pending' });
  const approvedFarmers = await FarmProfile.countDocuments({ verificationStatus: 'approved' });
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments({ status: { $ne: 'archived' } });

  const orders = await Order.find({ 'paymentInfo.status': 'paid' });
  const totalGMV = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

  const completedOrdersCount = await Order.countDocuments({ orderStatus: 'completed' });
  const cancelledOrdersCount = await Order.countDocuments({ orderStatus: 'cancelled' });

  res.status(200).json({
    success: true,
    data: {
      totalCustomers,
      totalFarmers,
      approvedFarmers,
      pendingVerifications,
      totalOrders,
      completedOrdersCount,
      cancelledOrdersCount,
      totalProducts,
      totalGMV
    }
  });
});

// 2. Reports
exports.getAdminReports = catchAsync(async (req, res, next) => {
  const completedOrders = await Order.find({ orderStatus: 'completed' })
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });

  const topProducts = await Product.find({ status: { $ne: 'archived' } })
    .sort({ pricePerUnit: -1 })
    .limit(5)
    .populate('farm', 'farmName');

  const topFarms = await FarmProfile.find({ verificationStatus: 'approved' })
    .sort({ ratingAverage: -1 })
    .limit(5)
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    data: {
      completedOrdersCount: completedOrders.length,
      topProducts,
      topFarms
    }
  });
});

// 3. Manage Farmers & Verification
exports.getAllFarmers = catchAsync(async (req, res, next) => {
  const farms = await FarmProfile.find()
    .populate('user', 'name email phone avatar status createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: farms.length,
    data: { farms }
  });
});

exports.getPendingFarmers = catchAsync(async (req, res, next) => {
  const farms = await FarmProfile.find({ verificationStatus: 'pending' })
    .populate('user', 'name email phone avatar createdAt');

  res.status(200).json({
    success: true,
    results: farms.length,
    data: { farms }
  });
});

exports.verifyFarmer = catchAsync(async (req, res, next) => {
  const { status, rejectionReason } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return next(new AppError('Status must be approved or rejected', 400));
  }

  const farm = await FarmProfile.findById(req.params.id);
  if (!farm) {
    return next(new AppError('Farm profile not found', 404));
  }

  farm.verificationStatus = status;
  if (rejectionReason) farm.rejectionReason = rejectionReason;

  await farm.save();

  res.status(200).json({
    success: true,
    message: `Farmer application has been ${status}`,
    data: { farm }
  });
});

// 4. Manage Customers
exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: customers.length,
    data: { customers }
  });
});

// 5. Ban / Suspend Users
exports.toggleUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return next(new AppError('Status must be active or suspended', 400));
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === 'admin') {
    return next(new AppError('Admin users cannot be suspended', 403));
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User account status changed to ${status}`,
    data: { user }
  });
});

// 6. Manage Products
exports.getAllProductsAdmin = catchAsync(async (req, res, next) => {
  const products = await Product.find()
    .populate('farmer', 'name email')
    .populate('farm', 'farmName')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: products.length,
    data: { products }
  });
});

exports.adminUpdateProductStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['available', 'out_of_stock', 'pre_order_only', 'archived'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid produce status', 400));
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new AppError('Produce item not found', 404));
  }

  product.status = status;
  await product.save();

  res.status(200).json({
    success: true,
    data: { product }
  });
});

exports.adminDeleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new AppError('Produce item not found', 404));
  }

  product.status = 'archived';
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Produce item archived by administrator'
  });
});

// 7. Manage Orders
exports.getAllOrdersAdmin = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('customer', 'name email phone')
    .populate('items.farmer', 'name email')
    .populate('items.product', 'title images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: orders.length,
    data: { orders }
  });
});

exports.adminUpdateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, cancellationReason } = req.body;
  const validStatuses = ['pending', 'accepted', 'harvested_packed', 'out_for_delivery', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.orderStatus = status;
  if (cancellationReason) order.cancellationReason = cancellationReason;
  if (status === 'completed') order.paymentInfo.status = 'paid';

  await order.save();

  res.status(200).json({
    success: true,
    data: { order }
  });
});

// 8. Manage Categories
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, description, image } = req.body;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    return next(new AppError('Category already exists', 400));
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image: image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80'
  });

  res.status(201).json({
    success: true,
    data: { category }
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true });
  res.status(200).json({
    success: true,
    data: { categories }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    results: users.length,
    data: { users }
  });
});
