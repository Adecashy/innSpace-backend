const express = require("express")
const { userRegistration, login, logout } = require("../controllers/authController")


const authRouter = express.Router()

authRouter.post("/signup", userRegistration)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

module.exports = authRouter