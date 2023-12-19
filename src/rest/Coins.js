const Router = require("@koa/router");
const Joi = require("joi");

const CoinService = require("../service/Coins");
const validate = require("../core/validation");

const getAllCoins = async(ctx) =>{
  ctx.body = await CoinService.getAll();
};

getAllCoins.validationScheme = null;


const getCoinById = async (ctx) => {
  const gotCoins = await CoinService.getById(Number(ctx.params.id));
  gotCoins.favorite = Boolean(gotCoins.favorite);
  ctx.body = gotCoins;
};

getCoinById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};


const createCoin = async (ctx) => {
  const createdCoin = await CoinService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: Boolean(ctx.request.body.favorite),
  });
  createdCoin.favorite = Boolean(createdCoin.favorite);
  ctx.status = 201;
  ctx.body = createdCoin;
};

createCoin.validationScheme = {
  body: {
    id: Joi.number().integer().positive(),
    name: Joi.string().min(1),
    value: Joi.number().positive(),
    collectionId: Joi.number().integer().positive(),
    favorite: Joi.boolean(),
  },
};

const updateCoin = async (ctx) => {
  const updatedCoin = await CoinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  });
  updatedCoin.favorite = Boolean(updatedCoin.favorite);
  ctx.body = updatedCoin;
};

updateCoin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    name: Joi.string().min(1),
    value: Joi.number().integer().positive(),
    collectionId: Joi.number().integer().positive(),
    favorite: Joi.boolean(),
  }
};

const deleteCoin = async (ctx) => {
  await CoinService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteCoin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/Coins",
  });

  router.get("/", validate(getAllCoins.validationScheme), getAllCoins);
  router.get("/:id", validate(getCoinById.validationScheme), getCoinById);
  router.post("/", validate(createCoin.validationScheme), createCoin);
  router.put("/:id", validate(updateCoin.validationScheme), updateCoin);
  router.delete("/:id", validate(deleteCoin.validationScheme), deleteCoin);

  app.use(router.routes())
    .use(router.allowedMethods());
};