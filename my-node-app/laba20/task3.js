const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && (req.url === '/echo' || req.url === '/form')) {
    let body = '';
    let size = 0;
    const maxSize = 1024 * 1024; // 1 МБ

    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxSize) {
        res.statusCode = 413;
        res.end('413 Payload Too Large');
        req.destroy(); 
        return;
      }
      body += chunk.toString();
    });

    req.on('end', () => {
      if (size > maxSize) return;
      
      const time = new Date().toLocaleString('ru-RU');
      console.log(`[${time}] Размер тела запроса: ${size} байт`);

      const contentType = req.headers['content-type'] || '';

      if (req.url === '/echo') {
        if (contentType.includes('application/json')) {
          try {
            const parsed = JSON.parse(body);
            parsed.group = '477'; 
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(parsed, null, 2));
          } catch (e) {
            res.statusCode = 400;
            res.end('Невалидный JSON');
          }
        } else {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(body);
        }
      } 
      else if (req.url === '/form') {
        const params = new URLSearchParams(body);
        const obj = Object.fromEntries(params);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(obj, null, 2));
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Сервер (задание 3) запущен на порту 3000');
});