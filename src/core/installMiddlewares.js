const koaCors = require('@koa/cors');
const config = require('config');
const bodyParser = require('koa-bodyparser');


const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');



module.exports = async function installMiddleware(app) {
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
};

