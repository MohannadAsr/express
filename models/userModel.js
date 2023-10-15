const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an email"],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Invalid Email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    maxlength: 20,
  },
  passwordConfirm: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
