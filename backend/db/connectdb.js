const mongoose = require('mongoose');
const {serverConfig} = require('../configs/index')
const { dbConnection } = require('./dbConnStringGen')

// Sample inputs
const username = serverConfig.mongoDb.username;
const password = serverConfig.mongoDb.password;
const database = serverConfig.mongoDb.database;
const options = {
  retryWrites: true,
  w: 'majority',
  cluster: serverConfig.mongoDb.cluster,
  hostname: serverConfig.mongoDb.hostname
};

// Call dbConnection function
const connectionString = dbConnection(username, password, database, options);
mongoose.set('strictQuery', false);
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error(error);
  });

  module.exports =  mongoose 