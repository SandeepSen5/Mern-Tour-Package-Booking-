const mongoose = require('mongoose')
const { Schema } = mongoose;

const AdminSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
})

const AdminModel = mongoose.model('Admin', AdminSchema);
module.exports = AdminModel;



