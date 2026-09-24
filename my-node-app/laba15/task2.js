const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

let users = [
  { id: 1, name: 'Иванов Иван', group: 'ББМО-01-23' },
  { id: 2, name: 'Петров Петр', group: 'ББМО-01-23' },
];
let nextId = 3;

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

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
  console.log('Задание 2: http://localhost:3001/api/users');
});