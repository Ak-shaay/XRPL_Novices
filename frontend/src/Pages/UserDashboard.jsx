import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]); // State to hold the reports data
  const [transactionData, setTransactionData] = useState(null); // To store transaction details
  const { walletAddress } = useSelector((state) => state.user);
  const [transactionModal, setTransactionModal] = useState(false); // State for transaction modal
  const [isTransactionLoading, setIsTransactionLoading] = useState(false); // Loading state for transaction API
  const [errorMessage, setErrorMessage] = useState(""); // Error state for transaction

  const getAllReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/reports/getUserReports",
        { walletAddress: walletAddress },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setReports(response.data.reportsSubmittedByTheUser);
      } else {
        console.log("Failed to fetch reports", response.data);
      }
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          "An error occurred while fetching reports"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionDetails = async (reportId) => {
    setIsTransactionLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/transactions/id",
        { reportId }
      );

      console.log("", response);

      if (response.status === 200) {
        setTransactionData(response.data.transaction);
      } else {
        setErrorMessage("Failed to fetch transaction details");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while fetching transaction"
      );
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const openTransactionModal = (reportId) => {
    fetchTransactionDetails(reportId); // Fetch transaction data on modal open
    setTransactionModal(true);
  };

  const closeModal = () => {
    setTransactionModal(false);
    setTransactionData(null); // Reset the transaction data when closing modal
  };

  useEffect(() => {
    if (walletAddress) {
      getAllReports();
    }
  }, [walletAddress]);

  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <div className="container-fluid pt-4 px-4">
          {/* Reports Table */}
          <div className="bg-light text-center rounded mt-3 p-4">
            <h2>Submitted Reports</h2>
            <div className="table-responsive">
              <table className="table table-striped table-hover text-start align-middle table-bordered mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Report ID</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Admin Message</th>
                    <th>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report._id}</td>
                        <td>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td>{report.region}</td>
                        <td>{report.description}</td>
                        <td>{report.status}</td>
                        <td>{report.adminMessage}</td>
                        <td>
                          {report.status == "Verified" && (
                            <button
                              className="btn btn-info"
                              onClick={() => openTransactionModal(report._id)}
                            >
                              View Transaction
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {transactionModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transaction Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {isTransactionLoading ? (
                  <div>Loading transaction details...</div>
                ) : errorMessage ? (
                  <div className="text-danger">{errorMessage}</div>
                ) : transactionData ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Report ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={transactionData.reportId}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        value={transactionData.tokenAmount}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Transaction URL</label>
                      {transactionData.txHash ? (
                        <a
                          href={`https://testnet.xrpl.org/transactions/${transactionData.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="form-control"
                        >
                          View Transaction
                        </a>
                      ) : (
                        <p>No transaction URL available</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div>No transaction details available.</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;
