const mongoose = require("mongoose");

const validator = require("validator");

const { slugify } = require("slugify");

const axios = require("axios");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

const reportSchema = new mongoose.Schema({
  ipfsHash: {
    type: String,
    required: [true, "ipfs hash is required"], // Ensure IPFS hash is provided
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Description of the event is required"],
  },
  userId: {
    type: String,
    ref: "User", // Reference to the Users collection
    required: [true, "Wallet Id is required"],
  },
  location: {
    type: {
      latitude: { type: Number, required: true }, // Latitude as a number
      longitude: { type: Number, required: true }, // Longitude as a number
    },
    required: [true, "Location of the event is required"],
  },
  region: {
    type: String,
  },
  userEnteredRegion: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"], // Valid statuses
    default: "Pending", // Default status is Pending
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set submission time
  },
  approvedAt: {
    type: Date, // Approval time (if verified)
  },
  rejectedAt: {
    type: Date,
  },
  adminMessage: {
    type: String,
  },
});

reportSchema.methods.getLocation = catchAsync(async function (next) {
  // Extract latitude and longitude from the document's location field
  const { latitude, longitude } = this.location;

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

  return {
    city,
    principalSubdivision,
  };
});
reportSchema.pre(
  "save",
  catchAsync(async function (next) {
    if (this.isNew) {
      // Only run if location is present and modified/new
      const { latitude, longitude } = this.location;

      if (!latitude || !longitude) {
        return next(new AppError("Latitude and Longitude are required.", 400));
      }

      // Use the instance method to get location details
      const locationDetails = await this.getLocation();

      // Assign the region to the report
      this.region = `${locationDetails.city}, ${locationDetails.principalSubdivision}`;
    }

    next();
  })
);

const Report = new mongoose.model("Report", reportSchema);
module.exports = Report;
