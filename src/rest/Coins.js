const Router = require('@koa/router');
const CoinService = require('../service/Coins');

const getAllCoins = async(ctx) =>{
  ctx.body = await CoinService.getAll();
};

const getCoinById = async (ctx) => {
  ctx.body = await CoinService.getById(Number(ctx.params.id));
};


const createCoin = async (ctx) => {
  ctx.body = await CoinService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  });
};

const updateCoin = async (ctx) => {
  ctx.body = await CoinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  })
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