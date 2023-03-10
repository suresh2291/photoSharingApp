const express = require('express');
const router = express.Router();
const services = require('../../services/appServices')
const { authUser } = require('../../middlewares');

var serviceInt;
    serviceInt = services.getInst();
router.post('/register',(req, res) => {
    serviceInt.registerUser(req, res);
})

router.post('/activate',authUser,(req, res) => {
    serviceInt.activateUser(req, res);
})

router.post('/resendverification',authUser,(req, res) => {
    serviceInt.resendVerification(req, res);
})

router.post('/login', (req, res) => {
    serviceInt.login(req, res);
})

router.get('/',(req, res)=>{
    serviceInt.getUsers(req, res);
})

router.post('/checkauthstatus',authUser, (req, res)=>{
    serviceInt.Auth(req, res);
})

module.exports = router;