const Router = require('@koa/router');
const CollectionService = require('../service/Collections');


const getAllCollections = async(ctx) =>{
  ctx.body = CollectionService.getAll();
};

const getCollectionById = async (ctx) => {
  ctx.body = CollectionService.getById(Number(ctx.params.id));
};

const createCollection = async (ctx) => {
  ctx.body = CollectionService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId),
    value : Number(ctx.request.body.value)
  });
  
};

const updateCollection = async (ctx) => {
  ctx.body = CollectionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId),
    value : Number(ctx.request.body.value)
  })
};

const deleteCollection = async (ctx) => {
  CollectionService.deleteById(ctx.params.id);
  ctx.status = 204;
};


module.exports = (app) => {
  const router = new Router({
    prefix: '/Collections',
  });

  router.get('/', getAllCollections);
  router.post('/', createCollection);
  router.get('/:id', getCollectionById);
  router.put('/:id', updateCollection);
  router.delete('/:id', deleteCollection);

  app.use(router.routes())
     .use(router.allowedMethods());
};