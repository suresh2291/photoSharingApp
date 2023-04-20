const fs = require('fs');
const path = require('path');

module.exports = function(server) {
  const routesPath = path.join(__dirname);
  const files = fs.readdirSync(routesPath);
  files.forEach(function(file) {
    if (file === 'index.js') return;
    const route = `api/${file.split('.')[0]}`;
    const router = require(`./${file}`);
    server.use(`/${route}`, router);
  });
};