const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        // Bearer 33453454etert4554ty
        token =req.headers.authorization.split(" ")[1]
    }
        if(!token){
            return next(new ErrorResponse("Not authorized to access this route",401))
        }
        try{
            const decoded = await jwt.verify(token,process.env.JWT_SECRET)
            const user = await User.findById(decoded.id)
            console.log(user);
            if(!user){
                return next(new ErrorResponse("No user found with this id", 404)) 
            }
            req.user = user
            next()
        }catch(e){
            return next(new ErrorResponse(e.message,401));
        }
    
}