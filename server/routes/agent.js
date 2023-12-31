const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const verifyToken = require("../middlewares/agentMiddleware")
const agentControllers = require('../controllers/agentController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + ".jpg");
    },
});

const upload = multer({ storage: storage });

router.post('/register', agentControllers.agentRegister)

router.post('/login', agentControllers.agentLogin)

router.get('/logout', agentControllers.agentLogout)

router.post('/uploadbyLink', agentControllers.agentuploadbyLink)

router.post('/upload', upload.array('photos', 5), agentControllers.agentupload);

router.post('/addplaces', agentControllers.agentAddplaces)  // add package

router.put('/updateplaces', agentControllers.updatePlace)

router.get('/places', agentControllers.allPlaces)

router.get('/places/:id', agentControllers.singlePlace)

router.get('/allcategory', agentControllers.allCategory)

router.get('/userbookings', agentControllers.allBookings)

router.get('/getallusers', verifyToken, agentControllers.getallUsers)

router.get('/getmessages/:id', verifyToken, agentControllers.getuserMessages)

router.get('/getagentorders', verifyToken, agentControllers.getParticularOrder)

router.get('/getagentdetails', verifyToken, agentControllers.getAgentDetails)

router.post('/updateuser', verifyToken, agentControllers.updateAgent)

router.post('/updatepassword', verifyToken, agentControllers.updateAgentPaaword)

module.exports = router;



