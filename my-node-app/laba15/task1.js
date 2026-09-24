const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

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

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Задание 1: http://localhost:3000');
});