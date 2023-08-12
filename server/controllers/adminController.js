const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const Agent = require('../models/agent');
const Category = require('../models/category');
const Place = require('../models/place');
const Order = require('../models/order')
const jwtSecret = 'dsfxcvpdgsnkadfgdfsgaisdngpiasdgj';


exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const AdminDoc = await Admin.findOne({ email })
    console.log(AdminDoc)
    if (AdminDoc) {
        const passok = bcrypt.compareSync(password, AdminDoc.password);
        console.log(passok)
        if (passok) {
            jwt.sign({ email: AdminDoc.email, name: AdminDoc.name, id: AdminDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                console.log("done")
                res.cookie('Admintoken', token).json(AdminDoc)
            })
            console.log("ok");
        } else {
            res.status(422).json('paass not ok')
        }
    } else {
        res.status(422).json('not found');
    }
}


exports.adminProfile = async (req, res) => {
    const { Admintoken } = req.cookies;
    if (Admintoken) {
        jwt.verify(Admintoken, jwtSecret, {}, async (err, AdminData) => {
            if (err) throw err;
            const { name, email, _id, status } = await Admin.findById(AdminData.id);
            res.json({ name, email, _id })
        })
    }
    else {
        res.json(null)
    }
}


exports.allUsers = async (req, res) => {
    const userData = await User.find()
    res.json(userData);
}


exports.blockUser = async (req, res) => {
    console.log("checkedin");
    const { email } = req.body;
    console.log(email, "sssssssssssssssss")
    await User.updateOne({ email: email }, { status: false });
    res.json({ sucesss: true });
}


exports.unblockUser = async (req, res) => {
    try {
        const { email } = req.body;
        // Update the user's status to true
        await User.updateOne({ email: email }, { status: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unblock user:", error);
        res.status(500).json({ error: "Failed to unblock user" });
    }
}

exports.allAgents = async (req, res) => {
    const agentData = await Agent.find()
    res.json(agentData);
}


exports.blockAgent = async (req, res) => {
    console.log("checkedin");
    const { email } = req.body;
    console.log(email, "sssssssssssssssss")
    await Agent.updateOne({ email: email }, { status: false });
    res.json({ sucesss: true });
}


exports.unblockAgent = async (req, res) => {
    try {
        const { email } = req.body;
        await Agent.updateOne({ email: email }, { status: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unblock user:", error);
        res.status(500).json({ error: "Failed to unblock user" });
    }
}


exports.adminLogout = (req, res) => {
    res.cookie('Admintoken', '').json(true);
}


exports.adminUpload = async (req, res) => {
    const uploadedFile = [];
    console.log(req.files); // Here, you should see the uploaded files in the console
    for (let i = 0; i < req.files.length; i++) {
        const { filename } = req.files[i];
        uploadedFile.push(filename)
    }
    console.log(uploadedFile);
    return res.json(uploadedFile);
}


exports.addCategory = async (req, res) => {
    const { title, addedPhotos, description,
    } = req.body;
    const categoryDoc = await Category.create({
        title, photos: addedPhotos,
        description,
    })
    console.log(categoryDoc, "jsdjjfjhsdhh")
    res.json(categoryDoc);
}

exports.updateCategory = async (req, res) => {
    try {
        const { title, addedPhotos, description, id
        } = req.body;
        const categoryDoc = await Category.findByIdAndUpdate(id, { $set: { title, photos: addedPhotos, description } }, { new: true })
        console.log(categoryDoc, "jsdjjfjhsdhh")
        res.json(categoryDoc);
    } catch (error) {
        console.log(error);
    }
}


exports.allCategory = async (req, res) => {
    const categoryDoc = await Category.find();
    res.json(categoryDoc);
}


exports.blockCategory = async (req, res) => {
    const { title } = req.body;
    try {
        await Category.findOneAndUpdate({ title: title }, { status: false })
        res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.unblockCategory = async (req, res) => {
    try {
        const { title } = req.body
        await Category.findOneAndUpdate({ title: title }, { status: true })
        res.status(200).json({ success: true })
    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.categoryId = async (req, res) => {
    try {
        const { title } = req.query;
        console.log(title, "aaaaaaaa")
        const categoryDoc = await Category.findOne({ title: title });
        console.log(categoryDoc, "aaaaaaaaaaaaa")
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.categoryEditid = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id, "aaaaaaaa")
        const categoryDoc = await Category.findById(id);
        console.log(categoryDoc, "aaaaaaaaaaaaa")
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.allPackages = async (req, res) => {
    try {
        const packageDoc = await Place.find();
        res.status(200).json(packageDoc);
    }
    catch (error) {
        console.log('error')
    }
}


exports.blockPackage = async (req, res) => {
    console.log("checkedin");
    const { title } = req.body;
    console.log(title, "sssssssssssssssss")
    await Place.updateOne({ title: title }, { status: false });
    res.json({ sucesss: true });
}


exports.unblockPackage = async (req, res) => {
    try {
        const { title } = req.body;
        await Place.updateOne({ title: title }, { status: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unblock user:", error);
        res.status(500).json({ error: "Failed to unblock user" });
    }
}


exports.allOrders = async (req, res) => {
    try {
        const allBookings = await Order.find().populate({
            path: 'place',
            model: 'Place',
        });
        res.status(200).json(allBookings)
    }
    catch (error) {
        console.log(error);
    }
}