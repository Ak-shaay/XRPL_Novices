import axios from "axios";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const StatusCheck = () => {
  const [id, setId] = useState("");
  const [report, setReport] = useState(null); // Store report data directly
  const [error, setError] = useState(null);

  const statusHandler = async () => {
    if (!id) {
      alert("Please enter a Report ID");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/reports/id",
        { id }
      );
      console.log("Response:", data.report);
      setReport(data.report);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "An error occurred");
      setReport(null); // Clear any previous report data

      // Clear the error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
    setReport(null); // Clear the previously displayed report when the ID changes
  };

  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-column flex-grow-1 justify-content-center">
        <main className="d-flex flex-column justify-content-center align-items-center">
          {/* Input Form */}
          <form className="form-signin col-10 col-md-6 col-lg-4 my-4 text-white border border-light p-4 rounded">
            <h1 className="h3 mb-3 font-weight-normal">
              Check the status of your Report
            </h1>
            <label
              htmlFor="inputReportId"
              className="d-flex justify-content-start mt-3"
            >
              Report ID
            </label>
            <input
              type="text"
              id="inputReportId"
              className="form-control mt-1 mb-3"
              placeholder="Enter your Report ID"
              value={id}
              onChange={handleIdChange} // Update the ID and clear the report
              required
              autoFocus
            />
            <div className="mb-3">
              <button
                type="button"
                className="py-1 px-4 btn"
                style={{ backgroundColor: "#6c63ff", color: "white" }}
                onClick={statusHandler}
              >
                Check
              </button>
            </div>
          </form>

          {/* Display Report Details */}
          {report && (
            <form className="form-signin col-10 col-md-6 col-lg-4 my-4 text-white border border-light p-4 rounded">
              <div className="form-group row">
                <label
                  htmlFor="staticReportId"
                  className="col-sm-4 col-form-label"
                >
                  Report ID
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext text-white"
                    id="staticReportId"
                    value={report._id || "N/A"}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="staticCreatedAt"
                  className="col-sm-4 col-form-label"
                >
                  Created At
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext text-white"
                    id="staticCreatedAt"
                    value={new Date(report.createdAt).toLocaleString() || "N/A"}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="status" className="col-sm-4 col-form-label">
                  Status
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext text-white"
                    id="status"
                    value={report.status || "N/A"}
                  />
                </div>
              </div>
              {report.status === "Verified" && report.approvedAt && (
                <div className="form-group row">
                  <label
                    htmlFor="verifiedAt"
                    className="col-sm-4 col-form-label"
                  >
                    Verified At
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext text-white"
                      id="verifiedAt"
                      value={new Date(report.approvedAt).toLocaleString() || "N/A"}
                    />
                  </div>
                </div>
              )}
              {report.status === "Rejected" && report.rejectedAt && (
                <div className="form-group row">
                  <label
                    htmlFor="rejectedAt"
                    className="col-sm-4 col-form-label"
                  >
                    Rejected At
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext text-white"
                      id="rejectedAt"
                      value={new Date(report.rejectedAt).toLocaleString() || "N/A"}
                    />
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger mt-3 col-10 col-md-6 col-lg-4"
              role="alert"
            >
              {error}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StatusCheck;
