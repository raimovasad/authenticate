const User = require('../models/User')

exports.register = async(req,res,next)=>{
    const {username, email,password} = req.body
    try{
        const user = await User.create({
            username,
            email,
            password   
        })
        res.status(201).json({
            success: true,
            user
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            error: e.message
        })
    }
}

exports.login = (req,res,next)=>{
    res.send('Login route')
}

exports.forgotpassword = (req,res,next)=>{
    res.send('forgotpassword route')
}

exports.resetpassword = (req,res,next)=>{
    res.send('resetpassword route')
}