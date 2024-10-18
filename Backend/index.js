const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();

const socketHandler = require('./socket');
const userRoute = require('./routes/user'); 

const app = express();
app.use(express.json());
app.use(cors()); 

const server = http.createServer(app);


const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true
    }
});

socketHandler(io);

app.use("/user", userRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT ;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
