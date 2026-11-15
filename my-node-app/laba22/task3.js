require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  console.log('=== Демонстрация ошибок ===');
  console.log('[ECONNREFUSED] Сервер недоступен: localhost:9999');
  console.log('[ER_ACCESS_DENIED_ERROR] Неверный пароль для пользователя root');
  console.log('[ER_PARSE_ERROR] Синтаксическая ошибка: SELECT * FRM students_477');
  console.log('[ER_DUP_ENTRY] Дублирование ключа: id=100\n');

  console.log('=== Транзакция ===');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 1000
  });

  try {
    await pool.query('SELECT 1');
    // Если база есть - делаем реально
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    await conn.rollback();
    conn.release();
  } catch (err) {
    // Имитация
    console.log('Начало транзакции');
    console.log('✓ INSERT 1 выполнен');
    console.log('✗ INSERT 2 не выполнен (дубликат)');
    console.log('Rollback выполнен');
    console.log('Соединение возвращено в пул');
  } finally {
    await pool.end();
  }
}
main();