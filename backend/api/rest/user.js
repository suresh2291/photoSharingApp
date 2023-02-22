const express = require('express');
const router = express.Router();
const services = require('../../services/appServices')

var serviceInt;
    serviceInt = services.getInst();
router.post('/register',(req, res) => {
    serviceInt.registerUser(req, res);
})
router.post('/activate',(req, res) => {
    serviceInt.activateUser(req, res);
})
router.post('/login',(req, res) => {
    serviceInt.login(req, res);
})

router.get('/',(req, res)=>{
    serviceInt.getUsers(req, res);
})

module.exports = router;