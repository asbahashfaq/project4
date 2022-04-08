const express = require('express')
const Parent = require('../models/parent')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/', (req,res) => {
    console.log('get parent contact')
    var data = {}
    const {id} = req.query
    console.log("parent ID TO WORK WITH : ", id)
    return Parent.findById(id)
        .then(response => res.json(response))



})
router.post('/new', (req, res) => {
    console.log('test post request')
    console.log(req.body)
    const { name, email, password } = req.body

    const passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) 
    Parent
        .create(name, email, passwordDigest)
        .then(response => res.json(response))
        .catch(error => res.json(error))
})

// router.put('/', (req, res) => {
//     const userId = req.session.userId
//     const editInput = req.body
//     if (Object.keys(editInput)[0].includes('Name')) {
//         const newName = editInput['Name-edit']
//         Parent
//             .updateName(newName, userId)
//             .then(userName => res.json(userName))
//     } else if (Object.keys(editInput)[0].includes('Email')) {
//         const newEmail = editInput['Email-edit']
//         Parent
//             .updateEmail(newEmail, userId)
//             .then(userEmail => res.json(userEmail))
//     }
    

// })


module.exports = router