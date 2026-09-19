const fs = require('fs').promises;
const path = require('path');

const N = 6;

const extFilter = ['.js', '.json', '.txt', '.md'];

async function scan(dir, res) {
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const it of items) {
    const p = path.join(dir, it.name);

    if (it.isDirectory()) {
      if (it.name === 'node_modules' || it.name === '.git') continue;
      res.dirs++;
      await scan(p, res);
    } else {
      const st = await fs.stat(p);
      const ext = path.extname(it.name).toLowerCase();

      res.files.push({ name: it.name, path: p, size: st.size, ext });
      res.total += st.size;

      if (!res.byExt[ext]) res.byExt[ext] = { count: 0, size: 0 };
      res.byExt[ext].count++;
      res.byExt[ext].size += st.size;
    }
  }
}

function fmt(b) {
  if (b < 1024) return `${b} Б`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} КБ`;
  return `${(b / 1024 / 1024).toFixed(2)} МБ`;
}

async function main() {
  const dir = process.argv[2] || __dirname;
  const res = { dirs: 0, files: [], total: 0, byExt: {} };

  try {
    await scan(dir, res);

    res.files.sort((a, b) => b.size - a.size);
    const top5 = res.files.slice(0, 5);
    const min5 = res.files.slice(-5).reverse();

    console.log(`Анализ директории: ${dir}`);
    console.log(`Общее количество папок: ${res.dirs}`);
    console.log(`Общее количество файлов: ${res.files.length}`);
    console.log(`Общий размер: ${fmt(res.total)} (${res.total} байт)`);

    console.log('\nРасширения файлов:');
    for (const [e, v] of Object.entries(res.byExt)) {
      console.log(`${e}: ${v.count} файлов (${fmt(v.size)})`);
    }

    console.log('\nТоп-5 самых больших:');
    top5.forEach((f, i) => console.log(`${i + 1}. ${f.name} (${fmt(f.size)}) - ${f.path}`));

    console.log('\nТоп-5 самых маленьких:');
    min5.forEach((f, i) => console.log(`${i + 1}. ${f.name} (${fmt(f.size)}) - ${f.path}`));

    const report = {
      dir,
      dirs: res.dirs,
      filesCount: res.files.length,
      totalSize: res.total,
      byExt: res.byExt,
      top5: top5.map(f => ({ name: f.name, size: f.size, path: f.path })),
      min5: min5.map(f => ({ name: f.name, size: f.size, path: f.path })),
    };

    const out = path.join(__dirname, `report_${N}.json`);
    await fs.writeFile(out, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\nОтчет сохранен: report_${N}.json`);
  } catch (e) {
    console.error('Ошибка:', e.message);
  }
}

main();