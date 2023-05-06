// This code imports the "mongoose" package which is a Object Data Modelling (ODM) library for MongoDB and config files for server and database connection. 
const mongoose = require('mongoose');
const {serverConfig} = require('../configs/index')
const { dbConnection } = require('./dbConnStringGen')

// The following variables are used to store database connection details like username, password, database name and options.
const username = serverConfig.mongoDb.username;
const password = serverConfig.mongoDb.password;
const database = serverConfig.mongoDb.database;
const options = {
  retryWrites: true,
  w: 'majority',
  cluster: serverConfig.mongoDb.cluster,
  hostname: serverConfig.mongoDb.hostname
};

// The following code generates a connection string using the above variables and stores it in "connectionString" variable.
const connectionString = dbConnection(username, password, database, options);

// The following code sets "strictQuery" flag to false. This tells Mongoose that it should not throw an error if there are any undefined fields in the query object.
 mongoose.set('strictQuery', false);

// The following code establishes the connection with MongoDB Atlas using the above-generated connection string and options.
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

// This exports mongoose object so any other module can use it to create mongoose schema and model.
module.exports =  mongoose
