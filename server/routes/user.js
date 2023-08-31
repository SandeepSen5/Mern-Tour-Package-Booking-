const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const verifyToken = require('../middlewares/userMiddleware')
const userController = require("../controllers/userController");


router.post('/register', userController.userRegister);

router.post('/googleregister', userController.googleRegister);

router.post('/login', userController.userLogin)

router.get('/places', userController.getAllplaces)

router.get('/place/:id', userController.singlePlace)

router.post('/bookings', userController.bookPackage)

router.get('/bookingdetails/:id', userController.getBookingdetails)

router.get('/logout', userController.userLogout)

router.post('/create-payment-intent/:id', verifyToken, userController.createOrder)

router.put('/order', userController.updateOrder)

router.post('/codorder/:id', verifyToken, userController.updateCodOrder)

router.get('/mybookings', verifyToken, userController.myBookings)

router.get('/allcategory', userController.getCategory)

router.post('/addreview', userController.addReview)

router.post('/cancelbooking', verifyToken, userController.cancelBooking)

router.get('/allreviews/:id', userController.getIdreviews)

router.delete('/deletecatid/:id', userController.deleteReview)

router.get('/getmessages/:id', verifyToken, userController.getuserMessages)

router.get('/getall', userController.getallAgents)

router.get('/categoryselected/:id', userController.selectedCategory)

router.get('/getuserdetails', verifyToken, userController.getUserDetails)

router.post('/updateuser', verifyToken, userController.updateUser)

router.post('/updatepassword', verifyToken, userController.updateUserPaaword)

router.get('/getslots/:id', userController.getSlots)

router.get('/getwallet', verifyToken, userController.getWalletBalance)

module.exports = router;

