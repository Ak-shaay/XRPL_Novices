const express = require("express");

const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.route("/").get(transactionController.getAllTransactions);
// .post(transactionController.createNewTransaction);

router.route("/id").post(transactionController.getTransactionById);

// router.route("/issueTokens").post(transactionController.issueTokens);
// Only one thing to export
module.exports = router;
