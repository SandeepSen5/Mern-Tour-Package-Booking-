const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const download = require('image-downloader');
const jwtSecret = 'sakdfnsadklfnasdgsdfgsdgfg';


const Agent = require('../models/agent')
const Place = require('../models/place');

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

router.get('/profile', agentControllers.agentProfile)

router.get('/logout', agentControllers.agentLogout)

router.post('/uploadbyLink', agentControllers.agentuploadbyLink)

router.post('/upload', upload.array('photos', 5), agentControllers.agentupload);

router.post('/addplaces', agentControllers.agentAddplaces)  // add package

router.put('/updateplaces', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address,
        addedPhotos, description,
        perks, price, extraInfo, cancelInfo
    } = req.body;

    console.log(title, id,
        perks, price)
    jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
        if (err) throw err;
        const updatePlaceDoc = {
            owner: agentData.id,
            title, address, photos: addedPhotos,
            description, perks, price, extraInfo, cancelInfo
        }
        const PlaceDoc = await Place.findByIdAndUpdate(
            id, updatePlaceDoc, { new: true }
        )
        res.json(PlaceDoc);
    })
})


router.get('/places', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, agentData) => {
        if (err) throw err;
        const { id } = agentData;
        const places = await Place.find();
        res.json(places);
    })
})


router.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id))
})






module.exports = router;



