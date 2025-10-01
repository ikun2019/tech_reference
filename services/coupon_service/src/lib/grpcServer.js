const grpc = require('@grpc/grpc-js');
const http = require('http');

const { CouponServiceService } = require('../../proto/coupon_grpc_pb');
const { unlockCoupon, getUnlockCategories } = require('../impl');

// * Graceful Shutdown
const shutdown = (server, healthServer) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 coupon_service gRPC server is shut down');
    });
  }
  if (healthServer) {
    healthServer.close(() => {
      console.log('🔴 coupon_service health check is shut down');
    });
  }
};

exports.startServer = () => {
  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createInsecure();

  server.addService(CouponServiceService, {
    unlockCoupon: unlockCoupon,
    getUnlockCategories: getUnlockCategories
  });

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    server.start();
    console.log('🟢 coupon_service gRPC server is running');
  });

  const healthServer = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  healthServer.listen(8080, () => {
    console.log('🟢 coupon_service health check');
  });

  process.on('SIGINT', () => shutdown(server, healthServer));
  process.on('SIGTERM', () => shutdown(server, healthServer));
};