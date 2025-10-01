const express = require('express');
const cors = require('cors');

// * routerのインポート
const notionRouter = require('./routes/notion.router');

// * appの設定
const app = express();
app.use(express.json());
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

app.listen(8000, () => {
  console.log('🟢 gateway server is running')
});