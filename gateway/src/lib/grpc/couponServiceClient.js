const grpc = require('@grpc/grpc-js');

const fs = require('fs');

const { CouponServiceClient } = require('../../../proto/coupon_grpc_pb');

const client = new CouponServiceClient('coupon_service:50051', grpc.credentials.createInsecure());

module.exports = client;