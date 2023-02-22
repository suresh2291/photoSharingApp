const bcrypt = require('bcrypt');
const {serverConfig} = require('../configs/index')

async function generatePassword(password) {
  const saltRounds = serverConfig.password.salt;
  const hash = await bcrypt.hash(password, saltRounds)
      return hash;
}


async function validatePassword(password, hash) {
// Compare the entered password with the stored hash
const passwordValidate = await bcrypt.compare(password, hash)
return passwordValidate
}

module.exports={
    generatePassword,
    validatePassword
}