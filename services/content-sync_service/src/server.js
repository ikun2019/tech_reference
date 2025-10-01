const { startServer } = require('./lib/grpcServer');

require('./cron/commandSync');
require('./cron/starterSync');

startServer();