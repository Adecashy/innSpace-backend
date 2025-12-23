const hotelModel = require("../models/hotelModel")
const roomModel = require("../models/roomModel")

const createRoom = async (req, res) => {
    try {
        const { hotelId, type, pricePerNight, maxGuests } = req.body
        const image = req.file.path
        const amenities = JSON.parse(req.body.amenities)
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "room image is required"
            })
        }
        const hotel = await hotelModel.findById(hotelId)
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "hotel not found"
            })
        }
        const room = await roomModel.create({
            hotelId,
            type,
            pricePerNight,
            maxGuests,
            amenities,
            image
        })
        hotel.rooms.push(room._id)
        await hotel.save()
        res.status(201).json({
            success: true,
            message: "Room created successfully",
            room
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createRoom
}