const Router = require("@koa/router");

const apiCoinService = require("../service/apiCoins");
const validate = require("../core/validation");

const getAllCoins = async(ctx) =>{
  ctx.body = await apiCoinService.getAll();
};

getAllCoins.validationScheme = null;


module.exports = (app) => {
  const router = new Router({
    prefix: "/apiCoins",
  });

  router.get("/", validate(getAllCoins.validationScheme), getAllCoins);

  app.use(router.routes())
    .use(router.allowedMethods());
};