
const User = require('../db/schemas/User')
const Code = require('../db/schemas/Code')
const {serverConfig} = require('../configs/index')
const { generateToken } = require('../helpers/tokens')
const { validateUsername } = require('../helpers/validations')
const generateCode = require("../helpers/generateCode");
const {generatePassword} = require('../modules/password') 
const { sendVerificationEmail, sendResetPasswordEmail } = require('../helpers/mailers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function photoAppService() {}
/*-----------------------------------USERS--------------------------------*/
photoAppService.prototype.getUsers = async function (req, res, next) {
    console.log('getUsers')
    res.send("welcome from user home")
}

photoAppService.prototype.Auth = async function (req, res, next) {
    res.send(`welcome from user`)
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
         "Sorry, that email address is already taken. Please log in or use a different email address to register.",
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
        const url = `${serverConfig.port.frontEndUrl}/activate?token=${verifyEmail}`
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
            message: `Please check your email. After you have verified your email, you can close this window and start using your account.`
        })
}catch(e){
    res.status(500).json({message: e.message})
}
}


photoAppService.prototype.activateUser = async function(req, res, next) {
try{
    const validUser = req.user.id;
    const { token } = req.body
    const user = jwt.verify(token, serverConfig.jwtToken)
    const checkUser = await User.findById(user.id)
    if (validUser !== user.id) {
        return res.status(400).json({
          message: "You don't have the authorization to complete this operation.",
        });
    }
    if(checkUser.verified === true){
       return res.status(400).json({message: "Your account has already been activated. You can close this window and start using your account."})
    }else{
        await User.findByIdAndUpdate(user.id, {verified:true})
        return res.status(200).json({message: "Welcome to our app! Your account is now active and ready to use."})
    }
}catch(e){
    res.status(500).json({message: e.message})
}
}


photoAppService.prototype.resendVerification = async function(req, res, next) {
    try{
        const id = req.user.id;
        const user = await User.findById(id)
        if(user.verified === true){
           return res.status(400).json({message: "Your account has already been activated."})
        }
        const verifyEmail = generateToken({id: user._id.toString()}, '1d')
        const url = `${serverConfig.port.frontEndUrl}/activate?token=${verifyEmail}`
        await sendVerificationEmail(user.email, user.firstName, url)
        return res.status(200).json({message: "Email verification send to your email."})
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
        return res.status(400).json({message: "We're sorry, but the email address you entered doesn't match our records. Please try again or create new account."})
    }
    
    const checkPassword = await bcrypt.compare(password, user.password)
    
    if(!checkPassword){
        return res.status(400).json({message: "Oops! It looks like your password is incorrect. Please try again or click 'forgotten password' to reset it."})
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
            message: `Welcome back ${user.firstName}! We're so excited to have you here! You can now share and discover the most beautiful photos with other users.`
        })

}catch(e){
    res.status(500).json({message: e.message})
}
}
/*-----------------------------------USERS--------------------------------*/


/*-----------------------------------RESET PASSWORD--------------------------------*/
photoAppService.prototype.findUser = async function (req, res, next) {
  try {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
          return res.status(400).json({
            message: "Account does not exists.",
          });
        }
        return res.status(200).json({
          email: user.email,
          picture: user.avatar,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  } catch (error) {
    res.status(500).json({ message: e.message });
  }
};

photoAppService.prototype.verifyCode = async function (req, res, next) {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        const Dbcode = await Code.findOne({ user: user._id });
        if (Dbcode.code !== code) {
          return res.status(400).json({
            message: "Verification code is wrong..",
          });
        }
        return res.status(200).json({ message: "code verified" });
    } catch (error) {
      res.status(500).json({ message: e.message });
    }
  };

photoAppService.prototype.sendResetPasswordCode = async function (req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode();
    await new Code({
      code,
      user: user._id,
    }).save();
    sendResetPasswordEmail(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: e.message });
  }
};  

photoAppService.prototype.changePassword = async function (req, res, next) {
    
    try {
    const { email, password } = req.body;
    const newPassword = await generatePassword(req.body.password)
  await User.findOneAndUpdate(
    { email },
    {
      password: newPassword,
    }
  );
  return res.status(200).json({ message: "password changed" });
    } catch (error) {
      res.status(500).json({ message: e.message });
    }
  };
/*-----------------------------------RESET PASSWORD--------------------------------*/

module.exports = {
    getInst: function() {
        return new photoAppService();
    }
};