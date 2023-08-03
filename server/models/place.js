const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent"
    },
    title: String,
    address:[String],
    photos: [String],
    description: [String],
    perks: [String],
    extraInfo: [String],
    cancelInfo: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }
});

const Place = mongoose.model('place', placeSchema);
module.exports = Place;








