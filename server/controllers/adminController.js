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
const Order = require('../models/order');
const Review = require('../models/review');
const createError = require('../utils/createError');
require('dotenv').config();


exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const AdminDoc = await Admin.findOne({ email })
    if (AdminDoc) {
        const passok = bcrypt.compareSync(password, AdminDoc.password);
        console.log(passok)
        if (passok) {
            jwt.sign({ email: AdminDoc.email, name: AdminDoc.name, id: AdminDoc._id }, process.env.ADMIN_JWTSECRET, {}, (err, token) => {
                if (err) return next(createError(401, "Admin Credentials Incorrect"));
                res.cookie('Admintoken', token).json(AdminDoc)
            })
        } else {
            return next(createError(400, "IncorrectPassword"));
        }
    } else {
        return next(createError(404, "Incorrect UserId"))
    }
}

exports.allUsers = async (req, res, next) => {
    try {
        const userData = await User.find();
        res.status(200).json(userData);
    }
    catch (err) {
        next(err);
    }
}


exports.blockUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        await User.updateOne({ email: email }, { status: false });
        res.status(200).json({ sucesss: true });
    }
    catch (err) {
        next(err);
    }

}


exports.unblockUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        await User.updateOne({ email: email }, { status: true });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

exports.allAgents = async (req, res, next) => {
    try {
        const agentData = await Agent.find()
        res.json(agentData);
    }
    catch (err) {
        next(err);
    }
}


exports.blockAgent = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email, "sssssssssssssssss")
        await Agent.updateOne({ email: email }, { status: false });
        res.json({ sucesss: true });
    }
    catch (err) {
        next(err);
    }
}

exports.unblockAgent = async (req, res, next) => {
    try {
        const { email } = req.body;
        await Agent.updateOne({ email: email }, { status: true });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}


exports.adminLogout = async (req, res, next) => {
    try {
        res.cookie('Admintoken', '').json(true);
    }
    catch (err) {
        next(err);
    }

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


exports.addCategory = async (req, res, next) => {
    try {
        const { title, addedPhotos, description,
        } = req.body;
        const categoryDoc = await Category.create({
            title, photos: addedPhotos,
            description,
        })
        console.log(categoryDoc, "jsdjjfjhsdhh")
        res.json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const { title, addedPhotos, description, id
        } = req.body;
        const categoryDoc = await Category.findByIdAndUpdate(id, { $set: { title, photos: addedPhotos, description } }, { new: true })
        console.log(categoryDoc, "jsdjjfjhsdhh")
        res.json(categoryDoc);
    } catch (err) {
        next(err);
    }
}


exports.allCategory = async (req, res, next) => {
    try {
        const categoryDoc = await Category.find();
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.blockCategory = async (req, res, next) => {
    const { title } = req.body;
    try {
        await Category.findOneAndUpdate({ title: title }, { status: false })
        res.status(200).json({ success: true });
    }
    catch (err) {
        next(err);
    }
}


exports.unblockCategory = async (req, res, next) => {
    try {
        const { title } = req.body
        await Category.findOneAndUpdate({ title: title }, { status: true })
        res.status(200).json({ success: true })
    }
    catch (err) {
        next(err);
    }
}


exports.categoryId = async (req, res, next) => {
    try {
        const { title } = req.query;
        console.log(title, "aaaaaaaa")
        const categoryDoc = await Category.findOne({ title: title });
        console.log(categoryDoc, "aaaaaaaaaaaaa")
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.categoryEditid = async (req, res, next) => {
    try {
        const { id } = req.query;
        console.log(id, "aaaaaaaa")
        const categoryDoc = await Category.findById(id);
        console.log(categoryDoc, "aaaaaaaaaaaaa")
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.allPackages = async (req, res, next) => {
    try {
        const packageDoc = await Place.find();
        res.status(200).json(packageDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.blockPackage = async (req, res, next) => {
    try {
        console.log("checkedin");
        const { title } = req.body;
        console.log(title, "sssssssssssssssss")
        await Place.updateOne({ title: title }, { status: false });
        res.json({ sucesss: true });
    }
    catch (err) {
        next(err);
    }

}

exports.unblockPackage = async (req, res, next) => {
    try {
        const { title } = req.body;
        await Place.updateOne({ title: title }, { status: true });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

exports.allOrders = async (req, res, next) => {
    try {
        const allBookings = await Order.find().populate({
            path: 'place',
            model: 'Place',
        });
        res.status(200).json(allBookings)
    }
    catch (err) {
        next(err);
    }
}


exports.bookingStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;
        console.log(id, status);
        const orderDoc = await Order.findByIdAndUpdate(id, {
            $set: {
                deliverystatus: status
            }
        })
        res.status(200).json(orderDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.getAllreviews = async (req, res, next) => {
    try {
        const allReviews = await Review.find().populate({
            path: 'owner',
            model: 'User',
        })
            .populate({
                path: 'place',
                model: 'Place',
            });
        res.status(200).json(allReviews);
    }
    catch (err) {
        next(err);
    }
}


exports.blockReview = async (req, res, next) => {
    try {
        const { keyid } = req.body;
        await Review.findByIdAndUpdate(keyid, { status: false });
        res.status(200).json({ sucesss: true });
    }
    catch (err) {
        next(err);
    }
}


exports.unblockReview = async (req, res, next) => {
    try {
        const { keyid } = req.body;
        await Review.findByIdAndUpdate(keyid, { status: true });
        res.status(200).json({ sucesss: true });
    } catch (err) {
        next(err);
    }
}


