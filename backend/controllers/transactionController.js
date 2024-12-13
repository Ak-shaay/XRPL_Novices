const xrpl = require("xrpl");

const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apifeatures");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Transaction.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Transactions = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: Transactions.length,
    Transactions,
  });
});
// exports.getTransactionById = catchAsync(async (req, res, next) => {
//   const { id } = req.body;
//   const transaction = await Transaction.findById(id);

//   if (!transaction) {
//     return next(new AppError("Couldn't find any Transaction by that Id", 404));
//   }

//   res.status(200).json({
//     result: "success",
//     transaction,
//   });
// });

exports.getTransactionById = catchAsync(async (req, res, next) => {
  const { reportId } = req.body; 
  const transaction = await Transaction.findOne({ reportId });

  if (!transaction) {
    return next(new AppError("Couldn't find any Transaction with that Report Id", 404));
  }

  res.status(200).json({
    result: "success",
    transaction,
  });
});