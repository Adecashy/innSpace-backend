const express = require("express")
const { getUserProfile } = require("../controllers/userControllers")
const isLoggedIn = require("../middlewares/isLoggedIn")

const userRouter = express.Router()

userRouter.get("/my-profile", isLoggedIn, getUserProfile)

module.exports = userRouter