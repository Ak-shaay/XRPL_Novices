const { promisify } = require("util");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  secure: false, //?IMPORTANT The cookie will only be sent in an encrypted connection (HTTPS)
  httpOnly: true, //? NOTE This will make it so that the cookie cannot be modified or accessed in any way by the browser
  //! BUG to prevent XSS attacks
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    token,
    data: user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const currentUser = await User.create({
    role: req.body?.role || 'user',
    name: req.body.name,
    walletAddress: req.body.walletAddress,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(200).json({
    message: "Account created successfully",
  });
  // createSendToken(currentUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  // check if email and password exist
  if (!name || !password)
    return next(new AppError("Wallet Address and password is required", 404));

  // check if the user and password exists in the database
  const user = await User.findOne({ name }).select("+password");

  // const correct = await user?.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Wallet Address or Password doesn't match", 401));
  }
  // createSendToken(user, 200, res);
  user.password = undefined;
  res.status(200).json({
    status: "Success",
    user,
  });
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // Roles is an array which contains people which we are allowing
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have the permission to perform the action`, 403)
      );
    }
    next();
  };
