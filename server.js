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
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
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
  
app.use(express.static(path.resolve(__dirname, "./frontend/build")));

//routes 
app.use('/parents', parentsController)
app.use('/sessions', sessionsController)
app.use('/children', childrenController)
app.use('/users', usersController)
app.use('/contacts', contactsController)



  
// const express = require('express')
// const http = require('http')
// const app = express()
// const server = http.createServer(app)

// const io = require('socket.io')(server, {
//     cors: {
//         origin: "http://localhost:3001",
//         methods: ["GET", "POST"]
//     }
// })


// io.on("connection", (socket) => {
//     socket.emit( "me", socket.id )  //getting own id, to use for connection

//     socket.on( "disconnect", () => { //when call gets disconnected
//         socket.broadcast.emit( "callEnded" )
//     })

//     socket.on( "callUser", data => {
//         io.to(data.userToCall).emit('callUser', {
//             signal: data.signalData,
//             from: data.from,
//             name: data.name
//         })
//     })

//     socket.on( "answerCall", data => io.to(data.to).emit( "callAccepted"), data.signalData )

// })

// server.listen(3000, () => console.log('Server is listening on port 3000'))