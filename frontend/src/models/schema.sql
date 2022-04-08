CREATE DATABASE kids_social;
\c kids_social

CREATE TABLE parents(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    profile_image bytea,
    uuid TEXT,
    password_digest TEXT
);

CREATE TABLE children(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password_digest TEXT,
    parents_id INTEGER,
    name TEXT,
    age INTEGER,
    profile_image bytea,
    uuid TEXT,
    FOREIGN KEY(parents_id) REFERENCES parents(id)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT,
    username TEXT,
    email TEXT,
    password_digest TEXT,
    profile_image TEXT,
    parents_id INTEGER,
    uuid TEXT
);
-- parents automatically added to contacts of children and children to parents
-- insert image using bytea('url') as value
CREATE TABLE contacts(
    id SERIAL PRIMARY KEY, 
    child_id INTEGER,
    account_type TEXT,
    user_id INTEGER
    --based on ids from 3 types of accounts (c, p, s)            
);

CREATE TABLE callhistory(
    id SERIAL PRIMARY KEY,
    caller_id INTEGER,
    receiver_id INTEGER,
    call_time timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY, 
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT,
    message_time timestamp DEFAULT CURRENT_TIMESTAMP
);


-- NEW

CREATE TABLE notifications(
    id SERIAL PRIMARY KEY,
    for_parent_id INTEGER,
    content TEXT,
    notification_time timestamp DEFAULT CURRENT_TIMESTAMP
)