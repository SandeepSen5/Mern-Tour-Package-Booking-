const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const adminControllers = require('../controllers/adminController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + ".jpg");
    },
});


const upload = multer({ storage: storage });

router.post('/login', adminControllers.adminLogin)

router.get('/profile', adminControllers.adminProfile)

router.get('/users', adminControllers.allUsers)

router.patch('/blockuser', adminControllers.blockUser)

router.patch('/unblockuser', adminControllers.unblockUser);

router.get('/agents', adminControllers.allAgents)

router.patch('/blockagent', adminControllers.blockAgent)

router.patch('/unblockagent', adminControllers.unblockAgent);

router.post('/upload', upload.array('photos', 5), adminControllers.adminUpload);

router.post('/addcategory', adminControllers.addCategory)

router.put('/updatecategory', adminControllers.updateCategory)

router.get('/logout', adminControllers.adminLogout)

router.get('/getcategory', adminControllers.allCategory)

router.patch('/blockcategory', adminControllers.blockCategory)

router.patch('/unblockcategory', adminControllers.unblockCategory)

router.get('/categoryid',adminControllers.categoryId)

router.get('/categoryeditid',adminControllers.categoryEditid)

router.get('/allpackages', adminControllers.allPackages);

router.patch('/blockpackage', adminControllers.blockPackage)

router.patch('/unblockpackage', adminControllers.unblockPackage);

router.get('/allorders',adminControllers.allOrders)

module.exports = router;