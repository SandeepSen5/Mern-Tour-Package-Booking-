const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const ws = require('ws');
require('dotenv').config()
const createError = require('./utils/createError');
const Message = require('./models/message')
const Agent = require("./models/agent")
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


app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('connected')
    })
    .catch(err => console.log(err));

app.use('/admin', adminRouter);
app.use('/agent', agentRouter);
app.use('/', userRouter);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
})


const server = app.listen(4000, console.log('Server Started Running'));

const wss = new ws.WebSocketServer({ server });

const agentWebSocketInstances = new Map();

wss.on('connection', async (connection, req) => {
    try {
        console.log(req.headers);
        console.log('ws connected');
        const cookies = req.headers.cookie;

        if (cookies) {
            const cookiePairs = cookies.split(';');
            const tokenCookiePair = cookiePairs.find(pair => pair.trim().startsWith('Usertoken='));

            if (tokenCookiePair) {
                const tokenCookieString = tokenCookiePair.trim();
                const token = tokenCookieString.split('=')[1];
                console.log('User token:', token);
                if (token) {
                    jwt.verify(token, process.env.USER_JWTSECRET, {}, async (err, userData) => {
                        if (err) throw err;
                        console.log(userData);
                        const { id, name } = userData;
                        connection.userId = id;
                        connection.username = name;
                    })
                }
            } else {
                console.log('usertoken cookie not found');
            }
        }

        const agentsDoc = await Agent.aggregate([
            { $project: { id: '$_id', agentname: '$name', _id: 0 } }
        ]);

        agentsDoc.forEach(agent => {
            agentWebSocketInstances.set(agent.id.toString(), connection);
        });



        connection.on('message', async (message) => {
            const messageData = JSON.parse(message.toString());
            const { recipient, text, sender } = messageData;

            if (recipient && text && sender) {
                const messageDoc = await Message.create({
                    sender,
                    recipient,
                    text,
                });

                if (agentWebSocketInstances.has(recipient)) {
                    const agentConnection = agentWebSocketInstances.get(recipient);
                    if (agentConnection) {
                        try {
                            agentConnection.send(JSON.stringify({ text, sender, recipient, _id: messageDoc._id }));
                        } catch (sendError) {
                            console.log('Error sending message to agent:', sendError);
                        }
                    }
                } else {
                    [...wss.clients]
                        .filter(c => c.userId == recipient)
                        .forEach(c => {
                            console.log('Sending message to:', c.username);
                            try {
                                c.send(JSON.stringify({ text, sender, recipient, _id: messageDoc._id }));
                            } catch (sendError) {
                                console.log('Error sending message:', sendError);
                            }
                        });
                }
            }
        });

        const clientsArray = Array.from(wss.clients);
        clientsArray.forEach(client => {
            client.send(JSON.stringify(
                { online: clientsArray.map(c => ({ userId: c.userId, username: c.username })) }
            ));
        });

    } catch (err) {
        console.log(err);
    }
});



