const fs = require('fs');
const path = require('path');
const util = require('util');

const read = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const del = util.promisify(fs.unlink);
const list = util.promisify(fs.readdir);
const st = util.promisify(fs.stat);

class FMP {
  constructor(dir = './test-data-promises') {
    this.dir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async createFile(f, c) {
    const p = path.join(this.dir, f);
    await write(p, c, 'utf8');
    return p;
  }

  async readFile(f) {
    return await read(path.join(this.dir, f), 'utf8');
  }

  async getFileStats(f) {
    const s = await st(path.join(this.dir, f));
    return { size: s.size, created: s.birthtime, modified: s.mtime, isFile: s.isFile() };
  }

  async deleteFile(f) {
    await del(path.join(this.dir, f));
  }

  async listFiles() {
    const files = await list(this.dir);
    const res = await Promise.all(files.map(async f => {
      const s = await st(path.join(this.dir, f));
      return { f, isFile: s.isFile() };
    }));
    return res.filter(r => r.isFile).map(r => r.f);
  }

  async createMultipleFiles(arr) {
    return await Promise.all(arr.map(i => this.createFile(i.f, i.c)));
  }

  async readMultipleFiles(arr) {
    const res = await Promise.all(arr.map(async f => ({ f, c: await this.readFile(f) })));
    const out = {};
    res.forEach(i => out[i.f] = i.c);
    return out;
  }
}

module.exports = FMP;