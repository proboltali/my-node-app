const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', (name) => {
  console.log(`[greet] Привет, ${name}!`);
});

emitter.on('info', () => {
  console.log('[info] Группа: 477');
  console.log('[info] Студент: Садыков Александр Вячеславович');
});

emitter.on('bye', () => {
  console.log('[bye] До свидания!');
});

console.log('=== Демонстрация EventEmitter ===');

emitter.emit('greet', 'Александр');
emitter.emit('info');
emitter.emit('bye');

const resUnknown = emitter.emit('unknown');
console.log(`Событие "unknown" без слушателей: ${resUnknown}`);

const resGreet = emitter.emit('greet', 'Иван');
console.log(`Событие "greet" со слушателями: ${resGreet}`);