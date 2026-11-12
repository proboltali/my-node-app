const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Использование: my-cli <команда> [аргументы]');
  console.log('Доступные команды:');
  console.log('  greet <имя> - поприветствовать пользователя');
  console.log('  info        - вывести информацию о группе');
  process.exit(0);
}

const command = args[0];

if (command === 'greet') {
  const name = args[1];
  if (!name) {
    console.error('Ошибка: укажите имя');
    process.exit(1);
  }
  console.log(`Привет, ${name}! Добро пожаловать в CLI-приложение группы 477.`);
  process.exit(0);
} else if (command === 'info') {
  console.log('Группа: 477');
  console.log('Студент: Садыков Александр Вячеславович');
  console.log('Лабораторная работа: №17');
  console.log(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  process.exit(0);
} else {
  console.error(`Ошибка: неизвестная команда "${command}"`);
  console.error('Для справки используйте: my-cli --help');
  process.exit(1);
}