const HFM = require('./hybridFileManager');
const hfm = new HFM();

async function run() {
  hfm.writeFile('cb.txt', 'CB', (e, p) => {
    console.log('CB write:', p);
    hfm.readFile('cb.txt', (e, d) => console.log('CB read:', d));
  });

  try {
    console.log('PR write:', await hfm.writeFile('pr.txt', 'PR'));
    console.log('PR read:', await hfm.readFile('pr.txt'));
  } catch (e) {
    console.error(e.message);
  }
}

run();