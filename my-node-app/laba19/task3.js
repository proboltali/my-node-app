const EventEmitter = require('events');

class DatabaseConnection extends EventEmitter {
  connect() {
    console.log('[EVENT] Подключение к БД...');
    this.emit('connect');
  }

  query(sql) {
    console.log(`[EVENT] Выполнение запроса: ${sql}`);
    const result = sql.includes('SELECT') ? '50 записей' : '1 запись добавлена';
    this.emit('query', sql, result);
  }

  close() {
    console.log('[EVENT] Закрытие соединения');
    this.emit('close');
  }

  makeError(msg) {
    this.emit('error', msg);
  }
}

const db = new DatabaseConnection();

db.on('connect', () => console.log('[EVENT] Соединение установлено (Группа 477)'));
db.on('query', (sql, result) => console.log(`[EVENT] Результат: ${result}`));
db.on('close', () => console.log('[EVENT] Соединение закрыто'));

console.log('=== DatabaseConnection (группа 477) ===');
db.connect();
db.query('SELECT * FROM students');
db.query('INSERT INTO students');
db.close();

console.log('\n=== Демонстрация ошибки ===');
db.on('error', (err) => {
  console.log(`[EVENT] Ошибка: ${err}`);
  console.log('(без слушателя error — процесс упал бы с исключением)');
});
db.makeError('Connection timeout');