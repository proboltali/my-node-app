const EventEmitter = require('events');
const emitter = new EventEmitter();

console.log('=== Сравнение on и once ===');
let onCount = 0;
let onceCount = 0;

emitter.on('tick', () => {
  onCount++;
  console.log(`[tick #${onCount}] on-слушатель`);
});

emitter.once('tick', () => {
  onceCount++;
  console.log(`[tick #${onceCount}] once-слушатель`);
});

emitter.emit('tick');
emitter.emit('tick');
emitter.emit('tick');

console.log(`on-слушатель вызван: ${onCount} раза`);
console.log(`once-слушатель вызван: ${onceCount} раз`);

console.log('\n=== Управление подписками ===');
const l1 = () => {};
const l2 = () => {};
const l3 = () => {};

emitter.on('test', l1);
emitter.on('test', l2);
emitter.on('test', l3);

console.log(`Слушателей до удаления: ${emitter.listenerCount('test')}`);

emitter.removeListener('test', l2);
console.log(`Слушателей после удаления одного: ${emitter.listenerCount('test')}`);

emitter.removeAllListeners('test');
console.log(`Слушателей после removeAllListeners: ${emitter.listenerCount('test')}`);

console.log('\n=== Порядок вызова ===');
emitter.on('order', () => console.log('1. Первый слушатель (группа 477)'));
emitter.on('order', () => console.log('2. Второй слушатель'));
emitter.on('order', () => console.log('3. Третий слушатель'));
emitter.emit('order');