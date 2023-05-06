const {serverConfig} = require('../configs/index')
const jwt = require('jsonwebtoken')
const errorHandler = require('../helpers/errors')

const authHandler = {
  // Middleware to authenticate user by verifying JWT token
  authUser : async (req, res, next) => {
    try{
      // Extract the token from the Authorization header of the request
      const token = req.headers.authorization.split(" ")[1]
      
      // Check if there is a token
      if(!token){
        return res.status(401).json({message: "unauthorized user"})
      }
      
      // Verify the token with the server's JWT secret
      await  jwt.verify(token, serverConfig.jwtToken, (err, user)=>{
        if(err){
          return res.status(401).json({message: "unauthorized user"})
        }
        
        // Add the user object to the request for future use
        req.user = user
        
        // Call the next middleware in the chain
        next();
      })
    }catch(error){
      // Handle any errors in the middleware chain
      await errorHandler(req, res, error)
    }
  }
};


module.exports = authHandler