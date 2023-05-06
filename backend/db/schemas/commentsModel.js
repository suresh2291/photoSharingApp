// This code imports required modules and defines the schema for a comment, using Mongoose as the ODM.
const mongoose = require("../connectdb"); // import the custom connectdb module which connects to the MongoDB database
const User = require("../schemas/userModel"); // Import the user model to reference with the comment
const Post = require("../schemas/postModel"); // Import the post model to reference with the comment

const commentSchema = mongoose.Schema({ // Define the schema for the comment
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      }, // The ID of the post that this comment is related to. The ObjectId type references the "Post" model in the same database.
    comment: {
      type: String,
      required: true,
    }, // The actual comment text. Required field of type string.
    image: {
      type: String,
    }, // An optional image included with the comment, stored as a string.
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // The user who posted this comment, referenced by their ObjectId from the "User" collection in the same database.
    commentAt: {
      type: Date,
      required: true,
    }, // The timestamp when this comment was posted. Required field of type date.
    replies: [
      {
        reply: {
          type: String,
          required: true,
        }, // The actual reply text to a comment. Required field of type string.
        image: {
          type: String,
        }, // An optional image included with the reply, stored as a string.
        replyBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        }, // The user who posted this reply to a comment, referenced by their ObjectId from the "User" collection in the same database.
        replyAt: {
          type: Date,
          required: true,
        }, // The timestamp when this reply was posted. Required field of type date.
      },
    ],
  },
  {
  timestamps: true, // Includes a timestamp for when the document was created and last updated.
  collection: 'comments', // Sets the name of the collection in the MongoDB database to store documents using this schema.
});

module.exports = mongoose.model('Comment', commentSchema); // Exports the model using the schema. "Comment" refers to the name of the collection that will be used by Mongoose. 
