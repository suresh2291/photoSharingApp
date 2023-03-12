const express = require("express");
const router = express.Router();
const services = require("../../services/appServices");
const { authUser } = require("../../middlewares");
const serviceInt = services.getInst();
router.post("/register", async (req, res, next) => {
  try {
    await serviceInt.registerUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/activate", authUser, async(req, res, next) => {
  try {
    await serviceInt.activateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/resendverification", authUser, async(req, res, next) => {
  try {
    await serviceInt.resendVerification(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async(req, res, next) => {
  try {
    await serviceInt.login(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/", async(req, res, next) => {
  try {
    await serviceInt.getUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/checkauthstatus", authUser, async(req, res, next) => {
  try {
    await serviceInt.Auth(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
