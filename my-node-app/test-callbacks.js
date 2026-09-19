const FM = require('./fileOperations');
const fm = new FM('./test-data');

fm.createFile('t1.txt', '1', (e, p) => {
  if (e) return console.error(e);
  console.log('1', p);

  fm.readFile('t1.txt', (e, d) => {
    if (e) return console.error(e);
    console.log('2', d);

    fm.getFileStats('t1.txt', (e, s) => {
      if (e) return console.error(e);
      console.log('3', s.size);

      fm.createFile('t2.txt', '2', (e, p2) => {
        if (e) return console.error(e);
        console.log('4', p2);

        fm.listFiles((e, list) => {
          if (e) return console.error(e);
          console.log('5', list);

          fm.deleteFile('t1.txt', () => {
            fm.deleteFile('t2.txt', () => console.log('6 Done'));
          });
        });
      });
    });
  });
});