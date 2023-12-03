const Router = require('@koa/router');
const UserService = require('../service/Users');
const Joi = require('joi');
const validate = require('../core/validation');


const getAllUsers = async(ctx) =>{
  ctx.body = await UserService.getAll();
};

getAllUsers.validationScheme = null;


const getUserById = async (ctx) => {
  ctx.body = await UserService.getById(Number(ctx.params.id));
};

getAllUsers.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createUser = async (ctx) => {
  ctx.body = await UserService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });
  ctx.status = 201;
};

createUser.validationScheme = {
  body: {
    id: Joi.number().integer().positive(),
    firstname: Joi.string().min(1),
    lastname : Joi.string().min(1),
    email: Joi.string().email(),
    password: Joi.string().min(1),
  },
};


const updateUser = async(ctx) => {
  ctx.body = await UserService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  })
};

const deleteUser = async (ctx) => {
  await UserService.deleteById(ctx.params.id);
  ctx.status = 204;
};


module.exports = (app) => {
  const router = new Router({
    prefix: '/users',
  });

  router.get('/', validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', validate(getUserById.validationScheme), getUserById);
  router.post('/', validate(createUser.validationScheme), createUser);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  app.use(router.routes())
     .use(router.allowedMethods());
};