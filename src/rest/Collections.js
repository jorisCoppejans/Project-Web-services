const Router = require("@koa/router");
const Joi = require("joi");

const { requireAuthentication } = require("../core/auth");
const CollectionService = require("../service/Collections");
const validate = require("../core/validation");


const getAllCollections = async(ctx) =>{
  const { userId } = ctx.state.session;
  ctx.body = await CollectionService.getAll(userId);
};

getAllCollections.validationScheme = null;

const getCollectionById = async (ctx) => {
  const {userId} = ctx.state.session;
  ctx.body = await CollectionService.getById(Number(ctx.params.id), userId);
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
    userId: ctx.state.session.userId,
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
    userId: ctx.state.session.userId,
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
  const userId = ctx.state.session.userId;
  await CollectionService.deleteById(ctx.params.id, userId);
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

  router.use(requireAuthentication);


  router.get("/", validate(getAllCollections.validationScheme), getAllCollections);
  router.get("/:id", validate(getCollectionById.validationScheme), getCollectionById);
  router.post("/", validate(createCollection.validationScheme), createCollection);
  router.put("/:id", validate(updateCollection.validationScheme),updateCollection);
  router.delete("/:id", validate(deleteCollection.validationScheme), deleteCollection);

  app.use(router.routes()).use(router.allowedMethods());
};