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
const Message = require("../models/message")
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

        if (!AgentDoc) {
            return next(createError(400, "Agent Not Registered"))
        }

        if (!AgentDoc.status) {
            return next(createError(400, "Grant  Login Permission"))
        }

        if (AgentDoc) {
            const passok = bcrypt.compareSync(password, AgentDoc.password);
            if (passok) {
                jwt.sign({ email: AgentDoc.email, name: AgentDoc.name, id: AgentDoc._id }, jwtSecret, {}, (err, token) => {
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

        const requiredFields = [title, address, description, category, price, extraInfo, cancelInfo];
        if (requiredFields.some(field => !field)) {
            return next(createError(400, "All required fields must be filled."))
        }

        if (price < 0) {
            return next(createError(400, "Enter Valid Price"));
        }

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



exports.getallUsers = async (req, res, next) => {

    try {
        console.log(req.agentId, "req.agentId");
        const userDoc = await Message.find({ recipient: req.agentId }).populate({
            path: 'sender',
            model: 'User'
        }).sort({ createdAt: -1 })

        const senders = userDoc.map(message => ({
            userId: message.sender._id,
            username: message.sender.name
        }));

        res.status(200).json(senders);

    } catch (err) {
        next(err);
    }
};


exports.getuserMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agentId = req.agentId;

        const messageDoc = await Message.find({
            $or: [
                { sender: id, recipient: agentId },
                { sender: agentId, recipient: id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messageDoc);
    } catch (err) {
        next(err);
    }
};


exports.getParticularOrder = async (req, res, next) => {
    try {
        console.log(req.agentId);
        const placeDoc = await Place.find({ owner: req.agentId });
        console.log(placeDoc);
        const OrderDoc = await Order.find({ place: placeDoc[0]._id }).populate({
            path: 'place',
            model: 'Place',
        });
        console.log(OrderDoc);
        res.status(200).json(OrderDoc);
    } catch (err) {
        next(err);
    }
}


exports.getAgentDetails = async (req, res, next) => {
    try {
        console.log(req.userId)
        const agentDoc = await Agent.findById(req.agentId);
        res.status(200).json(agentDoc);
    } catch (err) {
        next(err);
    }
}


exports.updateAgent = async (req, res, next) => {
    try {
        const { name, email, number } = req.body;
        const agentDoc = await Agent.findByIdAndUpdate(req.agentId, { $set: { name: name, email: email, number: number } });
        res.status(200).json(agentDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.updateAgentPaaword = async (req, res, next) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;

        if (!oldpassword || !newpassword || !confirmpassword) {
            return next(createError(400, "All fields are required"));
        }

        if (newpassword !== confirmpassword) {
            return next(createError(400, "Password Doesnt Match"))
        }

        if (newpassword.length < 4 || newpassword.length > 10) {
            return next(createError(400, "Password should be between 4 and 10 characters"));
        }

        const userDoc = await Agent.findById(req.agentId);
        if (userDoc) {
            const passok = bcrypt.compareSync(oldpassword, userDoc.password);
            if (passok) {
                const userDocumts = await Agent.findByIdAndUpdate(req.agentId, { $set: { password: bcrypt.hashSync(newpassword, bcryptSalt) } });
                res.status(200).json(userDocumts)
            }
            else {
                return next(createError(400, "Incorrect Password"))
            }
        }

    } catch (err) {
        next(err);
    }
}