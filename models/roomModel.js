const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    type: {
        type: String,
        enum: ["Deluxe Room", "Executive Suite", "Presidential Suite", "Family Room"],
        required: true
    },
    pricePerNight: {
        type: String,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
        default: []
    },
    image: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const roomModel = mongoose.model("Room", roomSchema);

module.exports = roomModel