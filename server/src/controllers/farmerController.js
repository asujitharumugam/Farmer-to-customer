const FarmProfile = require('../models/FarmProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.onboardFarm = catchAsync(async (req, res, next) => {
  const { farmName, story, address, city, state, zipCode, farmSizeAcres } = req.body;

  let existingFarm = await FarmProfile.findOne({ user: req.user._id });
  if (existingFarm && existingFarm.verificationStatus === 'approved') {
    return next(new AppError('Your farm is already onboarded and approved!', 400));
  }

  let fileUrl = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80';
  if (req.file) {
    fileUrl = await uploadToCloudinary(req.file.buffer, 'farm_documents');
  }

  const farmData = {
    user: req.user._id,
    farmName,
    story,
    location: { address, city, state, zipCode },
    farmSizeAcres: Number(farmSizeAcres) || 5,
    verificationDocs: [{ docType: 'Land/Farm Registry Document', fileUrl }],
    verificationStatus: 'pending'
  };

  if (existingFarm) {
    existingFarm = await FarmProfile.findByIdAndUpdate(existingFarm._id, farmData, { new: true, runValidators: true });
    return res.status(200).json({ success: true, data: { farm: existingFarm } });
  }

  const newFarm = await FarmProfile.create(farmData);
  res.status(201).json({
    success: true,
    data: { farm: newFarm }
  });
});

exports.getMyFarmProfile = catchAsync(async (req, res, next) => {
  const farm = await FarmProfile.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
  res.status(200).json({
    success: true,
    data: { farm }
  });
});

exports.getPublicFarmProfile = catchAsync(async (req, res, next) => {
  const farm = await FarmProfile.findById(req.params.id).populate('user', 'name email phone avatar');
  if (!farm) {
    return next(new AppError('Farm not found', 404));
  }
  res.status(200).json({
    success: true,
    data: { farm }
  });
});

exports.updateFarmProfile = catchAsync(async (req, res, next) => {
  let farm = await FarmProfile.findOne({ user: req.user._id });
  if (!farm) {
    return next(new AppError('Farm profile not found', 404));
  }

  const { farmName, story, address, city, state, zipCode, farmSizeAcres } = req.body;
  farm.farmName = farmName || farm.farmName;
  farm.story = story || farm.story;
  if (address || city || state) {
    farm.location = {
      address: address || farm.location.address,
      city: city || farm.location.city,
      state: state || farm.location.state,
      zipCode: zipCode || farm.location.zipCode
    };
  }
  if (farmSizeAcres) farm.farmSizeAcres = farmSizeAcres;

  await farm.save();

  res.status(200).json({
    success: true,
    data: { farm }
  });
});

exports.getFarmerDashboardMetrics = catchAsync(async (req, res, next) => {
  const farmerId = req.user._id;

  const farmProfile = await FarmProfile.findOne({ user: farmerId });
  const totalProducts = await Product.countDocuments({ farmer: farmerId, status: { $ne: 'archived' } });
  
  const orders = await Order.find({ 'items.farmer': farmerId });
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const acceptedOrders = orders.filter(o => o.orderStatus === 'accepted' || o.orderStatus === 'harvested_packed' || o.orderStatus === 'out_for_delivery').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'completed').length;
  
  const totalEarnings = orders
    .filter(o => o.orderStatus === 'completed' || o.paymentInfo.status === 'paid')
    .reduce((sum, o) => {
      const farmerItems = o.items.filter(it => it.farmer.toString() === farmerId.toString());
      const itemSum = farmerItems.reduce((s, it) => s + it.totalPrice, 0);
      return sum + itemSum;
    }, 0);

  res.status(200).json({
    success: true,
    data: {
      farmProfile,
      totalProducts,
      totalOrders: orders.length,
      pendingOrders,
      acceptedOrders,
      completedOrders,
      totalEarnings
    }
  });
});

exports.uploadFarmSitePhoto = catchAsync(async (req, res, next) => {
  let farm = await FarmProfile.findOne({ user: req.user._id });
  if (!farm) {
    return next(new AppError('Farm profile not found. Please onboard your farm first.', 404));
  }

  let photoUrl = req.body.imageUrl || '';
  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file.buffer, 'farm_site');
  }

  if (!photoUrl) {
    return next(new AppError('Please upload an image file or provide an image URL.', 400));
  }

  const caption = req.body.caption || 'Current farm site status photo';

  farm.siteImages.push({
    url: photoUrl,
    caption: caption,
    dateUploaded: new Date()
  });

  await farm.save();

  res.status(201).json({
    success: true,
    message: 'Farm site photo added successfully',
    data: { farm }
  });
});

exports.deleteFarmSitePhoto = catchAsync(async (req, res, next) => {
  let farm = await FarmProfile.findOne({ user: req.user._id });
  if (!farm) {
    return next(new AppError('Farm profile not found', 404));
  }

  const photoId = req.params.photoId;
  farm.siteImages = farm.siteImages.filter(img => img._id.toString() !== photoId);

  await farm.save();

  res.status(200).json({
    success: true,
    message: 'Farm site photo deleted successfully',
    data: { farm }
  });
});
