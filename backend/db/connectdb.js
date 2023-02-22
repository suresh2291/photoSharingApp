const mongoose = require('mongoose');
const {serverConfig} = require('../configs/index')
mongoose.set('strictQuery', false);
mongoose.connect(serverConfig.mongoDb.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error(error);
  });

  module.exports = mongoose