const multer = require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        allowedFormats: ["jpg", "png", "jpeg"],
        folder: "hotel-images",
        transformation: [{ width: 400, height: 400 }]
    })
})

const hotelImageUploader = multer({ storage })
module.exports = hotelImageUploader