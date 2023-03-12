const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const codeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
      },
      user: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
},{
  timestamps: true, 
  collection: 'resetpswrdcodes'
});

const myDB = mongoose.connection.useDb('photosharing');
module.exports = myDB.model('Code', codeSchema);
