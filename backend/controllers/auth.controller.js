import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";

export const register = async(req, res) => {
    //get name, email & passwordd from the body
    const {name, email, password} = req.body;

    //check for details
    if(!name || !email || !password){
        return res.json({success: false, message: "missing Details"})
    }

    //if all details exist
    try {
        //store details on our db
        
        //first check if User exists in db
        const existingUser = await userModel.findOne({email})
        if(existingUser) {
            return res.json({sucess: false, message: "User already exists"})
        }

        //  encrypt password before storing using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10)

        // creATE new USER
        const user = new userModel({name, email, password: hashedPassword})

        //save user in the db
        await user.save();

        //generate tokens 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        //send token to user inform of cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //7days in milliseconds
        })

    } catch (error) {
        res.status(404).json({success: false, message: error.message})
    }
}