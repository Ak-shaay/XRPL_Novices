const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  // console.log(err);
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError(`Invalid Token, Please login again`, 401);

const handleJWTExpiredError = () => new AppError(`Token Expired`, 401);
const handleJWTNotBefore = () => new AppError(`Token is not yet valid`, 401);
const handleDuplicateErrorDB = (err) => {
  // console.log("Duplicate");
  // console.log(err);
  // console.log(err.keyValue);
  let message = "";
  // const dupId = err.keyValue.ipfsHash;
  if (err.keyValue.ipfsHash) {
    message = `Image already exists`;
  }
  if (err.keyValue.walletAddress) {
    message = `The wallet address already exists`;
  }
  // console.log(message);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errorMessages = Object.values(err.errors)
    .map((obj) => obj.message)
    .join(". ");
  const message = `Invalid input data: ${errorMessages}`;
  return new AppError(message, 500);
};

const sendErrorDev = (err, res) => {
  console.log(err);
  // let error = { ...err };
  // console.log(error);
  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateErrorDB(err);
  if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleJWTExpiredError();
  if (err.name === "NotBeforeError") err = handleJWTNotBefore();
  if (err)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
};

const sendErrorProd = (err, res) => {
  // console.log(err);
  // Operational Error that we trust, send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown Error don't want to leak details to the client
  else {
    // 1. Log the Error
    console.error("Error ❌", err);

    // 2. Send the response
    res.status(500).json({
      status: "error",
      message: "Something went very wrong !",
    });
  }
};
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500; // Internal Server Error
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
  //   else if (process.env.NODE_ENV === 'production') {
  else {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (err.name === "NotBeforeError") error = handleJWTNotBefore();
    sendErrorProd(error, res);
  }
};
