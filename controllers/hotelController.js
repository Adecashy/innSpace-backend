const hotelModel = require("../models/hotelModel")

const addHotel = async (req, res) => {
    if (!req.files || req.files.length < 3) {
        return res.status(400).json({
            success: false,
            message: "at least 3 images required"
        })
    }
    try {
        const { name, description, address, city, rating, country, } = req.body
        const amenities = JSON.parse(req.body.amenities)
        const images = req.files?.map(file => file.path) || []
        const hotel = await hotelModel.create({
            name,
            description,
            amenities,
            location:{
                address,
                city,
                country
            },
            rating,
            images
        })
        if (!hotel) {
            return res.status(400).json({
                success: false,
                message: "hotel not added"
            })
        }
        res.status(201).json({
                success: true,
                message: "hotel added successfully",
                hotel
        })
    } catch (error) {
        console.log(error)
    }
}

const getHotels = async (req, res) => {
    try {
        const hotels = await hotelModel.find()
        if (!hotels) {
            return res.status(404).json({
                success: false,
                message: "unable to fetch hotels"
            })
        }
        res.status(200).json({
            success: true,
            message: "hotels fetched successfully",
            counts: hotels.length,
            hotels
        })
    } catch (error) {
        console.log(error)
    }
}

const getHotelById = async (req, res) => {
    try {
        const hotelId = req.params.id
        const hotel = await hotelModel.findById(hotelId).populate("rooms")
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "hotel not found"
            })
        }
        res.status(200).json({
            success: true,
            data: hotel
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addHotel,
    getHotels,
    getHotelById
}