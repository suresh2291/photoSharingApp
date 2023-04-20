const mongoose = require("../connectdb");
const User = require("../schemas/userModel")
const Post = require("../schemas/postModel")
const reactSchema = mongoose.Schema({
  react: {
    type: String,
    enum: ["like", "love", "haha", "sad", "angry", "wow", "congrats"],
    required: true,
  },
  postRef: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  reactBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
},{
  timestamps: true, 
  collection: 'reacts'
});

module.exports = mongoose.model('React', reactSchema);
