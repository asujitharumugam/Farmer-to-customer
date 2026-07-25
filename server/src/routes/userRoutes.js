const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('avatar'), userController.updateProfile);
router.post('/address', userController.addAddress);
router.delete('/address/:addressId', userController.removeAddress);

router.post('/wishlist/toggle', userController.toggleWishlist);
router.get('/wishlist', userController.getWishlist);

router.get('/customer-dashboard', userController.getCustomerDashboard);

module.exports = router;
