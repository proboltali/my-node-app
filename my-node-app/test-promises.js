const FMP = require('./fileOperationsPromises');
const fm = new FMP('./test-data-promises');

async function test() {
  try {
    console.log('1', await fm.createFile('t1.txt', '1'));
    console.log('2', await fm.readFile('t1.txt'));
    console.log('3', (await fm.getFileStats('t1.txt')).size);

    const files = [{ f: 't2.txt', c: 'A' }, { f: 't3.txt', c: 'B' }];
    console.log('4', (await fm.createMultipleFiles(files)).length);

    const list = await fm.listFiles();
    console.log('5', list);
    console.log('6', await fm.readMultipleFiles(list));

    for (const f of list) await fm.deleteFile(f);
    console.log('7 Done');
  } catch (e) {
    console.error(e.message);
  }
}

test();