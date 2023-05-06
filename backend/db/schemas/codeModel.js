// This code imports required modules and defines the schema for a reset password code, using Mongoose as the ODM.
const mongoose = require("../connectdb"); // import the custom connectdb module which connects to the MongoDB database
const User = require("../schemas/userModel") // Import the user model to reference with the reset password code
const codeSchema = mongoose.Schema({ // Define the schema for the reset password code
    code: {
        type: String,
        required: true,
      }, // The code value is of type string and is required
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }, // The user who requested the code is referenced by their ObjectId from the "User" collection in the same database.
},{
  timestamps: true, // Includes a timestamp for when the document was created and last updated
  collection: 'resetpswrdcodes' // Sets the name of the collection in the MongoDB database to store documents using this schema
});

module.exports = mongoose.model('Code', codeSchema); // Exports the model using the schema. "Code" refers to the name of the collection that will be used by Mongoose. 
