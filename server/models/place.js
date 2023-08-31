const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    }, 
    title: String,
    address: [String],
    photos: [String],
    description: [String],
    perks: [String],
    price: Number,
    category: String,
    extraInfo: [String],
    cancelInfo: [String],
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;


