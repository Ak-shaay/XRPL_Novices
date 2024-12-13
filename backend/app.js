// const fs = require('fs');
const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const reportsRouter = require("./routes/reportRoutes");
const transactionsRouter = require("./routes/transactionRoutes");
const usersRouter = require("./routes/userRoutes");
const xrplRouter = require("./routes/xrplRoutes");
const cors = require("cors");

app.use(cors());
//! SET SECURITY HTTP headers
app.use(helmet()); //? It will produce the middleware function that will be put right here

//! DEVELOPMENT LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//! LIMIT REQUESTS from same IP
const limiter = rateLimit({
  max: 1000000,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from your computer, Please try again in one hour!`,
});

app.use("/api", limiter);
//! BODY PARSER, reading data from the body into req.body
app.use(express.json({ limit: "10kb" })); //NOTE Middleware for parsing

// app.use(express.static(`${__dirname}/public/`));

//! Test MIDDLEWARE
app.use((req, res, next) => {
  // We will add a timestamp to the req object in order to know when was the request made
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use("/api/v1/reports", reportsRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/xrpl", xrplRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Couldn't find the requested ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
