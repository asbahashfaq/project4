// Kenny created file 16/3

// Will need to create a user model for this controller
const express = require('express')
const User = require('../models/user')
const Contact = require('../models/contact')
const bcrypt = require('bcrypt') 
const nodemailer = require('nodemailer')


const router = express.Router()

    // name             TEXT,
    // username         TEXT UNIQUE,
    // email              INTEGER,
    // password_digest  TEXT,
    // profile_image    bytea
    // parents_id       INTEGER,

router.get('/all',(req,res) => {  
    console.log('test get user') 
    const {parent} = req.query
    console.log("PARENTID: ",parent)
    User.getAll(parent)
        .then(response => res.json(response))
})
router.post('/new', (req, res) => {
    
    console.log('test post request users')
    console.log(req.body)
    const { name, username, email, password, parents_id, image_url } = req.body

    const passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) 
    User
        .create(name, username, email, passwordDigest, parents_id, image_url)
        .then(response => {
            sendEmail(req.body) //send email to user with their login details
            const userID = response.id
            Contact.create(userID,'p',parents_id).then(
                res => res
            )

            return res.json(response)
        })
        .catch(error => res.json(error))

    // console.log(req)
    //  var form = new formidable.IncomingForm();
    //   form.multiples = false;
    //   form.parse(req, async function (err, fields, files) {

    //     console.log(fields, files) 
    // })
});
router.get('/', (req,res) => {
    console.log('get user details')
    var data = {}
    const {id} = req.query
    console.log("USER ID TO WORK WITH : ", id)
    return User.findById(id)
        .then(response => data.user = response)
        // .then( () => 
        //     Contact.findByUserId(id)
        //     .then( response => {data.contacts = [response]; return data;}) 
        // )
        .then(() => res.json(data))



})
  
function sendEmail(details){
    console.log("Sending email", details)
    //send email to this email - NODEMAILER
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: "kidsocialsei51@gmail.com",
            pass: process.env('EMAIL_PASS')
        },
        tls: {
            rejectUnauthorized: false,
        },
    })
    console.log(details)
    let mailOptions = {
        from: '"KidSocial" <kidsocialsei51@gmail.com>',
        to: `${details.email}`,
        subject: "Welcome to KidSocial",
        text: `Hi ${details.name}! \n\nWelcome to the KidSocial Network! \n You can log in using the following credentials: \n\n   Username: ${details.username}\n   Password: ${details.password}\n\nHave fun :) `
    }
    transporter.sendMail(mailOptions, (error, success) => {
        if(error){
            console.log(error)
        }else{
            console.log("Email sent")
        }
    })
}


module.exports = router