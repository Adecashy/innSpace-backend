const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },

    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    checkInDate: {
        type: Date,
        required: true
    },

    checkOutDate: {
        type: Date,
        required: true
    },

    totalNights: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },

    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },

    paymentReference: {
        type: String
    },

    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 }
    }

}, { timestamps: true });

const bookingModel = mongoose.model("Booking", bookingSchema)

module.exports = bookingModel