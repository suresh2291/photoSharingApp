const mongoose = require("../connectdb");
const User = require("../schemas/userModel")
const imageSchema = mongoose.Schema(
  {
    fieldname: { type: String, required: true },
    originalname: { type: String, required: true },
    encoding: { type: String, required: true },
    mimetype: { type: String, required: true },
    destination: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "images",
  }
);

module.exports = mongoose.model("Images", imageSchema);
