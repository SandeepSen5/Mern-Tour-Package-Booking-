const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: String,
    photos: [String],
    description: [String],
    status: { type: Boolean, default: true },
}, {
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;




