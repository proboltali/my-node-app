const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  const start = Date.now();
  const time = new Date().toLocaleString('ru-RU');
  await next();
  const ms = Date.now() - start;
  console.log(`[${time}] ${ctx.method} ${ctx.path} - ${ms}ms`);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Внутренняя ошибка сервера',
      status: ctx.status,
    };
    ctx.app.emit('error', err, ctx);
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/protected') {
    const auth = ctx.get('Authorization');
    if (!auth) {
      ctx.status = 401;
      ctx.body = { error: 'Требуется авторизация', status: 401 };
      return;
    }
  }
  await next();
});

app.use(bodyParser());

router.get('/protected', async (ctx) => {
  ctx.body = { message: 'Доступ разрешён', user: 'authorized' };
});

router.get('/error', async (ctx) => {
  throw new Error('Тестовая ошибка сервера');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002, () => {
  console.log('Задание 3: http://localhost:3002');
});