const multer = require("multer");

const xrpl = require("xrpl");

const exifr = require("exifr");

const { PinataSDK } = require("pinata-web3");

// const IPFS = require("ipfs-core");

const fs = require("fs");
const fsp = require("fs").promises; //

const path = require("path");

const axios = require("axios");

const FormData = require("form-data");

const Report = require("../models/reportModel");

const User = require("../models/userModel");

const Transaction = require("../models/transactionModel");

const APIFeatures = require("../utils/apifeatures");

const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
// Helper function for token issuance
const issueTokensHandler = async (walletAddress, tokenAmount, reportId) => {
  const SERVER_URL = "wss://s.altnet.rippletest.net:51233";
  const { BANK_ACCOUNT_SECRET, BANK_ACCOUNT_ADDRESS } = process.env;

  const client = new xrpl.Client(SERVER_URL);
  try {
    await client.connect();
    // console.log("Connected to XRPL Testnet");

    const issuerWallet = xrpl.Wallet.fromSeed(BANK_ACCOUNT_SECRET);
    const dropsAmount = xrpl.xrpToDrops(tokenAmount);

    const paymentTx = {
      TransactionType: "Payment",
      Account: BANK_ACCOUNT_ADDRESS,
      Amount: dropsAmount,
      Destination: walletAddress,
    };

    const prepared = await client.autofill(paymentTx);
    const signed = issuerWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== "tesSUCCESS") {
      throw new AppError(
        result.result.meta.TransactionResult || "Token issuance failed",
        500
      );
    }

    // Save transaction in the database
    const transaction = await Transaction.create({
      reportId,
      wallet: walletAddress,
      tokenAmount,
      txHash: result.result.hash,
    });

    await client.disconnect();

    return transaction; // Return the transaction details
  } catch (err) {
    await client.disconnect();
    throw err;
  }
};


const regionFinder= async(latitude,longitude)=>{
  if (!latitude || !longitude) {
    return next(
      new AppError(
        "Latitude and Longitude are required to fetch location details.",
        400
      )
    );
  }

  // Reverse geocode using the BigDataCloud API
  const url = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  const params = { latitude, longitude, localityLanguage: "en" };

  const response = await axios.get(url, { params });

  // Extract city and principal subdivision
  const { city, principalSubdivision } = response.data;

  if (!city || !principalSubdivision) {
    return next(
      new AppError("Unable to fetch location details from the API.", 500)
    );
  }

  const region = city+','+ principalSubdivision
  return region;

};

//? PINATA CONFIGURATION
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT, // Pinata JWT from your environment variables
  pinataGateway: process.env.PINATA_GATEWAY, // Pinata Gateway URL from your environment variables
});

//? Configure multer for file upload
const upload = multer({
  dest: "uploads/", // Temporary storage
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError("Only image files are allowed!", 400), false);
    }
    cb(null, true);
  },
});
exports.uploadReportImage = upload.single("image");

//! CREATING A NEW REPORT
exports.createNewReport = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Image file is required.", 400));
  }

  const imagePath = path.join(__dirname, `../${req.file.path}`);
  // Extract geotags from the uploaded image
  const gpsData = await exifr.gps(imagePath);

  if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
    await fsp.unlink(imagePath); // Use promise-based unlink
    return next(new AppError("The image does not contain geotags.", 400));
  }

  // Upload the file to IPFS via Pinata
  const fileData = new FormData();
  fileData.append("file", fs.createReadStream(imagePath)); // Use callback-based `fs.createReadStream`

  const responseData = await axios({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data: fileData,
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      "Content-Type": "multipart/form-data",
    },
  });

  const ipfsHash = responseData.data.IpfsHash;

  if (!ipfsHash) {
    return next(new AppError(`Failed to store in the IPFS`, 400));
  }
  const url = `https://ipfs.io/ipfs/${ipfsHash}`;

  // Add geotags and IPFS hash to the request body
  req.body.location = {
    latitude: gpsData.latitude,
    longitude: gpsData.longitude,
  };
  req.body.ipfsHash = ipfsHash;
  // console.log(req.body);
  // Create the report
  req.body.region =await regionFinder(gpsData.latitude,gpsData.longitude)
  console.log("Created report",req.body.region);
  
  const newReport = await Report.create(req.body);
  // console.log(newReport);

  // Delete the uploaded image after processing
  await fsp.unlink(imagePath).catch(() => {
    console.error("Failed to clean up the image file after processing.");
  });

  res.status(201).json({
    status: "success",
    newReport,
    url,
  });

  // console.log(err);
  await fsp.unlink(imagePath).catch(() => {
    // console.error("Failed to clean up the image file after error.");
  });
});
// });
exports.getAllReports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Report.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reports = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: reports.length,
    reports,
  });
});
exports.getUserReports = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.body;

  const user = await User.findOne({ walletAddress: walletAddress });
  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  const reportsSubmittedByTheUser = await Report.find({
    userId: user.walletAddress,
  });

  if (reportsSubmittedByTheUser.length === 0) {
    return next(new AppError(`No Report submitted`, 400));
  }
  res.status(200).json({
    status: "Success",
    totalReports: reportsSubmittedByTheUser.length,
    reportsSubmittedByTheUser,
  });
});
exports.getReportById = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const { id } = req.body;
  const report = await Report.findById(id);

  if (!report) {
    return next(new AppError("Couldn't find any report by that Id", 404));
  }
  // const location = await report.getLocation();
  res.status(200).json({
    result: "success",
    report,
    // location,
  });
});

// exports.verifyReport = catchAsync(async (req, res, next) => {
//   const { id, status, rewardAmount, adminMessage } = req.body;

//   // Validate input
//   if (!id) {
//     return next(new AppError("Report ID is required", 400));
//   }
  
//   if (!status) {
//     return next(new AppError("Status is required", 400));
//   }

//   if (!["Verified", "Rejected"].includes(status)) {
//     return next(new AppError("Status must be either 'Verified' or 'Rejected'", 400));
//   }

//   if (!adminMessage) {
//     return next(new AppError("Admin message is required", 400));
//   }

//   // Find the report by ID
//   const reportToBeVerified = await Report.findById(id);
//   if (!reportToBeVerified) {
//     return next(new AppError("Report not found with the provided ID", 404));
//   }

//   // Update report status and timestamps
//   reportToBeVerified.status = status;

//   if (status === "Verified") {
//     // console.log("Reached");
//     reportToBeVerified.approvedAt = new Date(Date.now());
//     // Find the associated user
//     const user = await User.find({
//       walletAddress: reportToBeVerified.userId,
//     });
//     // console.log(user);
//     if (!user) {
//       return next(
//         new AppError("Associated user with the wallet address not found", 404)
//       );
//     }

//     // Issue tokens logic
//     const tokenAmount = rewardAmount;
//     const walletAddress = reportToBeVerified.userId;

//     const transaction = await issueTokensHandler(
//       walletAddress,
//       tokenAmount,
//       reportToBeVerified._id
//     );

//     // Save transaction details
//     reportToBeVerified.adminMessage = adminMessage;
//     reportToBeVerified.transactionHash = transaction.txHash;
//     reportToBeVerified.transactionHashUrl = `https://testnet.xrpl.org/transactions/${transaction.txHash}`;
//     // console.log(`Tokens issued successfully: ${transaction.txHash}`);
//   } else if (status === "Rejected") {
//     reportToBeVerified.rejectedAt = new Date(Date.now());
//   }

//   await reportToBeVerified.save();

//   res.status(200).json({
//     status: "success",

//     // reportStatus: status,
//     // messageFromAdmin: adminMessage,
//     // rewardAmount: status === "Verified" ? rewardAmount : undefined,
//     // transactionHash:
//     //   status === "Verified" ? reportToBeVerified.transactionHash : undefined,
//     // transactionHashUrl:
//     //   status === "Verified" ? reportToBeVerified.transactionHashUrl : undefined,
//   });
// });

exports.verifyReport = catchAsync(async (req, res, next) => {
  const { id, status, rewardAmount, adminMessage } = req.body;

  // Validate input
  if (!id) {
    return next(new AppError("Report ID is required", 400));
  }

  if (!status) {
    return next(new AppError("Status is required", 400));
  }

  if (!["Verified", "Rejected"].includes(status)) {
    return next(new AppError("Status must be either 'Verified' or 'Rejected'", 400));
  }

  if (!adminMessage) {
    return next(new AppError("Admin message is required", 400));
  }

  
  // Validate reward amount if status is 'Verified'
  if (status === "Verified") {
    if (rewardAmount <= 0 || isNaN(rewardAmount)) {
      return next(new AppError("A valid reward amount is required", 400));
    }
  }

  // Find the report by ID
  const reportToBeVerified = await Report.findById(id);
  if (!reportToBeVerified) {
    return next(new AppError("Report not found with the provided ID", 404));
  }

  // Update report status and timestamps
  reportToBeVerified.status = status;

  if (status === "Verified") {
    reportToBeVerified.approvedAt = new Date(Date.now());

    // Find the associated user using wallet address
    const user = await User.findOne({ walletAddress: reportToBeVerified.userId });
    if (!user) {
      return next(new AppError("Associated user with the wallet address not found", 404));
    }

    // Issue tokens logic
    const tokenAmount = rewardAmount;
    const walletAddress = reportToBeVerified.userId;

    try {
      const transaction = await issueTokensHandler(walletAddress, tokenAmount, reportToBeVerified._id);

      // Save transaction details
      reportToBeVerified.adminMessage = adminMessage;
      reportToBeVerified.transactionHash = transaction.txHash;
      reportToBeVerified.transactionHashUrl = `https://testnet.xrpl.org/transactions/${transaction.txHash}`;
    } catch (error) {
      return next(new AppError("Error issuing tokens: " + error.message, 500));
    }
  } else if (status === "Rejected") {
    reportToBeVerified.rejectedAt = new Date(Date.now());
    reportToBeVerified.adminMessage = adminMessage;
  }

  await reportToBeVerified.save();

  res.status(200).json({
    status: "success",
    message: `Report has been ${status.toLowerCase()} successfully.`,
    // transactionHash: status === "Verified" ? reportToBeVerified.transactionHash : undefined,
    // transactionHashUrl: status === "Verified" ? reportToBeVerified.transactionHashUrl : undefined,
  });
});
