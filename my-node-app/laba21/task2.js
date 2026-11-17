const { Writable } = require('stream');

const chunks = [
  "Группа: 477\n",
  "Студент: Садыков Александр Вячеславович\n",
  "Лабораторная работа: №21 (Средний уровень)\n",
  "Тема: Потоки в Node.js и backpressure\n"
];

let count = 0;

const myWritable = new Writable({
  highWaterMark: 16,
  write(chunk, encoding, callback) {
    console.log(`[WRITE] ${chunk.toString().trim()}`);
    count++;
    setTimeout(() => {
      callback();
    }, 300);
  }
});

myWritable.on('drain', () => {
  console.log('[DRAIN] Буфер освобождён, продолжаем запись');
});

myWritable.on('finish', () => {
  console.log('[FINISH] Все данные записаны');
  console.log(`Всего записано: ${count} чанка`);
});

myWritable.on('error', (err) => {
  console.error('Ошибка:', err.message);
});

console.log('=== Демонстрация Writable-потока ===');

for (const chunk of chunks) {
  const res = myWritable.write(chunk);
  console.log(`write() вернул: ${res} ${res ? '' : '← буфер переполнен!'}`);
}
myWritable.end();