const express = require("express");

const reportController = require("../controllers/reportController");

const router = express.Router();

router
  .route("/")
  .get(reportController.getAllReports)
  .post(reportController.uploadReportImage, reportController.createNewReport)
  .patch(reportController.verifyReport);

router.route("/id").post(reportController.getReportById);
router.route("/getUserReports").post(reportController.getUserReports);

// Only one thing to export
module.exports = router;
