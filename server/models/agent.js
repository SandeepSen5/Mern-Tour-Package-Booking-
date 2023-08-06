const mongoose = require('mongoose')
const { Schema } = mongoose;

const AgentSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    number:Number,
    password: String,
    status: { type: Boolean, default: true },
})

const AgentModel = mongoose.model('Agent', AgentSchema);
module.exports = AgentModel;




