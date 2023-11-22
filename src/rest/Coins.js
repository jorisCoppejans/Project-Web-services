const Router = require('@koa/router');
const CoinService = require('../service/Coins');

const getAllCoins = async(ctx) =>{
  ctx.body = await CoinService.getAll();
};

const getCoinById = async (ctx) => {
  const gotCoins = await CoinService.getById(Number(ctx.params.id));
  gotCoins.favorite = Boolean(gotCoins.favorite)
  ctx.body = gotCoins;
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

const updateCoin = async (ctx) => {
  const updatedCoin = await CoinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  })
  updatedCoin.favorite = Boolean(updatedCoin.favorite);
  ctx.body = updatedCoin;
};

const deleteCoin = async (ctx) => {
  await CoinService.deleteById(ctx.params.id);
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/Coins',
  });

  router.get('/', getAllCoins);
  router.post('/', createCoin);
  router.get('/:id', getCoinById);
  router.put('/:id', updateCoin);
  router.delete('/:id', deleteCoin);

  app.use(router.routes())
     .use(router.allowedMethods());
};