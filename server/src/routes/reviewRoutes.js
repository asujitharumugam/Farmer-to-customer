const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/product/:productId', reviewController.getProductReviews);
router.get('/admin/all', protect, authorize('admin'), reviewController.getAllReviews);
router.post('/', protect, authorize('customer'), reviewController.createReview);

module.exports = router;
