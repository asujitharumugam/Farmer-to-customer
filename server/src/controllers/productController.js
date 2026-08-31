const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getProducts = catchAsync(async (req, res, next) => {
  const { category, search, organic, farmerId, status, minPrice, maxPrice, sort } = req.query;

  const query = {};

  if (category) {
    const catDoc = await Category.findOne({ slug: category });
    if (catDoc) query.category = catDoc._id;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (organic !== undefined) {
    query.isOrganic = organic === 'true';
  }

  if (farmerId) {
    query.farmer = farmerId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.pricePerUnit = {};
    if (minPrice !== undefined) query.pricePerUnit.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.pricePerUnit.$lte = Number(maxPrice);
  }

  if (status && status !== 'all') {
    query.status = status;
  } else {
    query.status = { $ne: 'archived' };
  }

  let productsQuery = Product.find(query)
    .populate('farmer', 'name email avatar phone')
    .populate('farm', 'farmName location verificationStatus ratingAverage')
    .populate('category', 'name slug');

  if (sort === 'price-asc') productsQuery = productsQuery.sort({ pricePerUnit: 1 });
  else if (sort === 'price-desc') productsQuery = productsQuery.sort({ pricePerUnit: -1 });
  else if (sort === 'harvest-soon') productsQuery = productsQuery.sort({ harvestDate: 1 });
  else productsQuery = productsQuery.sort({ createdAt: -1 });

  const products = await productsQuery;

  res.status(200).json({
    success: true,
    results: products.length,
    data: { products }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('farmer', 'name email avatar phone')
    .populate('farm', 'farmName story location verificationStatus ratingAverage ratingCount')
    .populate('category', 'name slug');

  if (!product) {
    return next(new AppError('Produce item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { product }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, categoryId, pricePerUnit, unit, stockQuantity, harvestDate, isOrganic } = req.body;

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, 'produce_items');
      imageUrls.push(url);
    }
  } else if (req.body.imageUrl) {
    imageUrls.push(req.body.imageUrl);
  } else {
    imageUrls.push('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80');
  }

  const newProduct = await Product.create({
    farmer: req.user._id,
    farm: req.farmProfile._id,
    title,
    description,
    category: categoryId,
    pricePerUnit: Number(pricePerUnit),
    unit: unit || 'kg',
    stockQuantity: Number(stockQuantity),
    harvestDate: new Date(harvestDate),
    isOrganic: isOrganic === 'true' || isOrganic === true,
    images: imageUrls,
    status: Number(stockQuantity) > 0 ? 'available' : 'out_of_stock'
  });

  res.status(201).json({
    success: true,
    data: { product: newProduct }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only edit your own produce listings', 403));
  }

  const { title, description, categoryId, pricePerUnit, unit, stockQuantity, harvestDate, isOrganic, status } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (categoryId) product.category = categoryId;
  if (pricePerUnit !== undefined) product.pricePerUnit = Number(pricePerUnit);
  if (unit) product.unit = unit;
  if (stockQuantity !== undefined) {
    product.stockQuantity = Number(stockQuantity);
    if (Number(stockQuantity) === 0) product.status = 'out_of_stock';
    else if (product.status === 'out_of_stock') product.status = 'available';
  }
  if (harvestDate) product.harvestDate = new Date(harvestDate);
  if (isOrganic !== undefined) product.isOrganic = isOrganic === 'true' || isOrganic === true;
  if (status) product.status = status;

  if (req.files && req.files.length > 0) {
    let imageUrls = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, 'produce_items');
      imageUrls.push(url);
    }
    product.images = imageUrls;
  }

  await product.save();

  res.status(200).json({
    success: true,
    data: { product }
  });
});

exports.updateStock = catchAsync(async (req, res, next) => {
  const { stockQuantity } = req.body;

  if (stockQuantity === undefined || Number(stockQuantity) < 0) {
    return next(new AppError('Please provide a valid non-negative stock quantity.', 400));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only update stock for your own produce listings.', 403));
  }

  product.stockQuantity = Number(stockQuantity);
  if (Number(stockQuantity) === 0) {
    product.status = 'out_of_stock';
  } else if (product.status === 'out_of_stock') {
    product.status = 'available';
  }

  await product.save();

  res.status(200).json({
    success: true,
    data: { product }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own produce listings', 403));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Produce item deleted successfully'
  });
});
