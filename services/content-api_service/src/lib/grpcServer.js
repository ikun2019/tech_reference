const grpc = require('@grpc/grpc-js');

const { NotionServiceService } = require('../../proto/content-api_grpc_pb');
const { getCommands, getCommandDetail, getStarterKits, getStarterKitDetail } = require('../impl');

// * Graceful Shutdown
const shutdown = (server) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 content-api_service gRPC server is shut down');
    });
  }
};

exports.startServer = () => {
  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createInsecure();

  server.addService(NotionServiceService, {
    getCommands: getCommands,
    getCommandDetail: getCommandDetail,
    getStarterKits: getStarterKits,
    getStarterKitDetail: getStarterKitDetail
  });

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    server.start();
    console.log('🟢 content-api_service gRPC server is running');
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};