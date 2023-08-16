const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const User = require('../models/user');
const Place = require('../models/place');
const Booking = require('../models/booking');
const Category = require('../models/category')
const Order = require('../models/order');
const Review = require('../models/review')
const jwtSecret = 'nhdhdslalsjdbfhlaskhdfbfb';
const verifyToken = require('../middlewares/userMiddleware')
const createError = require('../utils/createError')
const Stripe = require("stripe");


exports.userRegister = async (req, res, next) => {
    try {
        const { name, email, number, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, "User already registered"))
        }
        const newUser = await User.create({
            name,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.status(200).json(newUser);
    } catch (err) {
        next(err);
    }
}



exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const UserDoc = await User.findOne({ email });
        if (!UserDoc.status) {
            return next(createError(400, "User Blocked"))
        }
        if (UserDoc) {
            const passok = bcrypt.compareSync(password, UserDoc.password);
            if (passok) {
                jwt.sign({ email: UserDoc.email, id: UserDoc._id }, jwtSecret, {}, (err, tokens) => {
                    if (err) throw err;
                    res.cookie('Usertoken', tokens).json(UserDoc)
                })
            }
            else {
                return next(createError(400, "IncorrectPassword"))
            }
        }
        else {
            return next(createError(404, "User Not Registered"))
        }
    }
    catch (err) {
        next(err);
    }
}


exports.getAllplaces = async (req, res, next) => {
    try {
        res.json(await Place.find());
    }
    catch (err) {
        next(err)
    }
}

exports.singlePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json(await Place.findById(id));
    }
    catch (err) {
        next(err)
    }
}

exports.bookPackage = async (req, res, next) => {
    try {
        const { bookin, guestno, name, email, phone, place, price } = req.body;
        const booking = await Booking.create({
            bookin, guestno, name, email, phone, place, price
        });
        res.status(200).json(booking);
    } catch (err) {
        next(err)
    }
}

exports.userLogout = async (req, res, next) => {
    try {
        res.cookie('Usertoken', '').json(true);
    }
    catch (err) {
        next(err)
    }
}

exports.createOrder = async (req, res, next) => {
    try {
        const stripe = new Stripe(process.env.STRIPE);
        const { id } = req.params;
        const bookingDoc = await Booking.findById(id);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (bookingDoc.price * bookingDoc.guestno) * 100,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        })

        const orderdoc = await Order.create({
            owner: req.userId,
            bookin: bookingDoc.bookin,
            guestno: bookingDoc.guestno,
            name: bookingDoc.name,
            email: bookingDoc.email,
            phone: bookingDoc.phone,
            place: bookingDoc.place,
            price: bookingDoc.price,
            total: bookingDoc.price * bookingDoc.guestno,
            payment_intent: paymentIntent.id,
        })
        res.status(200).send({ clientSecret: paymentIntent.client_secret })
    }
    catch (err) {
        next(err)
    }
}


exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findOneAndUpdate(
            { payment_intent: req.body.payment_intent },
            { $set: { orderstatus: 'Success', ordermethod: 'Stripe', deliverystatus: 'Pending' } },
            { new: true }
        );
        res.status(200).send(order);
    }
    catch (err) {
        next(err)
    }
}

exports.myBookings = async (req, res, next) => {
    try {
        console.log(req.userId);
        const allBookings = await Order.find({ owner: req.userId }).populate({
            path: 'place',
            model: 'Place',
        });
        console.log(allBookings);
        res.status(200).json(allBookings);
    }
    catch (err) {
        next(err)
    }
}

exports.getCategory = async (req, res, next) => {
    try {
        const categoryDoc = await Category.find({ status: true });
        res.json(categoryDoc);
    }
    catch (err) {
        next(err)
    }
}

exports.addReview = async (req, res, next) => {
    try {
        const { packageid, ownerid, reviewText } = req.body;
        const reviewDoc = await Review.create({
            owner: ownerid,
            place: packageid,
            desc: reviewText
        })
        res.status(200).json(reviewDoc)
    }
    catch (err) {
        next(err);
    }
}

exports.getIdreviews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewDoc = await Review.find({ place: id }).populate({
            path: 'owner',
            model: 'User'
        })
            .populate({
                path: 'place',
                model: 'Place'
            });;
        res.status(200).json(reviewDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.deleteReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id, "idddddddddd");
        await Review.findByIdAndDelete(id);
        res.status(200).json(true);
    }
    catch (err) {
        next(err);
    }
}