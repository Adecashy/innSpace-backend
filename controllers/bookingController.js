const bookingModel = require("../models/bookingModel")
const roomModel = require("../models/roomModel")

const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

const createBooking = async (req, res) => {
    try {
        const userId = req.user._id
        const { hotelId, roomId, checkInDate, checkOutDate, guests } = req.body

        const room = await roomModel.findById(roomId)
        if (!room) {
            return res.status(404).json({
                sucess: false,
                message: "Room not found"
            })
        }

        const totalNights = calculateNights(checkInDate, checkOutDate)
        if (totalNights <= 0) {
            return res.status(400).json({
                success: false,
                message: "invalid booking dates"
            })
        }

        // Check availability (simple version)
        const overlappingBooking = await bookingModel.findOne({
            roomId,
            bookingStatus: { $in: ["pending", "confirmed"] },
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
            ]
        });
        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                message: "Room not available for selected dates"
            });
        }

        const totalAmount = totalNights * room.pricePerNight

        const booking = await bookingModel.create({
            userId,
            hotelId,
            roomId,
            checkInDate,
            checkOutDate,
            totalNights,
            totalAmount,
            guests
        })

        res.status(201).json({
            success: true,
            message: "Booking created, proceed to make payment.",
            data: booking
        })
    } catch (error) {
        console.log(error)
    }
}

const getMyBookings = async (req, res) => {
    try {
       const bookings = await bookingModel.find({ userId: req.user._id }).populate("hotelId roomId").sort({ createdAt: -1})

       res.status(200).json({
            success: true,
            data: bookings
       }) 
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createBooking,
    getMyBookings
}