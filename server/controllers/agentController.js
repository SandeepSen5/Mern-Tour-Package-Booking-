const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const download = require('image-downloader');
const jwtSecret = 'sakdfnsadklfnasdgsdfgsdgfg';
const path = require('path');
const createError = require('../utils/createError');
const Agent = require('../models/agent');
const Place = require('../models/place');
const Category = require('../models/category');
const Order = require('../models/order');
const User = require('../models/user');

exports.agentRegister = async (req, res, next) => {
    try {
        const { name, email, number, password } = req.body;
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return next(createError(400, "Agent already registered"))
        }
        const AgentDoc = await Agent.create({
            name,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.status(200).json(AgentDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.agentLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const AgentDoc = await Agent.findOne({ email });
        if (!AgentDoc.status) {
            return next(createError(400, "Agent Blocked"))
        }
        if (AgentDoc) {
            const passok = bcrypt.compareSync(password, AgentDoc.password);
            if (passok) {
                jwt.sign({ email: AgentDoc.email, id: AgentDoc._id }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(AgentDoc);
                })
            } else {
                return next(createError(400, "Incorrect Password"))
            }
        } else {
            return next(createError(404, "Agent Not Registered"))
        }
    }
    catch (err) {
        next(err);
    }
}

exports.agentLogout = (req, res, next) => {
    try {
        res.cookie('token', '').json(true);
    }
    catch (err) {
        next(err);
    }

}


exports.agentuploadbyLink = async (req, res, next) => {
    try {
        const { Link } = req.body;
        const newName = 'photo' + Date.now() + '.jpg';
        const uploadsDir = path.resolve(__dirname, "../public/uploads", newName);
        await download.image({
            url: Link,
            dest: uploadsDir,
        }).then(({ filename }) => {
            console.log('Saved to', filename);
        }).catch((err) => console.error(err));
        res.status(200).json(newName)
    }
    catch (err) {
        next(err);
    }
}


exports.agentupload = async (req, res, next) => {
    try {
        const uploadedFile = [];
        for (let i = 0; i < req.files.length; i++) {
            const { filename } = req.files[i];
            uploadedFile.push(filename)
        }
        return res.json(uploadedFile);
    }
    catch (err) {
        next(err);
    }
}


exports.agentAddplaces = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const { title, address, addedPhotos,
            description, perks, category, price, extraInfo, cancelInfo } = req.body;
        jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
            if (err) throw err;
            const PlaceDoc = await Place.create({
                owner: agentData.id,
                title, address, photos: addedPhotos,
                description, perks, category, price, extraInfo, cancelInfo
            })
            res.status(200).json(PlaceDoc);
        })
    }
    catch (err) {
        next(err);
    }
}


exports.updatePlace = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const {
            id, title, address,
            addedPhotos, description,
            perks, category, price, extraInfo, cancelInfo
        } = req.body;
        jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
            if (err) throw err;
            const updatePlaceDoc = {
                owner: agentData.id,
                title, address, photos: addedPhotos,
                description, perks, category, price, extraInfo, cancelInfo
            }
            const PlaceDoc = await Place.findByIdAndUpdate(
                id, updatePlaceDoc, { new: true }
            )
            res.status(200).json(PlaceDoc);
        })
    }
    catch (err) {
        next(err);
    }
}


exports.allPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();
        res.json(places);
    }
    catch (err) {
        next(err);
    }
}


exports.singlePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json(await Place.findById(id))
    }
    catch (err) {
        next(err);
    }
}


exports.allCategory = async (req, res, next) => {
    try {
        const catDoc = await Category.find()
        res.status(200).json(catDoc);
    }
    catch (err) {
        console.log(err)
    }
}


exports.allBookings = async (req, res) => {
    try {
        const allBookings = await Order.find().populate({
            path: 'place',
            model: 'Place',
        });
        res.status(200).json(allBookings);
    }
    catch (err) {
        next(err)
    }
}





