const express = require('express')
const cors = require('cors')
 
//middlewares
const logger = require('./middlewares/logger') 
const sessions = require('./middlewares/sessions')

//controllers
const parentsController = require('./controllers/parents_controller')
const sessionsController = require('./controllers/sessions_controller')
const childrenController = require('./controllers/children_controller')
const usersController = require('./controllers/users_controller')
const contactsController = require('./controllers/contacts_controller')

//server setup 
const app = express() 
  
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

io.on('connection', socket => {
    console.log("Connecting to socket for uuid: ", socket.handshake.query.uuid, socket.handshake.query.account_type)
    if (!users[socket.id]) {
        users[socket.id] = { 
            id: socket.id,
            uuid: socket.handshake.query.uuid,
            type: socket.handshake.query.account_type
        };
        // users.uuid = socket.handshake.query.uuid
        // users.type = socket.handshake.query.account_type
    }
    console.log("users:", users)
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
        delete users[socket.id];
    })
    socket.on('close', () => {
        delete users[socket.id];
        console.log('Client disconnected')
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from, callerName: data.callerName});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});
//app.use( bodyParser.urlencoded({ extended: false }))
// app.use( bodyParser.json() )
//app.use( fileUpload() )

app.use(express.json())
//cors handling
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const port = process.env.PORT || 3001
 

//start web server
server.listen(port, 
    () => console.log(`Server started... listening on port ${port}`)
)  
//using middlewares
app.use(logger)  
app.use(sessions)
  


//routes 
app.use('/parents', parentsController)
app.use('/sessions', sessionsController)
app.use('/children', childrenController)
app.use('/users', usersController)
app.use('/contacts', contactsController)

if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.use(express.static(path.join(__dirname, './frontend/build')));
  
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
    });
  }