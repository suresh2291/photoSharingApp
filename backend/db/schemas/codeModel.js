const mongoose = require("../connectdb");
const User = require("../schemas/userModel")
const codeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
},{
  timestamps: true, 
  collection: 'resetpswrdcodes'
});

module.exports = mongoose.model('Code', codeSchema);
