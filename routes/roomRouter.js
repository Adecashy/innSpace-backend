const express = require("express")
const roomImageUploader = require("../middlewares/roomImageUploader")
const { createRoom } = require("../controllers/roomController")

const roomRouter = express.Router()

roomRouter.post("/add-room", 
    (req, res, next) => {
        roomImageUploader.single("image")(req, res, (err) => {
            if (err) {
                console.error("Upload Error:", err)
                return res.status(400).json({ success: false, message: err.message })
            }
            next()
        })   
    }, createRoom)

module.exports = roomRouter