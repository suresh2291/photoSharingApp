// Importing Mongoose, userModel and postModel modules
const mongoose = require("../connectdb");
const User = require("../schemas/userModel")
const Post = require("../schemas/postModel")

// Defining the React Schema using mongoose.Schema
const reactSchema = mongoose.Schema({
  // Defining 'react' field with validation constraints
  react: {
    type: String,
    enum: ["like", "love", "haha", "sad", "angry", "wow", "congrats"],
    required: true,
  },
  // Defining 'postRef' field as reference to the database collection 'Post'
  postRef: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  // Defining 'reactBy' field as reference to the database collection 'User'
  reactBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
  // Setting createdAt and updatedAt timestamps for the React document
},{
  timestamps: true, 
  // Setting collection name to 'reacts'
  collection: 'reacts'
});

// Exporting the model
module.exports = mongoose.model('React', reactSchema);
