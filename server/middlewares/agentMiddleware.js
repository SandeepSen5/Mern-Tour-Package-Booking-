const jwt = require('jsonwebtoken');
require('dotenv').config();
const createError = require("../utils/createError");

const verifyToken = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return next(createError(401, "Agent Not Registered"));
    jwt.verify(token, process.env.AGENT_JWTSECRET, {}, async (err, agentData) => {
        if (err) return next(createError(401, 'Token not valid'));
        req.agentId = agentData.id;
        req.agentname = agentData.name;
        req.agentEmailId = agentData.email;
        next();
    })
}     //userData contains the emailid and id of that user(document id of users collection)

module.exports = verifyToken;

