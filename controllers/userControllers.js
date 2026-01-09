const userModel = require("../models/userModel")

const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unable to fetch user"
            })
        }
        res.status(200).json({
            success:true,
            message: "user fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
    }
}

const getUserProfile = (req, res) => {
    const user = req.user
    try {
       if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        return res.status(200).json(user) 
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUserById,
    getUserProfile
}