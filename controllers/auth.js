const User = require('../models/User')

exports.register = async(req,res,next)=>{
    const {username, email,password} = req.body
    try{
        const user =  new User({
            username,
            email,
            password   
        })
        await user.save()
        console.log('User',user);
        
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

exports.login = async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){

        res.status(400).json({success:false, error: "Please provide email or password!"})
    }
    try{
        const user = await User.findOne({email:email}).select("+password")
        if(!user){
            res.status(404).json({success:false, error: "Invalid credentials"})
        }
        const isMatch = await user.matchPasswords(password) 
        if(!isMatch){
            res.status(404).json({success:false, error:'Invalid credentials'})
        }

        res.status(200).json({
            success: true,
            token:'asdas434554'
        })
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