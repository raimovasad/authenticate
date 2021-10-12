const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.register = async(req,res,next)=>{
    const {username, email,password} = req.body
    try{
        const user =  new User({
            username,
            email,
            password   
        })
        await user.save()
        
        await sendToken(user,201,res)
    }catch(e){
        next(e)
    }
}

exports.login = async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
       return next(new ErrorResponse("Please provide email or password!",400))  
    } 
    try{
        const user = await User.findOne({email:email}).select("+password")
        if(!user){
            return next(new ErrorResponse("Invalid Credentials!",401))
        }
        const isMatch = await user.matchPasswords(password) 
        if(!isMatch){
            return next(new ErrorResponse("Invalid Credentials!",401))
        }

       await sendToken(user,200,res)
    }
    catch(e){
        res.status(500).json({success:false, error: e.message})
    }
}

exports.forgotpassword = (req,res,next)=>{
    res.send('forgotpassword route')
}


exports.resetpassword = (req,res,next)=>{
    res.send('resetpassword route')
}

const sendToken = async(user,statusCode,res)=>{
    const token = await user.getSignedToken()
    console.log(token);
    res.status(statusCode).json({success: true,token})
}