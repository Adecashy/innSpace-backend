const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const blacklistedTokenModel = require("../models/blacklistedTokenModel")

const userRegistration = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({ ...req.body, password: hashedPassword})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user registration unsuccessful"
            })
        }

        res.status(201).json({
            success: true,
            message: "user registration successful!",
            user
        })
    } catch (error) {
        console.log(error)
    }
}




const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "email or password incorrect"
            })
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if (!isCorrectPassword) {
            return res.status(404).json({
                success: false,
                message: "email or password incorrect"
            })
        }

        const token = jwt.sign({ email, id: user._id }, process.env.jwt_secret, {
            expiresIn: process.env.jwt_exp
        })

        res.status(200).json({
            success: true,
            message: "login successful",
            token
        })
    } catch (error) {
        console.log(error)
    }
}

const logout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    try {
        await blacklistedTokenModel.create({ token })
        res.status(200).json({
            success: true,
            message: "logout successful"
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    userRegistration,
    login,
    logout
}