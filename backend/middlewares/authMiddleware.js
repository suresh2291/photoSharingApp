const {serverConfig} = require('../configs/index')
const jwt = require('jsonwebtoken')
function errorHandler(req, res, error) {
    res.status(500).send({
        errors: [{
            msg: error.message,
            code: 500
        }]
    });
}

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
                console.log('user: ', req.user)
                next();
            })
        }catch(e){
            errorHandler(req, res, e)
        }
    }
}

module.exports = authHandler