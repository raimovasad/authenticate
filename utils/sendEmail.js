const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendEmail = (options)=>{
    const msg = {
        to: options.to, // Change to your recipient
        from: process.env.EMAIL_FROM, // Change to your verified sender
        subject: 'Reset your password Asadbek',
        text: "Change IT academy",
        html: options.text,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

}


  
// const sendEmail = (options)=>{
//     const transporter = nodemailer.createTransport({
//         service: process.env.EMAIL_SERVICE,
//         auth:{
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     })
//     const mailOptions = {
//         from:process.env.EMAIL_FROM,
//         to:options.to,    
//         subject: options.subject,
//         html:options.text
//     }
//     transporter.sendMail(mailOptions,function(err,info){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(info);
//         }
//     })
// }

module.exports = sendEmail