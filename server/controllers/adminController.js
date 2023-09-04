const express = require('express');
const router = express.Router();
const moment = require('moment');
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
const Slot = require('../models/slot');
const createError = require('../utils/createError');
require('dotenv').config();


exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const AdminDoc = await Admin.findOne({ email });

    if (!AdminDoc) {
        return next(createError(404, "Enter Valid Credential"))
    }

    if (AdminDoc) {
        const passok = bcrypt.compareSync(password, AdminDoc.password);
        console.log(passok)
        if (passok) {
            jwt.sign({ email: AdminDoc.email, name: AdminDoc.name, id: AdminDoc._id }, process.env.ADMIN_JWTSECRET, {}, (err, token) => {
                if (err) return next(createError(401, "Admin Credentials Incorrect"));
                res.cookie('Admintoken', token).json(AdminDoc)
            })
        } else {
            return next(createError(400, "Incorrect Password"));
        }
    } else {
        return next(createError(404, "Enter Credential"))
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
        const requiredFields = [title, description];

        if (requiredFields.some(field => !field)) {
            return next(createError(400, "All required fields must be filled."))
        }

        if (addedPhotos.length < 0) {
            return next(createError(400, "Add Photo"))
        }

        const categoryDoc = await Category.create({
            title, photos: addedPhotos,
            description,
        })

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
        const orderDeatials = await Order.findById(id);
        const amt = parseInt(orderDeatials.total);
        const no = parseInt(orderDeatials.guestno);
        const userID = orderDeatials.owner.toString();
        const formattedBookinoutDate = orderDeatials.bookin.toISOString().split('T')[0];

        if (status == 'Pending') {
            const slotDoc = await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: + no } });
            console.log(slotDoc, "const slotDoc=const slotDoc=const slotDoc=");
        }

        if (status == 'Cancelled') {
            const slotDoc = await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: - no } });
            console.log(slotDoc, "const slotDoc=const slotDoc=const slotDoc=");
            const user = await User.findByIdAndUpdate(userID, { $inc: { wallet: amt } }, { new: true });
            console.log(user, orderDeatials.owner, "haiiiii");
        }

        if (status == 'Success') {
            const slotDoc = await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: - no } });
            console.log(slotDoc, "const slotDoc=const slotDoc=const slotDoc=");
        }

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


exports.getCounts = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json(userCount);
    } catch (err) {
        next(err);
    }
};


exports.getAgents = async (req, res, next) => {
    try {
        const agentCount = await Agent.countDocuments();
        res.status(200).json(agentCount);
    } catch (err) {
        next(err);
    }
};


exports.getOrdercount = async (req, res, next) => {
    try {
        const successOrPendingOrderCount = await Order.countDocuments({
            $or: [{ deliverystatus: 'Success' }, { deliverystatus: 'Pending' }, { deliverystatus: 'Cancelled' }]
        });
        res.status(200).json(successOrPendingOrderCount);
    }
    catch (err) {
        next(err);
    }
}


exports.getEarnings = async (req, res, next) => {
    try {
        const pipeline = [
            // {
            //     $match: {
            //         deliverystatus: { $ne: "Cancelled" }
            //     }
            // },
            {
                $group: {
                    _id: null,
                    totalSum: { $sum: "$total" }
                }
            }
        ];

        const result = await Order.aggregate(pipeline);

        if (result.length > 0) {
            const totalSum = result[0].totalSum;
            res.status(200).json(totalSum);
        } else {
            res.status(200).json({ totalSum: 0 });
        }
    } catch (err) {
        next(err);
    }
};


exports.getPieDeatails = async (req, res, next) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$deliverystatus",
                    count: { $sum: 1 }
                }
            }
        ];
        const statusCounts = await Order.aggregate(pipeline);

        const formattedResult = statusCounts.map(status => ({
            name: status._id,
            value: status.count
        }));

        if (statusCounts) {
            res.status(200).json(formattedResult);
        }
    }
    catch (err) {
        next(err);
    }
}



exports.getSalesReport = async (req, res, next) => {

    try {

        const orders = await Order.find();

        function getMonthFromDate(date) {
            const parsedDate = new Date(date);
            return parsedDate.getMonth();
        }

        const monthlySales = Array.from({ length: 12 }, (_, monthIndex) => {
            return {
                // name: moment().month(monthIndex).format('MMMM'),
                name: moment().month(monthIndex).format('MMM'),
                value: 0,
            };
        });


        orders.forEach(order => {
            const monthIndex = getMonthFromDate(order.createdAt);
            monthlySales[monthIndex].value += order.total;
        });

        res.json(monthlySales);
    } catch (err) {
        next(err);
    }
};






