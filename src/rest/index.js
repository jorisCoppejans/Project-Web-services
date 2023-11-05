const Router = require('@koa/router');
const installUserRouter = ('./Users.js');
const installCollectionRouter = require('./Collections');
const installCoinRouter = require('./Coins');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installUserRouter(router);
  installCollectionRouter(router);
  installCoinRouter(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};
