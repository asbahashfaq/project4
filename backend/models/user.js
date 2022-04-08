const db = require('../db/db')
const { v4: uuidv4 } = require('uuid');

// username         TEXT UNIQUE,
// password_digest  TEXT,
// parents_id       INTEGER,
// name             TEXT,
// email              TEXT,
// profile_image    bytea

const User = {
    getAll: (parent_id) => {
        console.log("PARENT: ",parent_id)
        const sql = `SELECT * FROM users WHERE parents_id = $1`
        return db
            .query(sql, [parent_id])
            .then(dbRes => dbRes.rows)         
    },
    findById: id => {
        const sql = `
        SELECT * FROM users
        WHERE id = $1
        `
        return db
            .query(sql, [id])
            .then(dbRes => dbRes.rows[0])
    },
    findByUsername: username => {
        const sql = `
        SELECT * FROM users
        WHERE username = $1
        `
        return db
            .query(sql, [username])
            .then(dbRes => dbRes.rows[0])
    },
    create: (name, username, email, passwordDigest, parents_id, image_url) => {
        var errorMessage = undefined
        const presql = `SELECT * FROM users WHERE username=$1`

        return db.query(presql, [username])
            .then( dbRes => {console.log(dbRes.rows); if (dbRes.rows.length > 0) errorMessage = "Username already in use" } )
            .then(() => {
                console.log(errorMessage)
                if (errorMessage != undefined) return {error:errorMessage}
                else{
                    const sql = `
                    INSERT INTO users(name, username, email, parents_id, password_digest, profile_image, uuid)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *
                    `  
                return db
                    .query(sql, [name, username, email ,parents_id, passwordDigest, image_url, uuidv4()])
                    .then(dbRes => dbRes.rows[0])
                    .catch(error => console.log(error))
            }
        })  
    }// ,
    // updateName: (name, id) => {
    //     const sql = `
    //         UPDATE users
    //         SET name = $2
    //         WHERE id = $1
    //         RETURNING *   
    //     `
    //     return db
    //         .query(sql, [id, name])
    //         .then(dbRes => dbRes.rows[0])
    // },
    // updateUsername: (username, id) => {
    //     const sql = `
    //         UPDATE users
    //         SET username = $2
    //         WHERE id = $1 
    //         RETURNING *
    //     `
    //     return db
    //         .query(sql, [id, username])
    //         .then(dbRes => dbRes.rows[0])
    // }
}

    
    module.exports = User
 