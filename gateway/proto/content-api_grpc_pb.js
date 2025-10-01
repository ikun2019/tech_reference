// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var content$api_pb = require('./content-api_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notion_CommandDetailResponse(arg) {
  if (!(arg instanceof content$api_pb.CommandDetailResponse)) {
    throw new Error('Expected argument of type notion.CommandDetailResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notion_CommandDetailResponse(buffer_arg) {
  return content$api_pb.CommandDetailResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notion_GetNotionByPathRequest(arg) {
  if (!(arg instanceof content$api_pb.GetNotionByPathRequest)) {
    throw new Error('Expected argument of type notion.GetNotionByPathRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notion_GetNotionByPathRequest(buffer_arg) {
  return content$api_pb.GetNotionByPathRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notion_ListCommandsResponse(arg) {
  if (!(arg instanceof content$api_pb.ListCommandsResponse)) {
    throw new Error('Expected argument of type notion.ListCommandsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notion_ListCommandsResponse(buffer_arg) {
  return content$api_pb.ListCommandsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notion_ListStarterResponse(arg) {
  if (!(arg instanceof content$api_pb.ListStarterResponse)) {
    throw new Error('Expected argument of type notion.ListStarterResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notion_ListStarterResponse(buffer_arg) {
  return content$api_pb.ListStarterResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notion_StarterKitDetailResponse(arg) {
  if (!(arg instanceof content$api_pb.StarterKitDetailResponse)) {
    throw new Error('Expected argument of type notion.StarterKitDetailResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notion_StarterKitDetailResponse(buffer_arg) {
  return content$api_pb.StarterKitDetailResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var NotionServiceService = exports.NotionServiceService = {
  getCommands: {
    path: '/notion.NotionService/GetCommands',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: content$api_pb.ListCommandsResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_notion_ListCommandsResponse,
    responseDeserialize: deserialize_notion_ListCommandsResponse,
  },
  getCommandDetail: {
    path: '/notion.NotionService/GetCommandDetail',
    requestStream: false,
    responseStream: false,
    requestType: content$api_pb.GetNotionByPathRequest,
    responseType: content$api_pb.CommandDetailResponse,
    requestSerialize: serialize_notion_GetNotionByPathRequest,
    requestDeserialize: deserialize_notion_GetNotionByPathRequest,
    responseSerialize: serialize_notion_CommandDetailResponse,
    responseDeserialize: deserialize_notion_CommandDetailResponse,
  },
  getStarterKits: {
    path: '/notion.NotionService/GetStarterKits',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: content$api_pb.ListStarterResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_notion_ListStarterResponse,
    responseDeserialize: deserialize_notion_ListStarterResponse,
  },
  getStarterKitDetail: {
    path: '/notion.NotionService/GetStarterKitDetail',
    requestStream: false,
    responseStream: false,
    requestType: content$api_pb.GetNotionByPathRequest,
    responseType: content$api_pb.StarterKitDetailResponse,
    requestSerialize: serialize_notion_GetNotionByPathRequest,
    requestDeserialize: deserialize_notion_GetNotionByPathRequest,
    responseSerialize: serialize_notion_StarterKitDetailResponse,
    responseDeserialize: deserialize_notion_StarterKitDetailResponse,
  },
};

exports.NotionServiceClient = grpc.makeGenericClientConstructor(NotionServiceService, 'NotionService');
