const {serverConfig} = require('../configs/index')
const jwt = require('jsonwebtoken')
const errorHandler = require('../helpers/errors')

const authHandler = {
    authUser : async (req, res, next) => {
        try{
            const token = req.headers.authorization.split(" ")[1]
            if(!token){
                return res.status(401).json({message: "unauthorized user"})
            }
            await  jwt.verify(token, serverConfig.jwtToken,(err, user)=>{
                if(err){
                    return res.status(401).json({message: "unauthorized user"})
                }
                req.user = user
                next();
            })
        }catch(error){
            await errorHandler(req, res, error)
        }
    }
}

module.exports = authHandler