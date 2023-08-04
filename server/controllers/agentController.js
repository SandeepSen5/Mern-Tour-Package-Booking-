const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const download = require('image-downloader');
const jwtSecret = 'sakdfnsadklfnasdgsdfgsdgfg';
const path = require('path');

const Agent = require('../models/agent')
const Place = require('../models/place');

exports.agentRegister = async (req, res) => {
    const { name, email, number, password } = req.body;
    try {
        const AgentDoc = await Agent.create({
            name,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(AgentDoc);
    }
    catch (e) {
        res.status(422).json(e)
    }
}


exports.agentLogin = async (req, res) => {
    console.log("hai111")
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const AgentDoc = await Agent.findOne({ email })
    console.log(AgentDoc)
    if (AgentDoc) {
        const passok = bcrypt.compareSync(password, AgentDoc.password);
        console.log(passok)
        if (passok) {
            jwt.sign({ email: AgentDoc.email, id: AgentDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                console.log("done")
                res.cookie('token', token).json(AgentDoc)
            })
            console.log("ok");
        } else {
            res.status(422).json('paass not ok')
        }
    } else {
        res.json('not found');
    }
}

exports.agentProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
            if (err) throw err;
            console.log(agentData, 'aaa');
            const { name, email, _id } = await Agent.findById(agentData.id)
            res.json({ name, email, _id })
        })
    }
    else {
        res.json(null)
    }
}


exports.agentLogout = (req, res) => {
    res.cookie('token', '').json(true);
}

exports.agentuploadbyLink = async (req, res) => {
    const { Link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    const uploadsDir = path.resolve(__dirname, "../public/uploads", newName);
    await download.image({
        url: Link,
        dest: uploadsDir,
    }).then(({ filename }) => {
        console.log('Saved to', filename);
    }).catch((err) => console.error(err));
    res.json(newName)
}


exports.agentupload = async (req, res) => {
    const uploadedFile = [];
    console.log(req.files); // Here, you should see the uploaded files in the console
    for (let i = 0; i < req.files.length; i++) {
        const { filename } = req.files[i];
        uploadedFile.push(filename)
    }
    console.log(uploadedFile);
    return res.json(uploadedFile);
}

 
exports.agentAddplaces = async (req, res) => {
    console.log('hai');
    const { token } = req.cookies;
    const { title, address, addedPhotos,
        description, perks, price, extraInfo, cancelInfo } = req.body;
        console.log(title)
    jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
        if (err) throw err;
        console.log( agentData.id," owner: agentData.id,")
        const PlaceDoc = await Place.create({
            owner: agentData.id,
            title, address,photos:addedPhotos,
            description, perks, price, extraInfo, cancelInfo
        })
        console.log(PlaceDoc,"jsdjjfjhsdhh")
        res.json(PlaceDoc);
    })

}








