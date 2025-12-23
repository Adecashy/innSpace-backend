const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const mongodbUri = process.env.MONGO_URI
const connectToDb = async () => {
    try {
        const connected = await mongoose.connect(mongodbUri)
        if (connected) {
            console.log("CONNECTED TO DATABASE!")
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToDb