const router = require('express').Router();

const { unlockCoupon, getUnlockCategories } = require('../controllers/coupon.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

// * POST => /api/coupon
router.post('/', authMiddleware, unlockCoupon);

// * GET => /api/coupon
router.get('/', authMiddleware, getUnlockCategories);

module.exports = router;