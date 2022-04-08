const express = require('express')
const Child = require('../models/child')
const Contact = require('../models/contact')
const bcrypt = require('bcrypt') 

const router = express.Router()

    // name             TEXT,
    // username         TEXT UNIQUE,
    // age              INTEGER,
    // password_digest  TEXT,
    // profile_image    bytea
    // parents_id       INTEGER,

router.get('/all',(req,res) => {  
    console.log('test get children') 
    const {parent} = req.query
    console.log("PARENTID: ",parent)
    Child.getAll(parent)
        .then(response => res.json(response))
})
router.post('/new', (req, res) => {
    
    console.log('test post request children')
    console.log(req.body)
    const { name, username, age, password, parents_id, image_url } = req.body

    const passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) 
    Child
        .create(name, username, age, passwordDigest, parents_id, image_url)
        .then(response => {
            const childID = response.id
            Contact.create(childID,'p',parents_id).then(
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
    console.log('get child details')
    var data = {}
    const {id} = req.query
    console.log("CHILD ID TO WORK WITH : ", id)
    return Child.findById(id)
        .then(response => data.child = response)
        .then( () => 
            Contact.findByChildId(id)
            .then( response => {data.contacts = [response]; return data;}) 
        )
        .then(() => res.json(data))



})
  
module.exports = router