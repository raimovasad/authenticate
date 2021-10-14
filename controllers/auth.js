const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const crypto =require('crypto')

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

exports.forgotpassword = async(req,res,next)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email:email})
        console.log(user);
        if(!user){
            return next(new ErrorResponse("Email could not be sent",404))
        }
        const resetToken = user.getResetPassword()
        await user.save();
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`
        const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href="${resetUrl}" clicktracking=off >${resetUrl}</a>`
        try{
            await sendEmail({
                to: user.email,
                subject:"Password reset request",
                text: message
            })
            res.status(200).json({success:true,data:"Email sent"})
        }catch(e){
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            return next(new ErrorResponse("Email could not be sent",500))
        }
    }
    catch(e){
         next(e)
    }
}


exports.resetpassword = async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest("hex")
    try{
        const user  =await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire:{$gt: Date.now()}
        })
        console.log(resetPasswordToken ,'546a60c95f75550481ee4a6f499fcc4f492e0bbc1141cce7049a4056dc1455ee');
        if(!user){
            return next(new ErrorResponse("Invalid Reset Token",400))
        }
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(201).json({
            success: true,
            data: 'Password Reset Success'
        })
    }
    catch(e){
        next(e)
    }
}

const sendToken = async(user,statusCode,res)=>{
    const token = await user.getSignedToken()
    console.log(token);
    res.status(statusCode).json({success: true,token})
} 