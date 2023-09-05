const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const ws = require('ws');
require('dotenv').config()
const Message = require('./models/message')
const Agent = require("./models/agent")
const createWebSocketServer = require("./controllers/websocket")
const app = express();

const adminRouter = require('./routes/admin')
const agentRouter = require('./routes/agent')
const userRouter = require('./routes/user')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// app.use('/uploads',express.static(__dirname+'/uploads'));
// app.use(express.static(path.join(__dirname, '/public/static')));

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('connected')
    })
    .catch(err => console.log(err));



const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));

app.use('/admin', adminRouter);
app.use('/agent', agentRouter);
app.use('/', userRouter);

app.get("/*", function (req, res) {
    res.sendFile(
        path.join(__dirname, '../client/dist/index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
})


const server = app.listen(4000, () => {
    console.log('Server Started Running');
    // Use the createWebSocketServer function to set up WebSocket connections
    createWebSocketServer(server);
});


