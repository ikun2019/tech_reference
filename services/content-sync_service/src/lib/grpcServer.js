const grpc = require('@grpc/grpc-js');

// * Graceful Shutdown
const shutdown = (server) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 content-sync_service gRPC server is shut down');
    });
  }
};

exports.startServer = () => {
  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createInsecure();

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    server.start();
    console.log('🟢 content-sync_service gRPC server is running');
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};