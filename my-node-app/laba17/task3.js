const { program } = require('commander');
const inquirer = require('inquirer');

program
  .command('init')
  .description('инициализация проекта')
  .option('--name <name>', 'название проекта')
  .option('--type <type>', 'тип проекта')
  .option('--typescript', 'добавить TypeScript')
  .option('--prettier', 'добавить Prettier')
  .option('--git', 'инициализировать Git')
  .option('--no-interactive', 'отключить интерактивный режим')
  .action(async (options) => {
    let projectName = options.name;
    let projectType = options.type;

    if (options.noInteractive) {
      if (!projectName || !projectType) {
        console.error('Ошибка: в неинтерактивном режиме необходимо указать --name и --type');
        process.exit(1);
      }
    } else {
      if (!projectName || !projectType) {
        console.log('Запуск интерактивного режима...');
        const answers = await inquirer.prompt([
          { type: 'input', name: 'name', message: 'Введите название проекта:', when: !projectName },
          { type: 'list', name: 'type', message: 'Выберите тип проекта:', choices: ['Web-приложение', 'CLI-утилита', 'Библиотека', 'Микросервис'], when: !projectType },
          { type: 'confirm', name: 'git', message: 'Использовать Git?', default: true }
        ]);
        projectName = projectName || answers.name;
        projectType = projectType || answers.type;
        options.git = answers.git;
      }
    }

    console.log(`✓ Проект "${projectName}" успешно инициализирован!`);
    console.log(`Тип: ${projectType}`);
    console.log(`Git: ${options.git ? 'да' : 'нет'}`);
  });

program.parse(process.argv);