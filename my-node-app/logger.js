const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'server.log');

function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Oshibka loga:', err);
    });
}

function setupLogger(app) {
    app.on('server:started', (port) => {
        writeLog(`Server zapyshchen na porty ${port}`);
    });

    app.on('request:received', (requestData) => {
        writeLog(`Polychen zapros: ${requestData.method} ${requestData.url}`);
    });

    app.on('server:stopped', () => {
        writeLog(`Servak ostanovlen`);
    });
}

module.exports = { setupLogger };