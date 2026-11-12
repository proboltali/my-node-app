const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const now = new Date().toLocaleString('ru-RU');
  res.send(`
    <html><body style="font-family:Arial; padding:40px;">
      <h1>Лабораторная работа №16</h1>
      <p><b>Студент:</b> Садыков Александр Вячеславович</p>
      <p><b>Группа:</b> 477</p>
      <p><b>Время:</b> ${now}</p>
      <p>Приветствие! Работает Express.js</p>
      <a href="/about">О разработчике</a> | <a href="/contacts">Контакты</a>
    </body></html>
  `);
});

app.get('/about', (req, res) => {
  res.send('<h1>О разработчике</h1><p>Студент: Садыков Александр Вячеславович, Группа 477</p>');
});

app.get('/contacts', (req, res) => {
  res.send('<h1>Контакты</h1><p>Email: sadykov@example.com</p>');
});

app.listen(PORT, () => console.log(`Сервер 1 запущен: http://localhost:${PORT}`));