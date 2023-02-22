const User = require('../db/schemas/User')

//Create a new username if the user already exists.
exports.validateUsername = async (username) => {
    console.log('username:  ', username)
    let checkusername = false;
  
    do {
      let check = await User.findOne({ userName: username });
      console.log('check username: ', check)
      if (check) {
        //change username
        username += (+new Date() * Math.random()).toString().substring(0, 1);
        checkusername = true;
      } else {
        checkusername = false;
      }
    } while (checkusername);
    return username;
  }