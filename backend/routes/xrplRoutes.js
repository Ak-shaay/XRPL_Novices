const express = require("express");

const xrplController = require("../controllers/xrplController");

const router = express.Router();

router.route("/balance").post(xrplController.balance);
router.route("/redeem/upi").post(xrplController.upi);
router.route("/redeem/bank").post(xrplController.bank);


module.exports = router;