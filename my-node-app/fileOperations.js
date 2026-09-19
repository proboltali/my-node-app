const fs = require('fs');
const path = require('path');

class FM {
  constructor(dir = './data') {
    this.dir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  createFile(f, c, cb) {
    const p = path.join(this.dir, f);
    fs.writeFile(p, c, 'utf8', e => cb(e, e ? null : p));
  }

  readFile(f, cb) {
    fs.readFile(path.join(this.dir, f), 'utf8', (e, d) => cb(e, d));
  }

  getFileStats(f, cb) {
    fs.stat(path.join(this.dir, f), (e, s) => {
      if (e) return cb(e, null);
      cb(null, { size: s.size, created: s.birthtime, modified: s.mtime, isFile: s.isFile() });
    });
  }

  deleteFile(f, cb) {
    fs.unlink(path.join(this.dir, f), e => cb(e));
  }

  listFiles(cb) {
    fs.readdir(this.dir, (e, files) => {
      if (e) return cb(e, null);
      const pr = files.map(f => new Promise(res => {
        fs.stat(path.join(this.dir, f), (err, s) => res({ f, isFile: !err && s.isFile() }));
      }));
      Promise.all(pr).then(r => cb(null, r.filter(x => x.isFile).map(x => x.f)));
    });
  }
}

module.exports = FM;