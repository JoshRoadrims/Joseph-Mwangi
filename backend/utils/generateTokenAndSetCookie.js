import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = async(res, userId) => {
    //create a token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
    //set cookie
    res.cookie("token", token, {
        httpOnly: true, //cookie cannot be accessed on the clients side
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token;
}