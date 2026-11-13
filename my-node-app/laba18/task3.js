const os = require('os');

const nets = os.networkInterfaces();
console.log('=== Сетевые интерфейсы ===');
let mainIp = null;

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4') {
      const mac = net.mac.split(':').map((part, i) => i < 3 ? part : '**').join(':');
      const isInternal = net.internal ? 'да' : 'нет';
      console.log(`Интерфейс: ${name}`);
      console.log(`IPv4: ${net.address}`);
      console.log(`MAC: ${mac}`);
      console.log(`Внутренний: ${isInternal}\n`);
      
      if (!net.internal && !mainIp) mainIp = { name, address: net.address };
    }
  }
}

if (mainIp) console.log(`Основной интерфейс: ${mainIp.name} (${mainIp.address})`);

const user = os.userInfo();
console.log('\n=== Информация о пользователе ===');
console.log(`Имя пользователя: ${user.username}`);
console.log(`UID: ${user.uid}`);
console.log(`Домашняя директория: ${user.homedir}`);
console.log(`Оболочка: ${user.shell}`);
console.log('Группа: 477');
console.log(`Проверка root: ${user.uid === 0 ? 'ДА (Вы root!)' : 'нет'}`);