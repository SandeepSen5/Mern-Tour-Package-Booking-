const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const moment = require('moment');
const User = require('../models/user');
const Agent = require('../models/agent')
const Place = require('../models/place');
const Booking = require('../models/booking');
const Category = require('../models/category')
const Order = require('../models/order');
const Review = require('../models/review');
const Message = require('../models/message');
const Slot = require('../models/slot');
const jwtSecret = 'nhdhdslalsjdbfhlaskhdfbfb';
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

exports.googleRegister = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        console.log(name, email);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            jwt.sign({ email: existingUser.email, name: existingUser.name, id: existingUser._id }, jwtSecret, {}, (err, tokens) => {
                if (err) throw err;
                res.cookie('Usertoken', tokens).json(existingUser)
            })
        } else {
            const UserDoc = await User.create({
                name,
                email,
            });

            if (UserDoc) {
                jwt.sign({ email: UserDoc.email, name: UserDoc.name, id: UserDoc._id }, jwtSecret, {}, (err, tokens) => {
                    if (err) throw err;
                    res.cookie('Usertoken', tokens).json(UserDoc)
                })
            }
            else {
                return next(createError(400, "Error with GoogleSignIn"))
            }
        }
    }
    catch (err) {
        next(err);
    }
}


exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const UserDoc = await User.findOne({ email });

        if (!UserDoc) {
            return next(createError(400, "User Not Registered"));
        }

        if (!UserDoc.status) {
            return next(createError(400, "User Blocked"))
        }

        if (UserDoc) {
            const passok = bcrypt.compareSync(password, UserDoc.password);
            if (passok) {
                jwt.sign({ email: UserDoc.email, name: UserDoc.name, id: UserDoc._id }, jwtSecret, {}, (err, tokens) => {
                    if (err) throw err;
                    res.cookie('Usertoken', tokens).json(UserDoc)
                })
            }
            else {
                return next(createError(400, "IncorrectPassword"))
            }
        }
        else {
            return next(createError(400, "User Not Registered"))
        }
    }
    catch (err) {
        next(err);
    }
}


exports.getAllplaces = async (req, res, next) => {
    try {
        res.json(await Place.find({ status: true }));
    }
    catch (err) {
        next(err)
    }
}

exports.singlePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json(await Place.findById(id).populate({
            path: 'owner',
            model: 'Agent',
        }));
    }
    catch (err) {
        next(err)
    }
}


exports.bookPackage = async (req, res, next) => {
    try {

        const { bookin, guestno, name, email, phone, place, price } = req.body;

        const slotDoc = await Slot.find({ place: place, bookin: bookin });
        if (slotDoc) {
            if ((slotDoc[0]?.count + parseInt(guestno)) > 20) {
                const no = 20 - slotDoc[0].count
                return next(createError(400, `Group of ${no} persons available for this date `));
            }
        }

        const bookinDate = new Date(bookin);
        const bookinoutDate = new Date(bookinDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        console.log(bookinDate, "bookinDate");
        console.log(bookinoutDate, "bookinoutDate");

        const existingBooking = await Slot.findOne({
            place: place,
            bookin: { $lt: bookin },
            bookout: { $gte: bookin }
        });

        if (existingBooking) {
            return next(createError(400, "Slot is already filled for the selected date range"));
        }

        const selectedDate = moment(bookin);
        const minDate = moment().add(14, 'days');
        if (selectedDate.isBefore(minDate)) {
            return next(createError(400, "Booking date must be at least 14 days from now"))
        }
        if (guestno < 1) {
            return next(createError(400, "Min 1 Guest"))
        }
        const booking = await Booking.create({
            bookin, guestno, name, email, phone, place, price
        });
        res.status(200).json(booking);
    } catch (err) {
        next(err)
    }
}

exports.getBookingdetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        const bookingDoc = await Booking.findById(id);
        console.log(bookingDoc);
        res.status(200).json(bookingDoc);
    }
    catch (err) {
        next(err);
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

        const bookinDate = new Date(bookingDoc.bookin);
        const bookinoutDate = new Date(bookinDate.getTime() + 2 * 24 * 60 * 60 * 1000);

        // Format the bookinoutDate to "yyyy-MM-dd"
        const formattedBookinoutDate = bookingDoc.bookin.toISOString().split('T')[0];
        const no = parseInt(bookingDoc.guestno);
        console.log(formattedBookinoutDate, "formattedBookinoutDate")
        console.log(bookingDoc.place, "bookingDoc.place ")
        const slotDetails = await Slot.find({ place: bookingDoc.place, bookin: formattedBookinoutDate })
        console.log(slotDetails, "slotDetails")
        if (slotDetails.length > 0) {
            await Slot.findOneAndUpdate({ place: bookingDoc.place, bookin: formattedBookinoutDate }, { $inc: { count: no } });
        }
        else {
            const slotDoc = await Slot.create({
                user: req.userId,
                count: bookingDoc.guestno,
                bookin: bookingDoc.bookin,
                bookout: bookinoutDate,
                place: bookingDoc.place,
            });

        }

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


exports.updateCodOrder = async (req, res, next) => {
    try {
        console.log("lll");
        const { id } = req.params;
        const bookingDoc = await Booking.findById(id);
        const userDoc = await User.findById(req.userId);
        const bookinDate = new Date(bookingDoc.bookin);
        const bookinoutDate = new Date(bookinDate.getTime() + 2 * 24 * 60 * 60 * 1000);

        // Format the bookinoutDate to "yyyy-MM-dd"
        const formattedBookinoutDate = bookingDoc.bookin.toISOString().split('T')[0];
        const no = parseInt(bookingDoc.guestno);
        const bookingprice = parseInt(bookingDoc.price);
        const amt = no * bookingprice;
        console.log(formattedBookinoutDate, "formattedBookinoutDate")
        console.log(bookingDoc.place, "bookingDoc.place ")
        const slotDetails = await Slot.find({ place: bookingDoc.place, bookin: formattedBookinoutDate })
        console.log(slotDetails, "slotDetails");

        if ((bookingDoc.price * bookingDoc.guestno) > userDoc.wallet) {
            return next(createError(400, "Insuffiecient Wallet Balance"));
        }

        if (slotDetails.length > 0) {
            await Slot.findOneAndUpdate({ place: bookingDoc.place, bookin: formattedBookinoutDate }, { $inc: { count: no } });
        }
        else {
            const slotDoc = await Slot.create({
                user: req.userId,
                count: bookingDoc.guestno,
                bookin: bookingDoc.bookin,
                bookout: bookinoutDate,
                place: bookingDoc.place,
            });
        }

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
            orderstatus: 'Success',
            ordermethod: 'Wallet',
            deliverystatus: 'Pending'
        })
        await User.findByIdAndUpdate(req.userId, { $inc: { wallet: -amt } });
        res.status(200).json(true);
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


exports.cancelBooking = async (req, res, next) => {
    try {
        const { bookingid, cancelText } = req.body;
        const order = await Order.findById(bookingid);

        const amt = parseInt(order.total)
        console.log(amt, "amt");
        const currentDate = new Date();
        const bookingDate = order.bookin;
        const daysBeforeBooking = Math.floor((bookingDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysBeforeBooking <= 14) {
            return next(createError(400, "Should Cancel 14 days before the booking date"))
        }

        const orderDeatials = await Order.findById(bookingid);
        const no = parseInt(orderDeatials.guestno);

        await Slot.findOneAndUpdate({ place: orderDeatials.place }, { $inc: { count: - no } });

        const orderDoc = await Order.findByIdAndUpdate(bookingid, { $set: { deliverystatus: 'Cancelled', reason: cancelText } });
        const user = await User.findByIdAndUpdate(req.userId, { $inc: { wallet: amt } }, { new: true });

        if (!user) {
            return next(createError(500, "Failed to update user's wallet"));
        }
        console.log(user, "user");
        res.status(200).json(orderDoc);
    } catch (err) {
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


exports.getuserMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const messageDoc = await Message.find({
            $or: [
                { sender: id, recipient: userId },
                { sender: userId, recipient: id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messageDoc);
    } catch (err) {
        next(err);
    }
};


exports.getallAgents = async (req, res, next) => {
    try {
        const agentsDoc = await Agent.aggregate([
            { $project: { userId: '$_id', username: '$name', _id: 0 } }
        ]);

        res.status(200).json(agentsDoc);
    } catch (err) {
        next(err);
    }
};


exports.selectedCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id, "iddddddddddddddddd");
        const categoryDoc = await Place.find({ category: id });
        res.status(200).json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.getUserDetails = async (req, res, next) => {
    try {
        console.log(req.userId)
        const userDoc = await User.findById(req.userId);
        res.status(200).json(userDoc);
    } catch (err) {
        next(err);
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, number } = req.body;
        const userDoc = await User.findByIdAndUpdate(req.userId, { $set: { name: name, email: email, number: number } });
        res.status(200).json(userDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.updateUserPaaword = async (req, res, next) => {
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

        const userDoc = await User.findById(req.userId);
        if (userDoc) {
            const passok = bcrypt.compareSync(oldpassword, userDoc.password);
            if (passok) {
                const userDocumts = await User.findByIdAndUpdate(req.userId, { $set: { password: bcrypt.hashSync(newpassword, bcryptSalt) } });
                res.status(200).json(userDocumts)
            }
            else {
                return next(createError(400, "IncorrectPassword"))
            }
        }
        else {
            return next(createError(400, "User Not Registered"))
        }

    } catch (err) {
        next(err);
    }
}


exports.getSlots = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const slotDoc = await Slot.find({ place: id });
        res.status(200).json(slotDoc);
    } catch (err) {
        next(err);
    }
}

exports.getWalletBalance = async (req, res, next) => {
    try {
        const userDoc = await User.findById(req.userId);
        res.status(200).json(userDoc)
    }
    catch (err) {
        next(err);
    }
}
