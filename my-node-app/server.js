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

let users = [
  { id: 1, name: 'Иванов Иван', group: 'ББМО-01-23' },
  { id: 2, name: 'Петров Петр', group: 'ББМО-01-23' },
];
let nextId = 3;

router.get('/', async (ctx) => {
  const now = new Date().toLocaleString('ru-RU');
  ctx.type = 'html';
  ctx.body = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>ЛР №15</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px; }
        .card { background: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        p { font-size: 16px; color: #333; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Лабораторная работа №15</h1>
        <p><b>Группа:</b> ББМО-01-23</p>
        <p><b>Дата и время:</b> ${now}</p>
        <p>Добро пожаловать! Сервер работает на Koa.js.</p>
      </div>
    </body>
    </html>
  `;
});

router.get('/api/users', async (ctx) => {
  ctx.body = users;
});

router.post('/api/users', async (ctx) => {
  const { name, group } = ctx.request.body || {};
  if (!name || !group) {
    ctx.status = 400;
    ctx.body = { error: 'Поля name и group обязательны' };
    return;
  }
  const user = { id: nextId++, name, group };
  users.push(user);
  ctx.status = 201;
  ctx.body = user;
});

router.put('/api/users/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  const { name, group } = ctx.request.body || {};
  if (!name || !group) {
    ctx.status = 400;
    ctx.body = { error: 'Поля name и group обязательны' };
    return;
  }
  user.name = name;
  user.group = group;
  ctx.body = user;
});

router.delete('/api/users/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  users.splice(idx, 1);
  ctx.body = { message: `Пользователь ${id} удалён` };
});

router.get('/protected', async (ctx) => {
  ctx.body = { message: 'Доступ разрешён', user: 'authorized' };
});

router.get('/error', async (ctx) => {
  throw new Error('Тестовая ошибка сервера');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Сервер запущен: http://localhost:3000 (LR15)');
});