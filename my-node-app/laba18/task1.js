const os = require('os');

const platform = os.platform();
let platformName = 'Неизвестная платформа';
if (platform === 'win32') platformName = 'Вы работаете в Windows';
else if (platform === 'linux') platformName = 'Вы работаете в Linux';
else if (platform === 'darwin') platformName = 'Вы работаете в macOS';

const uptimeSec = os.uptime();
const h = Math.floor(uptimeSec / 3600);
const m = Math.floor((uptimeSec % 3600) / 60);
const s = Math.floor(uptimeSec % 60);

console.log('=== Информация о системе (группа 477) ===');
console.log(`Студент: Садыков Александр Вячеславович`);
console.log(`Платформа: ${platform}`);
console.log(`Тип ОС: ${os.type()}`);
console.log(`Архитектура: ${os.arch()}`);
console.log(`Версия ОС: ${os.release()}`);
console.log(`Имя хоста: ${os.hostname()}`);
console.log(`Время работы: ${h} ч ${m} мин ${s} сек`);
console.log(platformName);