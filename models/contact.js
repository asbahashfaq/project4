const db = require('../db/db') 

//     id SERIAL PRIMARY KEY, 
//     name TEXT,
//     email TEXT UNIQUE,
//     account_type TEXT,
//     user_id INTEGER

const Contact = {
    getContactsByParent: (parent_id) => {
        console.log("getting contacts for parentId: ",parent_id)
        const sql = `SELECT * FROM contacts WHERE user_id = $1 AND account_type = 'p'`
        return db
            .query(sql, [parent_id, 'c'])
            .then(dbRes => dbRes.rows)         
    },
    findByChildId: (child_id) => {
        console.log("getting contacts for childId: ",child_id)
        const sql = `SELECT * FROM contacts WHERE child_id = $1`
        return db
            .query(sql, [child_id])
            .then(dbRes => dbRes.rows)         
    },
    findByUserId: (user_id) => {
        console.log("getting contacts for userID: ",user_id)
        const sql = `SELECT * FROM contacts WHERE user_id = $1 AND account_type = 's'`
        return db
            .query(sql, [user_id])
            .then(dbRes => dbRes.rows)         
    },
    findById: id => {
        const sql = `
        SELECT * FROM contacts
        WHERE id = $1
        `
        return db
            .query(sql, [id])
            .then(dbRes => dbRes.rows[0])
    },
    findByUsername: username => {
        const sql = `
        SELECT * FROM children
        WHERE username = $1
        `
        return db
            .query(sql, [username])
            .then(dbRes => dbRes.rows[0])
    },
    create: (child_id, account_type, user_id) => {  
         
        const sql = `
        INSERT INTO contacts(child_id, account_type, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `  
        return db
            .query(sql, [child_id, account_type, user_id])
            .then(dbRes => dbRes.rows[0])
            .catch(error => console.log(error))
           
    }, 
    delete: (child_id, account_type ,user_id) => { 
        const sql = `
        DELETE FROM contacts WHERE child_id = $1 AND account_type = $2 AND user_id = $3`

        return db
            .query(sql, [child_id, account_type, user_id])
            .then(dbRes => dbRes.rows)
            .catch(error => console.log(error))
    }
}

    
    module.exports = Contact
 