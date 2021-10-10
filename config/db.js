const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URI,(err)=>{
        if(err) throw err
        else{
            console.log('Connected to MongoDB');
        }
    })
}

module.exports = connectDB;