const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { requireApprovedFarmer } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.use(protect);
router.post('/', requireApprovedFarmer, upload.array('images', 5), productController.createProduct);
router.put('/:id', requireApprovedFarmer, upload.array('images', 5), productController.updateProduct);
router.patch('/:id/stock', requireApprovedFarmer, productController.updateStock);
router.delete('/:id', requireApprovedFarmer, productController.deleteProduct);

module.exports = router;
