const mongoose = require("mongoose");

const validator = require("validator");

const { slugify } = require("slugify");

const transactionSchema = new mongoose.Schema({
  reportId: {
    type: String, // UUIDs can be stored as strings
    required: [true, "Report Id is required"],
  },
  wallet: {
    type: String,
    required: [true, "Wallet Address is required"],
  },
  tokenAmount: {
    type: Number,
    required: [true, "The Token Amount to be transferred is required"],
  },
  txHash: {
    type: String,
    required: [true, "Transaction Hash is required"],
  },
  createdAt: {
    type: Date, // Timestamp is handled as a Date object in Mongoose
    required: true,
    default: Date.now,
  },
});

const Transaction = new mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
