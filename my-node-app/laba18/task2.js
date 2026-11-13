const os = require('os');

const cpus = os.cpus();
let totalSpeed = 0;
cpus.forEach(cpu => totalSpeed += cpu.speed);
const avgSpeed = Math.round(totalSpeed / cpus.length);

const totalMem = os.totalmem() / (1024 ** 3);
const freeMem = os.freemem() / (1024 ** 3);
const usedMem = totalMem - freeMem;
const memPercent = (usedMem / totalMem) * 100;

console.log('=== Информация о процессоре ===');
console.log(`Количество логических ядер: ${cpus.length}`);
console.log(`Модель процессора: ${cpus[0].model.trim()}`);
console.log(`Средняя частота: ${avgSpeed} МГц`);

console.log('\n=== Информация о памяти ===');
console.log(`Общий объём: ${totalMem.toFixed(2)} ГБ`);
console.log(`Свободно: ${freeMem.toFixed(2)} ГБ`);
console.log(`Использовано: ${usedMem.toFixed(2)} ГБ (${memPercent.toFixed(1)}%)`);

console.log('\n=== Средняя загрузка системы ===');
const load = os.loadavg();
console.log(`За 1 мин: ${load[0].toFixed(2)}`);
console.log(`За 5 мин: ${load[1].toFixed(2)}`);
console.log(`За 15 мин: ${load[2].toFixed(2)}`);
if (os.platform() === 'win32') {
  console.log('(Для Windows значения загрузки всегда 0.00)');
}

console.log('\nГруппа: 477');
if (memPercent > 80) {
  console.log('ВНИМАНИЕ: Свободной памяти меньше 20%!');
} else {
  console.log('Память в норме');
}