const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');

const verifyToken = async (req, res, next) => {
    const { Usertoken } = req.cookies;
    if (!Usertoken) return next(createError(401, "User Not Registered"));
    jwt.verify(Usertoken, process.env.USER_JWTSECRET, {}, async (err, userData) => {
        if (err) return next(createError(401, 'Token not valid'));
        req.userId = userData.id;
        req.userEmailId = userData.email;
        next();
    })
}     


module.exports = verifyToken;

