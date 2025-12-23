const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

const blacklistedTokenModel = mongoose.model("blacklistedtoken", tokenSchema)
module.exports = blacklistedTokenModel