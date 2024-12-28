import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../configs/nodemailer.js";
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

        //send a welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Roadrims Logistics",
            text: `Welcome to Roadrims Logistics Your Trusted Logistics and Transport partner. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({sucess:true});

    } catch (error) {
        res.status(404).json({success: false, message: error.message})
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;

    // validate userinput
    if(!email || !password) {
        return res.json({success: false, message: "email and password are required"})
    }

    try {
        //check if user exists
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "Invalid email"})
        }

        //check if password entered is correct
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Inavlid Password"})
        }

        //correct password ? => generate token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        //send cookie as a response
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7days to milliseconds
        })

        return res.status(200).json({sucess:true});

    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}


export const logout = async (req, res) => {
    try {
        //clear user's cookie from response
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        
        return res.status(200).json({sucess: true, message: "logged Out"})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}