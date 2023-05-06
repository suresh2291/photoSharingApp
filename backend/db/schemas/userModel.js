// Importing Mongoose and postModel, as well as serverConfig from configuration module
const mongoose = require("../connectdb");
const { serverConfig } = require("../../configs/index");
const Post = require("../schemas/postModel");

// Defining userSchema using mongoose.Schema()
const userSchema = mongoose.Schema(
  {
    // Defining various fields for the userSchema with data types and validation constraints
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      min: [6, "first name must be at least 6 characters, got {VALUE}"],
      max: 12,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      min: [6, "last name must be at least 6 characters, got {VALUE}"],
      max: 12,
    },
    userName: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => {
          return /^[^\s@]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/.test(value);//validating the email address
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      min: [6, "password must be at least 6 characters, got {VALUE}"],
      max: 12,
    },
    code: {
      type: String,
    },
    avatar: {
      type: String,
      trim: true,
      default: serverConfig.avatar.default,//setting the default profile pic
    },
    cover: {
      type: String,
      trim: true,
      default: serverConfig.avatar.coverPic,//setting the default cover pic
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
      trim: true,
    },
    bMonth: {
      type: Number,
      required: true,
      trim: true,
    },
    bDay: {
      type: Number,
      required: true,
      trim: true,
    },
    //this is used to verify the activated user.
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    search: [
      // Defining sub-document array search with properties user and createdAt
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    details: {
      // Defining details object containing various fields for additional user information
      bio: {
        type: String,
      },
      otherName: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      hometown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ["Single", "In a relationship", "Married", "Divorced"],
      },
      instagram: {
        type: String,
      },
    },
    savedPosts: [
      // Defining the sub-document array savedPosts with properties post and savedAt
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
        savedAt: {
          type: Date,
          required: true
        },
      },
    ],
  },
  {
    // Setting timestamps option to true for createdAt and updatedAt fields, and collection name to 'users'
    timestamps: true,
    collection: "users",
  }
);

// Creating text index on firstName, lastName and userName fields of userSchema
userSchema.index({ firstName: 'text', lastName: 'text', userName: 'text' }, { name: 'text_index' });

// Exporting User model from the userSchema
module.exports = mongoose.model("User", userSchema);
