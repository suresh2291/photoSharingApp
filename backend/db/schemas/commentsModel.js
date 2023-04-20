const mongoose = require("../connectdb");
const User = require("../schemas/userModel");
const Post = require("../schemas/postModel");

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentAt: {
      type: Date,
      required: true,
    },
    replies: [
      {
        reply: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        replyBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        replyAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
  timestamps: true, 
  collection: 'comments'
});

module.exports = mongoose.model('Comment', commentSchema);