const Router = require("@koa/router");

const apiCoinService = require("../service/apiCoins");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");


const getAllCoins = async(ctx) =>{
  ctx.body = await apiCoinService.getAll();
};

getAllCoins.validationScheme = null;


module.exports = (app) => {
  const router = new Router({
    prefix: "/apiCoins",
  });

  router.use(requireAuthentication);


  router.get("/", requireAuthentication, validate(getAllCoins.validationScheme), getAllCoins);

  app.use(router.routes())
    .use(router.allowedMethods());
};