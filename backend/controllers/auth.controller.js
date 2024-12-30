import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check for neccessary inputs
        if(!name, !email, !password) {
            return res.status(400).json({success: false, message: "All fields are required"})
        }
    
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({success: false, message: "User Already exists"})
        }
    
        //hashpassword before storing user to db
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //create the new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hours
        })
        //save user to db
        await user.save()

        // jwt token
        generateTokenAndSetCookie(res, user._id)

        //send verification email
        await sendVerificationEmail(user.email, verificationToken)

        return res.status(201).json({success:true, message: "User Created successfully",
        user: {
            ...user._doc,
            password: undefined,
        }
    })
    
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    //user inputs verification code 123456
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user) {
            return res.status(400).json({success: false, message: "Invalid or exipired verification code"})
        }

        user.isVerified =  true;

        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({success: true, message: "Email verified successfully", user: {...user._doc, password: undefined}})

    } catch (error) {
        console.log("Error in verifyEmail", error)
        res.status(400).json({success: false, message: error.message})
    }

}


export const login = async (req, res) => {
    //get user input
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(404).json({success: false, message: "Enter Email and Password"})
    }

    try {
        //check if user is registered
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({success: false, message: "User does not exist"})
        }

        //compare password
        const comparePassword = await bcrypt.compare(password, user.password)

        if(!comparePassword){
            return res.status(404).json({success: false, message: "Wrong Password"})
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date()

        await user.save();

        return res.status(200).json({success:true, 
            message: "Login successful", 
            user: {
                ...user._doc, 
                password: undefined,
            }
        })
    } catch (error) {
        console.log(`error in Login functon`, error)
        res.status(400).json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "User logged out successfully"})
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({success: false, message: "Invalid email"})
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 //1hour

        //save to db
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}}`)

        res.status(200).json({success:true, message: "Password reset Link sent to your email"})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;

        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        })

        if(!user) {
            return res.status(400).json({success: false, message: "Invalid or expired reset Token"})
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update db
        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        //save to db
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message:"Password reset Successful"})

    } catch (error) {
        console.log("Error in resetPassword", error)
        res.status(400).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        return res.status(200).json({success: true, user})
    } catch (error) {
        console.log(`Error in checkAuth`, error)
        res.status(500).json({success: false, message: "Server error"})
    }
}