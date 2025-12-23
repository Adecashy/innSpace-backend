const express = require("express")
const hotelImageUploader = require("../middlewares/hotelImageUploader")
const { addHotel, getHotels, getHotelById } = require("../controllers/hotelController")
const hotelRouter = express.Router()

hotelRouter.get("/", getHotels)
hotelRouter.get("/:id", getHotelById)
hotelRouter.post("/add-hotel",
    (req, res, next) => {
        hotelImageUploader.array("images", 10)(req, res, (err) =>{
            if (err) {
                console.error("Upload error:", err)
                return res.status(400).json({ success: false, message: err.message})
            }
            next()
        })
    }, addHotel)

module.exports = hotelRouter