const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    desc: String,
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;