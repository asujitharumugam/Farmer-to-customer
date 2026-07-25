const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// Customer Order Endpoints
router.post('/', authorize('customer'), orderController.createOrder);
router.post('/create-stripe-intent', authorize('customer'), orderController.createStripeIntent);
router.get('/my-orders', authorize('customer'), orderController.getMyOrders);
router.patch('/:id/cancel', authorize('customer'), orderController.cancelMyOrder);

// Farmer Order Endpoints
router.get('/farmer-orders', authorize('farmer', 'admin'), orderController.getFarmerOrders);
router.get('/farmer-history', authorize('farmer', 'admin'), orderController.getFarmerOrderHistory);
router.patch('/:id/accept', authorize('farmer', 'admin'), orderController.acceptOrder);
router.patch('/:id/reject', authorize('farmer', 'admin'), orderController.rejectOrder);
router.patch('/:id/status', authorize('farmer', 'admin'), orderController.updateOrderStatus);

router.get('/:id', orderController.getOrderById);

module.exports = router;
