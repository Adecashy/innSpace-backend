const jwt = require("jsonwebtoken");
const blacklistedTokenModel = require("../models/blacklistedTokenModel");
const userModel = require("../models/userModel");

const isLoggedIn = async (req, res, next) => {
    try {
       let token;
       // 1. check if there is token
       if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
       } 
       if (!token) {
            return res.status(403).json({
                success: false,
                message: "Token is required"
            })
       }

       // 2. validate the token and its expiration
       const { email } = jwt.verify(token, process.env.jwt_secret)

       // 3. check if it has not been blacklisted
      const isBlacklisted = await blacklistedTokenModel.findOne({ token })
       if (isBlacklisted) {
            return res.status(403).json({
                success: false,
                message: "Token is invalid: blacklisted"
            })
       }

       // 4. find the user with the payload
       const user = await userModel.findOne({ email })
       if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
       }

       // 5. Modify the req object by adding the user
       req.user = user
       next()
    } catch (error) {
        console.log(error)
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                success: false,
                message: "Token is invalid"
            })
        } else if (error.message === "jwt expired") {
            return res.status(400).json({
                success: false,
                message: "token has expired, kindly login again"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "something went wrong"
            })
        }
    }
}

module.exports = isLoggedIn