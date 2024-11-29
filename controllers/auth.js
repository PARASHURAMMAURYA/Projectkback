const express = require('express');
const User = require('../models/user');
const asyncWrapper = require('../middleware/async')
const Jwt = require('jsonwebtoken');
const multer = require('multer');
const { createCustomError } = require('../errors/CustomAPIError ');

const app = express();
const jwtKey = "your_jwt_secret"; // Replace with your actual secret

// Get all users
const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({ users });
});

// Signup
const signup = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User(req.body);
    const result = await user.save();
    const token = Jwt.sign({ id: result._id }, jwtKey, { expiresIn: "2h" });

    res.status(201).json({ user: result, auth: token });
});


// Login //  //  // 
const login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    const user = await User.findOne({ email,password}).select("-password");
    if (!user) {
        return res.status(404).json({ message: "No user found" });
    }
     
    const token = Jwt.sign({ id: user._id }, jwtKey, { expiresIn: "2h" });
    res.status(200).json({ user, auth: token });
});



// Get user data
const getUserData = asyncWrapper(async (req, res) => {
    const users = await User.find(req.body);
    res.status(200).json({ users });
});

// Profile card creation
const createProfileCard = asyncWrapper(async (req, res) => {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).json(result);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Update user profile
const updateProfile = asyncWrapper(async (req, res) => {
    const { name } = req.body;
    const profilePic = req.file ? req.file.path : null;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, profilePic },
        { new: true }
    );

    if (!updatedUser) {
        return next(createCustomError("User not found", 404));
    }

    res.status(200).json(updatedUser);
});

 

// Export the app
module.exports = {
  signup,
  login,
  getUserData,
  createProfileCard,
  updateProfile
}
