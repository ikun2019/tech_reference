const grpc = require('@grpc/grpc-js');

const fs = require('fs');

const { NotionServiceClient } = require('../../../proto/content-api_grpc_pb');

const client = new NotionServiceClient('content-api_service:50051', grpc.credentials.createInsecure());

module.exports = client;