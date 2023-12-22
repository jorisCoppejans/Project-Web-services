const Router = require("@koa/router");

const installUserRouter = require("./Users");
const installCollectionRouter = require("./Collections");
const installCoinRouter = require("./Coins");
const installApiCoinRouter = require("./apicoins");
const installHealthRouter = require("./health");

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installApiCoinRouter(router);
  installUserRouter(router);
  installCollectionRouter(router);
  installCoinRouter(router);
  installHealthRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
