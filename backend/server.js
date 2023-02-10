const express = require('express');
const {serverConfig} = require('./configs/index')
let server = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const helmet = require('helmet')
server.use(cors())//enable all apis req and res
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(helmet())

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.listen(serverConfig.port.default,()=>{
  console.log(`Server running at: ${serverConfig.port.default}`)
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

