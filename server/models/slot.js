const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookin: { type: Date},
    bookout: { type: Date},
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    count: { type: Number, deafult: 0 },
}, {
    timestamps: true
});

const SlotModel = mongoose.model('Slot', SlotSchema);
module.exports = SlotModel;







