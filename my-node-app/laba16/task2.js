const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

let books = [
  { id: 1, title: 'Война и мир', author: 'Толстой', year: 1869 },
  { id: 2, title: 'Преступление и наказание', author: 'Достоевский', year: 1866 }
];
let nextId = 3;

app.get('/api/books', (req, res) => res.json(books));
app.get('/api/books/search', (req, res) => {
  const { author } = req.query;
  res.json(author ? books.filter(b => b.author.toLowerCase() === author.toLowerCase()) : books);
});
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  book ? res.json(book) : res.status(404).json({ error: 'Книга не найдена', status: 404 });
});

app.get('/test-post', (req, res) => {
  const book = { id: nextId++, title: "1984", author: "Оруэлл", year: 1949 };
  books.push(book);
  res.json({ message: "Книга успешно добавлена через POST", book });
});

app.get('/test-put', (req, res) => {
  const book = books.find(b => b.id === 1);
  if (book) book.title = "Война и мир (том 1)";
  res.json({ message: "Книга успешно обновлена через PUT", book });
});

app.get('/test-delete', (req, res) => {
  const idx = books.findIndex(b => b.id === 1);
  if (idx !== -1) books.splice(idx, 1);
  res.json({ message: "Книга успешно удалена через DELETE" });
});

app.get('/test-bad', (req, res) => {
  res.status(400).json({ error: 'Поля title, author, year обязательны', status: 400 });
});

app.listen(PORT, () => console.log(`Сервер 2 запущен: http://localhost:${PORT}`));