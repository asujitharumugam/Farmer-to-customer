const Review = require('../models/Review');
const Product = require('../models/Product');
const FarmProfile = require('../models/FarmProfile');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  const { productId, rating, comment, orderId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produce item not found', 404));
  }

  const review = await Review.create({
    customer: req.user._id,
    product: productId,
    farmer: product.farmer,
    order: orderId,
    rating: Number(rating),
    comment
  });

  // Update farm rating aggregate score
  if (product.farm) {
    const farmReviews = await Review.find({ farmer: product.farmer });
    const avg = farmReviews.reduce((sum, r) => sum + r.rating, 0) / farmReviews.length;
    await FarmProfile.findByIdAndUpdate(product.farm, {
      ratingAverage: parseFloat(avg.toFixed(1)),
      ratingCount: farmReviews.length
    });
  }

  res.status(201).json({
    success: true,
    data: { review }
  });
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: reviews.length,
    data: { reviews }
  });
});
