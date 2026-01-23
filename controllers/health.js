export const CheckHealth = async (req, res) => {
    try {
        res.status(200).json("Server is Live")
    } catch (e) {
        throw new Error(e);
    }
}