const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Public Category Reading Endpoint
router.get('/categories', adminController.getCategories);

// All subsequent routes require Admin authorization
router.use(protect, authorize('admin'));

// 1. Dashboard & Reports Analytics
router.get('/analytics', adminController.getAdminStats);
router.get('/reports', adminController.getAdminReports);

// 2. Manage Farmers & Application Approvals
router.get('/farmers', adminController.getAllFarmers);
router.get('/farmers/pending', adminController.getPendingFarmers);
router.patch('/farmers/:id/verify', adminController.verifyFarmer);

// 3. Manage Customers & User Ban Management
router.get('/customers', adminController.getAllCustomers);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/status', adminController.toggleUserStatus);
router.patch('/users/:userId/approve', adminController.approveUserAccount);

// 4. Manage Products Moderation
router.get('/products', adminController.getAllProductsAdmin);
router.patch('/products/:productId/status', adminController.adminUpdateProductStatus);
router.delete('/products/:productId', adminController.adminDeleteProduct);

// 5. Manage Orders Override
router.get('/orders', adminController.getAllOrdersAdmin);
router.patch('/orders/:orderId/status', adminController.adminUpdateOrderStatus);

// 6. Category Management
router.post('/categories', adminController.createCategory);

module.exports = router;
