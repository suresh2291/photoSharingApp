// Importing required modules.
  const path = require('path');
  const fs = require('fs');

// This code exports a function that takes a server as input and dynamically loads all the routes in the current directory (except for index.js).
module.exports = function(server) {
  // Get the path for the current directory.
  const routesPath = path.join(__dirname);
  
  // Read all files in the current directory and store them in the "files" array.
  const files = fs.readdirSync(routesPath);
  
  // Loop through each file in the array, except for index.js.
  files.forEach(function(file) {
    if (file === 'index.js') return; // Skip loading of index.js.
    
    // Build the route for the API endpoint based on the name of the file (without the .js extension).
    const route = `api/${file.split('.')[0]}`;
    
    // Require the router module for the current file.
    const router = require(`./${file}`);
    
    // Mount the router at the newly created API endpoint.
    server.use(`/${route}`, router);
  });
};
