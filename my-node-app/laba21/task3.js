const fs = require('fs');
const { pipeline } = require('stream');
const path = require('path');

const inputFile = path.join(__dirname, 'input.txt');
const outPipe = path.join(__dirname, 'output-pipe.txt');
const outPipeline = path.join(__dirname, 'output-pipeline.txt');

console.log('=== Демонстрация pipe() ===');
try {
  const rs = fs.createReadStream(inputFile);
  const ws = fs.createWriteStream(outPipe);
  rs.pipe(ws);
  ws.on('finish', () => {
    console.log('✔ Копирование завершено через pipe()');
    console.log(`Размер: ${fs.statSync(outPipe).size} байт\n`);
  });
} catch (e) {
  console.error(e);
}

setTimeout(() => {
  console.log('=== Демонстрация pipe() с ошибкой ===');
  const rsErr = fs.createReadStream(path.join(__dirname, 'missing.txt'));
  const wsErr = fs.createWriteStream(outPipe);
  
  rsErr.on('error', (err) => {
    console.log(`✖ Ошибка: ${err.code} - файл не найден`);
    console.log('⚠ Внимание: pipe() не закрыл целевой поток! Возможна утечка памяти.\n');
    wsErr.end();
  });
  rsErr.pipe(wsErr);
}, 1000);

setTimeout(() => {
  console.log('=== Демонстрация pipeline() ===');
  pipeline(
    fs.createReadStream(inputFile),
    fs.createWriteStream(outPipeline),
    (err) => {
      if (err) console.error('Ошибка:', err.message);
      else console.log('✔ Копирование завершено через pipeline()\n');
      
      console.log('=== Демонстрация pipeline() с ошибкой ===');
      pipeline(
        fs.createReadStream(path.join(__dirname, 'missing.txt')),
        fs.createWriteStream(outPipeline),
        (err2) => {
          if (err2) {
            console.log(`✖ Ошибка: ${err2.code} - файл не найден`);
            console.log('✔ Все потоки автоматически закрыты');
            console.log('✔ Утечек нет');
          }
        }
      );
    }
  );
}, 2000);