const crypto = require("crypto")
const bookingModel = require("../models/bookingModel")
const roomModel = require("../models/roomModel")

const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

const prepareBooking = async (req, res) => {
    try {
    const { hotelId, roomIds, checkInDate, checkOutDate, guests } = req.body;
    if (!roomIds || roomIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rooms selected"
      });
    }

    const rooms = await roomModel.find({ _id: { $in: roomIds } });

    if (rooms.length !== roomIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more rooms not found"
      });
    }

    const totalNights = calculateNights(checkInDate, checkOutDate);
    if (totalNights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates"
      });
    }

    // 🔒 availability check
    const overlappingBooking = await bookingModel.findOne({
      roomId: { $in: roomIds },
      bookingStatus: "confirmed",
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "One or more rooms not available"
      });
    }

    const subtotal = rooms.reduce((sum, r) => sum + Number(r.pricePerNight), 0) * totalNights;

    const serviceFee = subtotal * 0.001;
    const tax = subtotal * 0.02;
    const totalAmount = subtotal + serviceFee + tax;

    res.status(200).json({
      success: true,
      message: "Rooms available",
      data: {
        hotelId,
        rooms,
        roomIds,
        checkInDate,
        checkOutDate,
        totalNights,
        subtotal,
        serviceFee,
        tax,
        totalAmount,
        guests
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Preview failed" });
  }
};


const initializeBookingPayment = async (req, res) => {
  console.log("initializing booking payment");
    try {
        const userId = req.user._id
        const { hotelId, roomIds, checkInDate, checkOutDate, guests } = req.body
        const rooms = await roomModel.find({ _id: { $in: roomIds } })
        if (!rooms.length) {
            return res.status(404).json({
                success: false,
                message: "Rooms not found"
            })
        }

        // Check availability again
        const overlapping = await bookingModel.findOne({
            roomId: { $in: roomIds },
            bookingStatus: "confirmed",
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate : { $gt: checkInDate } }
            ]
        })
        if (overlapping) {
            return res.status(400).json({
                success: false,
                message: "One or more rooms already booked"
            })
        }

        const totalNights = calculateNights(checkInDate, checkOutDate)

        const subtotal = rooms.reduce((sum, r) => sum + Number(r.pricePerNight), 0) * totalNights;
        const serviceFee = subtotal * 0.001
        const tax = subtotal * 0.02

        const totalAmount = subtotal + serviceFee + tax

        const bookingData = {
            userId,
            hotelId,
            roomIds,
            checkInDate,
            checkOutDate,
            guests,
            totalNights,
            subtotal,
            serviceFee,
            tax,
            totalAmount
        };

        const data = {
            email: req.user.email,
            amount: Math.round(totalAmount * 100),
            metadata: { bookingData }
        }
        console.log(data)
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
}

const activateToCreateBooking = async (req, res) => {
    try {
        console.log("WEBHOOK HIT")
        const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        const updatedHash = hash.update(req.body).digest("hex")
        if (updatedHash !== req.headers["x-paystack-signature"]) {
            return res.status(401).send("Invalid Signature")
        }
        const body = JSON.parse(req.body.toString("utf8"))
        console.log(body)
        if (body.event === "charge.success") {
            const result = body.data
            const bookingData = result.metadata.bookingData
            console.log(bookingData)

            if (!bookingData) return res.status(400)
            
            await bookingModel.create({
                userId: bookingData.userId,
                hotelId: bookingData.hotelId,
                roomIds: bookingData.roomIds,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                guests: bookingData.guests,
                totalNights: bookingData.totalNights,
                totalAmount: bookingData.totalAmount,
                paymentStatus: "paid",
                bookingStatus: "confirmed",
                paymentReference: result.reference
            })
        }
        return res.status(200).send("payment successful, booking created successfully!")
    } catch (error) {
        console.log(error)
    }
}

const getMyBookings = async (req, res) => {
    try {
       const bookings = await bookingModel.find({ userId: req.user._id }).populate("hotelId roomIds").sort({ createdAt: -1})

       res.status(200).json({
            success: true,
            data: bookings
       }) 
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    prepareBooking,
    getMyBookings,
    initializeBookingPayment,
    activateToCreateBooking
}  