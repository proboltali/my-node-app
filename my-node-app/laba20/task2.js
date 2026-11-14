const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/headers') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Group', '477');
    
    const data = {
      headers: req.headers,
      method: req.method,
      url: req.url,
      httpVersion: req.httpVersion
    };
    res.end(JSON.stringify(data, null, 2));
  } 
  else if (req.url === '/headers/set') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Group', '477');
    res.setHeader('Cache-Control', 'no-cache');
    res.end('<h1>Кастомные заголовки установлены!</h1>');
  }
  else if (req.url === '/headers/check') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Group', '477');
    
    const check = {
      hasContentType: res.hasHeader('Content-Type'),
      hasXGroup: res.hasHeader('X-Group'),
      hasUnknown: res.hasHeader('X-Unknown')
    };
    res.end(JSON.stringify(check, null, 2));
  }
  else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Сервер (задание 2) запущен на порту 3000');
});