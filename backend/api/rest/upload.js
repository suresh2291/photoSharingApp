const express = require("express");
const router = express.Router();
const services = require("../../services/appServices");
const serviceInt = services.getInst();
const { imageUpload, authUser } = require("../../middlewares");
const { Kafka } = require('kafkajs');

//routes used for uploading images to cloudinary.
router.post("/images", authUser, imageUpload, async(req, res, next) => {
  try {  
    await serviceInt.uploadImages(req, res, next);
  } catch (err) {
    next(err)
  }
});
router.post("/upload/cloudinary", authUser, async(req, res, next) => {
  try {  
    await serviceInt.uploadCloudinaryUri(req, res, next);
  } catch (err) {
    next(err)
  }
});
module.exports = router;
