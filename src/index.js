// index.js
const Koa = require('koa'); // 👈 1
const winston = require('winston')
const config = require('config');
const bodyParser = require('koa-bodyparser');
const CollectionService = require('./service/Collections');
const CoinService = require('./service/Coins');
const UserService = require('./service/Users');
const installRest = require('./rest');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level');
const LOG_DISABLED = config.get('logging.disabled');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [

    new winston.transports.Console(),
  ],
});

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);

const router = new Router();
const app = new Koa();

app.use(bodyParser());

installRest(app);


app.use(router.routes()).use(router.allowedMethods());

app.listen(9000, () => logger.info('server is running at ...'));
