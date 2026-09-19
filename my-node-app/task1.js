const fs = require('fs').promises;
const path = require('path');

const N = 6;

async function main() {
  const file = path.join(__dirname, `student_${N}.txt`);

  const books = [
    '1. "Война и мир" - Л. Толстой',
    '2. "Преступление и наказание" - Ф. Достоевский',
    '3. "Мастер и Маргарита" - М. Булгаков',
    '4. "1984" - Дж. Оруэлл',
    '5. "Гарри Поттер" - Дж. Роулинг',
  ];

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const head = [
    'Студент: Иванов Иван',
    'Группа: ИС-202',
    `Вариант: ${N}`,
    `Дата: ${now}`,
    '',
    'Любимые книги:',
    ...books,
  ];

  try {
    await fs.writeFile(file, head.join('\n') + '\n', 'utf8');
    console.log(`Создан файл: student_${N}.txt`);

    const cur = await fs.readFile(file, 'utf8');
    const count = cur.trim().split('\n').length;

    await fs.appendFile(file, `Количество записей: ${count}\n`, 'utf8');

    const final = await fs.readFile(file, 'utf8');
    console.log('Содержимое файла:\n');
    console.log(final);
  } catch (e) {
    console.error('Ошибка:', e.message);
  }
}

main();