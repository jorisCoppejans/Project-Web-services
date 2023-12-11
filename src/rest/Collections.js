const Router = require("@koa/router");
const Joi = require("joi");

const CollectionService = require("../service/Collections");
const validate = require("../core/validation");


const getAllCollections = async(ctx) =>{
  ctx.body = await CollectionService.getAll();
};

getAllCollections.validationScheme = null;

const getCollectionById = async (ctx) => {
  ctx.body = await CollectionService.getById(Number(ctx.params.id));
};

getCollectionById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createCollection = async (ctx) => {
  ctx.body = await CollectionService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId)
  });
  ctx.status = 201;
};

createCollection.validationScheme = {
  body: {
    id: Joi.number().integer().positive(),
    userId: Joi.number().integer().positive(),
    value: Joi.number().integer().positive(),
  },
};

const updateCollection = async (ctx) => {
  ctx.body = await CollectionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId),
    value : Number(ctx.request.body.value)
  });
};

updateCollection.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    userId: Joi.number().integer().positive(),
    value: Joi.number().integer().positive(),
  }
};

const deleteCollection = async (ctx) => {
  await CollectionService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteCollection.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};


module.exports = (app) => {
  const router = new Router({
    prefix: "/Collections",
  });

  router.get("/", validate(getAllCollections.validationScheme), getAllCollections);
  router.get("/:id", validate(getCollectionById.validationScheme), getCollectionById);
  router.post("/", validate(createCollection.validationScheme), createCollection);
  router.put("/:id", validate(updateCollection.validationScheme),updateCollection);
  router.delete("/:id", validate(deleteCollection.validationScheme), deleteCollection);

  app.use(router.routes())
    .use(router.allowedMethods());
};