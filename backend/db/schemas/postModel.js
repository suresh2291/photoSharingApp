// Importing Mongoose and userSchema module
const mongoose = require("../connectdb");
const User = require("../schemas/userModel");

// Defining the Post Schema using mongoose.Schema
const postSchema = mongoose.Schema(
  {
    // Defining 'type' field with validation constraints
    type: {
      type: String,
      enum: ["profilePicture", "coverPicture", null],
      default: null,
    },
    // Defining 'text' field
    text: {
      type: String,
    },
    // Defining 'images' field
    images: {
      type: Array,
    },
    // Defining 'user' field as reference to the database collection 'User'
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Defining 'background' field
    background: {
      type: String,
    },
    // Defining 'comments' field as reference to the database collection 'Comment'
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  // Setting timestamps for createdAt and updatedAt fields
  {
    timestamps: true,
    // Setting collection name to 'posts'
    collection: "posts",
  }
);

// Exporting the model 
module.exports = mongoose.model("Post", postSchema);
