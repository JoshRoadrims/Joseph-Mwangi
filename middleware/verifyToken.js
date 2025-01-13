import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    //get cookie from user
    const token = req.cookies.token;
    if(!token) return res.status(404).json({success: false, message: "Unauthorized - no token provided"})
    try {
        //decode token to verify it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(404).json({success: false, message: "Unauthorized - Invalid Token"})

        req.userId = decoded.userId
        
        next();
    } catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({success: false, message: error.message})
    }
}