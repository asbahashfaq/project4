const db = require('../db/db')
const { v4: uuidv4 } = require('uuid');

const Parent = {
    findByEmail: email => {
        const sql = `
        SELECT * FROM parents
        WHERE email = $1
        `
        return db
            .query(sql, [email])
            .then(dbRes => dbRes.rows[0])
    },
    findById: id => {
        const sql = `
        SELECT * FROM parents
        WHERE id = $1
        `
        return db
            .query(sql, [id])
            .then(dbRes => dbRes.rows[0])
    },
    create: (name, email, passwordDigest) => {
        var errorMessage = undefined
        const presql = `SELECT * FROM parents WHERE email=$1`
        return db.query(presql, [email])
        .then( dbRes => {console.log(dbRes.rows); if (dbRes.rows.length > 0) errorMessage = "Email already in use" } )
        .then(() => {
            console.log(errorMessage)
            if (errorMessage != undefined) return {error:errorMessage}
            else{
                const sql = `
                INSERT INTO parents(name, email, password_digest, uuid)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `
               
              return db
                .query(sql, [name, email, passwordDigest, uuidv4()])
                .then(dbRes => dbRes.rows[0].name)
                .catch(error => console.log(error))
            }
        }) 
        

        
    }
    // updateName: (name, id) => {
    //     const sql = `
    //         UPDATE parents
    //         SET name = $2
    //         WHERE id = $1
    //         RETURNING *   
    //     `
    //     return db
    //         .query(sql, [id, name])
    //         .then(dbRes => dbRes.rows[0])
    // },
    // updateEmail: (email, id) => {
    //     const sql = `
    //         UPDATE parents
    //         SET name = $2
    //         WHERE id = $1 
    //         RETURNING *
    //     `
    //     return db
    //         .query(sql, [id, email])
    //         .then(dbRes => dbRes.rows[0])
    // }
}

    
    module.exports = Parent
 