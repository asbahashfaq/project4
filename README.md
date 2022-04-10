# KidSocial - An app for children to stay in touch with relatives in a fully monitored environment.

This project was done as a part of the Software Engineering Immersive course at General Assembly. 
[Check it out!](https://kidsocial.herokuapp.com/)

![Login page][login-image]

### Functionality

* Allows parents to create an account for themselves.
* Parents can create accounts for their children.
* Parents can add contacts to their accounts, and decide which contacts their children can get in touch with.
* On account creation, each contact will get an email with their login credentials, and can log in to their accounts and place and accept calls.
* Children can log in to their accounts, created by their parents, and see all the contacts added for them.
* They can call their contacts by clicking on their pictures, as well as receive calls innitiated by their contacts.

#### Still to do 

* Parents will get notifications for all the correspondence that their children do with their contacts.
* Chat functionality will be implemented so that older children can chat with their contacts using text messages. 
* Support for mobile and tablet devices. 


## Built With

KidSocial is built using the PERN stack, which includes:

* [PostgreSQL](https://www.postgresql.org/)
* [Express.js](https://expressjs.com/)
* [React.js](https://reactjs.org/)
* [Node](https://nodejs.org/)

Other technologies used include: 

* [Socket.io](https://socket.io/)
* [SimplePeer](https://www.npmjs.com/package/simple-peer)
* [WebRTC](https://webrtc.org/)
* [NodeMailer](https://nodemailer.com/)
* [Node Sass](https://www.npmjs.com/package/node-sass)
* [Cloudinary](https://cloudinary.com/)
* [BCrypt](https://www.npmjs.com/package/bcrypt)
* [pg](https://www.npmjs.com/package/bcrypt)

The project has been deployed using [Heroku](https://www.heroku.com/), and is currently live. 

### Wireframes

Basic wireframes were developed to understand the flow of the app. 
![Project Wireframe][wireframe-image]


## How to run locally

To run this project locally, do the following: 

1. Clone the repository
2. Install npm packages
```
npm i
```
3. Create the database using the `schema.sql` file
4. In `frontend/package.json`, add 

    ```
    "proxy": "http://localhost:3001"
    ```

5. Create a `.env` file in your root directory and add `EXPRESS_SESSION_SECRET_KEY` 
6. To allow nodemailer to send emails, add the following to your `.env` file

    ```
    EMAIL=email
    EMAIL_PASS=password
    ```

    Replace email and password with the email and password of the account you want to use
7. To run the server, `cd` into the root directory (containing `server.js`), and run

    ```
    npm run dev
    ```

8. To execute the frontend app, run

    ```
    cd frontend
    npm i
    npm start
    ```

9. Go to `http://localhost:3000` to test the app


[wireframe-image]: demo/wireframe.png
[login-image]: demo/login.png
