const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    amenities: {
        type: [String], // e.g., ["WiFi", "Pool", "Gym"]
        default: []
    },
    images: {
        type: [String], // Cloudinary URLs
        required: true
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        }
    ],
    policies: {
        checkIn: { type: String, default: "12:00 PM" },
        checkOut: { type: String, default: "12:00 PM" },
        cancellation: { type: String }
    }
}, { timestamps: true });


module.exports = mongoose.model("Hotel", hotelSchema);