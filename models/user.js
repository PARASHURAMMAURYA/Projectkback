const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
  name: String,
  password:String,
  email:String,
  profilePic: {
    type: String,
    default: null,
  },
  }
);

module.exports  = mongoose.model('users',userSchema);