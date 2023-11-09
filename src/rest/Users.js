const Router = require('@koa/router');
const UserService = require('../service/Users');


const getAllUsers = async(ctx) =>{
  ctx.body = await UserService.getAll();
};

const getUserById = async (ctx) => {
  ctx.body = await UserService.getById(Number(ctx.params.id));
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

  router.get('/', getAllUsers);
  router.post('/', createUser);
  router.get('/:id', getUserById);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  app.use(router.routes())
     .use(router.allowedMethods());
};