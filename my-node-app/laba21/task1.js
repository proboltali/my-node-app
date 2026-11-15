const { Readable } = require('stream');

const chunks = [
  "Группа: 477",
  "Студент: Садыков Александр Вячеславович",
  "Лабораторная работа: №21",
  "Тема: Потоки в Node.js"
];
let i = 0;
let totalBytes = 0;
let totalChunks = 0;

const myStream = new Readable({
  read(size) {
    if (i < chunks.length) {
      const chunk = chunks[i];
      totalBytes += Buffer.byteLength(chunk);
      totalChunks++;
      this.push(chunk + "\n");
      i++;
    } else {
      this.push(null); 
    }
  }
});

console.log('=== Демонстрация Readable-потока ===');

myStream.on('data', (chunk) => {
  console.log(`[CHUNK ${totalChunks}] ${chunk.toString().trim()}`);
});

myStream.on('end', () => {
  console.log('[END] Поток завершён');
  console.log(`Всего получено чанков: ${totalChunks}`);
  console.log(`Общий размер данных: ${totalBytes} байт`);
});

myStream.on('error', (err) => {
  console.error('Ошибка:', err.message);
});