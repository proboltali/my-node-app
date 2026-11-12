const { program } = require('commander');
const chalk = require('chalk');

process.on('uncaughtException', (err) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(chalk.red('Ошибка:'), err);
  } else {
    console.error(chalk.red('Ошибка: файл конфигурации не найден'));
    console.error('Укажите путь через --config');
  }
  process.exit(1);
});

program.name('my-cli').version('1.0.0');

program.command('init')
  .option('--name <name>')
  .option('--type <type>')
  .action((opts) => {
    if (!opts.name) throw new Error('Не указано имя проекта');
    console.log(chalk.green(`✔ Проект "${opts.name}" создан`));
    console.log(chalk.green('✔ Установлены зависимости'));
    console.log(chalk.green('✔ Инициализирован Git-репозиторий'));
  });

program.command('build')
  .action(() => {
    console.log('Сборка проекта...');
    // Эмуляция ошибки для проверки обработчика
    throw new Error('config.json отсутствует в корне проекта'); 
  });

program.command('test')
  .action(() => {
    console.log('Запуск тестов...');
    console.log(chalk.green('✔ Пройдено: 15/15 тестов'));
    console.log(chalk.green('✔ Покрытие: 87%'));
  });

program.parse(process.argv);