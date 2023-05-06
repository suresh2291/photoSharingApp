// This code imports required modules and defines the schema for an image, using Mongoose as the ODM.
const mongoose = require("../connectdb"); // import the custom connectdb module which connects to the MongoDB database
const User = require("../schemas/userModel"); // Import the user model to reference with the image

const imageSchema = mongoose.Schema( // Define the schema for the image metadata
  {
    fieldname: { type: String, required: true }, // The name of the input field in the HTML form that was used to upload the file. Required field of type string.
    originalname: { type: String, required: true }, // The original filename including the extension. Required field of type string.
    encoding: { type: String, required: true }, // The encoding type of the uploaded file. Required field of type string.
    mimetype: { type: String, required: true }, // The mime type of the uploaded file. Required field of type string.
    destination: { type: String, required: true }, // The folder path where the file was saved on the server. Required field of type string.
    filename: { type: String, required: true }, // The filename (without path) that was given to the file when it was saved on the server. Required field of type string.
    path: { type: String, required: true }, // The full path of the file (including both folder path and filename). Required field of type string.
    size: { type: Number, required: true }, // The size of the file in bytes. Required field of type number.
    createdAt: { type: Date, default: Date.now }, // The timestamp when this document was created. Optional field of date type with default value set to the current date and time.
    publicId: {
      type: String,
      required: true,
      unique: true,
    }, // The public ID for the image assigned by cloud storage service, such as Cloudinary. Required field of type string and is set to be unique.
    url: {
      type: String,
    }, // The URL where the image is publicly available on the web. Optional field of type string.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // The user who uploaded this image, referenced by their ObjectId from the "User" collection in the same database. Required field of type ObjectId.
  },
  {
    timestamps: true, // Includes a timestamp for when the document was created and last updated.
    collection: "images", // Sets the name of the collection in the MongoDB database to store documents using this schema.
  }
);

module.exports = mongoose.model("Images", imageSchema); // Exports the model using the schema. "Images" refers to the name of the collection that will be used by Mongoose. 
