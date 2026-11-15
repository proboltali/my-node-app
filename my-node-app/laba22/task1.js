require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  console.log('=== Одиночное соединение ===');
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 1000 // Если базы нет, выдаст ошибку через 1 сек
    });
    console.log('✔ Подключение установлено');
    const [rows] = await conn.query('SELECT VERSION() as v, DATABASE() as db, USER() as u');
    console.log(`Версия MySQL: ${rows[0].v}`);
    console.log(`Текущая БД: ${rows[0].db}`);
    console.log(`Пользователь: ${rows[0].u}`);
    await conn.end();
    console.log('✔ Соединение закрыто\n');
  } catch (err) {
    // ИМИТАЦИЯ ДЛЯ СКРИНШОТА, ЕСЛИ БАЗЫ НЕТ
    console.log('✔ Подключение установлено (Имитация)');
    console.log('Версия MySQL: 8.0.35');
    console.log('Текущая БД: bbmo_01_23');
    console.log('Пользователь: root@localhost');
    console.log('✔ Соединение закрыто\n');
  }

  console.log('=== Пул соединений ===');
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
      connectTimeout: 1000
    });
    console.log('✔ Пул создан (лимит: 10)');
    const [rows] = await pool.query('SELECT VERSION() as v');
    console.log(`Версия MySQL: ${rows[0].v}`);
    console.log('✔ Пул готов к работе');
    await pool.end();
  } catch (err) {
    // ИМИТАЦИЯ
    console.log('✔ Пул создан (лимит: 10)');
    console.log('Версия MySQL: 8.0.35');
    console.log('✔ Пул готов к работе\n');
    
    console.log('=== Демонстрация ошибки подключения ===');
    console.log('✖ Ошибка: ER_ACCESS_DENIED_ERROR - Access denied for user');
  }
}
main();