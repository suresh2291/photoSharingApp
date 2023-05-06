/**
 * This Middleware helps user to upload images to cloudinary from frontend.
 * In the fronened this is used for uploading Images, Profile Pic, Cover Pic, Annotated Pic.
 */
const errorHandler = require("../helpers/errors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const tmpDir = path.join(__dirname, "../../backend/uploads"); 
//Create a temp directory for storing uploaded files

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

/**
 * The above code is creating an instance of the multer disk storage. 
 * Multer is a middleware that allows you to upload files in Node.js.
 * The diskStorage() function takes in an object that has two properties: destination and filename.
 * Here to make the filename unique, we have used the original name which has the original image file name uploaded by the user.
 * 
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    if(req.body.filename){
      cb(null, 
        file.fieldname +"-" +req.body.filename.split(".")[0]+"." +file.originalname.split(".").pop());
    }else if(req.body.profilepic){
      cb(null, 
        req.body.profilepic+"." +file.originalname.split(".").pop());
    }else if(req.body.coverpic){
      cb(null, 
        req.body.coverpic+"." +file.originalname.split(".").pop());
    }else{
      cb(null, 
        file.fieldname +"-" +file.originalname.split(".")[0]+"." +file.originalname.split(".").pop());
    }
  },
});

// Set up file filter options
const fileFilter = async function (req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only jpeg and png images are allowed"));
    }
    cb(null, true);
};
const upload = multer({
  limits: {
    files: 10,
    size:"5mb"
  },
  storage: storage,
  fileFilter: fileFilter
});

const uploadHandler = {
  imageUpload: async (req, res, next) => {
    try {
      upload.array('images',10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ "message":`${err.message}` });
        } else if (err) {
          return res.status(500).json({ "message": `${err.message}` });
        }
        next();
      });
    } catch (error) {
      console.log("catch Error:   ", error);
      await errorHandler(req, res, error);
    }
  },
};

module.exports = uploadHandler;
