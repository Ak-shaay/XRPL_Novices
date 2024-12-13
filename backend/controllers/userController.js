const User = require("../models/userModel");
const APIFeatures = require("../utils/apifeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (object, ...allowedFields) => {
  // We will loop through the object and check if each of the field is in the allowed fields
  // If it is simply add it to a new object
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = object[el];
    }
  });

  return newObj;
};
// IMPORTANT USERS RESOURCE

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Couldn't find any user by that Id", 404));
  }
  res.status(200).json({
    result: "success",
    user,
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return next(new AppError("Couldn't find any user by that Id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
