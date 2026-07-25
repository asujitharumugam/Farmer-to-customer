const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/public/:id', farmerController.getPublicFarmProfile);

router.use(protect, authorize('farmer', 'admin'));

router.post('/onboard', upload.single('document'), farmerController.onboardFarm);
router.get('/profile', farmerController.getMyFarmProfile);
router.put('/profile', farmerController.updateFarmProfile);
router.get('/dashboard-metrics', farmerController.getFarmerDashboardMetrics);

module.exports = router;
