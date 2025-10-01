const couponServiceClient = require('../lib/grpc/couponServiceClient');
const { UnlockCouponRequest, GetUnlockCategoriesRequest } = require('../../proto/coupon_pb');

// * POST => /api/coupon
exports.unlockCoupon = async (req, res) => {
  const user_id = req.user && req.user.id;
  const { coupon_id } = req.body || {};
  try {
    if (!user_id || !coupon_id) {
      return res.status(400).json({ error: 'invalid request' });
    }

    const request = new UnlockCouponRequest();
    if (typeof request.setUserId === 'function') request.setUserId(user_id);
    if (typeof request.setCouponId === 'function') request.setCouponId(coupon_id);

    const couponResponse = await new Promise((resolve, reject) => {
      couponServiceClient.unlockCoupon(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    console.log(couponResponse.toObject());
    const toObj = typeof couponResponse.toObject === 'function' ? couponResponse.toObject() : couponResponse;
    const success = toObj.success ?? (couponResponse.getSuccess ? couponResponse.getSuccess() : undefined);
    const unlocked = toObj.unlocked ?? (couponResponse.getUnlocked ? couponResponse.getUnlocked() : '');
    const errorMsg = toObj.error ?? (couponResponse.getError ? couponResponse.getError() : '')

    if (!success) {
      return res.status(400).json({ success: false, unlocked, error: errorMsg });
    }

    return res.status(200).json({
      success: true,
      unlocked,
      error: ''
    });
  } catch (error) {
    console.error('unlockCoupon error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// * GET => /api/coupon
exports.getUnlockCategories = async (req, res) => {
  console.log('getUnlockCategories');
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const request = new GetUnlockCategoriesRequest();
    request.setUserId(userId);

    const couponResponse = await new Promise((resolve, reject) => {
      couponServiceClient.getUnlockCategories(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    const categories = couponResponse.toObject().categoriesList || [];
    return res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ getUnlockCategories error:', error);
    return res.status(500).json({ error: 'getUnlockCategories failed' });
  }
};