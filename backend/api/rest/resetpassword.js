const express = require('express');
const router = express.Router();
const services = require('../../services/appServices')
const serviceInt = services.getInst();

router.post('/changepassword', async (req, res, next) => {
    try {
      await serviceInt.changePassword(req, res, next);
    } catch (error) {
      next(error);
    }
  });

router.post('/finduser', async (req, res, next) => {
    try {
      await serviceInt.findUser(req, res, next);
    } catch (error) {
      next(error);
    }
  });

router.post('/verifycode',  async (req, res, next) => {
    try {
      await serviceInt.verifyCode(req, res, next);
    } catch (error) {
      next(error);
    }
  });

router.post('/sendresetpassword',  async (req, res, next) => {
    try {
      await serviceInt.sendResetPasswordCode(req, res, next);
    } catch (error) {
      next(error);
    }
  });
module.exports = router;