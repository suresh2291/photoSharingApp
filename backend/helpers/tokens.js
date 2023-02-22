const {serverConfig} = require('../configs/index')
const jwt = require('jsonwebtoken')

function generateToken(payload,expired) {
    return jwt.sign(payload, serverConfig.jwtToken, {
        expiresIn: expired
    })
}

module.exports = {generateToken}