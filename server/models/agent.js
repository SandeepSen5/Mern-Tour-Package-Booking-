const mongoose = require('mongoose')
const { Schema } = mongoose;

const AgentSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
})

const AgentModel = mongoose.model('Agent', AgentSchema);
module.exports = AgentModel;




