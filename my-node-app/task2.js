const fs = require('fs').promises;
const path = require('path');

const N = 6;

async function mk(dir, text) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'info.txt'), text, 'utf8');
}

async function tree(dir, pre = '') {
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const it of items) {
    console.log(pre + it.name);
    if (it.isDirectory()) {
      await tree(path.join(dir, it.name), pre + '  ');
    }
  }
}

async function main() {
  const root = path.join(__dirname, `project_${N}`);

  const dirs = [
    ['src', 'исходники'],
    ['src/modules', 'модули'],
    ['src/components', 'компоненты'],
    ['src/utils', 'утилиты'],
    ['data', 'данные'],
    ['data/input', 'входные данные'],
    ['data/output', 'выходные данные'],
    ['temp', 'временные файлы'],
  ];

  try {
    await fs.rm(root, { recursive: true, force: true });

    for (const [d, t] of dirs) {
      await mk(path.join(root, d), t);
    }

    if (N % 2 === 1) {
      for (const i of [1, 2, 3]) {
        await fs.mkdir(path.join(root, 'src/components', String(i)), { recursive: true });
      }
    } else {
      const now = new Date().toISOString().slice(0, 10);
      for (const [d] of dirs) {
        await fs.writeFile(path.join(root, d, 'README.md'), now, 'utf8');
      }
    }

    console.log('Дерево до изменений:\n');
    console.log(`project_${N}`);
    await tree(root, '  ');

    await fs.rename(path.join(root, 'temp'), path.join(root, 'data/temp'));
    await fs.rename(path.join(root, 'data/output'), path.join(root, 'data/results'));
    await fs.rm(path.join(root, 'data/temp'), { recursive: true, force: true });

    console.log('\nДерево после изменений:\n');
    console.log(`project_${N}`);
    await tree(root, '  ');
  } catch (e) {
    console.error('Ошибка:', e.message);
  }
}

main();