const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");

const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: [true, "Wallet Address is required"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: [6, "Password must be more than 5 characters"],
    required: [true, "Password field is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm the Password"],
    validate: {
      // IMPORTANT This only works on CREATE & SAVE!!!
      validator: function (passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: "Password doesn't match",
    },
  },
});
userSchema.pre("save", async function (next) {
  // Only run this function if the password was modified or newly created
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = new Date() - 1000;
  }
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //* this -> Current Document
  //! But it can't get the password of the current document
  //? As the select is false for password

  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
