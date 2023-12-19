const Router = require("@koa/router");
const Joi = require("joi");

const userService = require("../service/Users");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");


const getAllUsers = async(ctx) =>{
  ctx.body = await userService.getAll();
};

getAllUsers.validationScheme = null;


const getUserById = async (ctx) => {
  ctx.body = await userService.getById(Number(ctx.params.id));
};

getUserById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createUser = async (ctx) => {
  ctx.body = await userService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });

  const token = await userService.register(ctx.request.body);
  ctx.body = token;
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
  ctx.body = await userService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });
};

updateUser.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    firstname: Joi.string().min(1),
    lastname : Joi.string().min(1),
    email: Joi.string().email(),
    password: Joi.string().min(1),
  }
};

const deleteUser = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteUser.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const token = await userService.register(ctx.request.body);
  ctx.body = token;
  ctx.status = 200;
};

register.validationScheme = {
  body: {
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

const checkUserId = (ctx, next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};


module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);
  
  router.get("/", requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get("/:id", requireAuthentication, validate(getUserById.validationScheme), checkUserId, getUserById);
  router.post("/", requireAuthentication, validate(createUser.validationScheme), createUser);
  router.put("/:id", requireAuthentication, validate(updateUser.validationScheme), checkUserId, updateUser);
  router.delete("/:id", requireAuthentication, validate(deleteUser.validationScheme), checkUserId, deleteUser);

  app.use(router.routes())
    .use(router.allowedMethods());
};