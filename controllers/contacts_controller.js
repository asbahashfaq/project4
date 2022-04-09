const express = require('express') 
const Contact = require('../models/contact') 
const User = require('../models/user')
const Parent = require('../models/parent')
const Child = require('../models/child')


const router = express.Router()
// id SERIAL PRIMARY KEY, 
// child_id INTEGER,
// account_type TEXT,
// user_id INTEGER

// router.get('/all',(req,res) => {  
//     console.log('test get contacts') 
//     const {parent} = req.query
//     console.log("PARENTID: ",parent)
//     Child.getAll(parent)
//         .then(response => res.json(response))
// })
router.post('/newContact', (req, res) => {
        // request: axios.post(`http://localhost:3001/contacts/newContact?c_id=${childID}&p_id=${parentID}&u_id=${contactID}`).then(
    
    console.log('test post request contact') 
    const { p_id, c_id, u_id } = req.query

 //create: (child_id, account_type, user_id) 
    Contact
        .create(c_id, 's', u_id)
        .then(response => res.json(response))
        .catch(error => res.json(error))

    // console.log(req)
    //  var form = new formidable.IncomingForm();
    //   form.multiples = false;
    //   form.parse(req, async function (err, fields, files) {

    //     console.log(fields, files) 
    // })
});
router.get('/getusers', (req, res) => {
    const {child_id} = req.query
    Contact
        .findByChildId(child_id)
        .then(response => {
            console.log(response)
            var users = []
            var promises = []
            response.forEach(contact => { 
                if (contact.account_type == 'p')
                    promises.push(Parent.findById(contact.user_id)
                    .then(parentContact => users.push(parentContact)))
                else if (contact.account_type == 's') 
                    promises.push(User.findById(contact.user_id)
                    .then(userContact => users.push(userContact)))
            }) 
            Promise.all(promises).then(() => res.json(users))
        })
        .then((userres) => console.log("userres:",userres))
        .catch(error => console.log("err",error))
});
router.get('/getuserscontacts', (req,res) => {
    const {user_id} = req.query
    Contact
        .findByUserId(user_id)
        .then(response => {
            console.log("RES",response)
            var users = []
            var promises = []
            response.forEach(contact => { 
                if (contact.account_type == 'p') //won't get used 
                    promises.push(Parent.findById(contact.user_id)
                    .then(parentContact => users.push(parentContact)))
                else if (contact.account_type == 's') 
                    promises.push(Child.findById(contact.child_id)
                    .then(childContact => users.push(childContact)))
            }) 
            Promise.all(promises).then(() => {console.log("usersadsfds",users);return res.json(users)})
        })
        .then((userres) => console.log("userres2:",userres))
        .catch(error => console.log("err",error))
})
router.delete('/del', (req, res) => {
    //axios.delete(`http://localhost:3001/contacts/del?c_id=${childID}&u_id=${contactID}`).then(
    console.log('removing from contacts')
    const { c_id, u_id } = req.query

    Contact.delete(c_id, 's', u_id)
    .then( response => res.json( response ) )
    .catch( error => res.json( error ) )

})

module.exports = router