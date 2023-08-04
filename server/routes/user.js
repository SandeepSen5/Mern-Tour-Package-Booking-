const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const User = require('../models/user')
const Place = require('../models/place')
const jwtSecret = 'nhdhdslalsjdbfhlaskhdfbfb';

router.post('/register', async (req, res) => {
    const { name, email, number, password } = req.body;
    try {
        const UserDoc = await User.create({
            name,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(UserDoc);
    } catch (e) {
        res.status(422).json(e)
    }
})

module.exports = router;


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const UserDoc = await User.findOne({ email })
    if (UserDoc) {
        const passok = bcrypt.compareSync(password, UserDoc.password);
        if (passok) {
            jwt.sign({ email: UserDoc.email, id: UserDoc._id }, jwtSecret, {}, (err, tokens) => {
                if (err) throw err;
                res.cookie('Usertoken', tokens).json(UserDoc)
            })
        }
        else {
            res.status(422).json('paass not ok')
        }
    }
    else {
        res.json('not found');
    }
})

router.get('/profile', async (req, res) => {
    console.log('hai')
    const { Usertoken } = req.cookies;
    if (Usertoken) {
        jwt.verify(Usertoken, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            console.log(userData, 'userDataaaa');
            const { name, email, _id } = await User.findById(userData.id)
            res.json({ name, email, _id })
        })
    }
    else {
        res.json(null)
    }
})


router.get('/places', async (req, res) => {
    console.log("hai");
    res.json(await Place.find());
})





