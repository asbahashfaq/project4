const express = require('express')
const Parent = require('../models/parent')
const Child = require('../models/child')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const router = express.Router()

router.post('/new', (req, res) => {
    console.log(req.session.userId)
    console.log(req.body)
    const { username, password, accountType} = req.body
    if (accountType == 'p'){        //PARENT
        var email = username
        Parent
        .findByEmail(email)
        .then(user => {
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password_digest)
                if (isValidPassword) {
                    console.log('VALID PASS')
                    req.session.userId = user.id
                    req.session.accountType = accountType
                    res.status(200).json({ ...user, accountType: accountType })
                } else {
                    res.json({ error: 'Invalid email or password' })
                }
            } else {
                res.json({ error: 'Invalid email or password' })
            }
        })

    }
    if (accountType == 'c'){        //CHILD
        Child
        .findByUsername(username)
        .then(user => {
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password_digest)
                if (isValidPassword) {
                    console.log('VALID PASS')
                    req.session.userId = user.id
                    req.session.accountType = accountType
                    res.status(200).json({ ...user, accountType: accountType })
                } else {
                    res.json({ error: 'Invalid email or password' })
                }
            } else {
                res.json({ error: 'Invalid email or password' })
            }
        })

    }
    if (accountType == 's'){        //USER
        User
        .findByUsername(username)
        .then(user => {
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password_digest)
                if (isValidPassword) {
                    console.log('VALID PASS')
                    req.session.userId = user.id
                    req.session.accountType = accountType
                    res.status(200).json({ ...user, accountType: accountType })
                } else {
                    res.json({ error: 'Invalid email or password' })
                }
            } else {
                res.json({ error: 'Invalid email or password' })
            }
        })

    }

    // User
    //     .findByEmail(email)
    //     .then(user => {
    //         if (user) {
    //             const isValidPassword = bcrypt.compareSync(password, user.password_digest)
    //             if (isValidPassword) {
    //                 req.session.userId = user.id
    //                 res.status(200).json({ username: user.name, email: user.email })
    //             } else {
    //                 res.status(422).json({ message: 'Invalid email or password' })
    //             }
    //         } else {
    //             res.status(422).json({ message: 'Invalid email or password' })
    //         }
    //     })
})

router.delete('/', (req, res) => {
    req.session.userId = undefined
    res.json({message: 'Logout Successful'})
})

module.exports = router