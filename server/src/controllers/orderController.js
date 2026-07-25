const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key';
const stripe = Stripe(stripeSecret);

exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, deliveryAddress, deliveryMethod, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items provided in order', 400));
  }

  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product with ID ${item.product} not found`, 404));
    }
    if (product.stockQuantity < item.quantity) {
      return next(new AppError(`Not enough stock available for ${product.title}`, 400));
    }

    const itemTotal = product.pricePerUnit * item.quantity;
    totalAmount += itemTotal;

    processedItems.push({
      product: product._id,
      farmer: product.farmer,
      title: product.title,
      quantity: item.quantity,
      pricePerUnit: product.pricePerUnit,
      unit: product.unit,
      totalPrice: itemTotal
    });

    // Deduct stock
    product.stockQuantity -= item.quantity;
    if (product.stockQuantity === 0) product.status = 'out_of_stock';
    await product.save();
  }

  const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const order = await Order.create({
    orderNumber,
    customer: req.user._id,
    items: processedItems,
    deliveryAddress,
    deliveryMethod: deliveryMethod || 'home_delivery',
    paymentInfo: {
      method: paymentMethod || 'cod',
      status: paymentMethod === 'stripe' ? 'paid' : 'pending'
    },
    orderStatus: 'pending',
    totalAmount
  });

  res.status(201).json({
    success: true,
    data: { order }
  });
});

exports.createStripeIntent = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError('Valid amount is required for payment', 400));
  }

  try {
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card']
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    }
  } catch (err) {
    console.warn('Stripe API Warn (operating in mock fallback mode):', err.message);
  }

  res.status(200).json({
    success: true,
    clientSecret: 'mock_stripe_client_secret_xyz123_demo',
    isMock: true
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate('items.product', 'title images pricePerUnit unit')
    .populate('items.farmer', 'name email phone avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: orders.length,
    data: { orders }
  });
});

exports.cancelMyOrder = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });

  if (!order) {
    return next(new AppError('Order not found or does not belong to you', 404));
  }

  if (order.orderStatus !== 'pending') {
    return next(new AppError(`Order cannot be cancelled because it is already '${order.orderStatus}'`, 400));
  }

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stockQuantity += item.quantity;
      if (product.status === 'out_of_stock') product.status = 'available';
      await product.save();
    }
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason || 'Cancelled by customer';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully and stock restored.',
    data: { order }
  });
});

exports.getFarmerOrders = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const filter = { 'items.farmer': req.user._id };

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  const orders = await Order.find(filter)
    .populate('customer', 'name email phone avatar')
    .populate('items.product', 'title images pricePerUnit unit')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: orders.length,
    data: { orders }
  });
});

exports.acceptOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const isAssignedFarmer = order.items.some(it => it.farmer.toString() === req.user._id.toString());
  if (!isAssignedFarmer && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to accept this order.', 403));
  }

  if (order.orderStatus !== 'pending') {
    return next(new AppError(`Order cannot be accepted because status is currently '${order.orderStatus}'`, 400));
  }

  order.orderStatus = 'accepted';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order accepted successfully',
    data: { order }
  });
});

exports.rejectOrder = catchAsync(async (req, res, next) => {
  const { cancellationReason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const isAssignedFarmer = order.items.some(it => it.farmer.toString() === req.user._id.toString());
  if (!isAssignedFarmer && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to reject this order.', 403));
  }

  if (order.orderStatus === 'completed' || order.orderStatus === 'cancelled') {
    return next(new AppError(`Order cannot be rejected because it is already '${order.orderStatus}'`, 400));
  }

  // Restore product stock
  for (const item of order.items) {
    if (item.farmer.toString() === req.user._id.toString()) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockQuantity += item.quantity;
        if (product.status === 'out_of_stock') product.status = 'available';
        await product.save();
      }
    }
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = cancellationReason || 'Rejected by farmer due to harvest availability';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order rejected and stock restored successfully',
    data: { order }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;
  const validStatuses = ['pending', 'accepted', 'harvested_packed', 'out_for_delivery', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.orderStatus = status;
  if (reason) order.cancellationReason = reason;

  if (status === 'completed') {
    order.paymentInfo.status = 'paid';
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: { order }
  });
});

exports.getFarmerOrderHistory = catchAsync(async (req, res, next) => {
  const historyOrders = await Order.find({
    'items.farmer': req.user._id,
    orderStatus: { $in: ['completed', 'cancelled'] }
  })
    .populate('customer', 'name email phone avatar')
    .populate('items.product', 'title images pricePerUnit unit')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    results: historyOrders.length,
    data: { orders: historyOrders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone avatar')
    .populate('items.product', 'title images pricePerUnit unit')
    .populate('items.farmer', 'name email phone avatar');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { order }
  });
});
