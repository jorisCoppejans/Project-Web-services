const Koa = require('koa');
const koaCors = require('@koa/cors');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const installRest = require('./rest');
const { initializeLogger, getLogger } = require('./core/logging');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level');
const LOG_DISABLED = config.get('logging.disabled');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

initializeLogger({
  level: LOG_LEVEL,
  disabled: LOG_DISABLED,
  defaultMeta: {
    NODE_ENV,
  },
});

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);
const app = new Koa();


app.use(
  koaCors({
    origin: (ctx) => {
      if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
        return ctx.request.header.origin;
      }
      return CORS_ORIGINS[0];
    },
    allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
    maxAge: CORS_MAX_AGE,
  })
);


app.use(bodyParser());

installRest(app);

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://localhost:9000');
});