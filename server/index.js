const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken')
require('dotenv').config()
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

console.log((path.join(__dirname, '/static')))
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


app.listen(4000, console.log('running'));


