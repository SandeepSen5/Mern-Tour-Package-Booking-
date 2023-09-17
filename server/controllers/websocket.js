const ws = require('ws');
const path = require('path');
const jwt = require('jsonwebtoken');
const Agent = require("../models/agent");
const Message = require('../models/message');
const fs = require('fs');

const createWebSocketServer = (server) => {

    const wss = new ws.WebSocketServer({ server });
    const agentWebSocketInstances = new Map();

    wss.on('connection', async (connection, req) => {
        try {

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
                            connection.userType = 'User';
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
                const { recipient, text, sender, file } = messageData;
                let filename = null;
                if (file) {
                    const ext = file.name.split('.').pop().toLowerCase(); // Get the file extension
                    filename = Date.now() + "." + ext;

                    const path1 = path.resolve(__dirname, "../public/uploads", filename);
                    const bufferData = Buffer.from(file.data.replace(/^data:[^;]+;base64,/, ''), 'base64');

                    fs.writeFile(path1, bufferData, (err) => {
                        if (err) {
                            console.error("Error uploading file:", err);
                        } else {
                            console.log("File uploaded successfully");
                        }
                    });


                    console.log(path1, "path123123123");
                    console.log({ file });
                }
                if (recipient && (text || file) && sender) {
                    const messageDoc = await Message.create({
                        sender,
                        recipient,
                        text,
                        file: file ? filename : null,
                    });

                    if (agentWebSocketInstances.has(recipient)) {
                        const agentConnection = agentWebSocketInstances.get(recipient);
                        if (agentConnection && agentConnection.userType !== 'User') {
                            try {
                                console.log(agentWebSocketInstances, "agentWebSocketInstances")
                                console.log(recipient, "recipient recipient");
                                console.log(agentWebSocketInstances.has(recipient), "agentWebSocketInstances.has(recipient)");
                                console.log(filename, "filenamefilenamefilename");
                                console.log(agentWebSocketInstances.get(recipient), "filefilename");
                                agentConnection.send(JSON.stringify({ text, sender, recipient, _id: messageDoc._id, file: file ? filename : null }));
                            } catch (sendError) {
                                console.log('Error sending message to agent:', sendError);
                            }
                        }
                    } else {
                        console.log("wrong");
                        [...wss.clients]
                            .filter(c => c.userId == recipient)
                            .forEach(c => {
                                console.log('Sending message to:', c.username);
                                try {
                                    c.send(JSON.stringify({ text, sender, recipient, _id: messageDoc._id, file: file ? filename : null, }));
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
};

module.exports = createWebSocketServer;
