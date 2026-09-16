const fs = require('fs');
const path = require('path');

class HFM {
  constructor(dir = './test-hybrid-data') {
    this.dir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  readFile(f, cb) {
    const p = path.join(this.dir, f);
    if (typeof cb === 'function') return fs.readFile(p, 'utf8', cb);
    return new Promise((res, rej) => fs.readFile(p, 'utf8', (e, d) => e ? rej(e) : res(d)));
  }

  writeFile(f, c, cb) {
    const p = path.join(this.dir, f);
    if (typeof cb === 'function') return fs.writeFile(p, c, 'utf8', e => cb(e, e ? null : p));
    return new Promise((res, rej) => fs.writeFile(p, c, 'utf8', e => e ? rej(e) : res(p)));
  }
}

module.exports = HFM;