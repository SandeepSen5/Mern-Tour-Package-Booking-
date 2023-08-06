const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin')
const User = require('../models/user')
const Agent = require('../models/agent')
const jwtSecret = 'dsfxcvpdgsnkadfgdfsgaisdngpiasdgj';

router.post('/login', async (req, res) => {
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
})

router.get('/profile', async (req, res) => {
    const { Admintoken } = req.cookies;
    if (Admintoken) {
        jwt.verify(Admintoken, jwtSecret, {}, async (err, AdminData) => {
            if (err) throw err;
            const { name, email, _id, status } = await Admin.findById(AdminData.id)
            res.json({ name, email, _id })
        })
    }
    else {
        res.json(null)
    }
})


router.get('/users', async (req, res) => {
    const userData = await User.find()
    res.json(userData);
})


router.patch('/blockuser', async (req, res) => {
    console.log("checkedin");
    const { email } = req.body;
    console.log(email, "sssssssssssssssss")
    await User.updateOne({ email: email }, { status: false });
    res.json({ sucesss: true });
})


router.patch('/unblockuser', async (req, res) => {
    try {
        const { email } = req.body;

        // Update the user's status to true
        await User.updateOne({ email: email }, { status: true });

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unblock user:", error);
        res.status(500).json({ error: "Failed to unblock user" });
    }
});


router.get('/agents', async (req, res) => {
    const agentData = await Agent.find()
    res.json(agentData);
})



router.patch('/blockagent', async (req, res) => {
    console.log("checkedin");
    const { email } = req.body;
    console.log(email, "sssssssssssssssss")
    await Agent.updateOne({ email: email }, { status: false });
    res.json({ sucesss: true });
})


router.patch('/unblockagent', async (req, res) => {
    try {
        const { email } = req.body;
        await Agent.updateOne({ email: email }, { status: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unblock user:", error);
        res.status(500).json({ error: "Failed to unblock user" });
    }
});


router.get('/logout', (req, res) => {
    res.cookie('Admintoken', '').json(true);
})


module.exports = router;