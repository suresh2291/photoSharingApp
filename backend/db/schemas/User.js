const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true,
    text: true,
    min: [6, 'first name must be at least 6 characters, got {VALUE}'],
    max: 12
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    trim: true,
    text: true,
    min: [6, 'last name must be at least 6 characters, got {VALUE}'],
    max: 12
  },
  userName: {
    type: String,
    required: [true, 'user name is required'],
    trim: true,
    text: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return /^[^\s@]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: 'Please enter a valid email address',
    },
  },
  password: {
    type: String,
    required:true,
    min: [6, 'password must be at least 6 characters, got {VALUE}'],
    max: 12
  },
  avatar: {
    type:String,
    trim:true,
    default: 'https://res.cloudinary.com/duwhuzgpi/image/upload/v1676527050/common/istockphoto-1393750072-612x612_nll0xc.jpg'
  },
  gender: {
    type: String,
    required: [true, 'gender is required'],
    trim: true,
    enum:['Male', 'Female', 'Others']
  },
  bYear: {
    type: Number,
    required: true,
    trim: true
  },
  bMonth: {
    type: Number,
    required: true,
    trim: true
  },
  bDay: {
    type: Number,
    required: true,
    trim: true
  },
  verified:{
    type: Boolean,
    default: false
  },
  friends:{
    type: Array,
    default: []
  },
  followers:{
    type: Array,
    default: []
  },
  following:{
    type: Array,
    default: []
  },
  requests:{
    type: Array,
    default: []
  },
  search:[
    {
      user:{
        type: ObjectId,
        ref:  'User'
      }
    }
  ],
  details: {
    bio: {
      type: String
    },
    aliasName: {
      type: String
    },
    job: {
      type: String
    },
    workplace: {
      type: String
    },
    highSchool: {
      type: String
    },
    currentCity: {
      type: String
    },
    hometown: {
      type: String
    }
  },
  savedPosts: [
    {
      post: {
        type: ObjectId,
        ref: 'Post'
     },
      savedAt: {
        type: Date,
        default: new Date()
     }
   }
  ]
},{
  timestamps: true, 
  collection: 'users'
});

const myDB = mongoose.connection.useDb('photosharing');
module.exports = myDB.model('User', userSchema);
