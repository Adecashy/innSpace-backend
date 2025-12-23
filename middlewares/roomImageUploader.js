const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        allowedFormats: ["jpg", "png", "jpeg"],
        folder: "room-images",
        transformation: [{ width: 400, height: 400 }]
    })
})

const roomImageUploader = multer({ storage })
module.exports = roomImageUploader