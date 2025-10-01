const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis',
  port: 6379,
  password: undefined,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

redis.on('connect', () => {
  console.log('🟢 Redis Connected');
});

redis.on('error', (err) => {
  console.error('🔴 Redis error:', err);
});

module.exports = redis;