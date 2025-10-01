// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var coupon_pb = require('./coupon_pb.js');

function serialize_coupon_GetUnlockCategoriesRequest(arg) {
  if (!(arg instanceof coupon_pb.GetUnlockCategoriesRequest)) {
    throw new Error('Expected argument of type coupon.GetUnlockCategoriesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_coupon_GetUnlockCategoriesRequest(buffer_arg) {
  return coupon_pb.GetUnlockCategoriesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_coupon_GetUnlockCategoriesResponse(arg) {
  if (!(arg instanceof coupon_pb.GetUnlockCategoriesResponse)) {
    throw new Error('Expected argument of type coupon.GetUnlockCategoriesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_coupon_GetUnlockCategoriesResponse(buffer_arg) {
  return coupon_pb.GetUnlockCategoriesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_coupon_UnlockCouponRequest(arg) {
  if (!(arg instanceof coupon_pb.UnlockCouponRequest)) {
    throw new Error('Expected argument of type coupon.UnlockCouponRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_coupon_UnlockCouponRequest(buffer_arg) {
  return coupon_pb.UnlockCouponRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_coupon_UnlockCouponResponse(arg) {
  if (!(arg instanceof coupon_pb.UnlockCouponResponse)) {
    throw new Error('Expected argument of type coupon.UnlockCouponResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_coupon_UnlockCouponResponse(buffer_arg) {
  return coupon_pb.UnlockCouponResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CouponServiceService = exports.CouponServiceService = {
  unlockCoupon: {
    path: '/coupon.CouponService/UnlockCoupon',
    requestStream: false,
    responseStream: false,
    requestType: coupon_pb.UnlockCouponRequest,
    responseType: coupon_pb.UnlockCouponResponse,
    requestSerialize: serialize_coupon_UnlockCouponRequest,
    requestDeserialize: deserialize_coupon_UnlockCouponRequest,
    responseSerialize: serialize_coupon_UnlockCouponResponse,
    responseDeserialize: deserialize_coupon_UnlockCouponResponse,
  },
  getUnlockCategories: {
    path: '/coupon.CouponService/GetUnlockCategories',
    requestStream: false,
    responseStream: false,
    requestType: coupon_pb.GetUnlockCategoriesRequest,
    responseType: coupon_pb.GetUnlockCategoriesResponse,
    requestSerialize: serialize_coupon_GetUnlockCategoriesRequest,
    requestDeserialize: deserialize_coupon_GetUnlockCategoriesRequest,
    responseSerialize: serialize_coupon_GetUnlockCategoriesResponse,
    responseDeserialize: deserialize_coupon_GetUnlockCategoriesResponse,
  },
};

exports.CouponServiceClient = grpc.makeGenericClientConstructor(CouponServiceService, 'CouponService');
