const express = require('express');
const router = express.Router()
const multer = require("multer");
const upload = multer();


const {
  signup,
  login,
  getUserData,
  createProfileCard,
  updateProfile
} = require('../controllers/auth');
        
        
router.post("/signup", signup);
router.post("/login", login);
router.get("/userdata", getUserData);
router.post("/profilecard", createProfileCard);
router.patch("/updateProfile", upload.single("profilePic"), updateProfile);
 
module.exports = router;
