const express = require("express")
const { createBooking, getMyBookings } = require("../controllers/bookingController")
const isLoggedIn = require("../middlewares/isLoggedIn")

const bookingRouter = express.Router()

bookingRouter.post("/book-room", isLoggedIn, createBooking)
bookingRouter.get("/", isLoggedIn, getMyBookings)

module.exports = bookingRouter