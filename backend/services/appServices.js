
const User = require('../db/schemas/User')
const {serverConfig} = require('../configs/index')
const { generateToken } = require('../helpers/tokens')
const { validateUsername } = require('../helpers/validations')
const {generatePassword} = require('../modules/password') 
const { sendVerificationEmail } = require('../helpers/mailers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function photoAppService() {}
photoAppService.prototype.getUsers = async function (req, res, next) {
    console.log('getUsers')
    res.send("welcome from user home")
}

photoAppService.prototype.registerUser = async function (req, res, next) {
try{
    const {
        firstName,
        lastName,
        email,
        gender,
        bYear,
        bMonth,
        bDay
     } = req.body
    
    const check = await User.findOne({ email });
     if (check) {
       return res.status(400).json({
         message:
           "This email address already exists,try with a different email address",
       });
    }
    
    const password = await generatePassword(req.body.password)
    let tempUserName = firstName + lastName
    let userName = await validateUsername(tempUserName)
    const user = await new User({firstName,
        lastName,
        userName,
        email,
        password,
        gender,
        bYear,
        bMonth,
        bDay}).save()
        const verifyEmail = generateToken({id: user._id.toString()}, '30m')
        const url = `${serverConfig.port.baseurl}/activate/${verifyEmail}`
        await sendVerificationEmail(user.email, user.firstName, url)
        const token = generateToken({id: user._id.toString()}, '7d')
        res.status(200).json({
            id: user._id,
            userName: user.userName,
            picture: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
            verified: user.verified,
            message: 'Register Success! Please activate your email'
        })
}catch(e){
    res.status(500).json({message: e.message})
}

}


photoAppService.prototype.activateUser = async function(req, res, next) {
try{
    const { token } = req.body
    const user = jwt.verify(token, serverConfig.jwtToken)
    console.log('user details:  ', user)
    const checkUser = await User.findById(user.id)
    if(checkUser.verified === true){
       return res.status(400).json({message: "This user is already activated"})
    }else{
        await User.findByIdAndUpdate(user.id, {verified:true})
        return res.status(200).json({message: "Account has been activated successfully"})
    }

}catch(e){
    res.status(500).json({message: e.message})
}
}

photoAppService.prototype.login = async function(req, res, next) 
{
try{
    const {email, password} = req.body
    const user = await User.findOne({ email })
    if(!user){
        return res.status(400).json({message: "The email address you entered isn't connected to an account."})
    }
    
    const checkPassword = await bcrypt.compare(password, user.password)
    
    if(!checkPassword){
        return res.status(400).json({message: "The password that you've entered is incorrect."})
    }
    const token = generateToken({id: user._id.toString()}, '7d')
        res.status(200).json({
            id: user._id,
            userName: user.userName,
            picture: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
            verified: user.verified,
            message: 'logged in successfully'
        })

}catch(e){
    res.status(500).json({message: e.message})
}
}
module.exports = {
    getInst: function() {
        return new photoAppService();
    }
};