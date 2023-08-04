const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent"
    },
    title: String,
    address: [String],
    photos: [String],
    description: [String],
    perks: [String],
    price: Number,
    extraInfo: [String],
    cancelInfo: [String],
});

const Place = mongoose.model('place', placeSchema);
module.exports = Place;








