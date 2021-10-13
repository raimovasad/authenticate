const {model, Schema} = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt =require("jsonwebtoken")
const crypto = require('crypto')


const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "Please provide a username"]
    },
    email:{
        type: String,
        required: [true,'Please provide a email'],
        unique: true,
        match:[
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            "Please provide a valid email"
        ]
    },
    password:{
        type: String,
        required: [true,'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date

})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
  const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
    
});

userSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.getSignedToken = async function(password){
    return await jwt.sign({id: this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}
userSchema.methods.getResetPassword = function(){
   const resetToken = crypto.randomBytes(20).toString("hex")
  
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10*(60*1000)
   return resetToken
}
module.exports = model('User',userSchema) 