const express = require('express');
const cors = require('cors');

// * routerのインポート
const notionRouter = require('./routes/notion.router');
const couponRouter = require('./routes/coupon.router');

// * appの設定
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * CORS設定
const allowOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowOrigins.indexOf(origin) == -1) {
      const msg = 'The Cors policy does not allow.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// * routerのマウント
app.use('/api/notion', notionRouter);
app.use('/api/coupon', couponRouter);

// * healthcheck
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
const server = app.listen(8000, () => {
  console.log('🟢 gateway server is running')
});

// * graceful shutdown
function shutdown() {
  console.log('🟡 Shutting down gracefully');
  server.close(() => {
    console.log('🔴 Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('⚠️ Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);