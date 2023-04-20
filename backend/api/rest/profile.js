const express = require('express');
const router = express.Router();
const services = require('../../services/appServices')
const serviceInt = services.getInst();
const { authUser } = require("../../middlewares");

router.get("/user_profile",authUser, async (req, res, next) => {
  try {
    await serviceInt.getUserProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/profile_images", authUser, async (req, res, next) => {
  try {
    await serviceInt.getProfileImages(req, res, next);
  } catch (error) {
    next(error);
  }
});
module.exports = router;