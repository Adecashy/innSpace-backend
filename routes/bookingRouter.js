const express = require("express")
const { getMyBookings, prepareBooking, initializeBookingPayment } = require("../controllers/bookingController")
const isLoggedIn = require("../middlewares/isLoggedIn")

const bookingRouter = express.Router()

bookingRouter.post("/preview", isLoggedIn, prepareBooking)
bookingRouter.post("/initialize", isLoggedIn, initializeBookingPayment)
bookingRouter.get("/", isLoggedIn, getMyBookings)

module.exports = bookingRouter