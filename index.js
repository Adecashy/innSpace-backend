const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const connectToDb = require("./config/connectToDb")
const authRouter = require("./routes/authRouter")
const hotelRouter = require("./routes/hotelRouter")
const roomRouter = require("./routes/roomRouter")
const bookingRouter = require("./routes/bookingRouter")
const userRouter = require("./routes/userRouter")

dotenv.config()

const PORT = process.env.PORT
connectToDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})


app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/hotel/rooms", roomRouter)
app.use("/api/hotel/bookings", bookingRouter)












// dKn0CeLuhVFRIetJ