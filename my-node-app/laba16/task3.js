const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3002;

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  const time = new Date().toLocaleString('ru-RU');
  res.on('finish', () => {
    console.log(`[${time}] ${req.method} ${req.path} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

app.use(compression());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100, message: { error: 'Слишком много запросов', status: 429 } }));

app.get('/api/data', (req, res) => {
  res.json({ message: "Тест логов и сжатия", data: new Array(100).fill("test") });
});

app.get('/error', (req, res) => { throw new Error('Тестовая ошибка сервера'); });
app.get('/async-error', async (req, res, next) => {
  try { await Promise.reject(new Error('Асинхронная ошибка')); } 
  catch (err) { next(err); }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message, status: err.status || 500 });
});

app.listen(PORT, () => console.log(`Сервер 3 запущен: http://localhost:${PORT}`));