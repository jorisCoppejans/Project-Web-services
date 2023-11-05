// index.js
const Koa = require('koa'); // 👈 1
const winston = require('winston')
const config = require('config');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const CollectionService = require('./service/Collections');
const CoinService = require('./service/Coins');
const UserService = require('./service/Users');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level');
const LOG_DISABLED = config.get('logging.disabled');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [

    new winston.transports.Console(),
  ],
});

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);

const router = new Router();
const app = new Koa();

app.use(bodyParser())

router.get("/api/users", async(ctx) =>{
  ctx.body = UserService.getAll();
});

router.get('/api/users/:id', async (ctx) => {
  ctx.body = UserService.getById(Number(ctx.params.id));
});

router.post('/api/users', async (ctx) => {
  ctx.body = UserService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });
  
});

router.put("/api/users/:id", async(ctx) => {
  ctx.body = UserService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    firstname: ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  })
})

router.delete('/api/users/:id', async (ctx) => {
  UserService.deleteById(ctx.params.id);
  ctx.status = 204;
});




router.get("/api/collections", async(ctx) =>{
  ctx.body = CollectionService.getAll();
});

router.get('/api/collections/:id', async (ctx) => {
  ctx.body = CollectionService.getById(Number(ctx.params.id));
});

router.post('/api/collections', async (ctx) => {
  ctx.body = CollectionService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId),
    value : Number(ctx.request.body.value)
  });
  
});

router.put('/api/collections/:id', async (ctx) => {
  ctx.body = CollectionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    userId: Number(ctx.request.body.userId),
    value : Number(ctx.request.body.value)
  })
});

router.delete('/api/collections/:id', async (ctx) => {
  CollectionService.deleteById(ctx.params.id);
  ctx.status = 204;
});




router.get("/api/coins", async(ctx) =>{
  ctx.body = CoinService.getAll();
});

router.get('/api/coins/:id', async (ctx) => {
  ctx.body = CoinService.getById(Number(ctx.params.id));
});


router.post('/api/coins', async (ctx) => {
  ctx.body = CoinService.create({
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  });
});

router.put('/api/coins/:id', async (ctx) => {
  ctx.body = CoinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.id),
    name: ctx.request.body.name,
    value : Number(ctx.request.body.value),
    collectionId: Number(ctx.request.body.collectionId),
    favorite: ctx.request.body.favorite,
  })
});

router.delete('/api/coins/:id', async (ctx) => {
  CoinService.deleteById(ctx.params.id);
  ctx.status = 204;
});





app.use(router.routes()).use(router.allowedMethods());

app.listen(9000, () => logger.info('server is running at ...'));
