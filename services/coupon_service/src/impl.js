const grpc = require('@grpc/grpc-js');
const bcrypt = require('bcryptjs');
const crypt = require('crypto');

const supabase = require('./lib/supabaseAPI');

const { UnlockCouponResponse, GetUnlockCategoriesResponse } = require('../proto/coupon_pb');

exports.unlockCoupon = async (call, callback) => {
  console.log('✅ gRPC unlockCoupon action');
  console.log('call =>', call.request.toObject());
  const req = call && call.request
    ? (typeof call.request.toObject === 'function' ? call.request.toObject() : call.request)
    : {};
  const user_id = (req.userId || '').trim();
  const code = (req.couponId || req.code || '').trim();

  try {
    if (!user_id || !code) {
      const response = new UnlockCouponResponse();
      response.setSuccess(false);
      response.setUnlocked('');
      response.setError('invalid request: user_id and coupon code are required');
      return callback(null, response);
    }

    //　クーポンコードからクーポンを検索
    const codeLookup = crypt.createHash('sha256').update(code).digest('hex');
    // console.log('codeLookup =>', codeLookup);
    // const codeHash = await bcrypt.hash(code, 10);
    // console.log('codeHash =>', codeHash)
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('id, slug, code_lookup, code_hash, category')
      .eq('code_lookup', codeLookup)
      .maybeSingle();
    if (couponError) {
      console.error('❌ coupon fetch error:', couponError);
      return callback({
        code: grpc.status.INTERNAL,
        message: couponError.message
      });
    }
    if (!coupon) {
      const response = new UnlockCouponResponse();
      response.setSuccess(false);
      response.setUnlocked('');
      response.setError('coupon not found');
      return callback(null, response);
    }

    // クーポンコードを比較
    const isOk = await bcrypt.compare(code, coupon.code_hash);
    if (!isOk) {
      const response = new UnlockCouponResponse();
      response.setSuccess(false);
      response.setUnlocked('');
      response.setError('invalid code');
      return callback(null, response);
    };

    const unlockCategory = coupon.category;
    if (!unlockCategory) {
      const response = new UnlockCouponResponse();
      response.setSuccess(false);
      response.setUnlocked('');
      response.setError('coupon has not category');
      return callback(null, response);
    }

    // カテゴリ解放状況をDBに保存
    const { error: upsertError } = await supabase
      .from('user_unlocked_category')
      .upsert(
        {
          user_id,
          source: 'coupon',
          coupon_id: coupon.id,
          unlock_category: unlockCategory
        },
        { onConflict: 'user_id, unlock_category' }
      );
    if (upsertError) {
      return callback({
        code: grpc.status.INTERNAL,
        message: upsertError.message
      });
    }

    const response = new UnlockCouponResponse();
    response.setSuccess(true);
    response.setUnlocked(unlockCategory);
    response.setError('');

    return callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Unknown error'
    })
  }
};

exports.getUnlockCategories = async (call, callback) => {
  console.log('✅ gRPC getUnlockCategories');
  const req = call && call.request
    ? (typeof call.request.toObject === 'function' ? call.request.toObject() : call.request)
    : {};
  const user_id = (req.userId || '').trim();

  try {
    if (!user_id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'user_id is required'
      });
    }

    const { data, error } = await supabase
      .from('user_unlocked_category')
      .select('unlock_category')
      .eq('user_id', user_id);
    if (error) {
      return callback({
        code: grpc.status.INTERNAL,
        message: error.message
      })
    }

    const categories = (data || []).map((c) => c.unlock_category).filter(Boolean);
    const response = new GetUnlockCategoriesResponse();
    response.setCategoriesList(categories);
    return callback(null, response);
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Unknown error'
    });
  }
};