import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

// SIGNUP CONTROLLER
export const signup = async (req, res) => {

    const {fullName, email, password} = req.body
    
    try {
        
        // ALL FIELDS REQUIRED
        if(!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // PASSWORD LENGTH
        if(password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        // IF USER ALREADY EXISTS
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        // PASSWORD HASHING
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //NEW USER CREATION
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        })

        if(newUser) {
            
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            return res.status(400).json({
                message: "Invalid user data."
            });
        }

    } catch(error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


// LOGIN CONTROLLER
export const login = async (req, res) => {
    
    const {email, password} = req.body;
    
    try {

        // USER NOT FOUND
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // PASSWORD VALIDATION
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch(error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

};


// LOGOUT CONTROLLER
export const logout = (req, res) => {

    try {

        // res.cookie("jwt", "", {maxAge: 0});
        res.header("jwt", "");

        res.status(200).json({
            message: "Logged Out Successfully"
        });

    } catch(error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

};


// PFP UPDATE CONTROLLER
export const updateProfile = async (req, res) => {

    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({
                message: "Profile picture is required"
            });
        }

        const uploadResponse =  await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json({
            updatedUser
        });
        
    } catch(error) {
        console.log("Error in profile update: ", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

}

// CHECK AUTH CONTROLLER
export const checkAuth = (req, res) => {

    try {
        res.status(200).json(req.user);
    } catch(error) {
        console.log("Error in checkAuth controller", error.message);
        res. status(500).json({
            message: "Internal Server Error"
        });
    }

}

